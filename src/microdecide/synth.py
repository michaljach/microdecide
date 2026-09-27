"""LLM-generated synthetic inputs, per label, with explicit diversity axes (docs/SPEC.md §4.1).

The label a batch was generated *for* is discarded: the teacher labels every input
independently, so generator intent never leaks into the training labels."""

from __future__ import annotations

import random
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass

from microdecide.data import Example
from microdecide.spec import TaskSpec
from microdecide.teachers.base import TeacherError
from microdecide.teachers.cache import DiskCache
from microdecide.teachers.llm import LLMClient

BATCH = 20
BORDERLINE_FRACTION = 0.3
AXES = {
    "length": ["a few words", "one short sentence", "two or three sentences", "a longer paragraph"],
    "tone": ["casual", "formal", "enthusiastic", "frustrated", "sarcastic", "deadpan"],
    "style": ["clean writing", "typos and little punctuation", "some ALL CAPS", "emoji", "internet slang"],
    "obfuscation": ["none", "none", "odd spellings or leetspeak", "spaced or punctuated letters"],
}
SCHEMA = {
    "type": "object",
    "properties": {"inputs": {"type": "array", "items": {"type": "string"}}},
    "required": ["inputs"],
    "additionalProperties": False,
}


@dataclass(frozen=True)
class Batch:
    label: str
    count: int
    axes: tuple[tuple[str, str], ...]
    borderline_with: str | None  # the other label a moderator might hesitate on


def plan(spec: TaskSpec, n: int, seed: int) -> list[Batch]:
    """Deterministic batch plan: n split evenly over labels, ~30% borderline per label."""
    rng = random.Random(seed)
    labels = spec.labels
    batches = []
    for i, label in enumerate(labels):
        per_label = n // len(labels) + (i < n % len(labels))
        n_border = round(per_label * BORDERLINE_FRACTION)
        for want, border in ((per_label - n_border, False), (n_border, True)):
            while want > 0:
                count = min(BATCH, want)
                axes = tuple((k, rng.choice(v)) for k, v in AXES.items())
                other = rng.choice([x for x in labels if x != label]) if border else None
                batches.append(Batch(label, count, axes, other))
                want -= count
    return batches


def system_prompt(spec: TaskSpec) -> str:
    labels = "\n".join(f"- {k}: {v}" for k, v in spec.output.labels.items())
    return (
        "You write realistic, varied synthetic inputs for training a small classifier.\n\n"
        f"Task: {spec.description.strip()}\n\nLabels:\n{labels}\n\n"
        f"Inputs are English text of at most {spec.input.max_chars} characters. "
        "Make every input distinct: different openings, topics, names, and wording. "
        "Return only the inputs."
    )


def batch_prompt(spec: TaskSpec, b: Batch) -> str:
    desc = spec.output.labels[b.label]
    axes = "\n".join(f"- {k}: {v}" for k, v in b.axes)
    border = ""
    if b.borderline_with:
        border = (
            f"\nMake them borderline: realistic cases where a careful moderator could hesitate between "
            f"'{b.label}' and '{b.borderline_with}', but would still choose '{b.label}'."
        )
    return f"Write {b.count} inputs that should be labeled '{b.label}' ({desc}).\nStyle for this batch:\n{axes}{border}"


def generate(spec: TaskSpec, llm: LLMClient | None = None, cache: DiskCache | None = None, workers: int = 4) -> list[Example]:
    model = spec.data.synth_model or spec.teacher.model
    if llm is None:
        if not model:
            raise TeacherError("data.synthetic > 0 needs data.synth_model (or teacher.model)")
        llm = LLMClient(model, max_tokens=8000)
    cache = cache or DiskCache()
    system = system_prompt(spec)

    def run(b: Batch) -> list[str]:
        user = batch_prompt(spec, b)
        key = DiskCache.key("synth", llm.model, system, user)
        hit = cache.get(key)
        if hit is not None:
            return hit
        texts = [t.strip() for t in llm.json(system, user, SCHEMA, temperature=1.0)["inputs"] if t.strip()]
        cache.put(key, texts)
        return texts

    batches = plan(spec, spec.data.synthetic, spec.seed)
    with ThreadPoolExecutor(workers) as pool:
        results = list(pool.map(run, batches))
    return [Example(text=t, source="synthetic") for texts in results for t in texts]
