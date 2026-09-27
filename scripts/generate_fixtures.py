"""Generate deterministic, offline Python→browser contract fixtures.

uv run python scripts/generate_fixtures.py
uv run python scripts/generate_fixtures.py --schema-only
"""
from __future__ import annotations

import argparse
from copy import deepcopy
import json
import tempfile
from pathlib import Path

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

from microdecide import calibrate
from microdecide.artifacts import MODEL_CONFIG, write_card
from microdecide.data import stratified_split, write_jsonl
from microdecide.export import export
from microdecide.spec import TaskSpec
from microdecide.static import StaticClassifier

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "web/src/model.schema.json"


def training_fixture(out: Path) -> None:
    rng = np.random.default_rng(42)
    y = np.repeat(np.arange(3), 80)
    rng.shuffle(y)
    centers = rng.normal(size=(3, 8))
    X = centers[y] + rng.normal(size=(len(y), 8))
    w = rng.uniform(0.5, 1, len(y))
    split = stratified_split(y.tolist(), 42)
    tr, va = (np.array([s == part for s in split]) for part in ("train", "val"))
    scaler = StandardScaler().fit(X[tr])
    C = 0.1
    clf = LogisticRegression(C=C, class_weight="balanced", max_iter=5000, tol=1e-10, random_state=42)
    clf.fit(scaler.transform(X[tr]), y[tr], sample_weight=w[tr])
    coef = clf.coef_ / scaler.scale_
    intercept = clf.intercept_ - (clf.coef_ * scaler.mean_ / scaler.scale_).sum(axis=1)
    logits = X @ coef.T + intercept
    temperature = calibrate.fit_temperature(logits[va], y[va])
    probs = calibrate.softmax(logits[va], temperature)
    fixture = dict(X=X.tolist(), y=y.tolist(), w=w.tolist(), split=split, C=C,
                   sk_coef=coef.tolist(), sk_intercept=intercept.tolist(), sk_pred=logits.argmax(1).tolist(),
                   val_logits=logits[va].tolist(), val_y=y[va].tolist(), temperature=temperature,
                   ece_after=calibrate.ece(probs, y[va]),
                   threshold=calibrate.pick_threshold(probs.max(1), probs.argmax(1) == y[va], 0.9))
    (out / "train_fixture.json").write_text(json.dumps(fixture) + "\n")


def exported_fixture(out: Path) -> None:
    from model2vec import StaticModel
    from tokenizers import Tokenizer, models, pre_tokenizers

    tok = Tokenizer(models.WordPiece({"[UNK]": 0, "[PAD]": 1, "good": 2, "bad": 3, "neutral": 4, "😀": 5}, unk_token="[UNK]"))
    tok.pre_tokenizer = pre_tokenizers.Whitespace()
    table = np.array([[0, 0], [0, 0], [10, 0], [-10, 0], [0, 10], [5, 5]], dtype=np.int8)
    encoder = StaticModel(vectors=table, tokenizer=tok, normalize=True, config={"normalize": True})
    labels = ["bad", "good"]
    model = StaticClassifier(encoder, labels, np.array([[-2., 0.], [2., 0.]]), np.array([0.1, -0.1]))
    spec = TaskSpec.model_validate({"task": "fixture", "description": "Offline parity fixture",
        "input": {"max_chars": 40}, "output": {"type": "choice", "labels": {"bad": "Bad", "good": "Good"}},
        "teacher": {"kind": "csv", "path": "unused.csv"}})
    texts = ["good", "bad", "neutral", "good bad", "", "unknown", "good 😀", "😀 " * 30, "bad " * 30]
    with tempfile.TemporaryDirectory() as tmp:
        run = Path(tmp)
        model.save(run)
        write_card(run / "model_card.json", {"model": "fixture@v1", "tier": "static", "labels": labels,
            "temperature": 1.25, "threshold": 0.7, "spec": spec.model_dump(mode="json"),
            "task": "fixture", "version": "v1", "base": "local-fixture"})
        write_jsonl(run / "labeled.jsonl", ({"text": text, "label": "bad" if "bad" in text else "good", "split": "test"} for text in texts))
        export(run, out / "model", log=lambda _: None)


def contract_fixtures(out: Path) -> None:
    config = json.loads((out / "model/microdecide.json").read_text())
    cases = [{"name": "static export", "config": config, "valid": True}]
    encoder = {k: config[k] for k in ("format", "format_version", "model", "labels", "temperature", "threshold", "max_chars", "onnx")}
    encoder.update(tier="encoder", tokenizer={"file": "tokenizer.json", "add_special_tokens": True, "max_tokens": 256, "truncation": True})
    cases.append({"name": "encoder export", "config": encoder, "valid": True})
    base = deepcopy(config)
    base.update(kind="base", labels=[], head={"coef": [], "intercept": []})
    cases.append({"name": "embedding base", "config": base, "valid": True})
    for field, value in [("format_version", 3), ("tier", "decoder"), ("temperature", 0), ("max_chars", -1),
                         ("labels", ["bad", "bad"]), ("dim", 3), ("head", {"coef": [], "intercept": []}),
                         ("tokenizer", {**config["tokenizer"], "drop_token_ids": [99]})]:
        cases.append({"name": f"invalid {field}", "config": {**config, field: value}, "valid": False})
    for case in cases:
        try:
            MODEL_CONFIG.validate_python(case["config"])
            valid = True
        except ValueError:
            valid = False
        assert valid == case["valid"], case["name"]
    (out / "contract_cases.json").write_text(json.dumps(cases) + "\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--schema-only", action="store_true")
    parser.add_argument("--out", type=Path, default=ROOT / "web/test/generated")
    args = parser.parse_args()
    schema = json.dumps(MODEL_CONFIG.json_schema(), indent=2) + "\n"
    if args.schema_only:
        SCHEMA.write_text(schema)
        return
    if SCHEMA.read_text() != schema:
        raise SystemExit("Artifact schema is stale: run scripts/generate_fixtures.py --schema-only")
    args.out.mkdir(parents=True, exist_ok=True)
    training_fixture(args.out)
    exported_fixture(args.out)
    contract_fixtures(args.out)
    print(f"Generated training and export fixtures → {args.out}")


if __name__ == "__main__":
    main()
