# Full encoder training in the browser

The Train page (`/train.html`) fine-tunes **every BERT encoder parameter**, the pooler,
and the classification head. It supports Nodd's MiniLM-L3, MiniLM-L6, and BGE-small BERT
architectures with absolute position embeddings and GELU. It does not use a frozen
encoder or send training examples to a server.

This is an experimental training runtime, separate from the ONNX inference runtime.
TensorFlow.js supplies autodiff and WebGPU, WebGL, or CPU kernels. A dedicated Web Worker
keeps training off the UI thread. Stopping terminates the worker and discards the incomplete
run. Closing or reloading the page also loses the in-memory session.

## Start locally

```sh
cd web
npm install
npm run prepare:training
npm run dev
```

Open `/train.html`. `prepare:training` downloads the pretrained MiniLM-L3 base once and
packages an FP32 starter in `web/public/training/minilm-l3.zip` (about 70 MB, ignored by Git).
Run this before building or deploying a site that should offer the default starter. The
normal inference models remain quantized and much smaller. Hosting needs HTTPS or localhost;
all runtime assets and the starter are served from the site's own origin.

Alternatively, package any existing supported encoder run and upload the ZIP:

```sh
uv run nodd prepare-browser-training runs/comment_moderation/v2 --out starter.zip
```

That checkpoint contains the original task's fine-tuned encoder. Use a pretrained base
for independent evaluation on new tasks, and avoid reusing evaluation examples that the
starting checkpoint already saw during training.

## Dataset and training

Supply a JSON array or JSONL with `text` and `label`, and optional `confidence` in `(0, 1]`.
There must be 2–20 labels, 10–10,000 examples, and at least five examples per label for
automatic splitting. Exact normalized duplicates are rejected, including duplicates with
conflicting labels. Near-duplicate or semantically similar examples still need manual review.

```jsonl
{"text":"My parcel has not arrived","label":"delivery"}
{"text":"Please refund this purchase","label":"refund"}
```

Provide more than these two illustrative rows. The automatic split is deterministic,
stratified, and approximately 60/20/20 train/validation/test. Alternatively supply `split`
on **every** row (`train`, `val`, or `test`); each split must contain every label. Existing
explicit splits are preserved. Your test split is evaluated only after training and
calibration, never used for checkpoint selection.

Defaults: six epochs, batch size two, 64 tokens, learning rate 0.0001, seed 42, target
precision 0.97. The maximum sequence length is 256; the maximum batch size is eight.
Lower defaults than Python keep browser memory use manageable. Weighted cross entropy,
AdamW, weight decay 0.01, 10% warmup, and linear learning-rate decay match the native
training approach. Dropout uses the encoder's configuration. A changed label set gets a
new seeded classification head; the entire encoder is still updated.

The epoch with highest validation macro F1 is restored. Temperature and escalation
threshold are fitted using validation examples. If no threshold reaches target precision,
all predictions are marked uncertain. Test accuracy, F1, coverage, and precision are
reported separately; validation success does not guarantee test or real-world precision.

## Hardware checks

Changing the model, dataset, settings, or backend invalidates the check. Before enabling
training the worker:

1. Validates the checkpoint architecture, tensor shapes, dataset, and tokenizer.
2. Reads WebGPU availability, logical CPU count, and approximate `deviceMemory` if exposed.
3. Tries WebGPU, then WebGL, then CPU in automatic mode. An explicitly selected backend
   must pass; it does not silently fall back.
4. Executes a **full forward/backward/AdamW step on the actual encoder**, using the selected
   batch size and full sequence length, then checks finite weights and restores the checkpoint.

The UI reports the tested backend, parameter count, estimated working memory, first-step
time (including warmup), and any failed backend attempts. An 8–16 GB laptop is a reasonable
starting point, but browser/driver/backend behavior matters. GPU backends can also execute
some unsupported or small operations on CPU.

Browsers do not reliably expose free GPU memory. The memory estimate includes parameter
state, checkpoint copies, and an activation estimate; it is **not** a measurement or reservation.
A passing probe does not guarantee a long run. Start small, keep the tab open, and lower
batch size or token count after a memory/backend failure. CPU training works but can be slow.

## Save, continue, and export

Download the finished `.nodd.zip` before leaving the page. It contains FP32 safetensors,
the tokenizer and configuration, labeled dataset with preserved splits, settings, metrics,
hardware report, and prediction parity samples. Treat it as private if the examples are private.
There is no automatic remote upload or browser-storage checkpoint saving.

You can use it as a starting checkpoint for another browser run and supply your dataset
again. This preserves model weights but starts a **fresh optimizer and schedule**; it is not
an exact interrupted-run resume.

To produce Nodd's existing ONNX/q8 inference artifact:

```sh
uv run nodd import-browser-training browser_model.nodd.zip
# Use the version directory printed by import:
uv run nodd eval runs/browser_model/v1
uv run nodd export runs/browser_model/v1
```

Import verifies native prediction parity before creating a version and recalibrates on the
saved validation split. The browser does all fine-tuning; ONNX export/quantization remains
in Python. The downloaded training ZIP is not itself a `nodd.load()` ONNX export folder.

## Validation

```sh
uv run pytest
cd web
npm test
npm run typecheck
npm run build
npm run test:browser
npm run test:training:browser
# Optional actual 17M-parameter model check, after preparing the starter:
NODD_REAL_TRAINING=1 node scripts/training-browser-check.mjs
```

Tests compare a full BERT forward pass and AdamW update with PyTorch, verify that encoder
weights change, check tensor disposal and dataset isolation, and exercise the actual browser
worker through training, calibrated prediction, download, Python import, evaluation, and ONNX
export. Automatic backend selection and cancellation are exercised too. Real MiniLM-L3 has
also been trained on WebGPU and checked for native prediction parity; this is functionality
validation, not a representative quality benchmark or a guarantee for every device.
