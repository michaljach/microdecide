/** Inference engines: token ids → logits. Both mirror microdecide/export.py exactly. */
import type { ModelConfig } from "./types.js";

export interface Engine {
  readonly device: "js" | "webgpu" | "wasm";
  logits(ids: number[][]): Promise<Float64Array[]>;
}

/** Plain JS: mean of int8 embedding rows → L2 normalize → linear head. */
export class StaticEngine implements Engine {
  readonly device = "js" as const;
  private readonly pooled: Float64Array;

  constructor(
    private readonly table: Int8Array,
    private readonly config: ModelConfig,
  ) {
    if (table.length !== config.vocab_size * config.dim) {
      throw new Error(`embedding table has ${table.length} values, expected ${config.vocab_size}x${config.dim}`);
    }
    this.pooled = new Float64Array(config.dim);
  }

  async logits(ids: number[][]): Promise<Float64Array[]> {
    return ids.map((row) => this.one(row));
  }

  private one(ids: number[]): Float64Array {
    const { dim, normalize, head } = this.config;
    const v = this.pooled.fill(0);
    for (const id of ids) {
      const off = id * dim;
      for (let j = 0; j < dim; j++) v[j] += this.table[off + j];
    }
    if (ids.length) for (let j = 0; j < dim; j++) v[j] /= ids.length;
    if (normalize) {
      let sq = 0;
      for (let j = 0; j < dim; j++) sq += v[j] * v[j];
      const norm = Math.sqrt(sq) + 1e-32;
      for (let j = 0; j < dim; j++) v[j] /= norm;
    }
    const out = new Float64Array(head.intercept.length);
    for (let k = 0; k < out.length; k++) {
      const w = head.coef[k];
      let z = head.intercept[k];
      for (let j = 0; j < dim; j++) z += v[j] * w[j];
      out[k] = z;
    }
    return out;
  }
}

type Ort = typeof import("onnxruntime-web/webgpu");

/** onnxruntime-web on WebGPU or WASM. Loaded lazily so the static path never downloads it. */
export class OnnxEngine implements Engine {
  private constructor(
    private readonly ort: Ort,
    private readonly session: import("onnxruntime-web/webgpu").InferenceSession,
    readonly device: "webgpu" | "wasm",
  ) {}

  static async create(model: ArrayBuffer, device: "auto" | "webgpu" | "wasm", wasmPaths: string): Promise<OnnxEngine> {
    const ort: Ort = await import("onnxruntime-web/webgpu");
    ort.env.wasm.wasmPaths = wasmPaths;
    ort.env.wasm.numThreads = globalThis.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;
    let chosen: "webgpu" | "wasm" = device === "webgpu" ? "webgpu" : "wasm";
    if (device === "auto") chosen = (await hasWebGPU()) ? "webgpu" : "wasm";
    const session = await ort.InferenceSession.create(new Uint8Array(model), {
      executionProviders: chosen === "webgpu" ? ["webgpu", "wasm"] : ["wasm"],
    });
    return new OnnxEngine(ort, session, chosen);
  }

  async logits(ids: number[][]): Promise<Float64Array[]> {
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
    const logits = out.logits;
    const data = logits.data as Float32Array;
    const n = logits.dims[1];
    return ids.map((_, i) => Float64Array.from(data.subarray(i * n, (i + 1) * n)));
  }
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
