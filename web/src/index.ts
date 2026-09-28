/**
 * microdecide-web: run a microdecide model in the browser.
 *
 *   const m = await MicroDecide.load("/models/comment_moderation/v1");
 *   const d = await m.decide("Buy cheap followers at ...");   // Decision
 */
import { Model } from "./model.js";
import type { Decision, LoadOptions, LoadProgress, ModelInfo } from "./types.js";
import { WorkerClient } from "./rpc.js";
import type { InferenceProtocol } from "./protocol.js";

export type { Decision, Device, EncoderConfig, LoadOptions, LoadProgress, ModelConfig, ModelInfo } from "./types.js";
export { clearModelCache } from "./fetch.js";
export { Model } from "./model.js";

export class MicroDecide {
  private constructor(
    readonly info: ModelInfo,
    private readonly run: (texts: string[]) => Promise<Decision[]>,
    private readonly worker: WorkerClient<InferenceProtocol, LoadProgress> | null,
  ) {}

  static async load(url: string, options: LoadOptions = {}): Promise<MicroDecide> {
    const useWorker = (options.worker ?? true) && typeof Worker !== "undefined";
    if (!useWorker) {
      const model = await Model.load(url, options);
      return new MicroDecide(model.info, (t) => model.decideBatch(t), null);
    }
    const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
    const client = new WorkerClient<InferenceProtocol, LoadProgress>(worker);
    const { onProgress, ...rest } = options; // functions can't cross into the worker
    try {
      const info = await client.call({ type: "load", url: new URL(url, location.href).href, options: rest }, onProgress);
      return new MicroDecide(info, (texts) => client.call({ type: "decide", texts }), client);
    } catch (err) {
      client.dispose();
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
    this.worker?.dispose();
  }
}
