/** Load an exported model folder and turn texts into Decisions. Runs in a worker or the main thread. */
import { type Engine, TransformersEngine } from "./engines.js";
import { type Fetcher, decodeJson, joinUrl, makeFetcher } from "./fetch.js";
import { parseModelConfig } from "./artifacts.js";
import { argmax, softmax } from "./text.js";
import type { Decision, LoadOptions, ModelConfig, ModelInfo } from "./types.js";

export class Model {
  private constructor(
    readonly config: ModelConfig,
    private readonly engine: Engine,
    readonly info: ModelInfo,
  ) {}

  static async load(baseUrl: string, options: LoadOptions = {}, fetcher?: Fetcher): Promise<Model> {
    const t0 = performance.now();
    const useCache = options.cache ?? true;
    // bytes per file for onProgress: [loaded, total]; files join as they start. `expected` is the
    // exported size of the files this load fetches: servers that gzip on the fly send no or the
    // compressed Content-Length, so the per-file totals alone can't be trusted.
    const files = new Map<string, [number, number]>();
    let expected = 0;
    let started = false; // report only once the config (and so `expected`) is known
    const onFile = (file: string, loaded: number, total: number) => {
      files.set(file, [loaded, total]);
      if (!options.onProgress || !started) return;
      let l = 0;
      let t = 0;
      for (const [a, b] of files.values()) (l += a), (t += Math.max(a, b));
      options.onProgress({ loaded: l, total: Math.max(t, expected) });
    };
    const get = fetcher ?? makeFetcher(useCache, onFile);
    const bytes = new Map<string, number>();
    const fetchCounted = async (file: string) => {
      const buf = await get(joinUrl(baseUrl, file));
      bytes.set(file, buf.byteLength);
      return buf;
    };
    const config = parseModelConfig(decodeJson(await fetchCounted("microdecide.json")));
    const device = options.device ?? "auto";
    const dtype = options.dtype ?? "q8";
    const onnxFile = dtype === "fp32" ? config.onnx.fp32_file : config.onnx.file;
    if (!onnxFile) throw new Error(`${config.model} has no ${dtype} ONNX file`);
    const toFetch = [config.tokenizer.file, "tokenizer_config.json", "config.json", onnxFile];
    expected = toFetch.reduce((sum, f) => sum + (config.files?.[f] ?? 0), 0);
    started = true;
    const engine: Engine = await TransformersEngine.create(
      baseUrl,
      config,
      { device, dtype, wasmPaths: options.ortWasmPaths ?? "/ort/", cache: useCache },
      (file, n) => bytes.set(file, n),
      onFile,
    );
    const info: ModelInfo = {
      model: config.model,
      labels: config.labels,
      threshold: config.threshold,
      device: engine.device,
      dtype,
      loadMs: performance.now() - t0,
      downloadBytes: [...bytes.values()].reduce((a, b) => a + b, 0),
    };
    return new Model(config, engine, info);
  }

  async decideBatch(texts: string[]): Promise<Decision[]> {
    const t0 = performance.now();
    const logits = await this.engine.logits(texts);
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
