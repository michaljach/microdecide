"""Train a model version (docs/SPEC.md §4.4): pick tier + base, fit, calibrate, save.

Tiers live in their own modules (static.py, encoder.py), each exposing CANDIDATES
(smallest first) and fit(base, data, labels, seed, log) -> (classifier, info). A classifier
has .tier, .logits(texts), .download_mb(), .save(dir), and classmethod .load(run_dir)."""

from __future__ import annotations

import shutil
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from microdecide import calibrate, encoder, static
from microdecide.data import data_dir, read_jsonl
from microdecide.spec import TaskSpec
from microdecide.artifacts import write_card
from microdecide.classifiers import Classifier, classifier_for

TIER_ORDER = ("static", "encoder")
# Best fit: the highest val macro F1 within the download budget wins, but a smaller model wins a
# near-tie — val splits are small, so F1 differences below this are mostly noise.
F1_TIE = 0.01
TIERS = {"static": static, "encoder": encoder}


def plan(spec: TaskSpec, override: str | None) -> list[tuple[str, str]]:
    """(tier, base) candidates to train, smallest estimated download first, across tiers in auto
    mode. Candidates estimated over max_download_mb are skipped (an explicit model.base never is)."""
    tier = override or spec.model.tier
    tiers = [t for t in TIER_ORDER if t in TIERS] if tier == "auto" else [tier]
    if spec.model.base:
        if tier == "auto":
            raise ValueError("model.base needs an explicit model.tier (the base belongs to one tier)")
        return [(tiers[0], spec.model.base)]
    cands = sorted((mb, t, base) for t in tiers for base, mb in TIERS[t].CANDIDATES)
    fitting = [(t, base) for mb, t, base in cands if mb <= spec.targets.max_download_mb]
    if not fitting:
        raise ValueError(f"no candidate fits max_download_mb={spec.targets.max_download_mb}: {[(b, mb) for mb, _, b in cands]}")
    return fitting


def best_fit(cands: list[dict], budget: float) -> int | None:
    """Index of the best-fitting candidate: highest val macro F1 within budget; among those within
    F1_TIE of it, the smallest download."""
    fits = [i for i, c in enumerate(cands) if c["est_download_mb"] <= budget]
    if not fits:
        return None
    top = max(cands[i]["val_macro_f1"] for i in fits)
    return min((i for i in fits if cands[i]["val_macro_f1"] >= top - F1_TIE), key=lambda i: cands[i]["est_download_mb"])


def next_version(spec: TaskSpec, runs: Path) -> str:
    root = Path(runs) / spec.task
    nums = [int(p.name[1:]) for p in root.glob("v*") if p.name[1:].isdigit()] if root.is_dir() else []
    return f"v{max(nums, default=0) + 1}"


def dir_size_mb(path: Path) -> float:
    return sum(f.stat().st_size for f in Path(path).rglob("*") if f.is_file()) / 1e6


def train(spec: TaskSpec, runs: str | Path = "runs", tier: str | None = None, log=print) -> Path:
    """Train the next version. `tier` overrides spec.model.tier (use spec.model.base / targets for the rest)."""
    runs = Path(runs)
    candidates_plan = plan(spec, tier)
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
    data = {
        s: (
            [r["text"] for r in part[s]],
            np.array([index[r["label"]] for r in part[s]]),
            np.array([r["confidence"] for r in part[s]]),  # down-weight uncertain teacher labels
        )
        for s in ("train", "val")
    }

    budget = spec.targets.max_download_mb
    t0 = time.perf_counter()
    tried: list[dict] = []
    models: list[Classifier] = []
    for t, base in candidates_plan:
        log(f"training {t} tier on {len(part['train'])} examples (base {base}) ...")
        model, info = TIERS[t].fit(base, data, labels, spec.seed, log)
        cand = {"tier": t, "base": base, "est_download_mb": round(model.download_mb(), 1), **info}
        tried.append(cand)
        models.append(model)
        fits = cand["est_download_mb"] <= budget
        log(f"  → val macro F1 {cand['val_macro_f1']:.3f}, ~{cand['est_download_mb']} MB{'' if fits else ' (over budget)'}")
    i = best_fit(tried, budget)
    if i is None:
        raise ValueError(f"no candidate fits max_download_mb={budget}: {[(c['base'], c['est_download_mb']) for c in tried]}")
    best, model = tried[i], models[i]
    if len(tried) > 1:
        log(f"best fit: {best['tier']} {best['base']} (val macro F1 {best['val_macro_f1']:.3f}, ~{best['est_download_mb']} MB)")
    train_s = time.perf_counter() - t0

    # calibrate on val
    zv = model.logits(data["val"][0])
    yv = data["val"][1]
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
        "tier": model.tier,
        "base": best["base"],
        "labels": labels,
        "prompt_template": None,  # static/encoder tiers see raw input text
        "temperature": T,
        "threshold": thr["threshold"],
        "calibration": calibration,
        "download_mb": best["est_download_mb"],
        "training": {"selection": "best fit", "chosen": best, "candidates": tried, "train_seconds": round(train_s, 2), "sample_weight": "teacher confidence"},
        "teacher": spec.teacher.model_dump(mode="json"),
        "data": {s: len(v) for s, v in part.items()},
        "seed": spec.seed,
        "created": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "spec": spec.model_dump(mode="json"),
    }
    write_card(out / "model_card.json", card)
    log(f"trained {card['model']} ({model.tier}, {best['base']}) in {train_s:.1f}s → {out}")
    return out
