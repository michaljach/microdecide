import json

import numpy as np
import pytest
from conftest import tiny_static_model
from typer.testing import CliRunner

from microdecide import static, train
from microdecide.cli import app
from microdecide.export import ExportError, export, reference_probabilities, static_onnx_probabilities
from microdecide.runtime import Runtime

TRICKY = [
    "buy cheap followers now",
    "you stupid idiot",
    "love the dark mode 😀 thanks",
    "completely unknown words zzz",  # all [UNK] → dropped → zero vector
    "",
    "idiot " * 3000,  # longer than max_chars
]


@pytest.fixture
def run_dir(toy_run, spec):
    return train.train(spec, toy_run, log=lambda _: None)


def test_export_layout_and_parity(run_dir):
    info = export(run_dir, log=lambda _: None)
    out = run_dir / "export"
    for f in ["microdecide.json", "tokenizer.json", "tokenizer_config.json", "config.json", "model_card.json",
              "static/embeddings.i8", "onnx/model_quantized.onnx", "parity.jsonl"]:
        assert (out / f).is_file(), f
    cfg = json.loads((out / "microdecide.json").read_text())
    assert cfg["labels"] == ["ok", "spam", "toxic"] and cfg["tokenizer"]["drop_token_ids"] == [0]
    assert (out / "static/embeddings.i8").stat().st_size == cfg["vocab_size"] * cfg["dim"]
    assert json.loads((out / "config.json").read_text())["id2label"] == {"0": "ok", "1": "spam", "2": "toxic"}

    for name in ("static", "onnx"):
        assert info["parity"][name]["label_agreement"] == 1.0
        assert info["parity"][name]["f1_drop"] <= 1e-9
    assert info["parity"]["static"]["max_abs_prob_diff"] < 1e-9
    assert info["parity"]["onnx"]["max_abs_prob_diff"] < 1e-5
    card = json.loads((out / "model_card.json").read_text())
    assert card["export"]["static_download_mb"] > 0


def test_reference_and_onnx_match_runtime_on_edge_cases(run_dir):
    export(run_dir, log=lambda _: None)
    out = run_dir / "export"
    rt = Runtime.load(run_dir)
    p_rt = rt.probabilities(TRICKY)
    np.testing.assert_allclose(reference_probabilities(out, TRICKY), p_rt, atol=1e-9)
    np.testing.assert_allclose(static_onnx_probabilities(out, TRICKY), p_rt, atol=1e-5)
    # empty / all-unknown inputs fall back to the head bias, identically everywhere
    np.testing.assert_allclose(p_rt[3], p_rt[4], atol=1e-12)


def test_export_rejects_float_embeddings(toy_run, spec, monkeypatch):
    float_model = tiny_static_model(int8=False)
    monkeypatch.setattr(static, "load_encoder", lambda base, quantize_to=None: float_model)
    out = train.train(spec, toy_run, log=lambda _: None)
    with pytest.raises(ExportError, match="int8"):
        export(out, log=lambda _: None)


def test_cli_export(run_dir, tmp_path):
    r = CliRunner().invoke(app, ["export", str(run_dir), "--out", str(tmp_path / "web_model")])
    assert r.exit_code == 0, r.output
    assert (tmp_path / "web_model" / "microdecide.json").is_file()
    r = CliRunner().invoke(app, ["export", str(tmp_path)])
    assert r.exit_code == 1 and "not a run directory" in r.output


def test_eval_includes_browser_bench(run_dir):
    from microdecide.evaluate import evaluate

    export(run_dir, log=lambda _: None)
    bench = {"date": "2026-09-27T00:00:00Z", "webgpu": False, "crossOriginIsolated": True, "results": [
        {"name": "static (plain JS)", "coldLoadMs": 700, "warmLoadMs": 17, "modelMB": 33.3, "p50Ms": 0.05,
         "p95Ms": 0.1, "batchMsPerInput": 0.02},
        {"name": "onnx · webgpu", "error": "WebGPU not available"},
    ]}
    (run_dir / "export" / "bench.json").write_text(json.dumps(bench))
    report = evaluate(run_dir, log=lambda _: None)
    assert report["browser"]["results"][0]["p95Ms"] == 0.1
    md = (run_dir / "report.md").read_text()
    assert "## Browser" in md and "WebGPU not available" in md
