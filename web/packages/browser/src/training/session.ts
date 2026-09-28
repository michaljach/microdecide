import * as tf from "@tensorflow/tfjs";
import { BertTokenizer } from "@huggingface/transformers";
import { toDecision } from "@nodd/core";
import { strFromU8, strToU8 } from "fflate";
import { Bert, Trainer } from "./bert.js";
import { readBundle, pack, jsonBytes, writeWeights, type Bundle, type Weights } from "./bundle.js";
import { dataset, validateOptions, shuffle, random, metrics, calibrate } from "./data.js";
import type { Hardware, Options, Progress, Result, Row } from "./types.js";

type Tokens = { ids: number[]; mask: number[]; types: number[] };
export function encodeText(tokenizer: BertTokenizer, text: string, maxTokens: number): Tokens {
  const output = tokenizer(text, { truncation: true, max_length: maxTokens, padding: "max_length" });
  const ids = Array.from(output.input_ids.data, Number), mask = Array.from(output.attention_mask.data, Number);
  const types = output.token_type_ids ? Array.from(output.token_type_ids.data, Number) : Array(ids.length).fill(0);
  // Transformers.js truncates after special-token insertion. HF's Python BERT tokenizer
  // reserves the final SEP slot first. Restore that slot for identical training/export inputs.
  if (!Number.isInteger(tokenizer.sep_token_id)) throw new Error("A BERT separator token is required.");
  if (ids.length === maxTokens && mask[maxTokens - 1] === 1) ids[maxTokens - 1] = tokenizer.sep_token_id;
  return { ids, mask, types };
}
export class Session {
  private model!: Bert;
  private bundle!: Bundle;
  private tokenizer!: BertTokenizer;
  private data!: ReturnType<typeof dataset>;
  private tokens = new Map<string, Tokens>();
  private result?: Result;
  private hardware!: Hardware;
  constructor(readonly options: Options, public progress: (p: Progress) => void) {}
  async prepare(buffer: ArrayBuffer, data: string, backend = "auto"): Promise<Hardware> {
    validateOptions(this.options);
    this.data = dataset(data, this.options.seed);
    this.bundle = readBundle(buffer);
    if (this.options.maxTokens > this.bundle.config.max_position_embeddings) throw new Error("Sequence length exceeds this encoder's position limit.");
    this.tokenizer = new BertTokenizer(JSON.parse(strFromU8(this.bundle.files["tokenizer.json"])), JSON.parse(strFromU8(this.bundle.files["tokenizer_config.json"])));
    this.encode(this.data.train[0].text);
    const nav = globalThis.navigator as (Navigator & { deviceMemory?: number; gpu?: { requestAdapter(): Promise<{ info?: { description?: string; vendor?: string; architecture?: string } } | null> } }) | undefined;
    const adapter = await nav?.gpu?.requestAdapter().catch(() => null);
    const webgpu = !!adapter;
    const gpu = adapter?.info?.description || [adapter?.info?.vendor, adapter?.info?.architecture].filter(Boolean).join(" ") || null;
    const failures: string[] = [];
    const backends = backend === "auto" ? [...(webgpu ? ["webgpu"] : []), "webgl", "cpu"] : [backend];
    for (const candidate of backends) {
      let trainer: Trainer | undefined;
      try {
        this.progress({ phase: `Checking ${candidate}: encoder, gradients, and optimizer` });
        if (candidate === "webgpu") await import("@tensorflow/tfjs-backend-webgpu");
        if (!await tf.setBackend(candidate)) throw new Error("Backend unavailable");
        await tf.ready();
        this.model = new Bert(this.bundle.config, this.bundle.weights, this.data.labels, this.options.seed);
        const parameters = this.model.parameters;
        // Conservatively count weights/gradients/moments plus checkpoint copies and attention/FFN activations.
        const c = this.bundle.config, b = this.options.batchSize, s = this.options.maxTokens;
        const estimatedMB = Math.ceil((parameters * 28 + c.num_hidden_layers * b * (s * c.hidden_size * 32 + c.num_attention_heads * s * s * 4) * 4) / 1e6);
        const memoryGB = nav?.deviceMemory ?? null;
        if (memoryGB !== null && estimatedMB > memoryGB * 1000 * 0.6) throw new Error(`Estimated ${estimatedMB} MB working memory is too high for reported ${memoryGB} GB RAM. Reduce batch size or sequence length.`);
        const original = await this.model.snapshot();
        trainer = new Trainer(this.model, this.options.learningRate);
        const start = performance.now();
        // Actual full-size batch/sequence, not a synthetic matrix multiplication capability check.
        const batch = this.tensors(Array.from({ length: b }, () => ({ ids: Array(s).fill(Math.min(1, c.vocab_size - 1)), mask: Array(s).fill(1), types: Array(s).fill(0) })));
        try { await trainer.step(batch.ids, batch.mask, batch.types, Array(b).fill(0), Array(b).fill(1)); }
        finally { tf.dispose(batch); }
        const stepMs = performance.now() - start;
        // Readback catches GPU failures and numerical issues that can otherwise be deferred.
        const probe = await this.model.snapshot();
        if (Object.values(probe).some(w => !w.values.every(Number.isFinite))) throw new Error("Backend produced non-finite weights.");
        this.model.restore(original);
        trainer.dispose(); trainer = undefined;
        this.hardware = { backend: candidate, webgpu, gpu, cores: nav?.hardwareConcurrency ?? null, memoryGB,
          estimatedMB, stepMs, parameters, notes: [
            "A full training step passed at the selected batch size and sequence length. Free GPU memory is not exposed by browsers; this is not a guarantee for a long run.",
            ...(candidate === "cpu" ? ["CPU fallback: training may be slow. Keep this tab open."] : []),
            ...failures,
          ] };
        // The model owns its weights now. Do not retain another 70–135 MB checkpoint in RAM.
        this.bundle.weights = {};
        delete this.bundle.files["model.safetensors"];
        return this.hardware;
      } catch (error) {
        trainer?.dispose(); this.model?.dispose();
        failures.push(`${candidate}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    throw new Error(`This browser could not complete a full training step. ${failures.join("; ")}`);
  }
  private encode(text: string): Tokens {
    const cached = this.tokens.get(text);
    if (cached) return cached;
    const { ids, mask, types } = encodeText(this.tokenizer, text, this.options.maxTokens);
    if (ids.length !== this.options.maxTokens || ids.some(i => !Number.isInteger(i) || i < 0 || i >= this.bundle.config.vocab_size) || types.some(i => i < 0 || i >= this.bundle.config.type_vocab_size)) throw new Error("Tokenizer is incompatible with the encoder.");
    const tokens = { ids, mask, types }; this.tokens.set(text, tokens); return tokens;
  }
  private tensors(tokens: Tokens[]) {
    return { ids: tf.tensor2d(tokens.map(t => t.ids), undefined, "int32"), mask: tf.tensor2d(tokens.map(t => t.mask), undefined, "int32"), types: tf.tensor2d(tokens.map(t => t.types), undefined, "int32") };
  }
  private ys(rows: Row[]) { return rows.map(r => this.data.labels.indexOf(r.label)); }
  private async logits(rows: Row[]): Promise<number[][]> {
    const result: number[][] = [];
    for (let i = 0; i < rows.length; i += this.options.batchSize) {
      const batch = this.tensors(rows.slice(i, i + this.options.batchSize).map(r => this.encode(r.text)));
      let logits: tf.Tensor2D | undefined;
      try { logits = this.model.forward(batch.ids, batch.mask, batch.types); result.push(...await logits.array()); }
      finally { logits?.dispose(); tf.dispose(batch); }
    }
    if (result.some(row => row.some(v => !Number.isFinite(v)))) throw new Error("The backend returned invalid predictions.");
    return result;
  }
  async train(): Promise<Result> {
    if (!this.hardware || this.result) throw new Error("Run a fresh hardware check before training.");
    const started = performance.now();
    const o = this.options, trainer = new Trainer(this.model, o.learningRate), rng = random(o.seed);
    const stepsPerEpoch = Math.ceil(this.data.train.length / o.batchSize), total = stepsPerEpoch * o.epochs;
    let step = 0, bestF1 = -1, bestEpoch = 0, best: Weights | undefined;
    const history: Result["history"] = [];
    try {
      for (let epoch = 1; epoch <= o.epochs; epoch++) {
        const rows = shuffle(this.data.train, rng); let lossSum = 0;
        for (let i = 0; i < rows.length; i += o.batchSize) {
          const selected = rows.slice(i, i + o.batchSize), batch = this.tensors(selected.map(r => this.encode(r.text)));
          const lr = o.learningRate * Math.min(1, (step + 1) / Math.max(1, 0.1 * total)) * Math.max(0, (total - step) / total);
          let loss: number;
          try { loss = await trainer.step(batch.ids, batch.mask, batch.types, this.ys(selected), selected.map(r => r.confidence ?? 1), lr); }
          finally { tf.dispose(batch); }
          lossSum += loss * selected.length; step++;
          this.progress({ phase: "Training every encoder layer", step, total, loss, epoch });
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        this.progress({ phase: "Evaluating validation split", epoch, step, total });
        const validation = metrics(await this.logits(this.data.val), this.ys(this.data.val), this.data.labels.length);
        history.push({ epoch, loss: lossSum / rows.length, validationF1: validation.macroF1 });
        this.progress({ phase: "Validation complete", epoch, step, total, validationF1: validation.macroF1 });
        if (validation.macroF1 > bestF1) { bestF1 = validation.macroF1; bestEpoch = epoch; best = await this.model.snapshot(); }
      }
      this.model.restore(best!);
    } finally { trainer.dispose(); }
    this.progress({ phase: "Calibrating confidence and evaluating untouched test split" });
    const valLogits = await this.logits(this.data.val), valY = this.ys(this.data.val);
    const calibration = calibrate(valLogits, valY, o.targetPrecision);
    this.result = { labels: this.data.labels, ...calibration, bestEpoch, history, trainSeconds: 0,
      validation: metrics(valLogits, valY, this.data.labels.length, calibration.temperature, calibration.threshold),
      test: metrics(await this.logits(this.data.test), this.ys(this.data.test), this.data.labels.length, calibration.temperature, calibration.threshold) };
    this.result.trainSeconds = (performance.now() - started) / 1000;
    return this.result;
  }
  async download(): Promise<Uint8Array> {
    if (!this.result) throw new Error("Finish training before saving a checkpoint.");
    const config = { ...this.bundle.config, architectures: ["BertForSequenceClassification"],
      id2label: Object.fromEntries(this.data.labels.map((l, i) => [i, l])), label2id: Object.fromEntries(this.data.labels.map((l, i) => [l, i])) };
    const referenceRows = this.data.test.slice(0, 16);
    const referenceLogits = await this.logits(referenceRows);
    return pack({ ...this.bundle.files, "config.json": jsonBytes(config), "model.safetensors": writeWeights(await this.model.snapshot()),
      "training_parity.json": jsonBytes(referenceRows.map((row, i) => ({ text: row.text, logits: referenceLogits[i] }))),
      "labeled.jsonl": strToU8(this.data.rows.map(r => JSON.stringify(r)).join("\n") + "\n"),
      "training.json": jsonBytes({ format: "nodd-browser-training", version: 1, options: this.options, result: this.result, hardware: this.hardware }) });
  }
  async predict(text: string) {
    if (!this.result) throw new Error("Train the model first.");
    const start = performance.now();
    const [logits] = await this.logits([{ text, label: this.data.labels[0] }]);
    return toDecision({ labels: this.data.labels, temperature: this.result.temperature, model: `${this.options.task}@browser` }, logits, performance.now() - start);
  }
  dispose() { this.model?.dispose(); this.tokens.clear(); }
}
