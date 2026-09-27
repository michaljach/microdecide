"""Collect inputs: load, normalize, dedup, split (docs/SPEC.md §4.1, §4.3)."""

from __future__ import annotations

import csv
import hashlib
import json
import random
import re
import unicodedata
from collections import defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Callable, Iterable, Sequence

import numpy as np

DEFAULT_EMBED_MODEL = "minishlab/potion-base-8M"
NEAR_DUP_THRESHOLD = 0.95
SPLITS = {"train": 0.70, "val": 0.15, "test": 0.15}

# Earlier sources win when duplicates collide (gold must never leak into train).
SOURCE_PRIORITY = ["gold", "seed", "unlabeled", "synthetic", "feedback"]

Embedder = Callable[[list[str]], np.ndarray]


@dataclass
class Example:
    text: str
    source: str  # gold | seed | unlabeled | synthetic | feedback
    label: str | None = None

    def to_json(self) -> dict:
        return {k: v for k, v in asdict(self).items() if v is not None}


def normalize(text: str) -> str:
    """Key used for exact dedup and lookups: NFKC, casefolded, whitespace collapsed."""
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", text)).strip().casefold()


def text_hash(text: str) -> str:
    return hashlib.sha256(normalize(text).encode()).hexdigest()[:16]


def read_rows(path: str | Path) -> list[dict]:
    """Read a CSV (with header) or JSONL file into dicts. Requires a `text` column."""
    path = Path(path)
    if not path.is_file():
        raise FileNotFoundError(f"{path}: file not found")
    if path.suffix == ".jsonl":
        rows = [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
    elif path.suffix == ".csv":
        with path.open(newline="") as f:
            rows = list(csv.DictReader(f))
    else:
        raise ValueError(f"{path}: expected .csv or .jsonl")
    for i, row in enumerate(rows):
        if not isinstance(row.get("text"), str) or not row["text"].strip():
            raise ValueError(f"{path}: row {i + 1} has no `text`")
    return rows


def load_examples(path: str | Path, source: str, labels: Sequence[str] | None = None) -> list[Example]:
    """Load examples. If `labels` is given, rows with a label keep it (validated);
    otherwise labels are ignored. A `source` column overrides the default source,
    except for gold files: their examples must remain held out."""
    out = []
    for i, row in enumerate(read_rows(path)):
        label = None
        if labels is not None:
            label = (row.get("label") or "").strip() or None
        if label is not None and label not in labels:
            raise ValueError(f"{path}: row {i + 1} has label {label!r} not in {list(labels)}")
        row_source = "gold" if source == "gold" else (row.get("source") or source).strip()
        out.append(Example(text=row["text"].strip(), source=row_source, label=label))
    return out


def write_jsonl(path: Path, records: Iterable[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def _priority(ex: Example) -> int:
    return SOURCE_PRIORITY.index(ex.source) if ex.source in SOURCE_PRIORITY else len(SOURCE_PRIORITY)


def dedup_exact(examples: list[Example]) -> list[Example]:
    seen: set[str] = set()
    out = []
    for ex in sorted(examples, key=_priority):  # stable: keeps file order within a source
        h = text_hash(ex.text)
        if h not in seen:
            seen.add(h)
            out.append(ex)
    return out


def dedup_near(
    examples: list[Example], embed: Embedder, threshold: float = NEAR_DUP_THRESHOLD
) -> list[Example]:
    """Greedy near-dup removal: drop an example whose cosine similarity to an
    already-kept one exceeds `threshold`. Assumes `examples` are priority-ordered."""
    if len(examples) < 2:
        return list(examples)
    emb = np.asarray(embed([ex.text for ex in examples]), dtype=np.float32)
    emb /= np.linalg.norm(emb, axis=1, keepdims=True).clip(min=1e-8)
    kept: list[int] = []
    for i in range(len(examples)):
        if kept and float((emb[kept] @ emb[i]).max()) > threshold:
            continue
        kept.append(i)
    return [examples[i] for i in kept]


def model2vec_embedder(model: str = DEFAULT_EMBED_MODEL) -> Embedder:
    from model2vec import StaticModel

    m = StaticModel.from_pretrained(model, force_download=False)
    return lambda texts: m.encode(texts)


def stratified_split(labels: Sequence[str], seed: int, fractions: dict[str, float] = SPLITS) -> list[str]:
    """Assign each index a split name, stratified by label. Deterministic for a seed."""
    rng = random.Random(seed)
    by_label: dict[str, list[int]] = defaultdict(list)
    for i, lab in enumerate(labels):
        by_label[lab].append(i)
    names = list(fractions)
    total = sum(fractions.values())
    out = [""] * len(labels)
    for lab in sorted(by_label):
        idx = by_label[lab]
        rng.shuffle(idx)
        n = len(idx)
        # every non-first split gets round(n * frac), at least 1 when there's enough data
        counts = {k: round(n * fractions[k] / total) for k in names[1:]}
        if n >= len(names):
            counts = {k: max(1, c) for k, c in counts.items()}
        start = 0
        for k in reversed(names[1:]):
            for i in idx[start : start + counts[k]]:
                out[i] = k
            start += counts[k]
        for i in idx[start:]:
            out[i] = names[0]
    return out


def split_with_gold(labels: Sequence[str], is_gold: Sequence[bool], seed: int) -> list[str]:
    """Gold examples are always the test set; the rest split train/val in 70:15."""
    if not any(is_gold):
        return stratified_split(labels, seed)
    rest = [i for i, g in enumerate(is_gold) if not g]
    rest_split = stratified_split([labels[i] for i in rest], seed, {"train": SPLITS["train"], "val": SPLITS["val"]})
    out = ["test"] * len(labels)
    for i, s in zip(rest, rest_split):
        out[i] = s
    return out


# --- pipeline steps -------------------------------------------------------------

Log = Callable[[str], None]


def data_dir(spec, runs: str | Path = "runs") -> Path:
    return Path(runs) / spec.task / "data"


def collect(spec, runs: str | Path = "runs", embed: Embedder | None = None, synthesize=None, log: Log = print) -> dict:
    """Merge gold, seed, unlabeled and synthetic inputs; dedup; write inputs.jsonl."""
    d = spec.data
    labels = spec.labels
    examples: list[Example] = []
    if d.gold:
        gold = load_examples(d.gold, "gold", labels)
        if missing := sum(ex.label is None for ex in gold):
            raise ValueError(f"{d.gold}: {missing} gold rows have no label")
        examples += gold
    if d.seed_examples:
        examples += load_examples(d.seed_examples, "seed", labels)
    if d.unlabeled:
        examples += load_examples(d.unlabeled, "unlabeled")
    if d.synthetic:
        if synthesize is None:
            from microdecide.synth import generate as synthesize
        log(f"generating {d.synthetic} synthetic inputs ...")
        examples += synthesize(spec)

    loaded = len(examples)
    truncated = 0
    for ex in examples:
        if len(ex.text) > spec.input.max_chars:
            ex.text = ex.text[: spec.input.max_chars]
            truncated += 1

    examples = dedup_exact(examples)
    after_exact = len(examples)
    if embed is None:
        log(f"embedding {after_exact} inputs for near-dup check ({DEFAULT_EMBED_MODEL}) ...")
        embed = model2vec_embedder()
    examples = dedup_near(examples, embed)

    out = data_dir(spec, runs)
    write_jsonl(out / "inputs.jsonl", (ex.to_json() for ex in examples))
    stats = {
        "loaded": loaded,
        "truncated": truncated,
        "exact_duplicates": loaded - after_exact,
        "near_duplicates": after_exact - len(examples),
        "inputs": len(examples),
        "by_source": _count(ex.source for ex in examples),
        "near_dup_threshold": NEAR_DUP_THRESHOLD,
        "seed": spec.seed,
    }
    (out / "collect.json").write_text(json.dumps(stats, indent=2))
    return stats


def label(spec, teacher, runs: str | Path = "runs", chunk: int = 200, log: Log = print) -> dict:
    """Label inputs.jsonl with the teacher (given labels are kept), filter, split; write labeled.jsonl."""
    out = data_dir(spec, runs)
    inputs_path = out / "inputs.jsonl"
    if not inputs_path.is_file():
        raise FileNotFoundError(f"{inputs_path} not found — run `microdecide collect` first")
    rows = read_jsonl(inputs_path)
    labels = spec.labels

    records: list[dict | None] = [None] * len(rows)
    todo = []
    for i, r in enumerate(rows):
        if r.get("label"):
            p = {k: float(k == r["label"]) for k in labels}
            records[i] = {"label": r["label"], "probabilities": p, "confidence": 1.0, "teacher": "given"}
        else:
            todo.append(i)

    for start in range(0, len(todo), chunk):
        idx = todo[start : start + chunk]
        decisions = teacher.label(spec, [rows[i]["text"] for i in idx])
        for i, dec in zip(idx, decisions):
            if dec is not None:
                spec.check_decision(dec)
                records[i] = {
                    "label": dec.label,
                    "probabilities": dec.probabilities,
                    "confidence": dec.confidence,
                    "teacher": dec.model,
                }
        log(f"labeled {min(start + chunk, len(todo))}/{len(todo)}")

    failed = sum(r is None for r in records)
    kept, low_conf = [], 0
    for row, rec in zip(rows, records):
        if rec is None:
            continue
        if rec["teacher"] != "given" and rec["confidence"] < spec.teacher.min_confidence:
            low_conf += 1
            continue
        kept.append({"text": row["text"], "source": row["source"], **rec})

    splits = split_with_gold([r["label"] for r in kept], [r["source"] == "gold" for r in kept], spec.seed)
    for r, s in zip(kept, splits):
        r["split"] = s
    write_jsonl(out / "labeled.jsonl", kept)

    stats = {
        "teacher": getattr(teacher, "name", "?"),
        "teacher_calls": getattr(teacher, "calls", None),
        "cache_hits": getattr(teacher, "hits", None),
        "given_labels": len(rows) - len(todo),
        "failed": failed,
        "dropped_low_confidence": low_conf,
        "labeled": len(kept),
        "by_label": _count(r["label"] for r in kept),
        "by_split": _count(r["split"] for r in kept),
        "by_source": _count(r["source"] for r in kept),
        "seed": spec.seed,
    }
    (out / "label.json").write_text(json.dumps(stats, indent=2))
    return stats


def _count(items: Iterable[str]) -> dict[str, int]:
    counts: dict[str, int] = defaultdict(int)
    for x in items:
        counts[x] += 1
    return dict(sorted(counts.items()))
