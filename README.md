# nodd

Turn one decision ("is this comment ok, spam or toxic?") into a **tiny, calibrated
classifier that runs in the browser** — ~10–35 MB, offline, no per-call cost — and
knows when it is unsure, so the hard cases can go to a bigger model.

**Live demo:** https://michaljach.github.io/nodd/ ·
**Docs:** https://michaljach.github.io/nodd/docs.html

## How it works

```
task spec (YAML) → collect inputs → teacher labels → train → calibrate → evaluate → export → browser
```

- **Models**: a small sentence encoder (MiniLM-class) fine-tuned with a classification
  head, exported to ONNX q8 and run with transformers.js. Every base model that fits your
  download budget is trained and the best fit is kept (highest validation F1; the smaller
  one on a near-tie).
- Every prediction is a typed `Decision` with a **calibrated** confidence; below the
  threshold (chosen for a target precision) it should be escalated.
- Exports are checked for **parity**: the browser matches Python on the test set.

Example task (`examples/comment_moderation.yaml`, 1,711 synthetic comments):

| model | download | test macro F1 | handled without escalation | browser p95 |
|---|---|---|---|---|
| MiniLM-L3 (v2) | 18.6 MB | 0.943 | 88% | 6.8 ms |
| **MiniLM-L6** (v3, best fit) | **23.7 MB** | **0.948** | **96%** | 12.0 ms |

The test data is synthetic — expect lower numbers on real comments.

## Quickstart

```bash
uv sync
uv run nodd run examples/comment_moderation.yaml   # collect → label → train → eval → export
uv run nodd compare runs/comment_moderation/v2 runs/comment_moderation/v3

cd web && npm install && npm run sync-model && npm run dev # demo, repository, docs, benchmark, parity
```

```ts
import { Nodd } from "@nodd/browser";
const m = await Nodd.load("/models/comment_moderation/v2");
const d = await m.decide("Buy cheap followers at …");  // { label: "spam", confidence: 0.99, … }
```

On a server, `@nodd/node` has the same API and runs the same export folder natively:

```ts
import { Nodd } from "@nodd/node";
const m = await Nodd.load("./runs/comment_moderation/v3/export");
```

Design: [docs/SPEC.md](docs/SPEC.md) · Plan: [docs/ROADMAP.md](docs/ROADMAP.md) ·
npm packages: [web/README.md](web/README.md)

Code layout and reproducible checks: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
