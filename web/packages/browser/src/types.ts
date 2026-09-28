export type Device = "auto" | "webgpu" | "wasm";

export interface LoadOptions {
  /** "q8" (default, smallest) or "fp32" (the full-precision file, if it is served). */
  dtype?: "q8" | "fp32";
  /** "auto" = WASM: lower single-input latency than WebGPU for models this size (see engine.ts).
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
