/**
 * @nodd/browser: run a nodd model in the browser (transformers.js on onnxruntime-web, WASM or WebGPU).
 *
 *   const m = await nodd.load("/models/comment_moderation/v3");
 *   const d = await m.decide("Buy cheap followers at ...");   // Decision
 */
import { Decider, type Decision, type ModelInfo } from "@nodd/core";
import { Model } from "./model.js";
import type { LoadOptions, LoadProgress } from "./types.js";
import { WorkerClient } from "./rpc.js";
import type { InferenceProtocol } from "./protocol.js";

export type { Decision, EncoderConfig, ModelConfig, ModelInfo } from "@nodd/core";
export type { Device, LoadOptions, LoadProgress } from "./types.js";
export { clearModelCache } from "./fetch.js";
export { Model } from "./model.js";

export class nodd extends Decider {
  private constructor(
    info: ModelInfo,
    run: (texts: string[]) => Promise<Decision[]>,
    private readonly worker: WorkerClient<InferenceProtocol, LoadProgress> | null,
  ) {
    super(info, run);
  }

  static async load(url: string, options: LoadOptions = {}): Promise<nodd> {
    const useWorker = (options.worker ?? true) && typeof Worker !== "undefined";
    if (!useWorker) {
      const model = await Model.load(url, options);
      return new nodd(model.info, (t) => model.decideBatch(t), null);
    }
    const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    const client = new WorkerClient<InferenceProtocol, LoadProgress>(worker);
    const { onProgress, ...rest } = options; // functions can't cross into the worker
    try {
      const info = await client.call({ type: "load", url: new URL(url, location.href).href, options: rest }, onProgress);
      return new nodd(info, (texts) => client.call({ type: "decide", texts }), client);
    } catch (err) {
      client.dispose();
      throw err;
    }
  }

  dispose(): void {
    this.worker?.dispose();
  }
}
