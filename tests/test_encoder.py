"""Encoder tier end to end on a tiny local BERT (no downloads): train, runtime, eval, export, compare."""

import json

import pytest
from typer.testing import CliRunner

from microdecide import encoder, static, train
from microdecide.cli import app
from microdecide.compare import compare
from microdecide.evaluate import evaluate
from microdecide.export import export
from microdecide.runtime import Runtime


@pytest.fixture
def encoder_run(toy_run, spec):
    return train.train(spec, toy_run, tier="encoder", log=lambda _: None)


def test_encoder_train_runtime_eval(encoder_run, spec):
    card = json.loads((encoder_run / "model_card.json").read_text())
    assert card["tier"] == "encoder"
    chosen = card["training"]["chosen"]
    assert chosen["epochs"] == encoder.EPOCHS and 1 <= chosen["best_epoch"] <= encoder.EPOCHS
    assert len(chosen["val_macro_f1_by_epoch"]) == encoder.EPOCHS
    assert (encoder_run / "encoder" / "config.json").is_file()

    rt = Runtime.load(encoder_run)
    d = rt.decide("buy cheap followers now")
    spec.check_decision(d)
    assert d.source == "micro" and d.model == "comment_moderation@v1"
    report = evaluate(encoder_run, log=lambda _: None)
    assert report["tier"] == "encoder" and report["size_mb"] == card["download_mb"]


def test_encoder_export(encoder_run):
    info = export(encoder_run, log=lambda _: None)
    out = encoder_run / "export"
    cfg = json.loads((out / "microdecide.json").read_text())
    assert cfg["format"] == "microdecide" and cfg["format_version"] == 2 and cfg["tier"] == "encoder"
    assert cfg["onnx"]["file"] == "onnx/model_quantized.onnx" and "input_ids" in cfg["onnx"]["inputs"]
    for f in ["onnx/model.onnx", "onnx/model_quantized.onnx", "tokenizer.json", "tokenizer_config.json", "config.json"]:
        assert (out / f).is_file(), f
    # transformers.js reads labels from config.json
    assert json.loads((out / "config.json").read_text())["id2label"] == {"0": "ok", "1": "spam", "2": "toxic"}
    assert info["parity"]["onnx_fp32"]["label_agreement"] == 1.0
    assert info["parity"]["onnx_fp32"]["max_abs_prob_diff"] < 1e-4
    assert info["parity_reference"] == "onnx_q8"
    assert (out / "onnx/model_quantized.onnx").stat().st_size < (out / "onnx/model.onnx").stat().st_size
    rows = [json.loads(line) for line in open(out / "parity.jsonl")]
    assert rows and {r["label"] for r in rows} <= {"ok", "spam", "toxic"}
    # eval now reports the measured q8 download
    assert evaluate(encoder_run, log=lambda _: None)["size_mb"] == info["onnx_download_mb"]


def test_auto_plan_orders_by_download_size(spec, monkeypatch):
    monkeypatch.setattr(static, "CANDIDATES", (("s-small", 5.0), ("s-big", 40.0)))
    monkeypatch.setattr(encoder, "CANDIDATES", (("e-small", 20.0), ("e-big", 30.0)))
    assert train.plan(spec, None) == [("static", "s-small"), ("encoder", "e-small"), ("encoder", "e-big"), ("static", "s-big")]
    assert train.plan(spec, "encoder") == [("encoder", "e-small"), ("encoder", "e-big")]
    forced = spec.model_copy(update={"model": spec.model.model_copy(update={"tier": "encoder", "base": "my/model"})})
    assert train.plan(forced, None) == [("encoder", "my/model")]
    with pytest.raises(ValueError, match="explicit model.tier"):
        train.plan(spec.model_copy(update={"model": spec.model.model_copy(update={"base": "my/model"})}), None)


def test_compare_static_vs_encoder(toy_run, spec, tmp_path):
    v1 = train.train(spec, toy_run, tier="static", log=lambda _: None)
    v2 = train.train(spec, toy_run, tier="encoder", log=lambda _: None)
    md, summary = compare([v1, v2], log=lambda _: None)
    assert summary["same_test_split"] and summary["models"] == ["comment_moderation@v1", "comment_moderation@v2"]
    assert "| tier | static | encoder |" in md and "macro F1" in md
    assert 0 <= next(iter(summary["agreement"].values())) <= 1

    out = tmp_path / "cmp.md"
    r = CliRunner().invoke(app, ["compare", str(v1), str(v2), "--out", str(out)])
    assert r.exit_code == 0, r.output
    assert out.read_text().startswith("# Model comparison")
