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

/** `microdecide.json`, written by `microdecide export`. */
export interface ModelConfig {
  format: "microdecide-static";
  format_version: number;
  model: string;
  labels: string[];
  temperature: number;
  threshold: number;
  max_chars: number;
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
  onnx: { file: string; inputs: string[]; output: string };
  head: { coef: number[][]; intercept: number[] };
}

/** "static" = plain JS over the int8 table (no runtime download); "onnx" = onnxruntime-web. */
export type Backend = "static" | "onnx";
export type Device = "auto" | "webgpu" | "wasm";

export interface LoadOptions {
  /** Default "static" for static-tier models: smallest download, no ONNX runtime needed. */
  backend?: Backend;
  /** ONNX only. "auto" = WebGPU when an adapter is available, else WASM. */
  device?: Device;
  /** Run inference in a Web Worker so the UI never blocks. Default true where Workers exist. */
  worker?: boolean;
  /** Cache model files with the Cache API after first load. Default true where available. */
  cache?: boolean;
  /** Where onnxruntime-web's .wasm files are served. Default "/ort/". */
  ortWasmPaths?: string;
}

export interface ModelInfo {
  model: string;
  labels: string[];
  threshold: number;
  backend: Backend;
  device: "js" | "webgpu" | "wasm";
  loadMs: number;
  downloadBytes: number;
}
