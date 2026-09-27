/// <reference lib="webworker" />
import { Model } from "./model.js";
import type { LoadOptions, LoadProgress } from "./types.js";

export type Request =
  | { id: number; type: "load"; url: string; options: Omit<LoadOptions, "onProgress">; progress: boolean }
  | { id: number; type: "decide"; texts: string[] };

let model: Model | null = null;

self.onmessage = async (e: MessageEvent<Request>) => {
  const msg = e.data;
  try {
    if (msg.type === "load") {
      const id = msg.id;
      const onProgress = msg.progress ? (progress: LoadProgress) => self.postMessage({ id, progress }) : undefined;
      model = await Model.load(msg.url, { ...msg.options, onProgress });
      self.postMessage({ id: msg.id, ok: true, result: model.info });
    } else {
      if (!model) throw new Error("model not loaded");
      self.postMessage({ id: msg.id, ok: true, result: await model.decideBatch(msg.texts) });
    }
  } catch (err) {
    self.postMessage({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
