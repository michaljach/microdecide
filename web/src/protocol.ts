import type { Decision, LoadOptions, ModelInfo } from "./types.js";
import type { RequestFor, WorkerReply } from "./rpc.js";

export interface InferenceProtocol {
  load: { request: { url: string; options: LoadOptions }; result: ModelInfo };
  decide: { request: { texts: string[] }; result: Decision[] };
}
export type Request = RequestFor<InferenceProtocol> & { id: number };
export type Reply = WorkerReply<ModelInfo | Decision[]>;
