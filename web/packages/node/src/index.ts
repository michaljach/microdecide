/**
 * @nodd/node: run a nodd model in Node (transformers.js on onnxruntime-node, native CPU).
 *
 *   const m = await nodd.load("./models/comment_moderation/v3");   // an exported folder on disk
 *   const d = await m.decide("Buy cheap followers at ...");         // Decision
 */
import { readFile, stat } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { Classifier, Decider, type Forward, type ModelInfo, type Tokenize, parseModelConfig } from "@nodd/core";

export type { Decision, EncoderConfig, ModelConfig, ModelInfo } from "@nodd/core";

export interface LoadOptions {
  /** "q8" (default, smallest) or "fp32" (if the export includes it). */
  dtype?: "q8" | "fp32";
}

// transformers.js resolves local models against a global env.localModelPath: load one at a time.
let queue: Promise<unknown> = Promise.resolve();

export class nodd extends Decider {
  /** Load an exported model folder (the output of `nodd export`) from disk. */
  static async load(dir: string, options: LoadOptions = {}): Promise<nodd> {
    const load = queue.then(() => loadClassifier(resolve(dir), options.dtype ?? "q8"));
    queue = load.catch(() => {});
    const { classifier, info } = await load;
    return new nodd(info, (texts) => classifier.decideBatch(texts));
  }
}

async function loadClassifier(dir: string, dtype: "q8" | "fp32"): Promise<{ classifier: Classifier; info: ModelInfo }> {
  const t0 = performance.now();
  const config = parseModelConfig(JSON.parse(await readFile(join(dir, "nodd.json"), "utf8")));
  const onnxFile = dtype === "fp32" ? config.onnx.fp32_file : config.onnx.file;
  if (!onnxFile) throw new Error(`${config.model} has no ${dtype} ONNX file`);
  const tfjs = await import("@huggingface/transformers");
  const { env } = tfjs;
  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.localModelPath = dirname(dir);
  const id = basename(dir);
  const [tokenizer, model] = await Promise.all([
    tfjs.AutoTokenizer.from_pretrained(id),
    tfjs.AutoModelForSequenceClassification.from_pretrained(id, { device: "cpu", dtype }),
  ]);
  const files = [config.tokenizer.file, "tokenizer_config.json", "config.json", onnxFile];
  const sizes = await Promise.all(files.map(async (f) => (await stat(join(dir, f))).size));
  const classifier = new Classifier(config, tokenizer as unknown as Tokenize, (inputs) => model(inputs) as ReturnType<Forward>,
    model.config.model_type === "bert" ? tokenizer.sep_token_id : undefined);
  const info: ModelInfo = {
    model: config.model,
    labels: config.labels,
    threshold: config.threshold,
    device: "cpu",
    dtype,
    loadMs: performance.now() - t0,
    downloadBytes: sizes.reduce((a, b) => a + b, 0),
  };
  return { classifier, info };
}
