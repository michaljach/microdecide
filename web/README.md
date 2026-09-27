# microdecide-web

Run a [microdecide](../docs/SPEC.md) model in the browser: plain JS (or onnxruntime-web) for
the static tier, transformers.js for the encoder tier. Inference runs in a Web Worker; model
files are cached with the Cache API. Encoder models must be served from the page's origin.

```ts
import { MicroDecide } from "microdecide-web";

const m = await MicroDecide.load("/models/comment_moderation/v3"); // an `microdecide export` folder
const d = await m.decide("Buy cheap followers at ...");
// { label: "spam", probabilities: {...}, confidence: 0.99, source: "micro", ... }
if (!m.isConfident(d)) { /* below the calibrated threshold: escalate */ }
```

Options: `backend: "static" | "onnx"`, `device: "auto" | "webgpu" | "wasm"` (onnx; auto = wasm
for static/encoder models, measured faster than WebGPU at this size), `dtype: "q8" | "fp32"` (encoder),
`worker`, `cache`, `ortWasmPaths` (default `/ort/`; serve `onnxruntime-web/dist/ort-wasm*`
there — `scripts/sync-model.mjs` does this for the demo).

### Training in the browser

```ts
import { StaticEmbedder, trainStaticHead, modelFiles, saveModelToCache, MicroDecide } from "microdecide-web";

const report = trainStaticHead({ X: texts.map((t) => embedder.embed(t)), y, labels });
const files = modelFiles("my_task", base, report);            // base = an `export-base` folder's files
await saveModelToCache("/playground-models/my_task", files);   // Cache API, same origin
const m = await MicroDecide.load("/playground-models/my_task");
```

The demo's `playground.html` is a full UI around this (see docs/SPEC.md §4.8.1).

The package ships as plain ESM that uses `new Worker(new URL("./worker.js", import.meta.url))`,
so your bundler (Vite, webpack 5, …) compiles the worker and its dependencies.

## Demo site

`demo/` is a static React site (Vite, one HTML entry per page, so deep links work on GitHub Pages
without a router): `index.html` (demo, benchmark, parity), `repository.html` (catalog from
`models/index.json`), `model.html?model=…`, `playground.html` (train your own), `bench.html`,
`parity.html`. Pages live in `demo/pages/`, shared components in `demo/ui/`. React is a dev
dependency only; the library in `src/` doesn't use it.

Development: see the Commands section in [CLAUDE.md](../CLAUDE.md).

## Development checks

`npm test` generates deterministic Python training and model-export fixtures with
uv, then runs all Node tests including parity. Run `uv sync --locked` at the repo
root first. No pretrained downloads or existing run artifacts are required.
`npm run test:browser` checks the built playground with those fixtures (requires
`npx playwright install chromium`).

Artifact schemas are owned by Python and compiled for browser validation with
`npm run schema`. See [the architecture notes](../docs/ARCHITECTURE.md) for module
ownership, compatibility entry points, and regeneration commands.

To deploy UI changes from a checkout without trained `runs/`, reuse the currently
published model assets:

```sh
git fetch origin gh-pages
git archive origin/gh-pages models bases examples ort | tar -x -C public
npm run deploy:pages -- --reuse-models
```

The default deployment command still syncs artifacts from local training runs.
