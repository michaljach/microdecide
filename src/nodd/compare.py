"""Compare model versions on the same test split (e.g. a retrain vs the previous version)."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from nodd.data import read_jsonl


def test_fingerprint(run_dir: Path) -> str:
    rows = sorted((r["text"], r["label"]) for r in read_jsonl(run_dir / "labeled.jsonl") if r["split"] == "test")
    return hashlib.sha256(json.dumps(rows).encode()).hexdigest()[:12]


def _report(run_dir: Path, log) -> dict:
    path = run_dir / "report.json"
    if not path.is_file():
        from nodd.evaluate import evaluate

        evaluate(run_dir, log=log)
    return json.loads(path.read_text())


def _best_browser(r: dict) -> str:
    ok = [x for x in r.get("browser", {}).get("results", []) if "error" not in x]
    if not ok:
        return "—"
    best = min(ok, key=lambda x: x["p95Ms"])
    return f"{best['p95Ms']:.2f} ms ({best['name']})"


def compare(run_dirs: list[str | Path], log=print) -> tuple[str, dict]:
    dirs = [Path(d) for d in run_dirs]
    reports = [_report(d, log) for d in dirs]
    cards = [json.loads((d / "model_card.json").read_text()) for d in dirs]
    fps = [test_fingerprint(d) for d in dirs]
    same_test = len(set(fps)) == 1
    labels = list(reports[0]["test"]["per_label"])

    preds = [[json.loads(l)["label"] for l in open(d / "test_predictions.jsonl")] for d in dirs]
    agreement = {}
    if same_test:
        for i in range(len(dirs)):
            for j in range(i + 1, len(dirs)):
                same = sum(a == b for a, b in zip(preds[i], preds[j])) / len(preds[i])
                agreement[f"{reports[i]['model']} vs {reports[j]['model']}"] = same

    f = lambda x, d=3: "—" if x is None else f"{x:.{d}f}"  # noqa: E731
    pct = lambda x: "—" if x is None else f"{x:.1%}"  # noqa: E731
    lines = [
        f"# Model comparison — {cards[0]['task']}",
        "",
        f"Test split {'identical across versions' if same_test else '**differs between versions — metrics are not directly comparable**'}"
        f" (fingerprint {', '.join(sorted(set(fps)))}, n={reports[0]['test']['n']}).",
        "",
        "| | " + " | ".join(r["model"] for r in reports) + " |",
        "|---" * (len(reports) + 1) + "|",
    ]
    rows = [
        ("tier", [r["tier"] for r in reports]),
        ("base", [f"`{r['base']}`" for r in reports]),
        ("**macro F1**", [f"**{f(r['test']['macro_f1'])}**" for r in reports]),
        ("accuracy", [pct(r["test"]["accuracy"]) for r in reports]),
        ("coverage @ threshold", [f"{pct(r['escalation']['coverage'])} ({pct(r['escalation']['accuracy_on_covered'])} accurate)" for r in reports]),
        ("escalation rate", [pct(r["escalation"]["escalation_rate"]) for r in reports]),
        ("ECE after calibration", [f(r["calibration"]["test_ece_after"]) for r in reports]),
        ("download", [f"{r['size_mb']} MB" for r in reports]),
        ("latency p95, python", [f"{r['latency']['p95_ms']:.2f} ms ({r['latency']['backend'].split('(')[-1].split(')')[0]})" for r in reports]),
        ("latency p95, browser (best)", [_best_browser(r) for r in reports]),
        ("train time", [f"{c['training']['train_seconds']:.0f} s" for c in cards]),
    ]
    rows += [(f"F1 · {lab}", [f(r["test"]["per_label"][lab]["f1"]) for r in reports]) for lab in labels]
    for name, vals in rows:
        lines.append(f"| {name} | " + " | ".join(vals) + " |")
    if agreement:
        lines += ["", "Prediction agreement on the test split: " + "; ".join(f"{k}: {v:.1%}" for k, v in agreement.items())]
    targets = reports[0]["targets"]
    lines += ["", f"Targets: macro F1 ≥ {targets['min_macro_f1']['target']}, download ≤ {targets['max_download_mb']['target']} MB.", ""]
    md = "\n".join(lines)
    summary = {
        "models": [r["model"] for r in reports],
        "same_test_split": same_test,
        "macro_f1": {r["model"]: r["test"]["macro_f1"] for r in reports},
        "agreement": agreement,
    }
    return md, summary
