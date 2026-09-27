/** Inference engines: texts → logits. Static engines mirror microdecide/export.py exactly. */
import { Tokenizer } from "@huggingface/tokenizers";
import { sliceCodePoints } from "./text.js";
import type { EncoderConfig, StaticConfig } from "./types.js";

export interface Engine {
  readonly device: "js" | "webgpu" | "wasm";
  logits(texts: string[]): Promise<Float64Array[]>;
}

/** Static-tier tokenization rules (= ExportedTokenizer.ids in microdecide/export.py). */
export class StaticTokenizer {
  private readonly tok: Tokenizer;
  private readonly drop: Set<number>;

  constructor(tokenizerJson: object, tokenizerConfig: object, private readonly config: StaticConfig) {
    this.tok = new Tokenizer(tokenizerJson, tokenizerConfig);
    this.drop = new Set(config.tokenizer.drop_token_ids);
  }

  ids(text: string): number[] {
    const t = this.config.tokenizer;
    const clipped = sliceCodePoints(sliceCodePoints(text, this.config.max_chars), t.max_tokens * t.median_token_length);
    const ids = this.tok.encode(clipped, { add_special_tokens: t.add_special_tokens }).ids;
    return ids.filter((id) => !this.drop.has(id)).slice(0, t.max_tokens);
  }
}

/** Static-tier sentence embedding: mean of int8 rows → L2 normalize (= model2vec encode). */
export class StaticEmbedder {
  constructor(
    private readonly table: Int8Array,
    readonly config: StaticConfig,
    readonly tokenizer: StaticTokenizer,
  ) {
    if (table.length !== config.vocab_size * config.dim) {
      throw new Error(`embedding table has ${table.length} values, expected ${config.vocab_size}x${config.dim}`);
    }
  }

  get dim(): number {
    return this.config.dim;
  }

  /** The raw int8 table (to save a trained model next to its base). */
  get weights(): Int8Array {
    return this.table;
  }

  embed(text: string, out: Float64Array = new Float64Array(this.config.dim)): Float64Array {
    const { dim, normalize } = this.config;
    const ids = this.tokenizer.ids(text);
    out.fill(0);
    for (const id of ids) {
      const off = id * dim;
      for (let j = 0; j < dim; j++) out[j] += this.table[off + j];
    }
    if (ids.length) for (let j = 0; j < dim; j++) out[j] /= ids.length;
    if (normalize) {
      let sq = 0;
      for (let j = 0; j < dim; j++) sq += out[j] * out[j];
      const norm = Math.sqrt(sq) + 1e-32;
      for (let j = 0; j < dim; j++) out[j] /= norm;
    }
    return out;
  }
}

/** Linear head over an embedding: logits = coef · v + intercept. */
export function applyHead(v: ArrayLike<number>, coef: ArrayLike<number>[], intercept: ArrayLike<number>): Float64Array {
  const out = new Float64Array(intercept.length);
  for (let k = 0; k < out.length; k++) {
    const w = coef[k];
    let z = intercept[k];
    for (let j = 0; j < v.length; j++) z += v[j] * w[j];
    out[k] = z;
  }
  return out;
}

/** Plain JS: StaticEmbedder → linear head. */
export class StaticEngine implements Engine {
  readonly device = "js" as const;
  private readonly pooled: Float64Array;

  constructor(private readonly embedder: StaticEmbedder) {
    this.pooled = new Float64Array(embedder.dim);
  }

  async logits(texts: string[]): Promise<Float64Array[]> {
    const { coef, intercept } = this.embedder.config.head;
    return texts.map((t) => applyHead(this.embedder.embed(t, this.pooled), coef, intercept));
  }
}

type Ort = typeof import("onnxruntime-web/webgpu");

/**
 * "auto" → WASM for the static and encoder tiers: measured on an M2 Pro (Metal), single-input
 * latency is lower on WASM (encoder q8: p50 2.5 ms vs 9.8 ms fp32 / 14.6 ms q8 on WebGPU); GPU
 * dispatch overhead dominates for models this small; WebGPU wins only on large batches.
 * Pass device: "webgpu" to force it.
 */
async function resolveDevice(device: "auto" | "webgpu" | "wasm"): Promise<"webgpu" | "wasm"> {
  return device === "auto" ? "wasm" : device;
}

function configureOrt(ort: Ort, wasmPaths: string) {
  ort.env.wasm.wasmPaths = wasmPaths;
  ort.env.wasm.numThreads = globalThis.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;
}

/** Static tier's ONNX graph on onnxruntime-web (WebGPU or WASM). Loaded lazily. */
export class StaticOnnxEngine implements Engine {
  private constructor(
    private readonly ort: Ort,
    private readonly session: import("onnxruntime-web/webgpu").InferenceSession,
    private readonly tokenizer: StaticTokenizer,
    readonly device: "webgpu" | "wasm",
  ) {}

