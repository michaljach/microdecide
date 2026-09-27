import json
from types import SimpleNamespace

import pytest

from microdecide import synth
from microdecide.teachers import CachedTeacher, CSVTeacher, DiskCache, FakeTeacher, LLMTeacher, TeacherError, make_teacher
from microdecide.teachers.llm import LLMClient


class FakeAnthropic:
    """Stands in for anthropic.Anthropic(): records requests, replays canned JSON."""

    def __init__(self, reply):
        self.requests = []
        self.reply = reply  # callable(request) -> (stop_reason, dict)
        self.messages = SimpleNamespace(create=self._create)

    def _create(self, **req):
        self.requests.append(req)
        stop, payload = self.reply(req)
        return SimpleNamespace(stop_reason=stop, content=[SimpleNamespace(type="text", text=json.dumps(payload))])


def test_fake_teacher_labels_within_set(spec):
    ds = FakeTeacher().label(spec, ["buy cheap stuff", "you idiot", "nice post"])
    assert [d.label for d in ds] == ["spam", "toxic", "ok"]
    for d in ds:
        assert set(d.probabilities) == set(spec.labels) and d.source == "teacher"
        assert d.confidence == pytest.approx(0.9)


def test_cached_teacher_second_run_makes_no_calls(spec):
    inner = FakeTeacher()
    first = CachedTeacher(inner).label(spec, ["a", "b", "buy now"])
    assert inner.calls == 3
    again = CachedTeacher(inner)
    second = again.label(spec, ["a", "b", "buy now"])
    assert inner.calls == 3 and again.hits == 3 and again.calls == 0
    assert [d.model_dump() for d in first] == [d.model_dump() for d in second]


def test_cache_key_includes_fingerprint(spec):
    inner = FakeTeacher()
    CachedTeacher(inner).label(spec, ["a"])
    changed = FakeTeacher(confidence=0.8)
    CachedTeacher(changed).label(spec, ["a"])
    assert changed.calls == 1


def test_disk_cache_roundtrip(tmp_path):
    c = DiskCache(tmp_path)
    k = DiskCache.key("x", "y")
    assert c.get(k) is None
    c.put(k, {"a": [1, 2]})
    assert c.get(k) == {"a": [1, 2]}


def test_csv_teacher(tmp_path, spec):
    p = tmp_path / "labels.csv"
    p.write_text("text,label,confidence\nBuy NOW,spam,0.8\nhello there,ok,\n")
    t = CSVTeacher(p)
    a, b, c = t.label(spec, ["buy   now", "Hello there", "unknown"])
    assert a.label == "spam" and a.confidence == pytest.approx(0.8)
    assert a.probabilities["ok"] == pytest.approx(0.1)
    assert b.label == "ok" and b.confidence == 1.0
    assert c is None


def test_csv_teacher_rejects_unknown_label(tmp_path, spec):
    p = tmp_path / "labels.csv"
    p.write_text("text,label\nhi,fine\n")
    with pytest.raises(TeacherError, match="label 'fine' not in"):
        CSVTeacher(p).label(spec, ["hi"])


def test_csv_cache_tracks_task_labels_and_file_contents(tmp_path, spec):
    p = tmp_path / "labels.csv"
    p.write_text("text,label,confidence\nhello,ok,0.8\n")
    first = CachedTeacher(CSVTeacher(p))
    (original,) = first.label(spec, ["hello"])
    assert original.probabilities["spam"] == pytest.approx(0.1)

    changed = spec.model_copy(update={"output": spec.output.model_copy(update={
        "labels": {k: v for k, v in spec.output.labels.items() if k != "toxic"},
    })})
    second = CachedTeacher(CSVTeacher(p))
    (decision,) = second.label(changed, ["hello"])
    changed.check_decision(decision)
    assert decision.probabilities["spam"] == pytest.approx(0.2)
    assert second.calls == 1 and second.hits == 0

    repeated = CachedTeacher(CSVTeacher(p))
    assert repeated.label(changed, ["hello"]) == [decision]
    assert repeated.calls == 0 and repeated.hits == 1

    p.write_text("text,label,confidence\nhello,spam,0.8\n")
    updated = CachedTeacher(CSVTeacher(p))
    assert updated.label(changed, ["hello"])[0].label == "spam"
    assert updated.calls == 1 and updated.hits == 0


