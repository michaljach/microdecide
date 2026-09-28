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

/** `microdecide.json`, written by `microdecide export`: a transformers.js sequence classifier. */
export interface EncoderConfig extends BaseConfig {
  tier: "encoder";
  onnx: OnnxRef;
  tokenizer: { file: string; add_special_tokens: boolean; max_tokens: number; truncation: boolean };
}

export type ModelConfig = EncoderConfig;

export type Device = "auto" | "webgpu" | "wasm";

export interface LoadOptions {
  /** "q8" (default, smallest) or "fp32" (the full-precision file, if it is served). */
  dtype?: "q8" | "fp32";
  /** "auto" = WASM: lower single-input latency than WebGPU for models this size (see engines.ts).
   *  Pass "webgpu" to force it. */
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
  labels: string[];
  threshold: number;
  device: "webgpu" | "wasm";
  dtype: "q8" | "fp32";
  loadMs: number;
  downloadBytes: number;
}
