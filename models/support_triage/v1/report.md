# support_triage@v1 — encoder tier

Base `sentence-transformers/all-MiniLM-L6-v2` · test n=50 · train/val/test = 231/50/50 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.901** (target 0.90 ✅) |
| accuracy | 90.0% |
| teacher agreement | 90.0% |
| coverage @ threshold 0.991 | 50.0% handled alone, 100.0% accurate (target 97%) |
| escalation rate | 50.0% |
| ECE (test) | 0.407 → 0.075 after temperature 0.21 |
| download size | 23.7 MB (budget 30.0 MB ✅) |
| latency (python (cpu), single input) | p50 3.63 ms · p95 3.92 ms |

## Recommendations

- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| billing | 0.769 | 1.000 | 0.870 | 10 |
| bug | 1.000 | 0.900 | 0.947 | 10 |
| account | 1.000 | 0.900 | 0.947 | 10 |
| how_to | 0.889 | 0.800 | 0.842 | 10 |
| feature_request | 0.900 | 0.900 | 0.900 | 10 |

## Confusion matrix (rows = true, cols = predicted)

| | billing | bug | account | how_to | feature_request |
|---|---|---|---|---|---|
| **billing** | 10 | 0 | 0 | 0 | 0 |
| **bug** | 1 | 9 | 0 | 0 | 0 |
| **account** | 0 | 0 | 9 | 1 | 0 |
| **how_to** | 1 | 0 | 0 | 8 | 1 |
| **feature_request** | 1 | 0 | 0 | 0 | 9 |

## Worst 5 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.99 | bug → billing | 0.9500000000000002 | The totals in the invoice table are calculated wrong. |
| 0.82 | feature_request → billing | 0.95 | We need SAML SSO for our enterprise rollout, please add it. |
| 0.69 | how_to → billing | 0.95 | How do I add a logo to my invoices? |
| 0.66 | account → how_to | 0.95 | How can I export all my personal data? |
| 0.56 | how_to → feature_request | 0.95 | Is there a way to snooze notifications during the weekend? |
