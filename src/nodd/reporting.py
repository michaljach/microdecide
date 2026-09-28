"""Presentation of evaluation results as Markdown."""

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
        f"| latency ({lat['backend'].split(';')[0]}, single input) | p50 {lat['p50_ms']:.2f} ms · p95 {lat['p95_ms']:.2f} ms |",
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
