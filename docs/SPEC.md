# microdecide — Design Spec

## 1. Goal

A user describes **one decision** (input, allowed outputs, quality/latency
target). microdecide produces a **specialized micro model** for exactly that
decision:

- small enough to **download and run in a browser** (WASM, WebGPU when
  available): ~10 MB to ~400 MB depending on tier
- returns a **typed decision + calibrated confidence**
- runs client-side: offline, private, no per-call cost
- **escalates** to a teacher model (Jev, an LLM, or a human) when unsure,
  and learns from those escalations

Positioning: a "System Zero" layer in front of System One (Jev) and
System Two (frontier LLMs). It handles the easy, high-volume majority of cases
cheaply; the hard cases go up the stack.

Non-goals (v1): text generation, multi-step reasoning, image/audio input,
distributed training.

## 2. Task spec (user input)

YAML, validated by a pydantic `TaskSpec` model.

```yaml
task: comment_moderation            # slug, used for paths
description: >
  Decide whether a user comment on a product blog is acceptable.
input:
  type: text
  max_chars: 2000
output:
  type: choice                      # v1: choice | boolean ; v2: score, multi_label
  labels:
    ok: Normal comment, on or off topic but harmless.
    spam: Ads, links to unrelated products, SEO junk.
    toxic: Insults, harassment, hate.
model:
  tier: auto                        # auto | static | encoder | decoder
  base: null                        # override base model id, e.g. Qwen/Qwen3-0.6B
  quantization: q4                  # q8 | q4 (decoder), q8 (encoder)
teacher:
  kind: llm                         # llm | jev | csv
  model: claude-haiku-4-5-20251001  # configurable (llm, jev)
  path: null                        # labeled CSV (csv)
  min_confidence: 0.0               # drop teacher labels below this
data:
  seed_examples: examples/comment_moderation_seed.csv   # optional
  unlabeled: null                   # optional CSV/JSONL of real inputs
  gold: null                        # optional human-labeled CSV/JSONL, always the test set
  synthetic: 2000                   # number of generated inputs
  synth_model: null                 # generator model, defaults to teacher.model
targets:
  min_macro_f1: 0.90
  deploy: browser                   # browser | node | python
  max_download_mb: 150              # hard budget for the model files
  max_latency_ms: 100               # p95 in browser, WASM backend, short input
escalation:
  target_precision: 0.97            # auto-pick threshold to hit this
seed: 42                            # all randomness (split, synth plan, training)
```

Label descriptions matter: they are used in teacher prompts and synthetic
data generation.

## 3. Output schema (every prediction)

```json
{
  "label": "spam",
  "probabilities": {"ok": 0.04, "spam": 0.93, "toxic": 0.03},
  "confidence": 0.93,
  "escalated": false,
  "source": "micro",              // micro | teacher
  "model": "comment_moderation@v3",
  "latency_ms": 0.4
}
```

`label` is always one of the spec's labels. Boolean tasks use labels
`true`/`false`.

## 4. Pipeline

```
spec ─▶ collect inputs ─▶ teacher labels ─▶ split ─▶ train ─▶ calibrate
                                                                   │
        feedback ◀── escalations ◀── serve (micro + fallback) ◀── export ◀── eval
```

### 4.1 Collect inputs
Sources, merged and deduplicated (normalized-text hash, then near-dup via
embedding cosine > 0.95):
1. user seed examples (may already have labels)
2. user unlabeled real data (best source)
3. synthetic generation by an LLM: prompted per label, with explicit
   diversity axes (length, tone, language, obfuscation, borderline cases).
   Generate ~30% "hard/borderline" examples on purpose.

### 4.2 Teacher labeling
`Teacher` interface:
```python
class Teacher(Protocol):
    name: str
    def fingerprint(self, spec: TaskSpec) -> str: ...   # prompt/model/file hash; part of the cache key
    def label(self, spec: TaskSpec, inputs: list[str]) -> list[Decision | None]: ...  # None = no answer
```
Implementations: `LLMTeacher` (Anthropic, schema-constrained JSON with label +
probability per label; OpenAI-compatible not yet), `JevTeacher` (M7),
`CSVTeacher` (human or offline labels, looked up by normalized text),
`FakeTeacher` (tests). All calls go through `CachedTeacher` (disk cache keyed
by teacher + fingerprint + input, `.cache/microdecide/` or `$MICRODECIDE_CACHE_DIR`).
Rows that already carry a label (gold, labeled seed) skip the teacher.
Store teacher confidence; low-confidence teacher labels are down-weighted
or dropped (configurable).

### 4.3 Split
Stratified train / val / test = 70 / 15 / 15. If a human-labeled gold set
exists, it is always used as the test set.

