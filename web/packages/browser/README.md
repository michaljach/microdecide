# @nodd/browser

Run a [nodd](https://github.com/michaljach/nodd) model in the browser with transformers.js
(onnxruntime-web: WASM by default, WebGPU opt-in). Inference runs in a Web Worker; model files
are cached with the Cache API, so a model loads offline after the first visit.

```sh
npm install @nodd/browser
```

```ts
import { Nodd } from "@nodd/browser";

const m = await Nodd.load("/models/comment_moderation/v3"); // a `nodd export` folder
const d = await m.decide("Buy cheap followers at ...");
// { label: "spam", probabilities: {...}, confidence: 0.99, source: "micro", ... }
if (!m.isConfident(d)) { /* below the calibrated threshold: escalate */ }
m.dispose(); // stops the worker
```

Options: `device: "auto" | "webgpu" | "wasm"` (auto = wasm, measured faster than WebGPU at this
size), `dtype: "q8" | "fp32"`, `onProgress({ loaded, total })`, `worker`, `cache`,
`ortWasmPaths` (default `/ort/`).

Serving:

- The export folder must be served from the page's own origin (never the Hub or a CDN).
- Serve `onnxruntime-web/dist/ort-wasm*` at `ortWasmPaths`.
- Optional: `Cross-Origin-Opener-Policy: same-origin` and
  `Cross-Origin-Embedder-Policy: require-corp` enable multi-threaded WASM.

The package ships as plain ESM that uses `new Worker(new URL("./worker.js", import.meta.url))`,
so your bundler (Vite, webpack 5, …) compiles the worker and its dependencies.

On a server, use [`@nodd/node`](https://www.npmjs.com/package/@nodd/node): same API, native CPU.
