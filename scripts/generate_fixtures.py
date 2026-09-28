"""Generate deterministic, offline Python→browser contract fixtures.

uv run python scripts/generate_fixtures.py
uv run python scripts/generate_fixtures.py --schema-only
"""
from __future__ import annotations

import argparse
import json
import tempfile
from pathlib import Path

from nodd.artifacts import MODEL_CONFIG, write_card
from nodd.data import write_jsonl
from nodd.export import export
from nodd.spec import TaskSpec
from nodd.encoder import EncoderClassifier

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "web/packages/core/src/model.schema.json"


def exported_fixture(out: Path) -> None:
    """A tiny seeded BERT classifier (1 layer, 16 dims) through the real exporter: the files a browser
    loads, plus parity.jsonl (the exported q8 model's answers) to check the browser against."""
    import torch
    from transformers import BertConfig, BertForSequenceClassification, BertTokenizerFast

    labels = ["bad", "good"]
    spec = TaskSpec.model_validate({"task": "fixture", "description": "Offline parity fixture",
        "input": {"max_chars": 40}, "output": {"type": "choice", "labels": {"bad": "Bad", "good": "Good"}},
        "model": {"tier": "encoder"}, "teacher": {"kind": "csv", "path": "unused.csv"}})
    texts = ["good", "bad", "neutral", "good bad", "", "unknown", "good 😀", "😀 " * 30, "bad " * 30]
    with tempfile.TemporaryDirectory() as tmp:
        run = Path(tmp)
        vocab = run / "vocab.txt"
        vocab.write_text("\n".join(["[PAD]", "[UNK]", "[CLS]", "[SEP]", "[MASK]", "good", "bad", "neutral"]) + "\n")
        tokenizer = BertTokenizerFast(vocab_file=str(vocab), do_lower_case=True)
        torch.manual_seed(0)
        config = BertConfig(vocab_size=8, hidden_size=16, num_hidden_layers=1, num_attention_heads=2, intermediate_size=32,
                            max_position_embeddings=64, num_labels=2, id2label=dict(enumerate(labels)),
                            label2id={label: i for i, label in enumerate(labels)})
        EncoderClassifier(BertForSequenceClassification(config), tokenizer, labels, max_tokens=32).save(run)
        write_card(run / "model_card.json", {"model": "fixture@v1", "tier": "encoder", "labels": labels,
            "temperature": 1.25, "threshold": 0.7, "spec": spec.model_dump(mode="json"),
            "task": "fixture", "version": "v1", "base": "local-fixture"})
        write_jsonl(run / "labeled.jsonl", ({"text": text, "label": "bad" if "bad" in text else "good", "split": "test"} for text in texts))
        export(run, out / "model", log=lambda _: None)


def contract_fixtures(out: Path) -> None:
    config = json.loads((out / "model/nodd.json").read_text())
    cases = [{"name": "encoder export", "config": config, "valid": True}]
    for field, value in [("format_version", 3), ("tier", "static"), ("tier", "decoder"), ("temperature", 0),
                         ("max_chars", -1), ("labels", ["bad", "bad"]), ("labels", ["good"]),
                         ("tokenizer", {**config["tokenizer"], "max_tokens": 0}), ("onnx", None)]:
        cases.append({"name": f"invalid {field}: {json.dumps(value)[:30]}", "config": {**config, field: value}, "valid": False})
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
