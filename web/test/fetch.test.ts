import { describe, expect, it } from "vitest";
import { makeFetcher, readWithProgress } from "../packages/browser/src/fetch";

function chunked(parts: number[], contentLength = true): Response {
  const body = new ReadableStream<Uint8Array>({
    start(c) {
      parts.forEach((n, i) => c.enqueue(new Uint8Array(n).fill(i + 1)));
      c.close();
    },
  });
  const total = parts.reduce((a, b) => a + b, 0);
  return new Response(body, { headers: contentLength ? { "content-length": String(total) } : {} });
}

describe("download progress", () => {
  it("reports bytes as chunks arrive and returns the whole body", async () => {
    const seen: [number, number][] = [];
    const buf = await readWithProgress(chunked([3, 5, 2]), (l, t) => seen.push([l, t]));
    expect(new Uint8Array(buf)).toEqual(Uint8Array.from([1, 1, 1, 2, 2, 2, 2, 2, 3, 3]));
    expect(seen[0]).toEqual([0, 10]);
    expect(seen.map(([l]) => l)).toEqual([0, 3, 8, 10, 10]);
    expect(seen.at(-1)).toEqual([10, 10]);
  });

  it("without Content-Length the total follows what has arrived", async () => {
    const seen: [number, number][] = [];
    await readWithProgress(chunked([4, 4], false), (l, t) => seen.push([l, t]));
    expect(seen).toEqual([[0, 0], [4, 4], [8, 8], [8, 8]]);
  });

  it("the fetcher reports per URL", async () => {
    const orig = globalThis.fetch;
    globalThis.fetch = (async () => chunked([6])) as typeof fetch;
    try {
      const seen: string[] = [];
      await makeFetcher(false, (url, l, t) => seen.push(`${url} ${l}/${t}`))("/m/model.bin");
      expect(seen).toEqual(["/m/model.bin 0/6", "/m/model.bin 6/6", "/m/model.bin 6/6"]);
    } finally {
      globalThis.fetch = orig;
    }
  });
});
