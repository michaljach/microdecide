"""Portable, FP32 BERT checkpoints for full browser fine-tuning and native ONNX export."""
from __future__ import annotations

import json
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from nodd import calibrate
from nodd.artifacts import write_card
from nodd.data import write_jsonl
from nodd.encoder import EncoderClassifier
from nodd.spec import TaskSpec
from nodd.train import next_version

FILES = ("config.json", "model.safetensors", "tokenizer.json", "tokenizer_config.json", "special_tokens_map.json")


def prepare_base(base: str, out: Path) -> Path:
    """Prepare a pretrained encoder, with a seeded head that the browser replaces for new labels."""
    import torch
    from transformers import AutoModelForSequenceClassification, AutoTokenizer
    from nodd.encoder import CANDIDATES
    if base not in {name for name, _ in CANDIDATES}:
        raise ValueError("Choose one of Nodd's supported encoder bases")
    torch.manual_seed(42)
    labels = ["LABEL_0", "LABEL_1"]
    model = AutoModelForSequenceClassification.from_pretrained(base, num_labels=2)
    with tempfile.TemporaryDirectory() as tmp:
        folder = Path(tmp)
        EncoderClassifier(model, AutoTokenizer.from_pretrained(base), labels).save(folder)
        return prepare(folder, out)


def prepare(run_dir: Path, out: Path) -> Path:
    """Package a saved encoder without including its original training data."""
    src = run_dir / "encoder"
    config = json.loads((src / "config.json").read_text())
    if config.get("model_type") != "bert" or config.get("hidden_act") != "gelu":
        raise ValueError("Browser training currently supports BERT/MiniLM encoders with GELU only")
    for name in FILES[:4]:
        if not (src / name).is_file():
            raise ValueError(f"Missing {src / name}; save an FP32 safetensors encoder first")
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_STORED) as archive:
        for name in FILES:
            if (src / name).is_file():
                archive.write(src / name, name)
    return out


