/** Fetch model files, via the Cache API when available so later loads work offline. */
export type Fetcher = (url: string) => Promise<ArrayBuffer>;

const CACHE_NAME = "microdecide-models-v1";

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

export async function clearModelCache(): Promise<boolean> {
  return typeof caches !== "undefined" ? caches.delete(CACHE_NAME) : false;
}

export function joinUrl(base: string, file: string): string {
  return `${base.replace(/\/+$/, "")}/${file}`;
}

export function decodeJson<T>(buf: ArrayBuffer): T {
  return JSON.parse(new TextDecoder().decode(buf)) as T;
}
