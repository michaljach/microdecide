# Larger synthetic training — 2026-09-28

Added 13,000 offline template-labeled examples (1,000 per label), increasing total training rows from 1,903 to 14,903. Both MiniLM-L3 and MiniLM-L6 were trained for each task on CPU, six epochs each; the existing validation-based selection rule chose the saved model. BGE-small was excluded by the existing 30 MB budget.

| Task | Version | Train rows, before → after | Selected base | Test F1, before → after | New q8 test F1 | q8 download |
|---|---|---:|---|---:|---:|---:|
| comment_moderation | v4 | 1,197 → 4,197 | MiniLM-L6 | 0.948 → 0.934 | 0.934 | 24.32 MB |
| prompt_injection | v3 | 237 → 2,237 | MiniLM-L3 | 0.942 → 0.942 | 0.942 | 18.58 MB |
| sentiment | v2 | 238 → 3,238 | MiniLM-L6 | 0.882 → 0.881 | 0.880 | 24.32 MB |
| support_triage | v2 | 231 → 5,231 | MiniLM-L6 | 0.901 → 0.918 | 0.939 | 24.32 MB |

## Interpretation

Support triage improved; prompt injection matched its baseline with a smaller model. Sentiment was essentially unchanged and remains below its 0.90 target. Moderation regressed, so more template data is not evidence of better quality. Baseline weights and reports remain available under their original versions.

Original validation/test records are unchanged. New examples are exact-deduplicated against all existing rows and filtered against both holdouts with a maximum embedding cosine similarity of 0.90. Variants within training share templates and are correlated; these counts do not represent independent scenarios. Labels are assigned by construction with training weight 0.9, not independently judged by an LLM. No paid teacher API was used.

Test sets are synthetic and small (257 moderation, 52 injection, 51 sentiment, 50 triage). Real-world accuracy is unmeasured. The validation-selected 97% precision target was not attained on the covered test subset for any of the four full-precision models. Export checks measure label agreement and F1; they do not establish confidence equivalence. Quantization can materially change individual probabilities.

## Verification

All 74 Python tests passed, including deterministic generation, holdout preservation, duplicate rejection, and exhaustion of the candidate pool. All four exports passed the existing ONNX F1-drop gate.

| Task | Chromium WASM q8 agreement | Chromium WebGPU q8 agreement |
|---|---:|---:|
| comment_moderation | 99.61% | 100.00% |
| prompt_injection | 100.00% | 100.00% |
| sentiment | 100.00% | 100.00% |
| support_triage | 100.00% | 100.00% |

Browser agreement is against Python ONNX q8 predictions on the test split. New exports were synced into the local browser catalog; the hosted site was not deployed.

## Reproduce and inspect

```bash
uv run python scripts/train_synthetic.py --per-label 1000
cd web && npm run sync-model
MODEL=/models/support_triage/v2 npm run parity
```

Requires the baseline runs listed above. Generation seed: 20260928; model seeds come from each task spec. Re-running saves the next version rather than overwriting previous models.

Each new run contains `labeled.jsonl`, `synthetic_manifest.json`, `model_card.json`, `report.md`, `report.json`, `comparison.md`, `browser_parity.json`, encoder weights, and the ONNX `export/` folder. The manifest and model cards record the generation method, baseline file SHA-256, counts, seed, and limitations. Runs are local, gitignored artifacts; the generator and this report are tracked source files.

## Hugging Face releases

The releases include ONNX exports in the current `nodd` format, original encoder checkpoints,
the exact labeled datasets, provenance, reports, and browser parity results. Earlier releases
remain available at their existing tags.

| Task | Release |
|---|---|
| Moderation | [nodd-repo/comment-moderation v4](https://huggingface.co/nodd-repo/comment-moderation/tree/v4) |
| Prompt injection | [nodd-repo/prompt-injection v3](https://huggingface.co/nodd-repo/prompt-injection/tree/v3) |
| Sentiment | [nodd-repo/sentiment v2](https://huggingface.co/nodd-repo/sentiment/tree/v2) |
| Support triage | [nodd-repo/support-triage v2](https://huggingface.co/nodd-repo/support-triage/tree/v2) |

The Python imports and exports were updated for the repository's rename to `nodd` before
publication. All 74 Python tests and all four Chromium WASM/WebGPU parity checks passed
again on the updated repository. The hosted demo site was not deployed in this release.
