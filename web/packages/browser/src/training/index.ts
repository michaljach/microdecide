import type { Request, Progress, Hardware, Result } from "./types.js";
import type { Decision } from "@nodd/core";
export { defaults } from "./types.js";
export type { Options, Hardware, Progress, Result } from "./types.js";
export { dataset as validateDataset, validateOptions } from "./data.js";

/** Dedicated worker: cancellation terminates computation and releases its GPU context. */
export class TrainingClient {
  private worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  private next = 0;
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void; progress?: (p: Progress) => void }>();
  constructor() {
    this.worker.onmessage = ({ data }) => {
      const p = this.pending.get(data.id); if (!p) return;
      if (data.progress) { p.progress?.(data.progress); return; }
      this.pending.delete(data.id);
      if (data.error) p.reject(new Error(data.error)); else p.resolve(data.value);
    };
    this.worker.onerror = e => this.dispose(e.message || "The training worker stopped. Try a smaller batch or another backend.");
    this.worker.onmessageerror = () => this.dispose("Could not read the training worker response.");
  }
  private stopped = false;
  private call<T>(request: Request, progress?: (p: Progress) => void): Promise<T> {
    if (this.stopped) return Promise.reject(new Error("Training worker has been stopped."));
    const id = ++this.next;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: v => resolve(v as T), reject, progress });
      try { this.worker.postMessage({ id, request }, request.kind === "check" ? [request.bundle] : []); }
      catch (error) { this.pending.delete(id); reject(error); }
    });
  }
  check(request: Omit<Extract<Request, { kind: "check" }>, "kind">, progress?: (p: Progress) => void) { return this.call<Hardware>({ kind: "check", ...request }, progress); }
  train(progress?: (p: Progress) => void) { return this.call<Result>({ kind: "train" }, progress); }
  download() { return this.call<Uint8Array>({ kind: "download" }); }
  predict(text: string) { return this.call<Decision>({ kind: "predict", text }); }
  dispose(reason = "Training stopped. No incomplete checkpoint was saved.") {
    this.stopped = true; this.worker.terminate();
    this.pending.forEach(p => p.reject(new Error(reason))); this.pending.clear();
  }
}
