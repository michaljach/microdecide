/** Load an exported model folder and turn texts into Decisions. Runs in a worker or the main thread. */
import { type Engine, StaticEmbedder, StaticEngine, StaticOnnxEngine, StaticTokenizer, TransformersEngine } from "./engines.js";
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
    const backend = options.backend ?? (config.tier === "static" ? "static" : "onnx");
    const device = options.device ?? "auto";
    const dtype = options.dtype ?? "q8";
    const toFetch =
      config.tier === "static"
        ? [config.tokenizer.file, "tokenizer_config.json", backend === "static" ? config.static.embeddings : config.onnx?.file]
        : [config.tokenizer.file, "tokenizer_config.json", "config.json", dtype === "fp32" ? config.onnx.fp32_file : config.onnx.file];
    expected = toFetch.reduce((sum, f) => sum + ((f && config.files?.[f]) || 0), 0);
    started = true;
    const wasmPaths = options.ortWasmPaths ?? "/ort/";
    let engine: Engine;
    if (config.tier === "static") {
      if (backend === "onnx" && !config.onnx) throw new Error(`${config.model} has no ONNX export; use backend "static"`);
      if (!config.labels.length) throw new Error(`${config.model} is an embedding base without a head`);
      const [tokJson, tokConfig, weights] = await Promise.all([
        fetchCounted(config.tokenizer.file).then((b) => decodeJson<object>(b)),
        fetchCounted("tokenizer_config.json").then((b) => decodeJson<object>(b)),
        fetchCounted(backend === "static" ? config.static.embeddings : config.onnx!.file),
      ]);
      const tokenizer = new StaticTokenizer(tokJson, tokConfig, config);
      engine =
        backend === "static"
          ? new StaticEngine(new StaticEmbedder(new Int8Array(weights), config, tokenizer))
          : await StaticOnnxEngine.create(weights, tokenizer, device, wasmPaths);
    } else {
      if (backend !== "onnx") throw new Error(`backend "${backend}" is only for static-tier models`);
      engine = await TransformersEngine.create(
        baseUrl,
        config,
        { device, dtype, wasmPaths, cache: useCache },
        (file, n) => bytes.set(file, n),
        onFile,
      );
    }
    const info: ModelInfo = {
      model: config.model,
      tier: config.tier,
      labels: config.labels,
      threshold: config.threshold,
      backend,
      device: engine.device,
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
