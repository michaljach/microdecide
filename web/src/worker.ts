/// <reference lib="webworker" />
import { Model } from "./model.js";
import type { LoadOptions } from "./types.js";

export type Request =
  | { id: number; type: "load"; url: string; options: LoadOptions }
  | { id: number; type: "decide"; texts: string[] };

let model: Model | null = null;

self.onmessage = async (e: MessageEvent<Request>) => {
  const msg = e.data;
  try {
    if (msg.type === "load") {
      model = await Model.load(msg.url, msg.options);
      self.postMessage({ id: msg.id, ok: true, result: model.info });
    } else {
      if (!model) throw new Error("model not loaded");
      self.postMessage({ id: msg.id, ok: true, result: await model.decideBatch(msg.texts) });
    }
  } catch (err) {
    self.postMessage({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
