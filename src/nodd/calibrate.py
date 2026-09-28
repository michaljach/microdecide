"""Calibration (temperature scaling), ECE, and escalation threshold (docs/SPEC.md §4.5)."""

from __future__ import annotations

import numpy as np
from scipy.optimize import minimize_scalar


def softmax(logits: np.ndarray, temperature: float = 1.0) -> np.ndarray:
    z = np.asarray(logits, dtype=np.float64) / temperature
    z -= z.max(axis=1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)


def nll(logits: np.ndarray, y: np.ndarray, temperature: float) -> float:
    p = softmax(logits, temperature)
    return float(-np.log(p[np.arange(len(y)), y].clip(1e-12)).mean())


def fit_temperature(logits: np.ndarray, y: np.ndarray) -> float:
    """Temperature T > 0 minimizing validation NLL of softmax(logits / T)."""
    res = minimize_scalar(lambda t: nll(logits, y, np.exp(t)), bounds=(np.log(0.05), np.log(20)), method="bounded")
    return float(np.exp(res.x))


def ece(probs: np.ndarray, y: np.ndarray, bins: int = 15) -> float:
    """Expected calibration error of the top-label confidence, equal-width bins."""
    conf = probs.max(axis=1)
    correct = probs.argmax(axis=1) == y
    edges = np.linspace(0, 1, bins + 1)
    total = 0.0
    for lo, hi in zip(edges[:-1], edges[1:]):
        m = (conf > lo) & (conf <= hi)
        if m.any():
            total += m.mean() * abs(correct[m].mean() - conf[m].mean())
    return float(total)


def pick_threshold(conf: np.ndarray, correct: np.ndarray, target_precision: float) -> dict:
    """Lowest confidence threshold t such that accuracy on {conf >= t} is >= target.

    Inputs below t get escalated. If no threshold reaches the target, t = 1.0 + tiny
    (escalate everything) and `reached` is False."""
    order = np.argsort(-conf, kind="stable")
    c, ok = conf[order], correct[order].astype(np.float64)
    precision = np.cumsum(ok) / np.arange(1, len(ok) + 1)
    best = None
    for k in range(len(c)):
        # only cut between distinct confidence values
        if (k + 1 == len(c) or c[k + 1] < c[k]) and precision[k] >= target_precision:
            best = k
    if best is None:
        return {"threshold": 1.0 + 1e-9, "coverage": 0.0, "precision": None, "reached": False}
    return {
        "threshold": float(c[best]),
        "coverage": (best + 1) / len(c),
        "precision": float(precision[best]),
        "reached": True,
    }
