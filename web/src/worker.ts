/// <reference lib="webworker" />
import { Model } from "./model.js";
import type { Request, Reply } from "./protocol.js";
export type { Request } from "./protocol.js";
const post = (msg: Reply) => self.postMessage(msg);

let model: Model | null = null;

self.onmessage = async (e: MessageEvent<Request>) => {
  const msg = e.data;
  try {
    if (msg.type === "load") {
      model = await Model.load(msg.url, msg.options);
      post({ id: msg.id, ok: true, result: model.info });
    } else {
      if (!model) throw new Error("model not loaded");
      post({ id: msg.id, ok: true, result: await model.decideBatch(msg.texts) });
    }
  } catch (err) {
    post({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
