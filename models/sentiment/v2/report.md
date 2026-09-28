# sentiment@v2 — encoder tier

Base `sentence-transformers/all-MiniLM-L6-v2` · test n=51 · train/val/test = 3238/51/51 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.881** (target 0.90 ❌) |
| accuracy | 88.2% |
| teacher agreement | 88.2% |
| coverage @ threshold 0.947 | 51.0% handled alone, 96.2% accurate (target 97%) |
| escalation rate | 49.0% |
| ECE (test) | 0.136 → 0.093 after temperature 1.55 |
| download size | 24.31 MB (budget 30.0 MB ✅) |
| latency (python (cpu), single input) | p50 3.42 ms · p95 3.57 ms |

## Recommendations

- Macro F1 0.881 is below the 0.90 target. Options: more/better data (real inputs beat synthetic), the encoder tier (M4), or escalation-heavy mode (the micro model handles only confident cases).
- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| positive | 0.895 | 0.944 | 0.919 | 18 |
| neutral | 0.933 | 0.824 | 0.875 | 17 |
| negative | 0.824 | 0.875 | 0.848 | 16 |

## Confusion matrix (rows = true, cols = predicted)

| | positive | neutral | negative |
|---|---|---|---|
| **positive** | 17 | 0 | 1 |
| **neutral** | 1 | 14 | 2 |
| **negative** | 1 | 1 | 14 |

## Worst 6 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.95 | positive → negative | 0.95 | I'm obsessed with this moisturizer, my skin has never felt better. |
| 0.92 | neutral → negative | 0.75 | Pros: light, cheap. Cons: flimsy, loud. |
| 0.91 | negative → positive | 0.95 | 1 star is too generous |
| 0.91 | negative → neutral | 0.95 | Waited on hold for two hours to be told to call back tomorrow. |
| 0.53 | neutral → positive | 0.92 | This is my second order from this store. |
| 0.51 | neutral → negative | 0.92 | We took the train instead of driving. |
