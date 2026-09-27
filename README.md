# microdecide

Turn one decision ("is this comment ok, spam or toxic?") into a **tiny, calibrated
classifier that runs in the browser** — ~10–35 MB, offline, no per-call cost — and
knows when it is unsure, so the hard cases can go to a bigger model.

**Live demo:** https://michaljach.github.io/microdecide/ ·
**Train your own in the browser:** https://michaljach.github.io/microdecide/playground.html

## How it works

```
task spec (YAML) → collect inputs → teacher labels → train → calibrate → evaluate → export → browser
```

- **Tiers**, smallest download first: *static* (model2vec embeddings + logistic
  regression, plain JS) and *encoder* (fine-tuned MiniLM, ONNX q8 via transformers.js).
  `auto` trains every candidate that fits your download budget and keeps the best fit
  (highest validation F1; the smaller one on a near-tie).
- Every prediction is a typed `Decision` with a **calibrated** confidence; below the
  threshold (chosen for a target precision) it should be escalated.
- Exports are checked for **parity**: the browser matches Python on the test set.

Example task (`examples/comment_moderation.yaml`, 1,711 synthetic comments):

| model | download | test macro F1 | handled without escalation | browser p95 |
|---|---|---|---|---|
| static · potion-32M | 33 MB | 0.897 | 81% | 0.1 ms |
| **encoder · MiniLM-L3** (auto pick) | **18.6 MB** | **0.943** | **88%** | 5.8 ms |

The test data is synthetic — expect lower numbers on real comments.

## Quickstart

```bash
uv sync
uv run microdecide run examples/comment_moderation.yaml   # collect → label → train → eval → export
uv run microdecide compare runs/comment_moderation/v1 runs/comment_moderation/v2

cd web && npm install && npm run sync-model && npm run dev # demo, benchmark, parity, playground
```

```ts
import { MicroDecide } from "microdecide-web";
const m = await MicroDecide.load("/models/comment_moderation/v2");
const d = await m.decide("Buy cheap followers at …");  // { label: "spam", confidence: 0.99, … }
```

Design: [docs/SPEC.md](docs/SPEC.md) · Plan: [docs/ROADMAP.md](docs/ROADMAP.md) ·
Web package: [web/README.md](web/README.md)
