"""Generate deterministic, offline Python→browser contract fixtures.

uv run python scripts/generate_fixtures.py
uv run python scripts/generate_fixtures.py --schema-only
"""
from __future__ import annotations

import argparse
import json
import tempfile
from pathlib import Path

import numpy as np
from microdecide.artifacts import MODEL_CONFIG, write_card
from microdecide.data import write_jsonl
from microdecide.export import export
from microdecide.spec import TaskSpec
from microdecide.static import StaticClassifier

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "web/src/model.schema.json"


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
    for field, value in [("format_version", 3), ("tier", "decoder"), ("temperature", 0), ("max_chars", -1),
                         ("labels", ["bad", "bad"]), ("dim", 3), ("head", {"coef": [], "intercept": []}),
                         ("tokenizer", {**config["tokenizer"], "drop_token_ids": [99]})]:
        cases.append({"name": f"invalid {field}", "config": {**config, field: value}, "valid": False})
    cases.append({"name": "invalid labels (none)", "config": {**config, "labels": [], "head": {"coef": [], "intercept": []}}, "valid": False})
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
    exported_fixture(args.out)
    contract_fixtures(args.out)
    print(f"Generated export fixtures → {args.out}")


if __name__ == "__main__":
    main()
