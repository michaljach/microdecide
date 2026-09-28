# sentiment@v1 — encoder tier

Base `sentence-transformers/all-MiniLM-L6-v2` · test n=51 · train/val/test = 238/51/51 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.882** (target 0.90 ❌) |
| accuracy | 88.2% |
| teacher agreement | 88.2% |
| coverage @ threshold 0.858 | 82.4% handled alone, 95.2% accurate (target 97%) |
| escalation rate | 17.6% |
| ECE (test) | 0.147 → 0.066 after temperature 0.54 |
| download size | 23.7 MB (budget 30.0 MB ✅) |
| latency (python (cpu), single input) | p50 3.70 ms · p95 3.99 ms |

## Recommendations

- Macro F1 0.882 is below the 0.90 target. Options: more/better data (real inputs beat synthetic), the encoder tier (M4), or escalation-heavy mode (the micro model handles only confident cases).
- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| positive | 1.000 | 0.778 | 0.875 | 18 |
| neutral | 0.889 | 0.941 | 0.914 | 17 |
| negative | 0.789 | 0.938 | 0.857 | 16 |

## Confusion matrix (rows = true, cols = predicted)

| | positive | neutral | negative |
|---|---|---|---|
| **positive** | 14 | 1 | 3 |
| **neutral** | 0 | 16 | 1 |
| **negative** | 0 | 1 | 15 |

## Worst 6 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.96 | negative → neutral | 0.95 | Waited on hold for two hours to be told to call back tomorrow. |
| 0.92 | neutral → negative | 0.75 | Pros: light, cheap. Cons: flimsy, loud. |
| 0.77 | positive → negative | 0.95 | I'm obsessed with this moisturizer, my skin has never felt better. |
| 0.67 | positive → negative | 0.95 | The team was welcoming and made onboarding painless. |
| 0.61 | positive → negative | 0.8 | Slow start, but the second half of the book is brilliant. |
| 0.56 | positive → neutral | 0.95 | Delivery arrived a day early and everything was in perfect condition. |
