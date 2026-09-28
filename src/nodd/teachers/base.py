"""Teacher protocol and helpers (docs/SPEC.md §4.2)."""

from __future__ import annotations

from typing import Protocol

from nodd.spec import Decision, TaskSpec


class TeacherError(RuntimeError):
    pass


class Teacher(Protocol):
    name: str

    def fingerprint(self, spec: TaskSpec) -> str:
        """Everything besides the input that determines the answer (prompt, model,
        label file hash, ...). Part of the cache key."""
        ...

    def label(self, spec: TaskSpec, inputs: list[str]) -> list[Decision | None]:
        """One decision per input, or None where the teacher could not answer."""
        ...


def make_decision(spec: TaskSpec, teacher: str, label: str, probs: dict[str, float], latency_ms: float = 0.0) -> Decision:
    """Build a teacher Decision: probabilities over exactly the spec's labels, normalized."""
    labels = spec.labels
    if label not in labels:
        raise TeacherError(f"teacher {teacher} returned label {label!r} outside {labels}")
    p = {k: max(0.0, float(probs.get(k, 0.0))) for k in labels}
    total = sum(p.values())
    p = {k: v / total for k, v in p.items()} if total > 0 else {k: float(k == label) for k in labels}
    return spec.check_decision(
        Decision(
            label=label,
            probabilities=p,
            confidence=p[label],
            source="teacher",
            model=teacher,
            latency_ms=latency_ms,
        )
    )


def spread(labels: list[str], label: str, confidence: float) -> dict[str, float]:
    """`confidence` on `label`, the remainder split evenly over the other labels."""
    rest = (1 - confidence) / (len(labels) - 1)
    return {k: confidence if k == label else rest for k in labels}
