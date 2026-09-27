/** Fetch model files, via the Cache API when available so later loads work offline. */
export type Fetcher = (url: string) => Promise<ArrayBuffer>;

export const CACHE_NAME = "microdecide-models-v1";

export function makeFetcher(useCache = true): Fetcher {
  const cacheOk = useCache && typeof caches !== "undefined";
  return async (url: string) => {
    if (cacheOk) {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(url);
      if (hit) return hit.arrayBuffer();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
      await cache.put(url, res.clone());
      return res.arrayBuffer();
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    return res.arrayBuffer();
  };
}

/** Clears cached model files (ours, and transformers.js' cache used by the encoder tier). */
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
