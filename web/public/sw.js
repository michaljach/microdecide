// Demo app-shell service worker: network first, cache fallback, so the demo (page, JS, worker,
// onnxruntime wasm) reloads offline after one online visit. Model files are cached by the
// library itself (Cache API "microdecide-models-v1"), so they're skipped here.
const CACHE = "microdecide-demo-shell-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/models/")) return;
  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(e.request);
        if (res.ok) await cache.put(e.request, res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match(e.request, { ignoreSearch: url.pathname.endsWith(".html") || url.pathname === "/" });
        if (hit) return hit;
        throw err;
      }
    })(),
  );
});
