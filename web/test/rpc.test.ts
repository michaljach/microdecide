import { describe, expect, it, vi } from "vitest";
import { WorkerClient } from "../src/rpc";
import type { InferenceProtocol } from "../src/protocol";

function setup() {
  const worker = { postMessage: vi.fn(), terminate: vi.fn(), onmessage: null as any, onerror: null as any, onmessageerror: null as any };
  const client = new WorkerClient<InferenceProtocol>(worker as unknown as Worker);
  return { worker, client };
}

describe("worker transport", () => {
  it("correlates out-of-order responses and delivers progress without settling", async () => {
    const { worker, client } = setup();
    const progress = vi.fn();
    const first = client.call({ type: "decide", texts: ["a"] }, progress);
    const second = client.call({ type: "decide", texts: ["b"] });
    const [a, b] = worker.postMessage.mock.calls.map(([msg]) => msg.id);
    worker.onmessage({ data: { id: a, progress: { stage: "fit", fraction: 0.5 } } });
    expect(progress).toHaveBeenCalledWith("fit", 0.5);
    worker.onmessage({ data: { id: b, ok: true, result: [] } });
    await expect(second).resolves.toEqual([]);
    worker.onmessage({ data: { id: a, ok: false, error: "failed" } });
    await expect(first).rejects.toThrow("failed");
  });

  it.each(["dispose", "error", "messageerror"])("rejects pending and future calls on %s", async (event) => {
    const { worker, client } = setup();
    const pending = client.call({ type: "decide", texts: [] });
    if (event === "dispose") client.dispose();
    else if (event === "error") worker.onerror({ message: "worker crashed" });
    else worker.onmessageerror({});
    await expect(pending).rejects.toThrow();
    await expect(client.call({ type: "decide", texts: [] })).rejects.toThrow("disposed");
    expect(worker.terminate).toHaveBeenCalledOnce();
  });

  it("rejects a request that cannot be cloned", async () => {
    const { worker, client } = setup();
    worker.postMessage.mockImplementationOnce(() => { throw new Error("cannot clone"); });
    await expect(client.call({ type: "decide", texts: [] })).rejects.toThrow("cannot clone");
    client.dispose();
  });
});
