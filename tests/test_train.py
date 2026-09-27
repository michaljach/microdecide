import json

import numpy as np
import pytest
from conftest import TOY_ROWS, tiny_static_model
from typer.testing import CliRunner

from microdecide import calibrate, data, static, train
from microdecide.evaluate import evaluate
from microdecide.runtime import Runtime


# --- calibrate ---


def test_temperature_fixes_overconfidence():
    rng = np.random.default_rng(0)
    y = rng.integers(0, 3, 2000)
    logits = rng.normal(size=(2000, 3))
    logits[np.arange(2000), y] += 1.0
    logits *= 5  # overconfident
    T = calibrate.fit_temperature(logits, y)
    assert T > 2
    assert calibrate.ece(calibrate.softmax(logits, T), y) < calibrate.ece(calibrate.softmax(logits), y) / 2


def test_ece_perfect_and_bad():
    y = np.array([0, 1, 0, 1])
    assert calibrate.ece(np.array([[1, 0], [0, 1], [1, 0], [0, 1]], float), y) == pytest.approx(0)
    assert calibrate.ece(np.array([[0, 1], [1, 0], [0, 1], [1, 0]], float), y) == pytest.approx(1)


def test_pick_threshold():
    conf = np.array([0.99, 0.95, 0.9, 0.8, 0.7, 0.6])
    correct = np.array([1, 1, 1, 0, 1, 0], bool)
    t = calibrate.pick_threshold(conf, correct, 0.97)
    assert t["threshold"] == 0.9 and t["coverage"] == pytest.approx(0.5) and t["reached"]
    t = calibrate.pick_threshold(conf, correct, 0.75)
    assert t["threshold"] == 0.7  # 4/5 correct at >= 0.7
    t = calibrate.pick_threshold(np.array([0.9, 0.8]), np.array([0, 0], bool), 0.97)
    assert not t["reached"] and t["coverage"] == 0 and t["threshold"] > 1


def test_pick_threshold_ties_are_not_split():
    conf = np.array([0.9, 0.9, 0.9])
    correct = np.array([1, 0, 1], bool)
    assert not calibrate.pick_threshold(conf, correct, 0.97)["reached"]


# --- train / runtime / eval ---


def test_train_runtime_eval(toy_run, spec):
    out = train.train(spec, toy_run, log=lambda _: None)
    assert out.name == "v1"
    card = json.loads((out / "model_card.json").read_text())
    assert card["labels"] == ["ok", "spam", "toxic"] and card["seed"] == spec.seed
    assert card["base"] == "tiny-a"  # smallest candidate already meets the target → stop
    assert [c["base"] for c in card["training"]["candidates"]] == ["tiny-a"]
    assert card["temperature"] > 0 and 0 < card["threshold"] <= 1 + 1e-6

    rt = Runtime.load(out)
    d = rt.decide("buy cheap followers now")
    assert d.label == "spam" and d.source == "micro" and d.model == "comment_moderation@v1"
    spec.check_decision(d)
    assert rt.decide("you stupid idiot").label == "toxic"
    assert rt.decide("thanks for the dark mode").label == "ok"
    assert len(rt.decide_batch(["a", "b"])) == 2

    report = evaluate(out, log=lambda _: None)
    assert report["test"]["macro_f1"] > 0.8
    assert {"coverage", "accuracy_on_covered", "threshold"} <= set(report["escalation"])
    assert report["latency"]["p95_ms"] > 0
    md = (out / "report.md").read_text()
    for section in ["## Summary", "## Per label", "## Confusion matrix", "Worst"]:
        assert section in md
    assert sum(1 for _ in open(out / "test_predictions.jsonl")) == report["test"]["n"]

    assert train.train(spec, toy_run, log=lambda _: None).name == "v2"


def test_head_folds_scaler(toy_run, spec):
    """head.json alone (emb @ coef.T + b) must reproduce the model's logits."""
    out = train.train(spec, toy_run, log=lambda _: None)
    head = json.loads((out / "head.json").read_text())
    rt = Runtime.load(out)
    texts = ["buy cheap followers", "what a moron", "love it"]
    emb = rt.model.embed(texts)
    manual = emb @ np.array(head["coef"]).T + np.array(head["intercept"])
    np.testing.assert_allclose(manual, rt.model.logits(texts), rtol=1e-4, atol=1e-4)


def test_train_budget_and_tiers(toy_run, spec):
    tight = spec.model_copy(update={"targets": spec.targets.model_copy(update={"max_download_mb": 0.5})})
    with pytest.raises(ValueError, match="no candidate fits"):
        train.train(tight, toy_run, log=lambda _: None)
    with pytest.raises(ValueError, match="unknown tier"):
        train.classifier_for("huge")


def test_train_requires_labels(tmp_path, spec):
    with pytest.raises(FileNotFoundError, match="microdecide label"):
        train.train(spec, tmp_path / "runs")


def test_cli_run_end_to_end(tmp_path, spec, monkeypatch):
    """collect → label → train → eval through the CLI, offline (CSV teacher, fake embedder, tiny encoder)."""
    import csv

    import yaml

    from microdecide.cli import app

    csv_path = tmp_path / "data.csv"
    with csv_path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["text", "label", "confidence", "source"])
        for rep in range(4):
            for text, label in TOY_ROWS:
                w.writerow([f"{text} {'x' * rep}".strip(), label, 0.95, "synthetic"])
    raw = spec.model_dump(mode="json")
    raw["data"].update(unlabeled=str(csv_path), synthetic=0)
    raw["teacher"] = {"kind": "csv", "path": str(csv_path)}
    spec_path = tmp_path / "spec.yaml"
    spec_path.write_text(yaml.safe_dump(raw))
    model = tiny_static_model()
    # orthogonal vectors: no near-duplicates among the (deliberately similar) toy rows
    monkeypatch.setattr(data, "model2vec_embedder", lambda *a, **k: lambda texts: np.eye(len(texts), dtype=np.float32))
    monkeypatch.setattr(static, "load_encoder", lambda base, quantize_to=None: model)
    monkeypatch.setattr(static, "CANDIDATES", (("tiny", 0.1),))

    r = CliRunner().invoke(app, ["run", str(spec_path), "--runs", str(tmp_path / "runs")])
    assert r.exit_code == 0, r.output
    assert "comment_moderation@v1: macro F1" in r.output
    assert (tmp_path / "runs" / "comment_moderation" / "v1" / "report.md").is_file()