def import_checkpoint(checkpoint: Path, runs: Path) -> Path:
    """Restore trained weights as a normal versioned run; recalibrate natively on validation."""
    import torch
    from transformers import BertConfig, BertForSequenceClassification, BertTokenizerFast
    from safetensors.torch import load_file

    with tempfile.TemporaryDirectory() as tmp:
        folder = Path(tmp)
        with zipfile.ZipFile(checkpoint) as archive:
            allowed = set(FILES) | {"training.json", "labeled.jsonl", "training_parity.json"}
            entries = archive.infolist()
            if len({i.filename for i in entries}) != len(entries):
                raise ValueError("Duplicate checkpoint entries")
            if sum(i.file_size for i in entries) > 300_000_000:
                raise ValueError("Checkpoint exceeds 300 MB")
            for name in (*FILES[:4], "training.json", "labeled.jsonl", "training_parity.json"):
                if name not in archive.namelist():
                    raise ValueError(f"Checkpoint missing {name}")
            for name in allowed.intersection(archive.namelist()):
                (folder / name).write_bytes(archive.read(name))
        meta = json.loads((folder / "training.json").read_text())
        if meta.get("format") != "nodd-browser-training" or meta.get("version") != 1:
            raise ValueError("Unsupported browser checkpoint")
        options, result = meta["options"], meta["result"]
        train_seconds = result.get("trainSeconds")
        if not isinstance(train_seconds, (int, float)) or not np.isfinite(train_seconds) or train_seconds < 0:
            raise ValueError("Invalid checkpoint training duration")
        labels = result["labels"]
        if not isinstance(labels, list) or len(labels) < 2 or len(labels) > 20 or len(set(labels)) != len(labels):
            raise ValueError("Invalid checkpoint labels")
        spec = TaskSpec.model_validate({"task": options["task"], "description": "Full encoder fine-tuning in the browser",
            "input": {"max_chars": 20000}, "output": {"type": "choice", "labels": {label: label for label in labels}},
            "model": {"tier": "encoder"}, "teacher": {"kind": "csv", "path": "labeled.jsonl"},
            "escalation": {"target_precision": options["targetPrecision"]}, "seed": options["seed"]})
        max_tokens = options["maxTokens"]
        if not isinstance(max_tokens, int) or not 8 <= max_tokens <= 256:
            raise ValueError("Invalid sequence length")
        config = BertConfig.from_pretrained(folder, local_files_only=True)
        if config.model_type != "bert" or config.hidden_act != "gelu" or config.is_decoder or config.add_cross_attention:
            raise ValueError("Unsupported encoder configuration")
        for name, maximum in {"hidden_size": 768, "num_hidden_layers": 12, "vocab_size": 100000,
                              "intermediate_size": 3072, "max_position_embeddings": 2048,
                              "type_vocab_size": 16, "num_attention_heads": 768}.items():
            value = getattr(config, name)
            if not isinstance(value, int) or not 1 <= value <= maximum:
                raise ValueError("Encoder exceeds small-model limits")
        if config.hidden_size % config.num_attention_heads or max_tokens > config.max_position_embeddings:
            raise ValueError("Invalid encoder attention or position dimensions")
        if [config.id2label[i] for i in range(len(labels))] != labels:
            raise ValueError("Checkpoint labels do not match the encoder")
        model = BertForSequenceClassification(config)
        state = load_file(str(folder / "model.safetensors"))
        if any(not torch.isfinite(t).all() for t in state.values()):
            raise ValueError("Checkpoint contains non-finite weights")
        model.load_state_dict(state, strict=True)
        clf = EncoderClassifier(model, BertTokenizerFast.from_pretrained(folder, local_files_only=True), labels, max_tokens)
        reference = json.loads((folder / "training_parity.json").read_text())
        if not isinstance(reference, list) or not 1 <= len(reference) <= 16:
            raise ValueError("Invalid training parity reference")
        native_logits = clf.logits([r["text"] for r in reference], batch=2)
        expected_logits = np.array([r["logits"] for r in reference], dtype=np.float32)
        if native_logits.shape != expected_logits.shape or not np.isfinite(expected_logits).all() or not np.allclose(native_logits, expected_logits, atol=0.005, rtol=0.005):
            raise ValueError("Browser checkpoint does not reproduce its predictions in Python")
        rows = [json.loads(line) for line in (folder / "labeled.jsonl").read_text().splitlines() if line.strip()]
        if not 10 <= len(rows) <= 10000:
            raise ValueError("Invalid dataset size")
        seen = set()
        import unicodedata
        for row in rows:
            if not isinstance(row.get("text"), str) or not row["text"].strip() or len(row["text"]) > 20000 or row.get("label") not in labels or row.get("split") not in ("train", "val", "test"):
                raise ValueError("Invalid checkpoint dataset")
            normalized = " ".join(unicodedata.normalize("NFKC", row["text"]).lower().split())
            if normalized in seen:
                raise ValueError("Duplicate text in checkpoint dataset")
            seen.add(normalized)
            if not 0 < row.get("confidence", 1) <= 1:
                raise ValueError("Invalid example confidence")
            row.setdefault("confidence", 1.0)
            row["source"] = "browser_upload"
            row["teacher"] = "given"
        for split in ("train", "val", "test"):
            if set(r["label"] for r in rows if r["split"] == split) != set(labels):
                raise ValueError("Each split must contain all labels")
        val = [r for r in rows if r["split"] == "val"]
        logits = clf.logits([r["text"] for r in val], batch=2)
        y = np.array([labels.index(r["label"]) for r in val])
        temperature = calibrate.fit_temperature(logits, y)
        probs = calibrate.softmax(logits, temperature)
        threshold = calibrate.pick_threshold(probs.max(axis=1), probs.argmax(axis=1) == y, spec.escalation.target_precision)
        version = next_version(spec, runs)
        out = runs / spec.task / version
        out.mkdir(parents=True, exist_ok=False)
        clf.save(out)
        write_jsonl(out / "labeled.jsonl", rows)
        (out / "browser_training.json").write_text(json.dumps(meta, indent=2) + "\n")
        write_card(out / "model_card.json", {"model": f"{spec.task}@{version}", "task": spec.task, "version": version,
            "tier": "encoder", "base": "browser-bert", "labels": labels, "temperature": temperature, "threshold": threshold["threshold"],
            "spec": spec.model_dump(mode="json"), "download_mb": clf.download_mb(), "seed": spec.seed,
            "created": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "teacher": spec.teacher.model_dump(mode="json"),
            "data": {split: sum(r["split"] == split for r in rows) for split in ("train", "val", "test")},
            "training": {"source": "browser", "train_seconds": train_seconds, **meta},
            "calibration": {"method": "temperature", "temperature": temperature, "threshold": threshold["threshold"],
                "val_ece_before": calibrate.ece(calibrate.softmax(logits), y), "val_ece_after": calibrate.ece(probs, y),
                "val_coverage": threshold["coverage"], "val_precision_at_threshold": threshold["precision"], "target_precision_reached": threshold["reached"]}})
        return out
