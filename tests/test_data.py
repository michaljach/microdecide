import json
from collections import Counter

import pytest
import yaml
from conftest import fake_embed
from typer.testing import CliRunner

from microdecide import data
from microdecide.cli import app
from microdecide.data import Example, dedup_exact, dedup_near, normalize, split_with_gold, stratified_split
from microdecide.teachers import CachedTeacher, FakeTeacher

COMMENTS = [
    "Great post, thanks for the detailed changelog!",
    "great post,   THANKS for the detailed changelog!",  # exact dup after normalize
    "Great post, thanks for the detailed changelog!!",  # near dup
    "Buy cheap followers now at www.fake-followers.example",
    "You are an idiot and so is everyone who uses this",
    "Does the new export feature support CSV?",
    "The update broke sync on my phone, please fix.",
    "Click here for a huge discount on watches http://x.example",
    "Shut up, loser, nobody asked you.",
    "I switched from a competitor last month and I'm happy so far.",
]


def write_csv(path, rows, header=("text",)):
    import csv

    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


def test_normalize():
    assert normalize("  Héllo\n\tWORLD  ") == "héllo world"
    assert normalize("ｆｕｌｌｗｉｄｔｈ") == "fullwidth"


def test_exact_dedup_prefers_higher_priority_source():
    exs = [Example("Same text", "synthetic"), Example("same   TEXT", "gold", "ok"), Example("other", "seed")]
    out = dedup_exact(exs)
    assert [(e.source, e.text) for e in out] == [("gold", "same   TEXT"), ("seed", "other")]


def test_near_dedup():
    exs = [Example(t, "unlabeled") for t in COMMENTS]
    out = dedup_near(dedup_exact(exs), fake_embed)
    texts = [e.text for e in out]
    assert COMMENTS[0] in texts and COMMENTS[2] not in texts
    assert len(texts) == len(COMMENTS) - 2


def test_stratified_split_proportions_and_determinism():
    labels = ["ok"] * 100 + ["spam"] * 40 + ["toxic"] * 20
    a = stratified_split(labels, seed=1)
    assert a == stratified_split(labels, seed=1)
    assert a != stratified_split(labels, seed=2)
    for lab, n in [("ok", 100), ("spam", 40), ("toxic", 20)]:
        c = Counter(s for s, l in zip(a, labels) if l == lab)
        assert c["test"] == round(n * 0.15) and c["val"] == round(n * 0.15)
        assert c["train"] == n - c["test"] - c["val"]


def test_tiny_label_still_reaches_every_split():
    labels = ["ok"] * 50 + ["toxic"] * 3
    s = stratified_split(labels, seed=0)
    assert {x for x, l in zip(s, labels) if l == "toxic"} == {"train", "val", "test"}


def test_gold_is_always_test():
    labels = ["ok", "spam"] * 20
    gold = [i < 6 for i in range(40)]
    s = split_with_gold(labels, gold, seed=0)
    assert all(x == "test" for x, g in zip(s, gold) if g)
    assert "test" not in {x for x, g in zip(s, gold) if not g}


def test_load_examples_validates_labels_and_source(tmp_path, spec):
    p = tmp_path / "seed.csv"
    write_csv(p, [("hello", "ok", ""), ("promo", "spam", "synthetic")], ("text", "label", "source"))
    exs = data.load_examples(p, "seed", spec.labels)
    assert [(e.label, e.source) for e in exs] == [("ok", "seed"), ("spam", "synthetic")]
    write_csv(p, [("hello", "fine")], ("text", "label"))
    with pytest.raises(ValueError, match="label 'fine' not in"):
        data.load_examples(p, "seed", spec.labels)


def test_load_examples_ignores_labels_for_unlabeled(tmp_path):
    p = tmp_path / "u.jsonl"
    p.write_text(json.dumps({"text": "hi", "label": "ok"}) + "\n")
    assert data.load_examples(p, "unlabeled")[0].label is None


def test_missing_text_column(tmp_path):
    p = tmp_path / "bad.csv"
    write_csv(p, [("x",)], ("comment",))
    with pytest.raises(ValueError, match="no `text`"):
        data.read_rows(p)


