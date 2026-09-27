# CLAUDE.md — microdecide

Working name: **microdecide**. A framework that turns a Jev-style task spec
(input + fixed set of typed outputs) into a tiny, fast, calibrated model
trained for that one use case, that **runs in the browser** (WASM/WebGPU),
with automatic escalation to a bigger "teacher" model when it is unsure.

Full design: `docs/SPEC.md`. Build plan: `docs/ROADMAP.md`.
Example spec: `examples/comment_moderation.yaml`.

## How to work in this repo

- Build **one milestone at a time** from `docs/ROADMAP.md`. Do not start the
  next milestone until the current one's acceptance criteria pass.
- After each milestone: run `uv run pytest`, then summarize what was built
  and what's next. Update the checkbox in `docs/ROADMAP.md`.
- Keep it minimal. Prefer a few clear modules over abstractions. No plugin
  systems until a second implementation actually exists.
- Every tier must **run in the browser** via transformers.js (WASM, WebGPU
  when available). Static and encoder tiers must also **train on CPU**.
  The decoder tier (Qwen-class) trains with LoRA on a GPU (CUDA or Apple MPS).
- Classification is **one forward pass, no text generation**: decoder models
  use a sequence-classification head, not prompting + parsing.

## Stack

- Python 3.11+, managed with `uv`
- `pydantic` v2 for the spec and all typed outputs
- `typer` for the CLI
- `scikit-learn` for the tiny tier head + calibration
- `model2vec` (static embeddings) for the tiny tier encoder
- `setfit` / `sentence-transformers` for the encoder tier
- `transformers` + `peft` for the decoder tier (LoRA + classification head)
- `optimum[onnxruntime]` for ONNX export + int8/q4 quantization
- **Browser runtime** in `web/`: TypeScript + `@huggingface/transformers`
  (transformers.js), built with `vite`; a demo + benchmark page
- `fastapi` + `uvicorn` for the escalation/feedback server
- `pytest` for tests

Add dependencies only when the milestone needs them.

## Commands

```bash
uv sync                          # install
uv run pytest                    # tests
uv run microdecide run examples/comment_moderation.yaml   # full pipeline (→ export)

cd web && npm install
npm run sync-model               # copy every runs/<task>/<version>/export + ORT wasm into public/, write models/index.json
npm run dev                      # demo at /, /models.html, /model.html?model=…, /bench.html, /parity.html
npm test && npm run typecheck    # vitest (incl. Node parity vs Python) + tsc
npm run parity                   # headless Chromium: browser labels vs Python (≥ 99.5%)
npm run bench                    # → export/bench.json; `microdecide eval` adds it to report.md
npm run offline                  # network cut: page + model reload from caches, still classifies
```

## Rules

- **Never put teacher API keys in browser code.** Browser escalation calls
  the user's own server endpoint, which calls the teacher.
- **Never** hardcode or commit API keys. Read from env:
  `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `TYPESAFE_API_KEY`.
- **Cache every teacher call** on disk (keyed by hash of teacher + prompt +
  input). Teacher calls cost money; re-running the pipeline must be free.
- Tests must not hit real APIs. Use a `FakeTeacher` that labels with simple
  keyword rules.
- Every model output follows the `Decision` schema in `docs/SPEC.md`.
  Never return a label outside the spec's label set.
- Determinism: fix random seeds; record them in the run metadata.
- Artifacts go under `runs/<task>/<version>/`, never into `src/`.
- The Jev teacher adapter (M7) must be written against TypeSafe's current
  official API docs — check them first; don't guess endpoints or fields.