### 4.4 Train — model tiers (all browser-runnable)
All tiers output logits over the label set in **one forward pass**.
Sizes/latencies are rough targets; measure with the benchmark page (M3).

| Tier | Base (default, configurable) | Method | Download | Train on |
|---|---|---|---|---|
| static | model2vec potion-base-8M → 32M (int8 embeddings) | logistic regression head | ~9–33 MB | CPU, seconds |
| encoder | MiniLM-L3 → MiniLM-L6 → bge-small (17–33M params) | full fine-tune, `*ForSequenceClassification` | ~18–35 MB (q8) | CPU, < 1 min |
| decoder-S | ~135–360M decoder (e.g. SmolLM2-135M/360M, Gemma 3 270M) | LoRA + seq-classification head | ~80–250 MB (q4/q8) | GPU, <1 h |
| decoder-M | Qwen3-0.6B (or Qwen2.5-0.5B) | LoRA + seq-classification head | ~350–500 MB (q4) | GPU, ~1 h |

Decoder tiers: load with `AutoModelForSequenceClassification` (score head on
last token), LoRA on attention + MLP, merge LoRA into weights before export.
Use the task description + label descriptions only at train time via the
teacher; at inference the model sees just the input text (short prompt
template optional, fixed in `model_card.json`).

Static tier details: embeddings are quantized to int8 at train time (no F1
loss measured; no train/export mismatch). Standardization is folded into the
head, so `head.json` is just `logits = emb @ coef.T + intercept` and can be
evaluated (or refit) outside Python. Without `model.base`, the static tier
tries its bases smallest-first and keeps the first meeting `min_macro_f1` on
val within budget. Head C is chosen by val macro F1; teacher confidence is
the sample weight.

Encoder tier details: standard `AutoModelForSequenceClassification` (so the
export runs in transformers.js unchanged), AdamW 1e-4, 6 epochs, warmup 10%,
max 256 tokens, teacher confidence as sample weight, best epoch by val macro F1.
Trains on CPU by default (reproducible); `MICRODECIDE_DEVICE=mps|cuda` to speed up.

**Auto mode**: try every (tier, base) candidate smallest estimated download
first, across tiers; pick the first that meets `min_macro_f1` on val **and**
fits `max_download_mb` (else the best val F1 within budget). "Smallest" is the
download: on the example task the encoder (MiniLM-L3, 18.6 MB q8, F1 0.943)
beats the larger static model (potion-32M, 33 MB, F1 0.897). If none fits, report the gap
and recommend: more/better data, a larger budget, or escalation-heavy mode.

Reality check to keep in the report: decoder tiers are 10–50× larger to
download than encoders and much slower on WASM; they earn their place only on
tasks needing more language understanding (sarcasm, context, multilingual).
Qwen-class 0.6B is the *upper* bound, not the default.

### 4.5 Calibrate
Temperature scaling (or isotonic if val set is large) fit on val.
Report ECE before/after. Pick the escalation threshold on val as the lowest
confidence at which precision ≥ `target_precision`.

### 4.6 Evaluate (report.md + report.json per run)
- accuracy, macro F1, per-label precision/recall, confusion matrix
- agreement with teacher
- ECE (calibration error)
- **coverage** at chosen threshold: % of inputs the micro model handles
  alone, and accuracy on that covered set
- latency p50/p95, model size on disk
- 20 worst errors listed for inspection

### 4.7 Export (browser-first)
`microdecide export <run_dir>` → `<run_dir>/export/`, transformers.js folder layout:
```
microdecide.json          runtime config: labels, temperature, threshold, head weights,
                          tokenizer rules (max_chars, max_tokens, dropped ids)
tokenizer.json            HF tokenizer (+ tokenizer_config.json, config.json)
static/embeddings.i8      static tier: int8 table [vocab, dim], plain JS, no ONNX runtime
onnx/model_quantized.onnx input_ids + attention_mask → logits (onnxruntime-web)
parity.jsonl              test-split predictions from Python (browser parity input)
model_card.json           card + export parity + download sizes (+ bench.json from web/)
```
- Static tier: embeddings are already int8 from training, so export adds no
  quantization loss. Encoder: `torch.onnx.export` (dynamo) → `onnx/model.onnx`
  (fp32) + dynamic int8 `onnx/model_quantized.onnx` (transformers.js "q8"), plus
  the HF tokenizer/config files. Decoder q4 (fallback q8 if F1 drops > 1 point).
- `parity.jsonl` holds the predictions of the artifact the browser runs (static
  format, or the q8 ONNX), so browser parity isolates runtime differences from
  quantization loss (which the export parity check measures).
