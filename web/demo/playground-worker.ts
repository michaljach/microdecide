/// <reference lib="webworker" />
// Playground worker: embedding base + training + live prediction + save/zip, off the UI thread.
import { StaticEmbedder, StaticTokenizer, applyHead } from "../src/engines";
import { decodeJson, joinUrl, makeFetcher } from "../src/fetch";
import { type EmbeddingBase, modelFiles, saveModelToCache, zipModel } from "../src/package";
import { argmax, softmax } from "../src/text";
import { type TrainReport, trainStaticHead } from "../src/train";
import type { Decision, StaticConfig } from "../src/types";

export interface Example {
  text: string;
  label: string;
  weight?: number;
}

export type Req =
  | { id: number; type: "loadBase"; url: string }
  | { id: number; type: "train"; examples: Example[]; labels: string[]; targetPrecision: number; seed: number; name: string }
  | { id: number; type: "predict"; text: string }
  | { id: number; type: "save"; name: string }
  | { id: number; type: "zip"; name: string };

let base: (EmbeddingBase & { embedder: StaticEmbedder; url: string; mb: number }) | null = null;
let embCache = new Map<string, Float64Array>();
let trained: { report: TrainReport; name: string; examples: Example[] } | null = null;

const post = (msg: unknown, transfer: Transferable[] = []) => (self as unknown as Worker).postMessage(msg, transfer);
const progress = (id: number, stage: string, fraction: number) => post({ id, progress: { stage, fraction } });

async function loadBase(url: string) {
  const get = makeFetcher(true);
  const config = decodeJson<StaticConfig>(await get(joinUrl(url, "microdecide.json")));
  const [tokenizerJson, tokenizerConfig, table] = await Promise.all([
    get(joinUrl(url, config.tokenizer.file)),
    get(joinUrl(url, "tokenizer_config.json")),
    get(joinUrl(url, config.static.embeddings)),
  ]);
  const tokenizer = new StaticTokenizer(decodeJson(tokenizerJson), decodeJson(tokenizerConfig), config);
  base = {
    url,
    config,
    tokenizerJson,
    tokenizerConfig,
    table,
    embedder: new StaticEmbedder(new Int8Array(table), config, tokenizer),
    mb: (table.byteLength + tokenizerJson.byteLength) / 1e6,
  };
  embCache = new Map();
  trained = null;
  return { model: config.model, dim: config.dim, vocab: config.vocab_size, mb: base.mb };
}

function decide(text: string): Decision {
  if (!base || !trained) throw new Error("train a model first");
  const t0 = performance.now();
  const { head } = trained.report;
  const p = softmax(applyHead(base.embedder.embed(text), head.coef, head.intercept), head.temperature);
  const i = argmax(p);
  return {
    label: head.labels[i],
    probabilities: Object.fromEntries(head.labels.map((l, k) => [l, p[k]])),
    confidence: p[i],
    escalated: false,
    source: "micro",
    model: `${trained.name}@browser`,
    latency_ms: performance.now() - t0,
  };
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const msg = e.data;
  try {
    if (msg.type === "loadBase") {
      post({ id: msg.id, ok: true, result: await loadBase(msg.url) });
    } else if (msg.type === "train") {
      if (!base) throw new Error("load a base first");
      const t0 = performance.now();
      const X = msg.examples.map((ex, i) => {
        let v = embCache.get(ex.text);
        if (!v) {
          v = base!.embedder.embed(ex.text);
          embCache.set(ex.text, v);
        }
        if (i % 200 === 0) progress(msg.id, "embed", i / msg.examples.length);
        return v;
      });
      const embedMs = performance.now() - t0;
      const index = new Map(msg.labels.map((l, i) => [l, i]));
      const report = trainStaticHead({
        X,
        y: msg.examples.map((ex) => index.get(ex.label)!),
        labels: msg.labels,
        weights: msg.examples.map((ex) => ex.weight ?? 1),
        seed: msg.seed,
        targetPrecision: msg.targetPrecision,
        onProgress: (stage, f) => progress(msg.id, stage, f),
      });
      trained = { report, name: msg.name, examples: msg.examples };
      const test = report.split.flatMap((s, i) => (s === "test" ? [i] : []));
      const predictions = test.map((i) => {
        const p = report.probs[i];
        const k = argmax(p);
        return { text: msg.examples[i].text, label: msg.examples[i].label, predicted: msg.labels[k], confidence: p[k], probabilities: p };
      });
      const { probs: _probs, split: _split, ...summary } = report;
      post({ id: msg.id, ok: true, result: { ...summary, ms: { embed: embedMs, ...report.ms, total: performance.now() - t0 }, predictions } });
    } else if (msg.type === "predict") {
      post({ id: msg.id, ok: true, result: decide(msg.text) });
    } else if (msg.type === "save" || msg.type === "zip") {
      if (!base || !trained) throw new Error("train a model first");
      const files = modelFiles(msg.name, base, trained.report, { examples: trained.examples.length });
      if (msg.type === "save") {
        const url = await saveModelToCache(`/playground-models/${msg.name}`, files);
        post({ id: msg.id, ok: true, result: { url: new URL(url).pathname, bytes: Object.values(files).reduce((a, f) => a + f.byteLength, 0) } });
      } else {
        const bytes = zipModel(msg.name, files);
        post({ id: msg.id, ok: true, result: bytes }, [bytes.buffer]);
      }
    }
  } catch (err) {
    post({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
