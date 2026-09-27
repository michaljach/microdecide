"""Evaluate a run on its test split; write report.md + report.json (docs/SPEC.md §4.6)."""

from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np

from microdecide import calibrate
from microdecide.data import read_jsonl, write_jsonl
from microdecide.runtime import Runtime

N_WORST = 20
N_LATENCY = 200


def _metrics(y: np.ndarray, pred: np.ndarray, labels: list[str]) -> dict:
    from sklearn.metrics import accuracy_score, confusion_matrix, precision_recall_fscore_support

    idx = list(range(len(labels)))
    p, r, f, s = precision_recall_fscore_support(y, pred, labels=idx, zero_division=0)
    return {
        "n": int(len(y)),
        "accuracy": float(accuracy_score(y, pred)) if len(y) else None,
        "macro_f1": float(f.mean()) if len(y) else None,
        "per_label": {
            lab: {"precision": float(p[i]), "recall": float(r[i]), "f1": float(f[i]), "support": int(s[i])}
            for i, lab in enumerate(labels)
        },
        "confusion": confusion_matrix(y, pred, labels=idx).tolist(),
    }


def _latency(rt: Runtime, texts: list[str]) -> dict:
    rt.decide(texts[0])  # warm up
    times = []
    for t in texts[:N_LATENCY]:
        t0 = time.perf_counter()
        rt.decide(t)
        times.append((time.perf_counter() - t0) * 1000)
    t0 = time.perf_counter()
    rt.decide_batch(texts)
    batch_ms = (time.perf_counter() - t0) * 1000 / len(texts)
    return {
        "p50_ms": float(np.percentile(times, 50)),
        "p95_ms": float(np.percentile(times, 95)),
        "batch_ms_per_input": batch_ms,
        "backend": "python (CPU); browser numbers come from the benchmark page (M3)",
    }


def evaluate(run_dir: str | Path, log=print) -> dict:
    run_dir = Path(run_dir)
    rt = Runtime.load(run_dir)
    card = rt.card
    spec = card["spec"]
    labels = rt.labels
    index = {k: i for i, k in enumerate(labels)}
    test = [r for r in read_jsonl(run_dir / "labeled.jsonl") if r["split"] == "test"]
    if not test:
        raise ValueError("empty test split")
    texts = [r["text"] for r in test]
    y = np.array([index[r["label"]] for r in test])

    logits = rt.model.logits(texts)
    raw = calibrate.softmax(logits)
    probs = calibrate.softmax(logits, rt.temperature)
    pred = probs.argmax(axis=1)
    conf = probs.max(axis=1)
    covered = conf >= rt.threshold

    overall = _metrics(y, pred, labels)
    by_source = {
        src: _metrics(y[m], pred[m], labels)
        for src in sorted({r["source"] for r in test})
        if (m := np.array([r["source"] == src for r in test])).any()
    }
    non_gold = np.array([r["teacher"] != "given" for r in test])
    size_mb = download_mb(run_dir, card)

    worst_idx = [i for i in np.argsort(-conf) if pred[i] != y[i]][:N_WORST]
    worst = [
        {
            "text": texts[i],
            "label": labels[y[i]],
            "predicted": labels[pred[i]],
            "confidence": round(float(conf[i]), 3),
            "teacher_confidence": test[i]["confidence"],
        }
        for i in worst_idx
    ]

    t = spec["targets"]
    report = {
        "model": card["model"],
        "tier": card["tier"],
        "base": card["base"],
        "test": overall,
        "by_source": by_source,
        "teacher_agreement": float((pred[non_gold] == y[non_gold]).mean()) if non_gold.any() else None,
        "calibration": {
            "temperature": rt.temperature,
            "test_ece_before": calibrate.ece(raw, y),
            "test_ece_after": calibrate.ece(probs, y),
            **{k: v for k, v in card["calibration"].items() if k.startswith("val_")},
        },
        "escalation": {
            "threshold": rt.threshold,
            "target_precision": spec["escalation"]["target_precision"],
            "coverage": float(covered.mean()),
            "accuracy_on_covered": float((pred[covered] == y[covered]).mean()) if covered.any() else None,
            "escalation_rate": float(1 - covered.mean()),
        },
        "latency": _latency(rt, texts),
        "size_mb": round(size_mb, 2),
        "targets": {
            "min_macro_f1": {"target": t["min_macro_f1"], "actual": overall["macro_f1"], "met": overall["macro_f1"] >= t["min_macro_f1"]},
            "max_download_mb": {"target": t["max_download_mb"], "actual": round(size_mb, 2), "met": size_mb <= t["max_download_mb"]},
        },
        "worst_errors": worst,
        "data": card["data"],
        "seed": card["seed"],
    }
    bench = run_dir / "export" / "bench.json"
    if bench.is_file():  # written by `npm run bench` in web/
        report["browser"] = json.loads(bench.read_text())
    report["recommendations"] = _recommend(report)

    (run_dir / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))
    (run_dir / "report.md").write_text(render_markdown(report))
    write_jsonl(
        run_dir / "test_predictions.jsonl",
        (
            {"text": texts[i], "label": labels[pred[i]], "probabilities": dict(zip(labels, map(float, probs[i])))}
            for i in range(len(texts))
        ),
    )
    log(f"report → {run_dir / 'report.md'}")
    return report


def download_mb(run_dir: Path, card: dict) -> float:
    """What the browser downloads: measured from the export if there is one, else the train-time estimate."""
    exp = run_dir / "export" / "model_card.json"
    if exp.is_file():
        e = json.loads(exp.read_text())["export"]
        return e["static_download_mb"] if card["tier"] == "static" else e["onnx_download_mb"]
    return card["download_mb"]


