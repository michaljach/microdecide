"""Offline checkpoint handoff: trained browser weights become normal Nodd runs."""
import json
import zipfile

import pytest
import torch
from transformers import BertConfig, BertForSequenceClassification, BertTokenizerFast

from nodd.browser_training import prepare, import_checkpoint
from nodd.encoder import EncoderClassifier
from nodd.evaluate import evaluate


@pytest.fixture
def checkpoint(tmp_path):
    src = tmp_path / "source"
    src.mkdir()
    vocab = src / "vocab.txt"
    vocab.write_text("[PAD]\n[UNK]\n[CLS]\n[SEP]\n[MASK]\ngood\nbad\nneutral\n")
    tok = BertTokenizerFast(vocab=str(vocab))
    config = BertConfig(vocab_size=8, hidden_size=16, num_hidden_layers=1, num_attention_heads=2,
        intermediate_size=32, max_position_embeddings=64, id2label={0: "bad", 1: "good"},
        label2id={"bad": 0, "good": 1})
    torch.manual_seed(42)
    clf = EncoderClassifier(BertForSequenceClassification(config), tok, ["bad", "good"], 8)
    clf.save(src)
    path = prepare(src, tmp_path / "checkpoint.zip")
    with zipfile.ZipFile(path) as archive:
        assert "labeled.jsonl" not in archive.namelist()
    rows = [{"text": f"{'good' if i % 2 else 'bad'} " + "neutral " * (i + 1), "label": "good" if i % 2 else "bad",
        "split": "train" if i < 6 else "val" if i < 8 else "test"} for i in range(10)]
    reference = [{"text": r["text"], "logits": clf.logits([r["text"]])[0].tolist()} for r in rows[-2:]]
    meta = {"format": "nodd-browser-training", "version": 1,
        "options": {"task": "browser_test", "maxTokens": 8, "targetPrecision": 0.97, "seed": 42},
        "result": {"labels": ["bad", "good"], "trainSeconds": 0.1}}
    with zipfile.ZipFile(path, "a") as archive:
        archive.writestr("training.json", json.dumps(meta))
        archive.writestr("labeled.jsonl", "\n".join(json.dumps(r) for r in rows))
        archive.writestr("training_parity.json", json.dumps(reference))
    return path


def test_import_calibrates_and_evaluates(checkpoint, tmp_path):
    out = import_checkpoint(checkpoint, tmp_path / "runs")
    assert out.name == "v1"
    card = json.loads((out / "model_card.json").read_text())
    assert card["training"]["source"] == "browser"
    assert card["data"] == {"train": 6, "val": 2, "test": 2}
    assert evaluate(out, log=lambda _: None)["test"]["n"] == 2
    assert import_checkpoint(checkpoint, tmp_path / "runs").name == "v2"


def test_rejects_corrupt_predictions_before_creating_run(checkpoint, tmp_path):
    with zipfile.ZipFile(checkpoint) as archive:
        files = {name: archive.read(name) for name in archive.namelist()}
    files["training_parity.json"] = json.dumps([{"text": "good", "logits": [100, -100]}]).encode()
    with zipfile.ZipFile(checkpoint, "w") as archive:
        for name, data in files.items():
            archive.writestr(name, data)
    with pytest.raises(ValueError, match="does not reproduce"):
        import_checkpoint(checkpoint, tmp_path / "runs")
    assert not (tmp_path / "runs").exists()
