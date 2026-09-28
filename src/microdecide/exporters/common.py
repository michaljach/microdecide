"""Shared export configuration, sizing, and parity metrics."""
from __future__ import annotations

from pathlib import Path
from typing import Callable

import numpy as np

from microdecide.artifacts import read_config, write_config

Probs = Callable[[list[str]], np.ndarray]
FORMAT = "microdecide"
FORMAT_VERSION = 2
OPSET = 18
MAX_F1_DROP = 0.02


class ExportError(RuntimeError):
    pass


def _mb(*files: Path) -> float:
    return round(sum(f.stat().st_size for f in files) / 1e6, 2)


def compare(p_ref: np.ndarray, p: np.ndarray, y: np.ndarray) -> dict:
    from sklearn.metrics import f1_score

    f_ref = f1_score(y, p_ref.argmax(1), average="macro")
    f = f1_score(y, p.argmax(1), average="macro")
    return {
        "label_agreement": float((p_ref.argmax(1) == p.argmax(1)).mean()),
        "max_abs_prob_diff": float(np.abs(p_ref - p).max()),
        "macro_f1": float(f),
        "f1_drop": float(f_ref - f),
    }


def _write_config(out: Path, config: dict) -> None:
    write_config(out / "microdecide.json", config)


def record_file_sizes(out: Path) -> None:
    """Add {relative path: bytes} of the model files to microdecide.json (download-progress totals)."""
    config = read_config(out / "microdecide.json")
    config["files"] = {
        p.relative_to(out).as_posix(): p.stat().st_size
        for p in sorted(out.rglob("*"))
        if p.is_file() and p.name not in {"microdecide.json", "model_card.json", "parity.jsonl", "bench.json"}
    }
    _write_config(out, config)
