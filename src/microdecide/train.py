"""Model tiers (docs/SPEC.md §4.4). M2: static tier = frozen model2vec embeddings + logistic regression."""

from __future__ import annotations

import json
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from microdecide import calibrate
from microdecide.data import data_dir, read_jsonl
from microdecide.spec import TaskSpec

TIERS = ("static", "encoder", "decoder")
# smallest first; without model.base, the smallest that meets targets on val wins
STATIC_CANDIDATES = ("minishlab/potion-base-8M", "minishlab/potion-base-32M")
EMBEDDING_DTYPE = "int8"  # quantized at train time: no train/export mismatch, ~4x smaller, same F1
C_GRID = (0.003, 0.01, 0.03, 0.1, 0.3, 1.0, 3.0)


class StaticClassifier:
    """Embedding lookup + mean pool (model2vec) → linear head. Head is plain JSON so
    it can be read (and refit) outside Python, e.g. in the browser."""

    def __init__(self, encoder, labels: list[str], coef: np.ndarray, intercept: np.ndarray):
        self.encoder = encoder
        self.labels = labels
        self.coef = np.asarray(coef, dtype=np.float32)  # (n_labels, dim)
        self.intercept = np.asarray(intercept, dtype=np.float32)  # (n_labels,)

    def embed(self, texts: list[str]) -> np.ndarray:
        return self.encoder.encode(list(texts))

    def logits(self, texts: list[str]) -> np.ndarray:
        return self.embed(texts) @ self.coef.T + self.intercept

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


def estimated_mb(encoder) -> float:
    return encoder.embedding.nbytes / 1e6 + 1.0  # + tokenizer/config


def fit_static_head(
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
    return coef, intercept, {"C": C, "val_macro_f1_by_C": search}


def resolve_tier(spec: TaskSpec, override: str | None) -> str:
    tier = override or spec.model.tier
    if tier in ("auto", "static"):
        return "static"  # the only tier until M4; auto picks the smallest that fits
    raise NotImplementedError(f"tier {tier!r} lands in {'M4' if tier == 'encoder' else 'M5'}")


def next_version(spec: TaskSpec, runs: Path) -> str:
    root = Path(runs) / spec.task
    nums = [int(p.name[1:]) for p in root.glob("v*") if p.name[1:].isdigit()] if root.is_dir() else []
    return f"v{max(nums, default=0) + 1}"


def dir_size_mb(path: Path) -> float:
    return sum(f.stat().st_size for f in Path(path).rglob("*") if f.is_file()) / 1e6


def train(spec: TaskSpec, runs: str | Path = "runs", tier: str | None = None, log=print) -> Path:
    runs = Path(runs)
    tier = resolve_tier(spec, tier)
    labeled = data_dir(spec, runs) / "labeled.jsonl"
    if not labeled.is_file():
        raise FileNotFoundError(f"{labeled} not found — run `microdecide label` first")
    rows = read_jsonl(labeled)
    labels = spec.labels
    index = {k: i for i, k in enumerate(labels)}
    part = {s: [r for r in rows if r["split"] == s] for s in ("train", "val", "test")}
    if not part["train"] or not part["val"]:
        raise ValueError("need non-empty train and val splits")

    np.random.seed(spec.seed)
    y = np.array([index[r["label"]] for r in part["train"]])
    yv = np.array([index[r["label"]] for r in part["val"]])
    w = np.array([r["confidence"] for r in part["train"]])  # down-weight uncertain teacher labels
    bases = [spec.model.base] if spec.model.base else list(STATIC_CANDIDATES)
    budget, target = spec.targets.max_download_mb, spec.targets.min_macro_f1
    t0 = time.perf_counter()
    candidates, chosen = [], None
    for base in bases:
        log(f"training {tier} tier on {len(part['train'])} examples (base {base}) ...")
        encoder = load_encoder(base)
        X = encoder.encode([r["text"] for r in part["train"]])
        Xv = encoder.encode([r["text"] for r in part["val"]])
        coef, intercept, search = fit_static_head(X, y, w, Xv, yv, len(labels), spec.seed)
        cand = {"base": base, "val_macro_f1": search["val_macro_f1_by_C"][str(search["C"])], "est_mb": round(estimated_mb(encoder), 1), **search}
        candidates.append(cand)
        fits = cand["est_mb"] <= budget
        if fits and (chosen is None or cand["val_macro_f1"] > chosen[0]["val_macro_f1"]):
            chosen = (cand, StaticClassifier(encoder, labels, coef, intercept))
        log(f"  val macro F1 {cand['val_macro_f1']:.3f}, ~{cand['est_mb']} MB{'' if fits else ' (over budget)'}")
        if fits and cand["val_macro_f1"] >= target:
            break  # smallest that meets targets
    if chosen is None:
        raise ValueError(f"no static base fits max_download_mb={budget}: {[(c['base'], c['est_mb']) for c in candidates]}")
    search, model = chosen
    base = search["base"]
    train_s = time.perf_counter() - t0

    # calibrate on val
    zv = model.logits([r["text"] for r in part["val"]])
    T = calibrate.fit_temperature(zv, yv)
    pv = calibrate.softmax(zv, T)
    thr = calibrate.pick_threshold(pv.max(axis=1), pv.argmax(axis=1) == yv, spec.escalation.target_precision)
    calibration = {
        "method": "temperature",
        "temperature": T,
        "val_ece_before": calibrate.ece(calibrate.softmax(zv), yv),
        "val_ece_after": calibrate.ece(pv, yv),
        "threshold": thr["threshold"],
        "val_coverage": thr["coverage"],
        "val_precision_at_threshold": thr["precision"],
        "target_precision_reached": thr["reached"],
    }

    version = next_version(spec, runs)
    out = runs / spec.task / version
    out.mkdir(parents=True)
    model.save(out)
    shutil.copy(labeled, out / "labeled.jsonl")  # the exact data this version saw, for eval/compare
    card = {
        "task": spec.task,
        "version": version,
        "model": f"{spec.task}@{version}",
        "tier": tier,
        "base": base,
        "labels": labels,
        "prompt_template": None,  # static tier sees raw input text
        "temperature": T,
        "threshold": thr["threshold"],
        "calibration": calibration,
        "embedding_dtype": EMBEDDING_DTYPE,
        "training": {
            "C": search["C"],
            "candidates": candidates,
            "train_seconds": round(train_s, 2),
            "sample_weight": "teacher confidence",
        },
        "teacher": spec.teacher.model_dump(mode="json"),
        "data": {s: len(v) for s, v in part.items()},
        "seed": spec.seed,
        "created": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "spec": spec.model_dump(mode="json"),
        "files_mb": {"embeddings": round(dir_size_mb(out / "embeddings"), 2), "head": round((out / "head.json").stat().st_size / 1e6, 3)},
    }
    (out / "model_card.json").write_text(json.dumps(card, indent=2))
    log(f"trained {card['model']} in {train_s:.1f}s → {out}")
    return out
