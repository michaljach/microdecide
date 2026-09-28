# comment_moderation@v2 — encoder tier

Base `sentence-transformers/paraphrase-MiniLM-L3-v2` · test n=257 · train/val/test = 1197/257/257 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.943** (target 0.90 ✅) |
| accuracy | 94.2% |
| teacher agreement | 94.2% |
| coverage @ threshold 0.903 | 87.5% handled alone, 96.9% accurate (target 97%) |
| escalation rate | 12.5% |
| ECE (test) | 0.026 → 0.015 after temperature 1.19 |
| download size | 18.58 MB (budget 150.0 MB ✅) |
| latency (python, single input) | p50 2.46 ms · p95 2.86 ms |

## Recommendations

- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Browser (headless Chromium, from `npm run bench`)

2026-09-27 · crossOriginIsolated=True · WebGPU=True

| backend | cold load | warm load | download | p50 | p95 | batch/input |
|---|---|---|---|---|---|---|
| transformers.js · wasm · q8 | 848 ms | 192 ms | 18.6 MB | 2.46 ms | 6.81 ms | 3.292 ms |
| transformers.js · webgpu · q8 | 655 ms | 186 ms | 18.6 MB | 14.73 ms | 21.11 ms | 3.698 ms |
| transformers.js · webgpu · fp32 | 1866 ms | 191 ms | 70.8 MB | 9.75 ms | 11.69 ms | 0.681 ms |

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| ok | 0.969 | 0.896 | 0.931 | 106 |
| spam | 0.946 | 0.986 | 0.966 | 71 |
| toxic | 0.906 | 0.963 | 0.933 | 80 |

## Confusion matrix (rows = true, cols = predicted)

| | ok | spam | toxic |
|---|---|---|---|
| **ok** | 95 | 3 | 8 |
| **spam** | 1 | 70 | 0 |
| **toxic** | 2 | 1 | 77 |

## Worst 15 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.97 | ok → spam | 0.79 | Hey, I'm the author of a popular productivity newsletter and I featured this update this week. Great stuff! |
| 0.97 | toxic → ok | 0.66 | The pricing team are basically con artists. |
| 0.96 | ok → toxic | 0.8 | This slaps. |
| 0.96 | ok → toxic | 0.74 | Nobody asked for this. Nobody. |
| 0.95 | toxic → ok | 0.96 | 🖕🖕🖕 to the whole team |
| 0.94 | ok → toxic | 0.74 | Your uptime is a joke this month. |
| 0.94 | spam → ok | 0.77 | Anybody interested in a side hustle? Reply and I'll send you the details. |
| 0.90 | toxic → spam | 0.94 | Hey Emma, send pics instead of writing blog posts, it'd be more useful. |
| 0.90 | ok → toxic | 0.84 | The comment above calling the author names is uncalled for. Critique the work, not the person. |
| 0.84 | ok → toxic | 0.86 | Whoever is running your Twitter account is hilarious. |
| 0.69 | ok → spam | 0.74 | Cheap move to raise prices right after the outage. |
| 0.67 | ok → toxic | 0.72 | Fine. Whatever. |
| 0.58 | ok → toxic | 0.98 | That migration was painless. Good job everyone. |
| 0.56 | ok → spam | 0.86 | My review of the app: 9/10. Would be 10 if the Android widget worked. |
| 0.50 | ok → toxic | 0.85 | The pricing is fair. People complaining here have never run a business. |
