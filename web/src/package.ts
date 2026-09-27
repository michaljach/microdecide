/** Package a head trained in the browser (+ its embedding base) as a model folder that
 *  `MicroDecide.load` opens: store it in the Cache API, or zip it for download. */
import { parseModelConfig } from "./artifacts.js";
import { CACHE_NAME, joinUrl } from "./fetch.js";
import type { TrainReport } from "./train.js";
import type { StaticConfig } from "./types.js";
import { zip } from "./zip.js";

export interface EmbeddingBase {
  config: StaticConfig;
  tokenizerJson: ArrayBuffer;
  tokenizerConfig: ArrayBuffer;
  table: ArrayBuffer;
}

export function modelFiles(name: string, base: EmbeddingBase, report: TrainReport, extra: Record<string, unknown> = {}): Record<string, Uint8Array> {
  const { onnx: _onnx, kind: _kind, ...baseConfig } = base.config;
  const config: StaticConfig = {
    ...baseConfig,
    model: `${name}@browser`,
    labels: report.head.labels,
    temperature: report.head.temperature,
    threshold: report.head.threshold,
    head: { coef: report.head.coef, intercept: report.head.intercept },
  };
  const card = {
    task: name,
    model: config.model,
    tier: "static",
    base: base.config.model,
    trained_in: "browser",
    created: new Date().toISOString(),
    labels: config.labels,
    temperature: config.temperature,
    threshold: config.threshold,
    C: report.C,
    val_macro_f1_by_C: report.valMacroF1ByC,
    data: report.counts,
    test: { macro_f1: report.test.macroF1, accuracy: report.test.accuracy, confusion: report.test.confusion },
    calibration: report.calibration,
    escalation: report.escalation,
    ...extra,
  };
  const json = (v: unknown) => new TextEncoder().encode(JSON.stringify(v));
  return {
    "microdecide.json": json(parseModelConfig(config)),
    "model_card.json": json(card),
    "tokenizer.json": new Uint8Array(base.tokenizerJson),
    "tokenizer_config.json": new Uint8Array(base.tokenizerConfig),
    [config.static.embeddings]: new Uint8Array(base.table),
  };
}

/** Store a model folder under `url` (e.g. "/playground-models/my_task") in the Cache API that
 *  MicroDecide.load reads first — so it loads with no server, and offline. */
export async function saveModelToCache(url: string, files: Record<string, Uint8Array>): Promise<string> {
  if (typeof caches === "undefined") throw new Error("Cache API not available");
  const abs = new URL(url, globalThis.location?.href).href.replace(/\/+$/, "");
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    Object.entries(files).map(([file, data]) =>
      cache.put(joinUrl(abs, file), new Response(data as BodyInit, { headers: { "Content-Length": String(data.byteLength) } })),
    ),
  );
  return abs;
}

export function zipModel(name: string, files: Record<string, Uint8Array>): Uint8Array {
  return zip(Object.fromEntries(Object.entries(files).map(([f, d]) => [`${name}/${f}`, d])));
}