def test_llm_teacher_request_and_normalization(spec):
    client = FakeAnthropic(lambda req: ("end_turn", {"label": "spam", "probabilities": {"ok": 1, "spam": 8, "toxic": 1}}))
    t = LLMTeacher("claude-haiku-4-5-20251001", client=client, workers=2)
    (d,) = t.label(spec, ["Buy followers"])
    assert d.label == "spam" and d.confidence == pytest.approx(0.8) and d.model == "llm:claude-haiku-4-5-20251001"
    req = client.requests[0]
    schema = req["output_config"]["format"]["schema"]
    assert schema["properties"]["label"]["enum"] == ["ok", "spam", "toxic"]
    assert "<input>\nBuy followers\n</input>" in req["messages"][0]["content"]
    assert "Insults, harassment" in req["system"]


def test_llm_teacher_refusal_and_bad_output_are_skipped(spec):
    replies = iter([("refusal", {}), ("end_turn", {"label": "meh", "probabilities": {}}), ("end_turn", {"x": 1})])
    client = FakeAnthropic(lambda req: next(replies))
    t = LLMTeacher("claude-haiku-4-5-20251001", client=client, workers=1)
    assert t.label(spec, ["a", "b", "c"]) == [None, None, None]
    assert len(t.errors) == 3


def test_llm_teacher_needs_key(spec):
    t = LLMTeacher("claude-haiku-4-5-20251001")
    assert t.label(spec, ["x"]) == [None]
    assert "ANTHROPIC_API_KEY" in t.errors[0]


def test_llm_client_rejects_non_claude():
    with pytest.raises(TeacherError, match="only Anthropic"):
        LLMClient("gpt-5")


def test_make_teacher(spec):
    def with_teacher(**kw):
        return spec.model_copy(update={"teacher": spec.teacher.model_copy(update=kw)})

    assert isinstance(make_teacher(spec), CSVTeacher)  # the example spec (PoC: offline labels)
    assert isinstance(make_teacher(with_teacher(kind="llm", model="claude-haiku-4-5-20251001")), LLMTeacher)
    with pytest.raises(TeacherError, match="M7"):
        make_teacher(with_teacher(kind="jev"))


# --- synth ---


def test_synth_plan(spec):
    batches = synth.plan(spec, 200, seed=42)
    assert sum(b.count for b in batches) == 200
    per_label = {lab: sum(b.count for b in batches if b.label == lab) for lab in spec.labels}
    assert per_label == {"ok": 67, "spam": 67, "toxic": 66}
    border = sum(b.count for b in batches if b.borderline_with)
    assert 0.28 <= border / 200 <= 0.32
    assert all(b.borderline_with != b.label for b in batches)
    assert batches == synth.plan(spec, 200, seed=42)


def test_synth_generate_is_cached_and_drops_intent(spec):
    n = {"i": 0}

    def reply(req):
        n["i"] += 1
        return "end_turn", {"inputs": [f"comment {n['i']}-{j}" for j in range(3)] + ["  "]}

    s = spec.model_copy(update={"data": spec.data.model_copy(update={"synthetic": 60})})
    client = FakeAnthropic(reply)
    llm = LLMClient("claude-haiku-4-5-20251001", client=client)
    first = synth.generate(s, llm=llm, workers=1)
    calls = len(client.requests)
    assert calls == len(synth.plan(s, 60, s.seed))
    assert all(ex.source == "synthetic" and ex.label is None for ex in first)
    assert all(ex.text.strip() for ex in first)
    assert client.requests[0]["temperature"] == 1.0
    second = synth.generate(s, llm=llm, workers=1)
    assert len(client.requests) == calls
    assert [e.text for e in first] == [e.text for e in second]
