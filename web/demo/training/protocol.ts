import type { TrainReport } from "../../src/train";
import type { Decision } from "../../src/types";
import type { RequestFor, WorkerReply } from "../../src/rpc";

export interface Example { text: string; label: string; weight?: number }
export type TrainResult = Omit<TrainReport, "probs" | "split" | "ms"> & {
  ms: TrainReport["ms"] & { embed: number; total: number };
  predictions: { text: string; label: string; predicted: string; confidence: number; probabilities: number[] }[];
};
export interface TrainingProtocol {
  loadBase: { request: { url: string }; result: { model: string; dim: number; vocab: number; mb: number } };
  train: { request: { examples: Example[]; labels: string[]; targetPrecision: number; seed: number; name: string }; result: TrainResult };
  predict: { request: { text: string }; result: Decision };
  save: { request: { name: string; url: string }; result: { url: string; bytes: number } };
  zip: { request: { name: string }; result: Uint8Array };
}
export type Req = RequestFor<TrainingProtocol> & { id: number };
export type Reply = WorkerReply<TrainingProtocol[keyof TrainingProtocol]["result"]>;
