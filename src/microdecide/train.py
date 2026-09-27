"""Train a model version (docs/SPEC.md §4.4): pick tier + base, fit, calibrate, save.

Tiers live in their own modules (static.py, encoder.py), each exposing CANDIDATES
(smallest first) and fit(base, data, labels, seed, log) -> (classifier, info). A classifier
has .tier, .logits(texts), .download_mb(), .save(dir), and classmethod .load(run_dir)."""

from __future__ import annotations

import json
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

from microdecide import calibrate, encoder, static
from microdecide.data import data_dir, read_jsonl
from microdecide.spec import TaskSpec

TIER_ORDER = ("static", "encoder")
TIERS = {"static": static, "encoder": encoder}


def classifier_for(tier: str):
    if tier == "static":
        return static.StaticClassifier
    if tier == "encoder":
        return encoder.EncoderClassifier
    raise ValueError(f"unknown tier {tier!r}")


def plan(spec: TaskSpec, override: str | None) -> list[tuple[str, str]]:
    """(tier, base) candidates in the order they are tried: by estimated download size, across
    tiers in auto mode ("smallest that meets targets" — an encoder can beat a larger static model)."""
    tier = override or spec.model.tier
    tiers = [t for t in TIER_ORDER if t in TIERS] if tier == "auto" else [tier]
    if spec.model.base:
        if tier == "auto":
            raise ValueError("model.base needs an explicit model.tier (the base belongs to one tier)")
        return [(tiers[0], spec.model.base)]
    cands = [(mb, t, base) for t in tiers for base, mb in TIERS[t].CANDIDATES]
    return [(t, base) for _, t, base in sorted(cands, key=lambda c: c[0])]


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

    budget, target = spec.targets.max_download_mb, spec.targets.min_macro_f1
    t0 = time.perf_counter()
    tried, chosen = [], None
    for t, base in candidates_plan:
        log(f"training {t} tier on {len(part['train'])} examples (base {base}) ...")
        model, info = TIERS[t].fit(base, data, labels, spec.seed, log)
        cand = {"tier": t, "base": base, "est_download_mb": round(model.download_mb(), 1), **info}
        tried.append(cand)
        fits = cand["est_download_mb"] <= budget
        log(f"  → val macro F1 {cand['val_macro_f1']:.3f}, ~{cand['est_download_mb']} MB{'' if fits else ' (over budget)'}")
        if fits and (chosen is None or cand["val_macro_f1"] > chosen[0]["val_macro_f1"]):
            chosen = (cand, model)
        if fits and cand["val_macro_f1"] >= target:
            break  # smallest that meets targets
    if chosen is None:
        raise ValueError(f"no candidate fits max_download_mb={budget}: {[(c['base'], c['est_download_mb']) for c in tried]}")
    best, model = chosen
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
        "training": {"chosen": best, "candidates": tried, "train_seconds": round(train_s, 2), "sample_weight": "teacher confidence"},
        "teacher": spec.teacher.model_dump(mode="json"),
        "data": {s: len(v) for s, v in part.items()},
        "seed": spec.seed,
        "created": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "spec": spec.model_dump(mode="json"),
    }
    (out / "model_card.json").write_text(json.dumps(card, indent=2))
    log(f"trained {card['model']} ({model.tier}, {best['base']}) in {train_s:.1f}s → {out}")
    return out
