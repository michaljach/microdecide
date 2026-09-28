"""Load a trained run and make decisions (docs/SPEC.md §4.9). Escalation arrives in M6."""

from __future__ import annotations

import time
from pathlib import Path

import numpy as np

from nodd.calibrate import softmax
from nodd.artifacts import read_card
from nodd.spec import Decision
from nodd.classifiers import Classifier, classifier_for


class Runtime:
    def __init__(self, model: Classifier, card: dict):
        self.model = model
        self.card = card
        self.labels: list[str] = card["labels"]
        self.temperature: float = card["temperature"]
        self.threshold: float = card["threshold"]
        self.name: str = card["model"]
        self.max_chars: int = card["spec"]["input"]["max_chars"]

    @classmethod
    def load(cls, run_dir: str | Path) -> Runtime:
        run_dir = Path(run_dir)
        card = read_card(run_dir / "model_card.json")
        return cls(classifier_for(card["tier"]).load(run_dir), card)

    def probabilities(self, texts: list[str]) -> np.ndarray:
        texts = [t[: self.max_chars] for t in texts]
        return softmax(self.model.logits(texts), self.temperature)

    def decide_batch(self, texts: list[str]) -> list[Decision]:
        t0 = time.perf_counter()
        probs = self.probabilities(texts)
        ms = (time.perf_counter() - t0) * 1000 / max(len(texts), 1)
        out = []
        for p in probs:
            i = int(p.argmax())
            out.append(
                Decision(
                    label=self.labels[i],
                    probabilities={k: float(v) for k, v in zip(self.labels, p)},
                    confidence=float(p[i]),
                    source="micro",
                    model=self.name,
                    latency_ms=ms,
                )
            )
        return out

    def decide(self, text: str) -> Decision:
        return self.decide_batch([text])[0]

    def is_confident(self, d: Decision) -> bool:
        """False → this decision should be escalated (M6 does it automatically)."""
        return d.confidence >= self.threshold
