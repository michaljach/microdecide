# comment_moderation@v4 — encoder tier

Base `sentence-transformers/all-MiniLM-L6-v2` · test n=257 · train/val/test = 4197/257/257 · seed 42

## Summary

| metric | value |
|---|---|
| macro F1 | **0.934** (target 0.90 ✅) |
| accuracy | 93.0% |
| teacher agreement | 93.0% |
| coverage @ threshold 0.731 | 96.5% handled alone, 95.6% accurate (target 97%) |
| escalation rate | 3.5% |
| ECE (test) | 0.046 → 0.037 after temperature 1.30 |
| download size | 24.31 MB (budget 30.0 MB ✅) |
| latency (python (cpu), single input) | p50 3.68 ms · p95 4.30 ms |

## Recommendations

- All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.

## Per label

| label | precision | recall | F1 | support |
|---|---|---|---|---|
| ok | 0.959 | 0.877 | 0.916 | 106 |
| spam | 0.986 | 0.986 | 0.986 | 71 |
| toxic | 0.854 | 0.950 | 0.899 | 80 |

## Confusion matrix (rows = true, cols = predicted)

| | ok | spam | toxic |
|---|---|---|---|
| **ok** | 93 | 0 | 13 |
| **spam** | 1 | 70 | 0 |
| **toxic** | 3 | 1 | 76 |

## Worst 18 errors (most confident mistakes)

| conf | true → predicted | teacher conf | text |
|---|---|---|---|
| 0.99 | ok → toxic | 0.8 | This slaps. |
| 0.98 | toxic → ok | 0.66 | The pricing team are basically con artists. |
| 0.98 | ok → toxic | 0.74 | This UX is idiotic. Why would "archive" be next to "delete" with no confirmation? |
| 0.97 | ok → toxic | 0.86 | Whoever is running your Twitter account is hilarious. |
| 0.97 | ok → toxic | 0.74 | Nobody asked for this. Nobody. |
| 0.94 | ok → toxic | 0.72 | Fine. Whatever. |
| 0.90 | ok → toxic | 0.87 | "Dumb" features like the confetti are what make me happy to open the app. |
| 0.87 | ok → toxic | 0.84 | The comment above calling the author names is uncalled for. Critique the work, not the person. |
| 0.79 | ok → toxic | 0.98 | That migration was painless. Good job everyone. |
| 0.78 | ok → toxic | 0.76 | This article is nonsense. Remote work doesn't "boost productivity" for everyone, stop pretending. |
| 0.75 | ok → toxic | 0.74 | Your uptime is a joke this month. |
| 0.73 | ok → toxic | 0.98 | Reading this with my morning coffee, great start to the day. |
| 0.66 | ok → toxic | 0.97 | Would be nice if subtasks could have their own assignees. |
| 0.61 | spam → ok | 0.66 | I made an unofficial desktop widget for this app, available on my Gumroad for $5. |
| 0.59 | toxic → ok | 0.71 | You're the reason warning labels exist. |
| 0.56 | ok → toxic | 0.87 | The support rep said the error message "stupid input" was a placeholder. Please change it, it's rude to users. |
| 0.50 | toxic → ok | 0.96 | 🖕🖕🖕 to the whole team |
| 0.50 | toxic → spam | 0.94 | Hey Emma, send pics instead of writing blog posts, it'd be more useful. |
