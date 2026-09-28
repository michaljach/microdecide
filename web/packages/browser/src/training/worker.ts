import { Session } from "./session.js";
import type { Request } from "./types.js";
let session: Session | undefined;
let busy = false;
self.onmessage = async (event: MessageEvent<{ id: number; request: Request }>) => {
  const { id, request } = event.data;
  if (busy) { self.postMessage({ id, error: "Training worker is busy." }); return; }
  busy = true;
  try {
    let value: unknown;
    if (request.kind === "check") {
      session?.dispose();
      session = new Session(request.options, progress => self.postMessage({ id, progress }));
      value = await session.prepare(request.bundle, request.data, request.backend);
    } else {
      if (!session) throw new Error("Check the model and browser first.");
      // Training progress belongs to this request, not the earlier hardware check.
      if (request.kind === "train") {
        session.progress = progress => self.postMessage({ id, progress });
        value = await session.train();
      } else if (request.kind === "download") value = await session.download();
      else value = await session.predict(request.text);
    }
    if (value instanceof Uint8Array) self.postMessage({ id, value }, { transfer: [value.buffer] });
    else self.postMessage({ id, value });
  } catch (err) {
    session?.dispose(); session = undefined;
    self.postMessage({ id, error: err instanceof Error ? err.message : String(err) });
  } finally { busy = false; }
};
