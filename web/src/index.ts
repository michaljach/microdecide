/**
 * microdecide-web: run a microdecide model in the browser.
 *
 *   const m = await MicroDecide.load("/models/comment_moderation/v1");
 *   const d = await m.decide("Buy cheap followers at ...");   // Decision
 */
import { Model } from "./model.js";
import type { Decision, LoadOptions, ModelInfo } from "./types.js";
import type { Request } from "./worker.js";

export type { Backend, Decision, Device, EncoderConfig, LoadOptions, ModelConfig, ModelInfo, StaticConfig } from "./types.js";
export { clearModelCache } from "./fetch.js";
export { Model } from "./model.js";

type Pending = { resolve: (v: unknown) => void; reject: (e: Error) => void };
type Distribute<T> = T extends unknown ? Omit<T, "id"> : never;

export class MicroDecide {
  private constructor(
    readonly info: ModelInfo,
    private readonly run: (texts: string[]) => Promise<Decision[]>,
    private readonly worker: Worker | null,
  ) {}

  static async load(url: string, options: LoadOptions = {}): Promise<MicroDecide> {
    const useWorker = (options.worker ?? true) && typeof Worker !== "undefined";
    if (!useWorker) {
      const model = await Model.load(url, options);
      return new MicroDecide(model.info, (t) => model.decideBatch(t), null);
    }
    const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    const pending = new Map<number, Pending>();
    let next = 0;
    worker.onmessage = (e) => {
      const { id, ok, result, error } = e.data;
      const p = pending.get(id);
      pending.delete(id);
      if (ok) p?.resolve(result);
      else p?.reject(new Error(error));
    };
    const call = <T>(msg: Distribute<Request>) =>
      new Promise<T>((resolve, reject) => {
        const id = next++;
        pending.set(id, { resolve: resolve as (v: unknown) => void, reject });
        worker.postMessage({ ...msg, id });
      });
    try {
      const info = await call<ModelInfo>({ type: "load", url: new URL(url, location.href).href, options });
      return new MicroDecide(info, (texts) => call<Decision[]>({ type: "decide", texts }), worker);
    } catch (err) {
      worker.terminate();
      throw err;
    }
  }

  async decide(text: string): Promise<Decision> {
    return (await this.run([text]))[0];
  }

  decideBatch(texts: string[]): Promise<Decision[]> {
    return this.run(texts);
  }

  /** False → below the calibrated threshold; escalate (automatic with escalateUrl in M6). */
  isConfident(d: Decision): boolean {
    return d.confidence >= this.info.threshold;
  }

  dispose(): void {
    this.worker?.terminate();
  }
}
export { StaticEmbedder, StaticTokenizer, applyHead } from "./engines.js";
export { type EmbeddingBase, modelFiles, saveModelToCache, zipModel } from "./package.js";
export { type Split, type TrainInput, type TrainReport, type TrainedHead, stratifiedSplit, trainStaticHead } from "./train.js";
