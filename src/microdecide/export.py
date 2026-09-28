"""Browser-first export (docs/SPEC.md §4.7). One folder per model, transformers.js layout.

  microdecide.json            runtime config: tier, labels, temperature, threshold, tokenizer rules
  tokenizer.json              HF tokenizer (+ tokenizer_config.json, config.json)
  onnx/model_quantized.onnx   logits graph for onnxruntime-web / transformers.js (WASM / WebGPU)
  onnx/model.onnx             full precision (optional in the browser); model_quantized.onnx is dynamic int8 (q8)

Every export runs a parity check (training-time model vs each exported artifact, test split) and
writes parity.jsonl — the exported artifact's predictions — for the browser parity page."""

from __future__ import annotations

import shutil
from pathlib import Path

import numpy as np

from microdecide.data import read_jsonl, write_jsonl
from microdecide.runtime import Runtime
from microdecide.artifacts import write_card

from microdecide.exporters.common import ExportError, FORMAT, FORMAT_VERSION, OPSET, MAX_F1_DROP, compare as _compare, record_file_sizes
from microdecide.exporters.encoder import _export_encoder, export_encoder_onnx, quantize_q8, encoder_onnx_probabilities


def export(run_dir: str | Path, out: str | Path | None = None, log=print) -> dict:
    run_dir = Path(run_dir)
    out = Path(out) if out else run_dir / "export"
    rt = Runtime.load(run_dir)
    if out.exists():
        shutil.rmtree(out)
    (out / "onnx").mkdir(parents=True)

    base_config = {
        "format": FORMAT,
        "format_version": FORMAT_VERSION,
        "tier": rt.card["tier"],
        "model": rt.card["model"],
        "labels": rt.labels,
        "temperature": rt.temperature,
        "threshold": rt.threshold,
        "max_chars": rt.max_chars,
    }
    if rt.card["tier"] != "encoder":
        raise ValueError(f"unknown tier {rt.card['tier']!r}")
    artifacts, primary, download = _export_encoder(rt, run_dir, out, base_config, log)

    record_file_sizes(out)

    # parity: training-time model vs every exported artifact, on the test split
    test = [r for r in read_jsonl(run_dir / "labeled.jsonl") if r["split"] == "test"]
    texts = [r["text"] for r in test]
    y = np.array([rt.labels.index(r["label"]) for r in test])
    p_model = rt.probabilities(texts)
    probs = {name: fn(texts) for name, fn in artifacts.items()}
    parity = {"n": len(texts), **{name: _compare(p_model, p, y) for name, p in probs.items()}}
    write_jsonl(
        out / "parity.jsonl",
        (
            {"text": t, "label": rt.labels[int(p.argmax())], "probabilities": dict(zip(rt.labels, map(float, p)))}
            for t, p in zip(texts, probs[primary])
        ),
    )
    info = {"format": FORMAT, "format_version": FORMAT_VERSION, "parity": parity, "parity_reference": primary, **download}
    failed = [f"{n} export F1 dropped {parity[n]['f1_drop']:.3f} (> {MAX_F1_DROP})" for n in artifacts if parity[n]["f1_drop"] > MAX_F1_DROP]
    if failed:
        info["failed"] = "; ".join(failed)  # kept for inspection; web/scripts/sync-model.mjs skips it
    write_card(out / "model_card.json", {**rt.card, "export": info})
    if failed:
        raise ExportError(info["failed"])
    sizes = ", ".join(f"{k.removesuffix('_download_mb')} {v} MB" for k, v in download.items())
    agree = ", ".join(f"{k} {parity[k]['label_agreement']:.2%}" for k in artifacts)
    log(f"exported → {out}  {sizes}; label agreement vs training model: {agree}")
    return info