def _recommend(r: dict) -> list[str]:
    out = []
    if not r["targets"]["min_macro_f1"]["met"]:
        f1 = r["test"]["macro_f1"]
        out.append(
            f"Macro F1 {f1:.3f} is below the {r['targets']['min_macro_f1']['target']:.2f} target. Options: "
            "more/better data (real inputs beat synthetic), the encoder tier (M4), "
            "or escalation-heavy mode (the micro model handles only confident cases)."
        )
    if not r["targets"]["max_download_mb"]["met"]:
        out.append("Model exceeds max_download_mb: use a smaller base or quantize (M3).")
    if r["escalation"]["coverage"] < 0.5:
        out.append(
            f"Only {r['escalation']['coverage']:.0%} of inputs clear the escalation threshold; "
            "most traffic would go to the teacher."
        )
    if set(r["by_source"]) == {"synthetic"}:
        out.append("All test data is synthetic: expect lower accuracy on real inputs. Add a human-labeled gold set.")
    return out


def _pct(x) -> str:
    return "—" if x is None else f"{x:.1%}"


def render_markdown(r: dict) -> str:
    t, e, c, lat = r["test"], r["escalation"], r["calibration"], r["latency"]
    labels = list(t["per_label"])
    ok = lambda m: "✅" if m else "❌"  # noqa: E731
    tg = r["targets"]
    lines = [
        f"# {r['model']} — {r['tier']} tier",
        "",
        f"Base `{r['base']}` · test n={t['n']} · train/val/test = {r['data']['train']}/{r['data']['val']}/{r['data']['test']} · seed {r['seed']}",
        "",
        "## Summary",
        "",
        "| metric | value |",
        "|---|---|",
        f"| macro F1 | **{t['macro_f1']:.3f}** (target {tg['min_macro_f1']['target']:.2f} {ok(tg['min_macro_f1']['met'])}) |",
        f"| accuracy | {_pct(t['accuracy'])} |",
        f"| teacher agreement | {_pct(r['teacher_agreement'])} |",
        f"| coverage @ threshold {e['threshold']:.3f} | {_pct(e['coverage'])} handled alone, {_pct(e['accuracy_on_covered'])} accurate (target {e['target_precision']:.0%}) |",
        f"| escalation rate | {_pct(e['escalation_rate'])} |",
        f"| ECE (test) | {c['test_ece_before']:.3f} → {c['test_ece_after']:.3f} after temperature {c['temperature']:.2f} |",
        f"| download size | {r['size_mb']} MB (budget {tg['max_download_mb']['target']} MB {ok(tg['max_download_mb']['met'])}) |",
        f"| latency (python, single input) | p50 {lat['p50_ms']:.2f} ms · p95 {lat['p95_ms']:.2f} ms |",
        "",
    ]
    if r["recommendations"]:
        lines += ["## Recommendations", ""] + [f"- {x}" for x in r["recommendations"]] + [""]
    if "browser" in r:
        b = r["browser"]
        lines += [
            "## Browser (headless Chromium, from `npm run bench`)",
            "",
            f"{b.get('date', '')[:10]} · crossOriginIsolated={b.get('crossOriginIsolated')} · WebGPU={b.get('webgpu')}",
            "",
            "| backend | cold load | warm load | download | p50 | p95 | batch/input |",
            "|---|---|---|---|---|---|---|",
        ]
        for x in b["results"]:
            if "error" in x:
                lines.append(f"| {x['name']} | {x['error']} | | | | | |")
            else:
                lines.append(
                    f"| {x['name']} | {x['coldLoadMs']:.0f} ms | {x['warmLoadMs']:.0f} ms | {x['modelMB']:.1f} MB | "
                    f"{x['p50Ms']:.2f} ms | {x['p95Ms']:.2f} ms | {x['batchMsPerInput']:.3f} ms |"
                )
        lines.append("")
    lines += ["## Per label", "", "| label | precision | recall | F1 | support |", "|---|---|---|---|---|"]
    for lab, m in t["per_label"].items():
        lines.append(f"| {lab} | {m['precision']:.3f} | {m['recall']:.3f} | {m['f1']:.3f} | {m['support']} |")
    lines += ["", "## Confusion matrix (rows = true, cols = predicted)", "", "| | " + " | ".join(labels) + " |", "|---" * (len(labels) + 1) + "|"]
    for lab, row in zip(labels, t["confusion"]):
        lines.append(f"| **{lab}** | " + " | ".join(map(str, row)) + " |")
    if len(r["by_source"]) > 1:
        lines += ["", "## By source", "", "| source | n | accuracy | macro F1 |", "|---|---|---|---|"]
        for src, m in r["by_source"].items():
            lines.append(f"| {src} | {m['n']} | {_pct(m['accuracy'])} | {m['macro_f1']:.3f} |")
    lines += ["", f"## Worst {len(r['worst_errors'])} errors (most confident mistakes)", "", "| conf | true → predicted | teacher conf | text |", "|---|---|---|---|"]
    for w in r["worst_errors"]:
        text = w["text"].replace("|", "\\|").replace("\n", " ")
        text = text if len(text) <= 140 else text[:137] + "..."
        lines.append(f"| {w['confidence']:.2f} | {w['label']} → {w['predicted']} | {w['teacher_confidence']} | {text} |")
    lines.append("")
    return "\n".join(lines)