- **Parity check** at export: training-time model vs exported static format vs
  exported ONNX on the test split — label agreement, max |Δp|, F1 delta; export
  fails if F1 drops > 2 pts. `export.reference_probabilities` re-implements
  inference from the exported files only and is the spec the JS runtime mirrors
  (code-point truncation to `max_chars`, then `max_tokens × median_token_length`
  chars; no special tokens; `[UNK]` dropped; masked mean → L2 norm → head).

### 4.8 Browser runtime (`web/`, npm package `microdecide-web`)
```ts
const m = await MicroDecide.load("/models/comment_moderation/v1", {
  backend: "static",             // static tier: static (plain JS, default) | onnx
  device: "auto",                // onnx: wasm for static/encoder (measured faster), webgpu for decoders
  dtype: "q8",                   // encoder: q8 (default) | fp32
});
const d = await m.decide("Buy cheap followers at ...");   // Decision
m.isConfident(d);                // false → escalate (escalateUrl lands in M6)
```
- Static tier: `@huggingface/tokenizers` (transformers.js' tokenizer) + plain JS,
  or its ONNX graph on `onnxruntime-web`. Encoder tier: transformers.js
  `AutoTokenizer` + `AutoModelForSequenceClassification`, files served from the
  page's origin only (never the Hub or a CDN, so it works offline). One shared
  onnxruntime-web; loaded lazily so the static path never downloads it.
- Device default is measured, not assumed (M2 Pro, Metal): static JS p95 0.1 ms;
  encoder q8 WASM p50 2.5 ms vs WebGPU 9.8 ms fp32 / 14.6 ms q8 single-input.
  WebGPU wins only on large batches at this size.
- Model files cached in the browser (Cache API) after first load; the demo adds
  an app-shell service worker so it reloads and classifies with the network off
- Runs in a Web Worker so the UI never blocks; batching supported
- `web/demo`: paste text → decision + probabilities; **benchmark page** (load
  time, p50/p95, WASM vs WebGPU); **parity page** (browser vs Python labels).
  `npm run parity|bench|offline` drive them in headless Chromium.

### 4.9 Server: escalate + feedback
`Runtime` wraps model + optional teacher:
```python
rt = Runtime.load("runs/comment_moderation/v3")
d = rt.decide("Buy cheap followers at ...")
```
If `confidence < threshold` and a teacher is configured → ask teacher,
return teacher's decision with `source="teacher"`, and append the input +
teacher label to `feedback.jsonl`.
FastAPI server exposes `POST /decide` with the same schema.

### 4.10 Improve
`microdecide retrain` merges `feedback.jsonl` into training data and
produces the next version. Report compares new vs previous version on the
same test set; don't promote if worse.

## 5. CLI

```
microdecide init <task>            # scaffold spec yaml
microdecide check <spec>           # validate a spec
microdecide collect <spec>         # 4.1
microdecide label <spec>           # 4.2
microdecide train <spec> [--tier static|encoder|decoder|auto]
microdecide eval <run_dir>
microdecide compare <run_dir> <run_dir>...   # same test split, side by side → runs/<task>/compare.md
microdecide export <run_dir>
microdecide serve <run_dir> [--teacher]
microdecide retrain <spec>
microdecide run <spec>             # collect → label → train → eval → export
```

## 6. Repo layout

```
microdecide/
  CLAUDE.md
  pyproject.toml
  docs/SPEC.md  docs/ROADMAP.md
  examples/comment_moderation.yaml
  src/microdecide/
    spec.py        # TaskSpec, Decision (pydantic)
    data.py        # collect, dedup, split
    synth.py       # synthetic input generation
    teachers/      # base.py, llm.py, jev.py, csv.py, fake.py, cache.py
    train.py       # tiers
    calibrate.py
    evaluate.py
    export.py
    runtime.py     # Runtime + escalation
    server.py
    cli.py
  web/             # TypeScript runtime package + demo/benchmark (vite)
  tests/
  runs/            # gitignored artifacts
```

## 7. Risks & mitigations

- **Teacher errors baked in** → keep optional human gold set; show worst
  errors; teacher-confidence filtering.
- **Synthetic data ≠ real data** → prefer real unlabeled data; report
  metrics separately for synthetic vs real test examples.
- **Drift in production** → escalation rate is logged; rising rate is the
  signal to retrain.
- **Overconfidence** → calibration is mandatory, never optional.

## 8. Later (v2+)

`score` (ordinal) and `multi_label` output types; multiple questions per
input sharing one backbone (one download, many decisions); non-text inputs (tabular, time series); web UI for reviewing
escalations.