  static async create(
    model: ArrayBuffer,
    tokenizer: StaticTokenizer,
    device: "auto" | "webgpu" | "wasm",
    wasmPaths: string,
  ): Promise<StaticOnnxEngine> {
    const ort: Ort = await import("onnxruntime-web/webgpu");
    configureOrt(ort, wasmPaths);
    const chosen = await resolveDevice(device);
    const session = await ort.InferenceSession.create(new Uint8Array(model), {
      executionProviders: chosen === "webgpu" ? ["webgpu", "wasm"] : ["wasm"],
    });
    return new StaticOnnxEngine(ort, session, tokenizer, chosen);
  }

  async logits(texts: string[]): Promise<Float64Array[]> {
    const ids = texts.map((t) => this.tokenizer.ids(t));
    const width = Math.max(1, ...ids.map((r) => r.length));
    const inputIds = new BigInt64Array(ids.length * width);
    const mask = new BigInt64Array(ids.length * width);
    ids.forEach((row, i) =>
      row.forEach((id, j) => {
        inputIds[i * width + j] = BigInt(id);
        mask[i * width + j] = 1n;
      }),
    );
    const dims = [ids.length, width];
    const out = await this.session.run({
      input_ids: new this.ort.Tensor("int64", inputIds, dims),
      attention_mask: new this.ort.Tensor("int64", mask, dims),
    });
    return splitRows(out.logits.data as Float32Array, ids.length, out.logits.dims[1]);
  }
}

type TransformersJs = typeof import("@huggingface/transformers");
type SeqClassifier = Awaited<ReturnType<TransformersJs["AutoModelForSequenceClassification"]["from_pretrained"]>>;
type HfTokenizer = Awaited<ReturnType<TransformersJs["AutoTokenizer"]["from_pretrained"]>>;

/** Encoder tier: transformers.js AutoTokenizer + AutoModelForSequenceClassification. Loaded lazily. */
export class TransformersEngine implements Engine {
  private constructor(
    private readonly tokenizer: HfTokenizer,
    private readonly model: SeqClassifier,
    private readonly config: EncoderConfig,
    readonly device: "webgpu" | "wasm",
  ) {}

  static async create(
    baseUrl: string,
    config: EncoderConfig,
    opts: { device: "auto" | "webgpu" | "wasm"; dtype: "q8" | "fp32"; wasmPaths: string; cache: boolean },
    onBytes: (file: string, bytes: number) => void,
  ): Promise<TransformersEngine> {
    const tfjs: TransformersJs = await import("@huggingface/transformers");
    const { env } = tfjs;
    // serve everything from the model folder; never the Hub, never a CDN. transformers.js joins
    // paths in a way that breaks "http://", so hand it a root-relative path (same origin only).
    const abs = new URL(baseUrl, globalThis.location?.href);
    if (globalThis.location && abs.origin !== globalThis.location.origin) {
      throw new Error(`encoder models must be served from the page's origin (got ${abs.origin})`);
    }
    const url = abs.pathname.replace(/\/+$/, "");
    const slash = url.lastIndexOf("/");
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = url.slice(0, slash + 1);
    env.useBrowserCache = opts.cache && typeof caches !== "undefined";
    if (env.backends.onnx.wasm) {
      env.backends.onnx.wasm.wasmPaths = opts.wasmPaths;
      env.backends.onnx.wasm.numThreads = globalThis.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;
    }
    const id = url.slice(slash + 1);
    const device = await resolveDevice(opts.device);
    const progress_callback = (p: { status: string; file?: string; total?: number }) => {
      if (p.status === "progress" && p.file && p.total) onBytes(p.file, p.total);
    };
    const [tokenizer, model] = await Promise.all([
      tfjs.AutoTokenizer.from_pretrained(id, { progress_callback }),
      tfjs.AutoModelForSequenceClassification.from_pretrained(id, { device, dtype: opts.dtype, progress_callback }),
    ]);
    return new TransformersEngine(tokenizer, model, config, device);
  }

  async logits(texts: string[]): Promise<Float64Array[]> {
    const clipped = texts.map((t) => sliceCodePoints(t, this.config.max_chars));
    const inputs = this.tokenizer(clipped, {
      padding: true,
      truncation: true,
      max_length: this.config.tokenizer.max_tokens,
    });
    const { logits } = await this.model(inputs);
    return splitRows(logits.data as Float32Array, texts.length, logits.dims[1]);
  }
}

function splitRows(data: Float32Array, rows: number, cols: number): Float64Array[] {
  return Array.from({ length: rows }, (_, i) => Float64Array.from(data.subarray(i * cols, (i + 1) * cols)));
}

export async function hasWebGPU(): Promise<boolean> {
  const gpu = (globalThis.navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } })?.gpu;
  if (!gpu) return false;
  try {
    return (await gpu.requestAdapter()) != null;
  } catch {
    return false;
  }
}
