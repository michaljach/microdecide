/** Mirrors `Decision` in docs/SPEC.md §3 and src/nodd/spec.py. */
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
  format: "nodd";
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

/** `nodd.json`, written by `nodd export`: a transformers.js sequence classifier. */
export interface EncoderConfig extends BaseConfig {
  tier: "encoder";
  onnx: OnnxRef;
  tokenizer: { file: string; add_special_tokens: boolean; max_tokens: number; truncation: boolean };
}

export type ModelConfig = EncoderConfig;

export interface ModelInfo {
  model: string;
  labels: string[];
  threshold: number;
  /** Where inference runs: "wasm"/"webgpu" in the browser, "cpu" in Node (onnxruntime-node). */
  device: "webgpu" | "wasm" | "cpu";
  dtype: "q8" | "fp32";
  loadMs: number;
  downloadBytes: number;
}
