# comment_moderation@v3 — encoder tier

Base `sentence-transformers/all-MiniLM-L6-v2` · test n=257 · train/val/test = 1197/257/257 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.948** (target 0.90 ✅) |
| accuracy | 94.6% |
| teacher agreement | 94.6% |
| coverage @ threshold 0.859 | 96.1% handled alone, 96.8% accurate (target 97%) |
| escalation rate | 3.9% |
| ECE (test) | 0.035 → 0.040 after temperature 1.27 |
| download size | 23.7 MB (budget 30.0 MB ✅) |
| latency (python (cpu), single input) | p50 3.84 ms · p95 4.13 ms |

## Recommendations

- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| ok | 0.960 | 0.906 | 0.932 | 106 |
| spam | 0.973 | 1.000 | 0.986 | 71 |
| toxic | 0.905 | 0.950 | 0.927 | 80 |

## Confusion matrix (rows = true, cols = predicted)

| | ok | spam | toxic |
|---|---|---|---|
| **ok** | 96 | 2 | 8 |
| **spam** | 0 | 71 | 0 |
| **toxic** | 4 | 0 | 76 |

## Worst 14 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.97 | ok → spam | 0.9 | The docs at docs.yourapp.com/api/webhooks explain this, section 3. |
| 0.97 | ok → toxic | 0.84 | The comment above calling the author names is uncalled for. Critique the work, not the person. |
| 0.94 | toxic → ok | 0.96 | 🖕🖕🖕 to the whole team |
| 0.93 | ok → toxic | 0.86 | Whoever is running your Twitter account is hilarious. |
| 0.90 | ok → toxic | 0.76 | This article is nonsense. Remote work doesn't "boost productivity" for everyone, stop pretending. |
| 0.90 | ok → toxic | 0.74 | Your uptime is a joke this month. |
| 0.90 | ok → spam | 0.79 | Hey, I'm the author of a popular productivity newsletter and I featured this update this week. Great stuff! |
| 0.88 | toxic → ok | 0.66 | The pricing team are basically con artists. |
| 0.80 | ok → toxic | 0.74 | Nobody asked for this. Nobody. |
| 0.71 | ok → toxic | 0.8 | This slaps. |
| 0.67 | toxic → ok | 0.94 | Hey Emma, send pics instead of writing blog posts, it'd be more useful. |
| 0.65 | toxic → ok | 0.94 | I swear if the sync fails again I'm going to find the dev responsible and make him pay. |
| 0.61 | ok → toxic | 0.88 | Just a PSA: the fake "support" accounts on Twitter are not the real team. Don't DM them your login. |
| 0.54 | ok → toxic | 0.72 | Fine. Whatever. |
