/** Shared worker transport: request/result types belong to each worker's protocol. */
export interface StageProgress {
  stage: string;
  fraction: number;
}
export type WorkerReply<T, G = StageProgress> =
  | { id: number; ok: true; result: T }
  | { id: number; ok: false; error: string }
  | { id: number; progress: G };
export type RequestFor<P> = { [K in keyof P]: { type: K } & (P[K] extends { request: infer R } ? R : never) }[keyof P];
export type ResultFor<P, K extends keyof P> = P[K] extends { result: infer R } ? R : never;
export type Progress<G = StageProgress> = (progress: G) => void;

export class WorkerClient<P, G = StageProgress> {
  private next = 0;
  private closed = false;
  private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void; progress?: Progress<G> }>();

  constructor(private readonly worker: Worker) {
    worker.onmessage = (event: MessageEvent<WorkerReply<unknown, G>>) => {
      const msg = event.data;
      const pending = this.pending.get(msg.id);
      if (!pending) return;
      if ("progress" in msg) return pending.progress?.(msg.progress);
      this.pending.delete(msg.id);
      if (msg.ok) pending.resolve(msg.result);
      else pending.reject(new Error(msg.error));
    };
    worker.onerror = (event) => this.dispose(new Error(event.message || "Worker failed"));
    worker.onmessageerror = () => this.dispose(new Error("Invalid worker message"));
  }

  call<K extends keyof P>(msg: { type: K } & (P[K] extends { request: infer R } ? R : never), progress?: Progress<G>): Promise<ResultFor<P, K>> {
    if (this.closed) return Promise.reject(new Error("Worker disposed"));
    return new Promise((resolve, reject) => {
      const id = this.next++;
      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject, progress });
      try {
        this.worker.postMessage({ ...msg, id });
      } catch (error) {
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  dispose(error = new Error("Worker disposed")): void {
    this.closed = true;
    this.worker.terminate();
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
  }
}
