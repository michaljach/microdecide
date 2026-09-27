import { useCallback, useEffect, useRef } from "react";
import { WorkerClient } from "../../src/rpc";
import type { TrainingProtocol } from "./protocol";

/** One worker per mounted training page; importing the page never starts a worker. */
export function useTrainingClient(): WorkerClient<TrainingProtocol>["call"] {
  const client = useRef<WorkerClient<TrainingProtocol> | null>(null);
  useEffect(() => {
    client.current = new WorkerClient<TrainingProtocol>(new Worker(new URL("../playground-worker.ts", import.meta.url), { type: "module" }));
    return () => { client.current?.dispose(); client.current = null; };
  }, []);
  return useCallback<WorkerClient<TrainingProtocol>["call"]>((msg, progress) => {
    if (!client.current) return Promise.reject(new Error("Training worker is not mounted"));
    return client.current.call(msg, progress);
  }, []);
}
