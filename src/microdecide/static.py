"""Static tier: frozen model2vec embeddings (int8) + logistic regression head."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np

# (base, estimated download MB), smallest first; without model.base, the smallest that meets
# targets on val wins (int8 table + tokenizer)
CANDIDATES = (("minishlab/potion-base-8M", 8.6), ("minishlab/potion-base-32M", 33.3))
EMBEDDING_DTYPE = "int8"  # quantized at train time: no train/export mismatch, ~4x smaller, same F1
C_GRID = (0.003, 0.01, 0.03, 0.1, 0.3, 1.0, 3.0)


class StaticClassifier:
    """Embedding lookup + mean pool (model2vec) → linear head. Head is plain JSON so
    it can be read (and refit) outside Python, e.g. in the browser."""

    tier = "static"

    def __init__(self, encoder, labels: list[str], coef: np.ndarray, intercept: np.ndarray):
        self.encoder = encoder
        self.labels = labels
        self.coef = np.asarray(coef, dtype=np.float32)  # (n_labels, dim)
        self.intercept = np.asarray(intercept, dtype=np.float32)  # (n_labels,)

    def embed(self, texts: list[str]) -> np.ndarray:
        return self.encoder.encode(list(texts))

    def logits(self, texts: list[str]) -> np.ndarray:
        return self.embed(texts) @ self.coef.T + self.intercept

    def download_mb(self) -> float:
        return self.encoder.embedding.nbytes / 1e6 + 1.0  # + tokenizer/config

    def save(self, out: Path) -> None:
        self.encoder.save_pretrained(out / "embeddings")
        head = {"labels": self.labels, "coef": self.coef.tolist(), "intercept": self.intercept.tolist()}
        (out / "head.json").write_text(json.dumps(head))

    @classmethod
    def load(cls, run_dir: Path) -> StaticClassifier:
        from model2vec import StaticModel

        head = json.loads((run_dir / "head.json").read_text())
        encoder = StaticModel.from_pretrained(str(run_dir / "embeddings"), force_download=False)
        return cls(encoder, head["labels"], head["coef"], head["intercept"])


def load_encoder(base: str, quantize_to: str | None = EMBEDDING_DTYPE):
    from model2vec import StaticModel

    return StaticModel.from_pretrained(base, quantize_to=quantize_to, force_download=False)


def fit_head(
    X: np.ndarray, y: np.ndarray, w: np.ndarray, Xv: np.ndarray, yv: np.ndarray, n_labels: int, seed: int
) -> tuple[np.ndarray, np.ndarray, dict]:
    """Standardize + logistic regression, C picked by val macro F1. The scaler is folded
    into the weights, so inference is just `emb @ coef.T + intercept`."""
    from sklearn.linear_model import LogisticRegression
    from sklearn.metrics import f1_score
    from sklearn.preprocessing import StandardScaler

    scaler = StandardScaler().fit(X)
    Xs, Xvs = scaler.transform(X), scaler.transform(Xv)
    search = {}
    best = None
    for C in C_GRID:
        clf = LogisticRegression(C=C, max_iter=5000, class_weight="balanced", random_state=seed)
        clf.fit(Xs, y, sample_weight=w)
        f1 = f1_score(yv, clf.predict(Xvs), average="macro", labels=list(range(n_labels)), zero_division=0)
        search[str(C)] = round(float(f1), 4)
        if best is None or f1 > best[0]:
            best = (f1, C, clf)
    _, C, clf = best
    coef = clf.coef_ / scaler.scale_
    intercept = clf.intercept_ - (clf.coef_ * scaler.mean_ / scaler.scale_).sum(axis=1)
    if coef.shape[0] == 1:  # binary: sklearn returns one row for class 1
        coef = np.vstack([-coef / 2, coef / 2])
        intercept = np.array([-intercept[0] / 2, intercept[0] / 2])
    return coef, intercept, {"C": C, "val_macro_f1": search[str(C)], "val_macro_f1_by_C": search}


def fit(base: str, data: dict, labels: list[str], seed: int, log) -> tuple[StaticClassifier, dict]:
    """data: {"train"|"val": (texts, y, weights)} → classifier + info (val_macro_f1, ...)."""
    encoder = load_encoder(base)
    (tx, y, w), (vx, yv, _) = data["train"], data["val"]
    coef, intercept, info = fit_head(encoder.encode(tx), y, w, encoder.encode(vx), yv, len(labels), seed)
    return StaticClassifier(encoder, labels, coef, intercept), {**info, "embedding_dtype": EMBEDDING_DTYPE}
