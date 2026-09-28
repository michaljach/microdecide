"""Keyword-rule teacher for tests. Never calls an API."""

from __future__ import annotations

import json

from nodd.spec import Decision, TaskSpec
from nodd.teachers.base import make_decision, spread

DEFAULT_RULES = {
    "spam": ["buy", "cheap", "http", "www.", "discount", "click", "followers", "promo"],
    "toxic": ["idiot", "stupid", "hate", "moron", "shut up", "loser"],
}


class FakeTeacher:
    def __init__(self, rules: dict[str, list[str]] | None = None, default: str | None = None, confidence: float = 0.9):
        self.rules = DEFAULT_RULES if rules is None else rules
        self.default = default
        self.confidence = confidence
        self.name = "fake"
        self.calls = 0

    def fingerprint(self, spec: TaskSpec) -> str:
        return json.dumps([self.rules, self.default, self.confidence], sort_keys=True)

    def label(self, spec: TaskSpec, inputs: list[str]) -> list[Decision | None]:
        labels = spec.labels
        default = self.default or labels[0]
        out = []
        for text in inputs:
            self.calls += 1
            low = text.lower()
            label = next(
                (lab for lab, kws in self.rules.items() if lab in labels and any(k in low for k in kws)), default
            )
            out.append(make_decision(spec, self.name, label, spread(labels, label, self.confidence)))
        return out
