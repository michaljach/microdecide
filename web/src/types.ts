/** Mirrors `Decision` in docs/SPEC.md §3 and src/microdecide/spec.py. */
export interface Decision {
  label: string;
  probabilities: Record<string, number>;
  confidence: number;
  escalated: boolean;
  source: "micro" | "teacher";
  model: string;
  latency_ms: number;
}

/** Wire fields are validated against model.schema.json, generated from Python artifacts.py. */
interface BaseConfig {
  format: "microdecide";
  format_version: 2;
  model: string;
  labels: string[];
  temperature: number;
  threshold: number;
  max_chars: number;
  /** Model file sizes in bytes by relative path (download progress totals). Absent in older exports. */
  files?: Record<string, number>;
}

interface OnnxRef {
  file: string;
  fp32_file?: string;
  dtype?: string;
  inputs: string[];
  output: string;
}

/** `microdecide.json` for the static tier: int8 embedding table + linear head. */
export interface StaticConfig extends BaseConfig {
  tier: "static";
  /** The ONNX graph of the same model (optional: the plain-JS backend doesn't need it). */
  onnx?: OnnxRef;
  normalize: boolean;
  dim: number;
  vocab_size: number;
  tokenizer: {
    file: string;
    add_special_tokens: boolean;
    median_token_length: number;
    max_tokens: number;
    drop_token_ids: number[];
  };
  static: { embeddings: string; dtype: "int8" };
  head: { coef: number[][]; intercept: number[] };
}

/** `microdecide.json` for the encoder tier: a transformers.js sequence classifier. */
export interface EncoderConfig extends BaseConfig {
  tier: "encoder";
  onnx: OnnxRef;
  tokenizer: { file: string; add_special_tokens: boolean; max_tokens: number; truncation: boolean };
}

/** `microdecide.json`, written by `microdecide export`. */
export type ModelConfig = StaticConfig | EncoderConfig;

/** "static" = plain JS over the int8 table (static tier only, no runtime download);
 *  "onnx" = onnxruntime-web (static tier's graph, or the encoder via transformers.js). */
export type Backend = "static" | "onnx";
export type Device = "auto" | "webgpu" | "wasm";

export interface LoadOptions {
  /** Default: "static" for static-tier models (smallest, no ONNX runtime), "onnx" otherwise. */
  backend?: Backend;
  /** Encoder tier only: "q8" (default, smallest) or "fp32" (often better on WebGPU). */
  dtype?: "q8" | "fp32";
  /** ONNX only. "auto" = WASM: lower single-input latency than WebGPU for models this size
   *  (see engines.ts). Pass "webgpu" to force it. */
  device?: Device;
  /** Run inference in a Web Worker so the UI never blocks. Default true where Workers exist. */
  worker?: boolean;
  /** Cache model files with the Cache API after first load. Default true where available. */
  cache?: boolean;
  /** Where onnxruntime-web's .wasm files are served. Default "/ort/". */
  ortWasmPaths?: string;
  /** Called as model files download (or are read back from the cache). */
  onProgress?: (p: LoadProgress) => void;
}

/** Bytes so far across the model's files. `total` grows as files start, so it can rise mid-load. */
export interface LoadProgress {
  loaded: number;
  total: number;
}

export interface ModelInfo {
  model: string;
  tier: ModelConfig["tier"];
  labels: string[];
  threshold: number;
  backend: Backend;
  device: "js" | "webgpu" | "wasm";
  loadMs: number;
  downloadBytes: number;
}
