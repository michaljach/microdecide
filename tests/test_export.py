import json

import pytest
from typer.testing import CliRunner

from microdecide import train
from microdecide.cli import app
from microdecide.export import export


@pytest.fixture
def run_dir(toy_run, spec):
    return train.train(spec, toy_run, log=lambda _: None)


def test_export_records_file_sizes(run_dir):
    export(run_dir, log=lambda _: None)
    out = run_dir / "export"
    cfg = json.loads((out / "microdecide.json").read_text())
    assert cfg["labels"] == ["ok", "spam", "toxic"] and cfg["tier"] == "encoder"
    # file sizes for the browser's download progress (not the config itself or eval-only files)
    for f in ("onnx/model_quantized.onnx", "onnx/model.onnx", "tokenizer.json"):
        assert cfg["files"][f] == (out / f).stat().st_size, f
    assert not {"microdecide.json", "parity.jsonl", "model_card.json"} & set(cfg["files"])


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
        {"name": "transformers.js · wasm · q8", "coldLoadMs": 900, "warmLoadMs": 190, "modelMB": 24.4, "p50Ms": 2.5,
         "p95Ms": 6.8, "batchMsPerInput": 3.3},
        {"name": "transformers.js · webgpu · q8", "error": "WebGPU not available"},
    ]}
    (run_dir / "export" / "bench.json").write_text(json.dumps(bench))
    report = evaluate(run_dir, log=lambda _: None)
    assert report["browser"]["results"][0]["p95Ms"] == 6.8
    md = (run_dir / "report.md").read_text()
    assert "## Browser" in md and "WebGPU not available" in md
