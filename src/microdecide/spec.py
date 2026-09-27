"""Task spec and Decision schema (docs/SPEC.md §2, §3)."""

from __future__ import annotations

import math
import re
from pathlib import Path
from typing import Literal

import yaml
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    ValidationError,
    ValidationInfo,
    field_validator,
    model_validator,
)

SLUG = r"^[a-z0-9][a-z0-9_-]*$"
LABEL = r"^[A-Za-z0-9][A-Za-z0-9_-]*$"
BOOLEAN_LABELS = ("true", "false")


class SpecError(ValueError):
    """A task spec that failed to load or validate. The message is user-facing."""


class _Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class InputSpec(_Strict):
    type: Literal["text"] = "text"
    max_chars: int = Field(2000, gt=0)


class OutputSpec(_Strict):
    type: Literal["choice", "boolean"]
    labels: dict[str, str]

    @field_validator("labels", mode="before")
    @classmethod
    def _stringify_keys(cls, v):
        # YAML parses `true:` / `false:` keys as booleans.
        if isinstance(v, dict):
            return {(str(k).lower() if isinstance(k, bool) else k): d for k, d in v.items()}
        return v

    @field_validator("labels")
    @classmethod
    def _check_labels(cls, v: dict[str, str], info: ValidationInfo) -> dict[str, str]:
        seen: dict[str, str] = {}
        for name, desc in v.items():
            if not re.match(LABEL, name):
                raise ValueError(f"label {name!r} must match {LABEL} (letters, digits, _ or -)")
            if not desc or not desc.strip():
                raise ValueError(f"label {name!r} needs a description (used in teacher prompts)")
            key = name.lower()
            if key in seen:
                raise ValueError(f"duplicate label {name!r} (clashes with {seen[key]!r})")
            seen[key] = name
        kind = info.data.get("type")
        if kind == "boolean" and sorted(v) != sorted(BOOLEAN_LABELS):
            raise ValueError(f"boolean output needs exactly labels 'true' and 'false', got {list(v)}")
        if kind == "choice" and len(v) < 2:
            raise ValueError(f"choice output needs at least 2 labels, got {len(v)}")
        return v


class ModelSpec(_Strict):
    tier: Literal["auto", "static", "encoder", "decoder"] = "auto"
    base: str | None = None
    quantization: Literal["q8", "q4"] = "q8"


class TeacherSpec(_Strict):
    kind: Literal["llm", "jev", "csv"]
    model: str | None = None
    path: Path | None = None  # labeled CSV for kind=csv

    @model_validator(mode="after")
    def _check_kind(self) -> TeacherSpec:
        if self.kind == "csv" and self.path is None:
            raise ValueError("teacher.kind 'csv' needs teacher.path (a labeled CSV)")
        if self.kind == "llm" and not self.model:
            raise ValueError("teacher.kind 'llm' needs teacher.model")
        return self


class DataSpec(_Strict):
    seed_examples: Path | None = None
    unlabeled: Path | None = None
    synthetic: int = Field(0, ge=0)


class Targets(_Strict):
    min_macro_f1: float = Field(0.9, gt=0, le=1)
    deploy: Literal["browser", "node", "python"] = "browser"
    max_download_mb: float = Field(150, gt=0)
    max_latency_ms: float = Field(100, gt=0)


class Escalation(_Strict):
    target_precision: float = Field(0.97, gt=0, le=1)


class TaskSpec(_Strict):
    task: str = Field(pattern=SLUG)
    description: str = Field(min_length=1)
    input: InputSpec = InputSpec()
    output: OutputSpec
    model: ModelSpec = ModelSpec()
    teacher: TeacherSpec
    data: DataSpec = DataSpec()
    targets: Targets = Targets()
    escalation: Escalation = Escalation()

    @property
    def labels(self) -> list[str]:
        return list(self.output.labels)

    def check_decision(self, d: Decision) -> Decision:
        """Raise if a decision uses labels outside this spec's label set."""
        allowed = set(self.labels)
        if d.label not in allowed or set(d.probabilities) != allowed:
            raise ValueError(
                f"decision labels {sorted(d.probabilities)} / {d.label!r} don't match spec labels {sorted(allowed)}"
            )
        return d


