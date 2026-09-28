import type { Decision, ModelInfo } from "@nodd/core";
import type { LoadOptions, LoadProgress } from "./types.js";
import type { RequestFor, WorkerReply } from "./rpc.js";

export interface InferenceProtocol {
  load: { request: { url: string; options: Omit<LoadOptions, "onProgress"> }; result: ModelInfo };
  decide: { request: { texts: string[] }; result: Decision[] };
}
export type Request = RequestFor<InferenceProtocol> & { id: number };
export type Reply = WorkerReply<ModelInfo | Decision[], LoadProgress>;
