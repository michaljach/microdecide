# microdecide-web

Run a [microdecide](../docs/SPEC.md) model in the browser: plain JS for the static tier,
onnxruntime-web (WASM / WebGPU) for ONNX exports. Inference runs in a Web Worker; model
files are cached with the Cache API.

```ts
import { MicroDecide } from "microdecide-web";

const m = await MicroDecide.load("/models/comment_moderation/v1"); // an `microdecide export` folder
const d = await m.decide("Buy cheap followers at ...");
// { label: "spam", probabilities: {...}, confidence: 0.99, source: "micro", ... }
if (!m.isConfident(d)) { /* below the calibrated threshold: escalate */ }
```

Options: `backend: "static" | "onnx"`, `device: "auto" | "webgpu" | "wasm"` (onnx),
`worker`, `cache`, `ortWasmPaths` (default `/ort/`; serve `onnxruntime-web/dist/ort-wasm*`
there — `scripts/sync-model.mjs` does this for the demo).

The package ships as plain ESM that uses `new Worker(new URL("./worker.js", import.meta.url))`,
so your bundler (Vite, webpack 5, …) compiles the worker and its dependencies.

Development: see the Commands section in [CLAUDE.md](../CLAUDE.md).