class Decision(_Strict):
    label: str
    probabilities: dict[str, float]
    confidence: float = Field(ge=0, le=1)
    escalated: bool = False
    source: Literal["micro", "teacher"]
    model: str
    latency_ms: float = Field(0.0, ge=0)

    @model_validator(mode="after")
    def _check(self) -> Decision:
        if self.label not in self.probabilities:
            raise ValueError(f"label {self.label!r} not in probabilities {sorted(self.probabilities)}")
        if any(not 0 <= p <= 1 for p in self.probabilities.values()):
            raise ValueError("probabilities must be in [0, 1]")
        if not math.isclose(sum(self.probabilities.values()), 1.0, abs_tol=1e-3):
            raise ValueError(f"probabilities must sum to 1, got {sum(self.probabilities.values()):.4f}")
        return self


class _UniqueKeyLoader(yaml.SafeLoader):
    """SafeLoader that rejects duplicate mapping keys (PyYAML silently keeps the last one)."""

    def construct_mapping(self, node, deep=False):
        seen = set()
        for key_node, _ in node.value:
            key = self.construct_object(key_node, deep=deep)
            if key in seen:
                raise SpecError(f"duplicate key {key!r} at line {key_node.start_mark.line + 1}")
            seen.add(key)
        return super().construct_mapping(node, deep=deep)


# YAML 1.2 booleans only: keep `yes`/`no`/`on`/`off` as strings so they work as labels.
_UniqueKeyLoader.yaml_implicit_resolvers = {
    ch: [(tag, rx) for tag, rx in resolvers if tag != "tag:yaml.org,2002:bool"]
    for ch, resolvers in yaml.SafeLoader.yaml_implicit_resolvers.items()
}
_UniqueKeyLoader.add_implicit_resolver(
    "tag:yaml.org,2002:bool", re.compile(r"^(?:true|True|TRUE|false|False|FALSE)$"), list("tTfF")
)


def _format_errors(e: ValidationError) -> str:
    lines = []
    for err in e.errors():
        loc = ".".join(str(p) for p in err["loc"]) or "<root>"
        msg = err["msg"].removeprefix("Value error, ")
        lines.append(f"  {loc}: {msg}")
    return "\n".join(lines)


def parse_spec(text: str, source: str = "<string>") -> TaskSpec:
    try:
        raw = yaml.load(text, Loader=_UniqueKeyLoader)
    except SpecError as e:
        raise SpecError(f"{source}: {e}") from None
    except yaml.YAMLError as e:
        raise SpecError(f"{source}: invalid YAML: {e}") from None
    if not isinstance(raw, dict):
        raise SpecError(f"{source}: expected a mapping at the top level")
    try:
        return TaskSpec.model_validate(raw)
    except ValidationError as e:
        raise SpecError(f"{source}: invalid task spec\n{_format_errors(e)}") from None


def load_spec(path: str | Path) -> TaskSpec:
    path = Path(path)
    if not path.is_file():
        raise SpecError(f"{path}: file not found")
    return parse_spec(path.read_text(), source=str(path))


TEMPLATE = """\
task: {task}
description: >
  Describe the one decision this model makes.
input:
  type: text
  max_chars: 2000
output:
  type: choice              # choice | boolean (labels: true, false)
  labels:
    label_a: Describe when this label applies.
    label_b: Describe when this label applies.
model:
  tier: auto                # auto | static | encoder | decoder
  base: null                # override base model id
  quantization: q8          # q8 | q4 (decoder only)
teacher:
  kind: llm                 # llm | jev | csv
  model: claude-haiku-4-5-20251001
data:
  seed_examples: null       # optional CSV/JSONL (text[,label])
  unlabeled: null           # optional CSV/JSONL of real inputs
  synthetic: 1000
targets:
  min_macro_f1: 0.90
  deploy: browser           # browser | node | python
  max_download_mb: 150
  max_latency_ms: 100
escalation:
  target_precision: 0.97
"""


def render_template(task: str) -> str:
    text = TEMPLATE.format(task=task)
    parse_spec(text, source="template")  # the template must always be valid
    return text
