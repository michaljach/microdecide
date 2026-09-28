/** Inference engine: texts → logits, via transformers.js (onnxruntime-web, WASM or WebGPU). */
import { sliceCodePoints } from "./text.js";
import type { EncoderConfig } from "./types.js";

export interface Engine {
  readonly device: "webgpu" | "wasm";
  logits(texts: string[]): Promise<Float64Array[]>;
}

/**
 * "auto" → WASM: measured on an M2 Pro (Metal), single-input latency is lower on WASM (encoder q8:
 * p50 2.5 ms vs 9.8 ms fp32 / 14.6 ms q8 on WebGPU); GPU dispatch overhead dominates for models this
 * small; WebGPU wins only on large batches. Pass device: "webgpu" to force it.
 */
async function resolveDevice(device: "auto" | "webgpu" | "wasm"): Promise<"webgpu" | "wasm"> {
  return device === "auto" ? "wasm" : device;
}

type TransformersJs = typeof import("@huggingface/transformers");
type SeqClassifier = Awaited<ReturnType<TransformersJs["AutoModelForSequenceClassification"]["from_pretrained"]>>;
type HfTokenizer = Awaited<ReturnType<TransformersJs["AutoTokenizer"]["from_pretrained"]>>;

/** transformers.js AutoTokenizer + AutoModelForSequenceClassification. Loaded lazily. */
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
    onProgress?: (file: string, loaded: number, total: number) => void,
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
    const progress_callback = (p: { status: string; file?: string; loaded?: number; total?: number }) => {
      if (p.status !== "progress" || !p.file || !p.total) return;
      onBytes(p.file, p.total);
      onProgress?.(p.file, p.loaded ?? 0, p.total);
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