def _pipeline_spec(spec, tmp_path, **data_fields):
    u = tmp_path / "unlabeled.csv"
    write_csv(u, [(t,) for t in COMMENTS])
    return spec.model_copy(update={"data": spec.data.model_copy(update={"unlabeled": u, "synthetic": 0, **data_fields})})


def test_collect_then_label_is_cached(tmp_path, spec):
    s = _pipeline_spec(spec, tmp_path)
    runs = tmp_path / "runs"
    cstats = data.collect(s, runs, embed=fake_embed, log=lambda _: None)
    assert cstats["exact_duplicates"] == 1 and cstats["near_duplicates"] == 1
    assert cstats["inputs"] == len(COMMENTS) - 2

    first = CachedTeacher(FakeTeacher())
    st1 = data.label(s, first, runs, log=lambda _: None)
    assert st1["teacher_calls"] == cstats["inputs"] and st1["cache_hits"] == 0

    inner = FakeTeacher()
    second = CachedTeacher(inner)
    st2 = data.label(s, second, runs, log=lambda _: None)
    assert inner.calls == 0 and st2["teacher_calls"] == 0 and st2["cache_hits"] == cstats["inputs"]

    rows = data.read_jsonl(runs / "comment_moderation" / "data" / "labeled.jsonl")
    assert len(rows) == cstats["inputs"]
    assert {r["label"] for r in rows} <= set(spec.labels)
    assert {r["split"] for r in rows} <= {"train", "val", "test"}
    assert {r["label"] for r in rows} == {"ok", "spam", "toxic"}


def test_label_keeps_given_labels_and_drops_low_confidence(tmp_path, spec):
    seed = tmp_path / "seed.csv"
    write_csv(seed, [("Totally fine comment about pricing", "ok")], ("text", "label"))
    s = _pipeline_spec(spec, tmp_path, seed_examples=seed)
    s = s.model_copy(update={"teacher": s.teacher.model_copy(update={"min_confidence": 0.95})})
    runs = tmp_path / "runs"
    data.collect(s, runs, embed=fake_embed, log=lambda _: None)
    st = data.label(s, CachedTeacher(FakeTeacher(confidence=0.9)), runs, log=lambda _: None)
    assert st["given_labels"] == 1
    assert st["labeled"] == 1  # every teacher label (0.9) is below 0.95
    assert st["dropped_low_confidence"] == len(COMMENTS) - 2


def test_label_requires_collect(tmp_path, spec):
    with pytest.raises(FileNotFoundError, match="run `microdecide collect` first"):
        data.label(spec, FakeTeacher(), tmp_path / "runs")


def test_cli_collect_and_label_with_csv_teacher(tmp_path, spec, monkeypatch):
    labels_csv = tmp_path / "labels.csv"
    kw = {"idiot": "toxic", "loser": "toxic", "cheap": "spam", "discount": "spam"}
    rows = [(t, next((v for k, v in kw.items() if k in t.lower()), "ok"), "0.9", "synthetic") for t in COMMENTS]
    write_csv(labels_csv, rows, ("text", "label", "confidence", "source"))
    spec_path = tmp_path / "spec.yaml"
    raw = spec.model_dump(mode="json")
    raw["data"].update(unlabeled=str(labels_csv), synthetic=0)
    raw["teacher"] = {"kind": "csv", "path": str(labels_csv)}
    spec_path.write_text(yaml.safe_dump(raw))
    monkeypatch.setattr(data, "model2vec_embedder", lambda *a, **k: fake_embed)
    runs = tmp_path / "runs"

    r = CliRunner().invoke(app, ["collect", str(spec_path), "--runs", str(runs)])
    assert r.exit_code == 0, r.output
    r = CliRunner().invoke(app, ["label", str(spec_path), "--runs", str(runs)])
    assert r.exit_code == 0, r.output
    assert "teacher_calls: 8" in r.output
    r = CliRunner().invoke(app, ["label", str(spec_path), "--runs", str(runs)])
    assert "teacher_calls: 0" in r.output and "cache_hits: 8" in r.output
    out = data.read_jsonl(runs / "comment_moderation" / "data" / "labeled.jsonl")
    assert all(row["source"] == "synthetic" for row in out)
