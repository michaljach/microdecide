"""Inference contract and built-in model loaders, shared by runtime and training."""

from pathlib import Path
from typing import Protocol, Self

import numpy as np


class Classifier(Protocol):
    tier: str
    labels: list[str]

    def logits(self, texts: list[str]) -> np.ndarray: ...
    def download_mb(self) -> float: ...
    def save(self, out: Path) -> None: ...

    @classmethod
    def load(cls, run_dir: Path) -> Self: ...


def classifier_for(tier: str) -> type[Classifier]:
    from microdecide import encoder, static

    if tier == "static":
        return static.StaticClassifier
    if tier == "encoder":
        return encoder.EncoderClassifier
    raise ValueError(f"unknown tier {tier!r}")
