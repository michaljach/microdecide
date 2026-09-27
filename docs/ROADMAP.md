# microdecide — Roadmap

Build in order. Each milestone ends with passing tests and a short summary.
End goal: a task-specific model that runs in the browser (WASM/WebGPU).

## [x] M0 — Skeleton
- `uv` project, `src/microdecide`, typer CLI entry point, pytest set up
- `spec.py`: `TaskSpec` and `Decision` pydantic models; load/validate YAML
- `microdecide init <task>` writes a template spec

**Done when:** example spec loads; invalid specs (no labels, duplicate
labels, unknown output type/tier) fail with clear errors; tests pass.

## [x] M1 — Data + teacher labeling
- `data.py`: load CSV/JSONL, normalize, exact + near-dup dedup, stratified split
- `synth.py`: LLM-based synthetic inputs per label incl. borderline cases
- `teachers/`: base protocol, disk cache, `FakeTeacher`, `LLMTeacher`, `CSVTeacher`
- CLI: `collect`, `label`

**Done when:** collect+label produces a labeled dataset; second run makes
zero teacher calls (cache); labels always within the label set.

## [ ] M2 — Static tier end to end (first PoC, Python)
- static embeddings + logistic regression; calibration; threshold; report
- `runtime.py`: `Runtime.load(...).decide(text) -> Decision`
- CLI: `train`, `eval`, `run`

**Done when:** `microdecide run examples/comment_moderation.yaml` finishes
on a laptop CPU in < 10 min with a readable report.

## [ ] M3 — Browser runtime + export (first PoC in the browser)
- export static tier (JSON/binary) and ONNX in transformers.js layout
- `web/`: TS package, Web Worker, `MicroDecide.load/decide`, demo page,
  benchmark page (load time, p50/p95, WASM vs WebGPU)
- parity check Python vs browser

**Done when:** the demo page classifies comments fully offline in the
browser, and browser labels match Python on ≥ 99.5% of the test set.

## [ ] M4 — Encoder tier
- MiniLM-class encoder, SetFit/fine-tune, ONNX q8 export, runs in `web/`

**Done when:** report compares static vs encoder; encoder runs in the demo.

## [ ] M5 — Decoder tier (Qwen-class)
- `AutoModelForSequenceClassification` + LoRA for SmolLM2/Gemma-270M and
  Qwen3-0.6B; merge LoRA; ONNX q4/q8 export; parity check
- `--tier auto` with `max_download_mb` budget

**Done when:** Qwen3-0.6B classifier runs in the browser demo (WebGPU, WASM
fallback); benchmark numbers recorded in the report; auto mode picks the
smallest tier that meets targets.

## [ ] M6 — Escalate, feedback, retrain
- FastAPI `POST /decide` (teacher proxy); browser `escalateUrl`
- `feedback.jsonl`; `microdecide retrain` with version comparison

**Done when:** low-confidence inputs in the browser get the teacher's answer
via the server and are logged; retrain refuses to promote a worse model.

## [ ] M7 — Jev teacher
- `JevTeacher` against TypeSafe's official API (check current docs first)
- Jev's calibrated probabilities used as soft labels in training

**Done when:** the example pipeline runs with `teacher.kind: jev`.
