/** Fetch model files, via the Cache API when available so later loads work offline. */
export type Fetcher = (url: string) => Promise<ArrayBuffer>;

export const CACHE_NAME = "nodd-models-v1";

/** Per-file progress: bytes read so far and the file's size (0 while unknown). */
export type FileProgress = (url: string, loaded: number, total: number) => void;

export function makeFetcher(useCache = true, onProgress?: FileProgress): Fetcher {
  const cacheOk = useCache && typeof caches !== "undefined";
  return async (url: string) => {
    const cache = cacheOk ? await caches.open(CACHE_NAME) : null;
    const hit = await cache?.match(url);
    if (hit) {
      const buf = await hit.arrayBuffer();
      onProgress?.(url, buf.byteLength, buf.byteLength);
      return buf;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const buf = await readWithProgress(res, (loaded, total) => onProgress?.(url, loaded, total));
    await cache?.put(url, new Response(buf, { headers: res.headers }));
    return buf;
  };
}

/** Read a response body, reporting bytes as they arrive (total from Content-Length, else 0). */
export async function readWithProgress(res: Response, onBytes: (loaded: number, total: number) => void): Promise<ArrayBuffer> {
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body) {
    const buf = await res.arrayBuffer();
    onBytes(buf.byteLength, buf.byteLength);
    return buf;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  onBytes(0, total);
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    onBytes(loaded, Math.max(total, loaded));
  }
  const out = new Uint8Array(loaded);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.byteLength;
  }
  onBytes(loaded, loaded);
  return out.buffer;
}

/** Clears cached model files (ours, and transformers.js' cache). */
export async function clearModelCache(): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  const results = await Promise.all([caches.delete(CACHE_NAME), caches.delete("transformers-cache")]);
  return results.some(Boolean);
}

export function joinUrl(base: string, file: string): string {
  return `${base.replace(/\/+$/, "")}/${file}`;
}

export function decodeJson<T>(buf: ArrayBuffer): T {
  return JSON.parse(new TextDecoder().decode(buf)) as T;
}
