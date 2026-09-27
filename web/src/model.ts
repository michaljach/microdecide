/** Load an exported model folder and turn texts into Decisions. Runs in a worker or the main thread. */
import { Tokenizer } from "@huggingface/tokenizers";
import { type Engine, OnnxEngine, StaticEngine } from "./engines.js";
import { type Fetcher, decodeJson, joinUrl, makeFetcher } from "./fetch.js";
import { argmax, sliceCodePoints, softmax } from "./text.js";
import type { Decision, LoadOptions, ModelConfig, ModelInfo } from "./types.js";

export class Model {
  private constructor(
    readonly config: ModelConfig,
    private readonly tokenizer: Tokenizer,
    private readonly engine: Engine,
    readonly info: ModelInfo,
  ) {}

  static async load(baseUrl: string, options: LoadOptions = {}, fetcher?: Fetcher): Promise<Model> {
    const t0 = performance.now();
    const get = fetcher ?? makeFetcher(options.cache ?? true);
    let bytes = 0;
    const fetchCounted = async (file: string) => {
      const buf = await get(joinUrl(baseUrl, file));
      bytes += buf.byteLength;
      return buf;
    };
    const config = decodeJson<ModelConfig>(await fetchCounted("microdecide.json"));
    if (config.format !== "microdecide-static" || config.format_version !== 1) {
      throw new Error(`unsupported model format ${config.format} v${config.format_version}`);
    }
    const backend = options.backend ?? "static";
    const [tokJson, tokConfig, weights] = await Promise.all([
      fetchCounted(config.tokenizer.file).then((b) => decodeJson<object>(b)),
      fetchCounted("tokenizer_config.json").then((b) => decodeJson<object>(b)),
      fetchCounted(backend === "static" ? config.static.embeddings : config.onnx.file),
    ]);
    const engine =
      backend === "static"
        ? new StaticEngine(new Int8Array(weights), config)
        : await OnnxEngine.create(weights, options.device ?? "auto", options.ortWasmPaths ?? "/ort/");
    const info: ModelInfo = {
      model: config.model,
      labels: config.labels,
      threshold: config.threshold,
      backend,
      device: engine.device,
      loadMs: performance.now() - t0,
      downloadBytes: bytes,
    };
    return new Model(config, new Tokenizer(tokJson, tokConfig), engine, info);
  }

  /** Same rules as ExportedTokenizer.ids in microdecide/export.py. */
  tokenize(text: string): number[] {
    const t = this.config.tokenizer;
    const clipped = sliceCodePoints(sliceCodePoints(text, this.config.max_chars), t.max_tokens * t.median_token_length);
    const drop = new Set(t.drop_token_ids);
    const ids = this.tokenizer.encode(clipped, { add_special_tokens: t.add_special_tokens }).ids;
    return ids.filter((id) => !drop.has(id)).slice(0, t.max_tokens);
  }

  async decideBatch(texts: string[]): Promise<Decision[]> {
    const t0 = performance.now();
    const logits = await this.engine.logits(texts.map((t) => this.tokenize(t)));
    const ms = (performance.now() - t0) / Math.max(texts.length, 1);
    const { labels, temperature, model } = this.config;
    return logits.map((z) => {
      const p = softmax(z, temperature);
      const i = argmax(p);
      return {
        label: labels[i],
        probabilities: Object.fromEntries(labels.map((l, k) => [l, p[k]])),
        confidence: p[i],
        escalated: false,
        source: "micro",
        model,
        latency_ms: ms,
      };
    });
  }
}
