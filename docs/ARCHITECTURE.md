# Code organization

The Python package builds and evaluates models; `web/src` is the browser library;
`web/demo` is its React application. Keep UI state and browser navigation out of
library code. The CLI coordinates existing pipeline functions.

## Python

- `spec.py`: user task specifications and decisions.
- `artifacts.py`: versioned model configs and model cards, validated on write and
  load. Legacy cards without `artifact_version` are treated as version 1. Browser
  model configs remain format version 2.
- `classifiers.py`: the inference `Classifier` protocol and built-in loaders.
  Both runtime and training use this module; runtime does not import training.
- `static.py`, `encoder.py`: tier implementations and fitting.
- `train.py`: candidate selection, calibration, and saving a run.
- `export.py`: export orchestration and compatibility exports.
  `exporters/static.py` and `exporters/encoder.py` own their artifact writers and
  reference inference; `exporters/common.py` owns parity metrics and shared helpers.
- `evaluate.py`: measurement and report data; `reporting.py`: Markdown rendering.
- `data.py`, `teachers/`, `synth.py`: collection, labeling, and generation.

The existing `microdecide.export` functions, `train.classifier_for`, and
`evaluate.render_markdown` remain importable. Prefer the owning modules in new
internal code. There is no plugin registry: two explicit tiers are sufficient.

## Browser library and demo

`model.ts` loads a config, selects an engine, and produces decisions. `index.ts`
provides the public API and chooses main-thread or worker execution. The engine
interface remains in `engines.ts`.

`train.ts` coordinates training and retains its previous exports. Its algorithms
live in `training/split.ts`, `optimize.ts`, `metrics.ts`, and `calibrate.ts`.

`rpc.ts` owns request correlation, progress delivery, error handling, and disposal.
`protocol.ts` defines inference messages. The demo's `training/protocol.ts` defines
training messages and derives its result from the library's `TrainReport`.
Clients infer their return types from the request rather than choosing arbitrary
result types. Worker replies use the same protocol types.

The playground page composes `training/task.ts` (persistent task state),
`training/client.ts` (worker lifecycle), and `training/Results.tsx` (report view).
Importing those modules does not start a worker. The page retains its form and
workflow orchestration. All six HTML entries contain only metadata, styles, and a
React root. Layout widths, page titles, confirmations, downloads, and keyboard
labeling are owned by React components and handlers. Refs invoke browser actions
such as focusing a queue, opening a modal, or starting a download. The only
explicit document lookup in the demo is the root mount. Service workers and ML
utilities remain ordinary JavaScript/TypeScript because they do not render UI.

## Artifact contracts

Python's `artifacts.py` generates `web/src/model.schema.json`. Ajv compiles it
at development time into `model-validator.ts`; `artifacts.ts` uses that validator
and checks relationships such as head dimensions and label cardinality. The
browser ships the generated validator, without Ajv or runtime schema compilation.

After changing the contract:

```sh
cd web
npm run schema
npm test
```

Both generated files are committed. The fixture generator checks schema freshness;
`npm test` also checks validator freshness. Cross-language cases cover accepted
configs and rejection of invalid versions, dimensions, labels, and tokenizer IDs.
Incompatible contract changes require a new format version and a migration plan.

## Reproducible checks

From a clean checkout:

```sh
uv sync --locked
uv run pytest
cd web
npm ci
npm test
npm run typecheck
npm run build:lib
npm run build:demo
```

`npm test` first runs `scripts/generate_fixtures.py` through uv. It creates seeded
training data and sklearn reference outputs, plus a tiny local WordPiece/model2vec
model exported through the production Python exporter. Fixtures go in ignored
`web/test/generated/`; no teacher calls, model downloads, or existing `runs/`
folders are needed. Node parity is required rather than skipped. `MODEL_EXPORT`
can still select a real static export for that test.

For production-page acceptance checks, install Chromium once and run:

```sh
npx playwright install chromium
npm run test:browser
```

This uses generated local fixtures to exercise training, caching, inference in
both execution modes, ZIP downloads, task persistence, and the model page. The
existing `parity`, `bench`, `offline`, and `playground` commands still cover real
exported models; the tiny fixtures do not replace quality checks on those models.
