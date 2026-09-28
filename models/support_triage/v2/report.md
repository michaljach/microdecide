# support_triage@v2 — encoder tier

Base `sentence-transformers/all-MiniLM-L6-v2` · test n=50 · train/val/test = 5231/50/50 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.918** (target 0.90 ✅) |
| accuracy | 92.0% |
| teacher agreement | 92.0% |
| coverage @ threshold 0.952 | 92.0% handled alone, 93.5% accurate (target 97%) |
| escalation rate | 8.0% |
| ECE (test) | 0.068 → 0.059 after temperature 1.25 |
| download size | 24.31 MB (budget 30.0 MB ✅) |
| latency (python (cpu), single input) | p50 3.44 ms · p95 3.73 ms |

## Recommendations

- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| billing | 0.909 | 1.000 | 0.952 | 10 |
| bug | 1.000 | 1.000 | 1.000 | 10 |
| account | 0.889 | 0.800 | 0.842 | 10 |
| how_to | 0.889 | 0.800 | 0.842 | 10 |
| feature_request | 0.909 | 1.000 | 0.952 | 10 |

## Confusion matrix (rows = true, cols = predicted)

| | billing | bug | account | how_to | feature_request |
|---|---|---|---|---|---|
| **billing** | 10 | 0 | 0 | 0 | 0 |
| **bug** | 0 | 10 | 0 | 0 | 0 |
| **account** | 0 | 0 | 8 | 1 | 1 |
| **how_to** | 1 | 0 | 1 | 8 | 0 |
| **feature_request** | 0 | 0 | 0 | 0 | 10 |

## Worst 4 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.98 | account → feature_request | 0.95 | Please remove my personal data under GDPR. |
| 0.98 | how_to → account | 0.95 | How do I add a signature to outgoing emails? |
| 0.96 | account → how_to | 0.95 | How can I export all my personal data? |
| 0.52 | how_to → billing | 0.95 | How do I add a logo to my invoices? |
