"""Versioned on-disk contracts. JSON Schema is also consumed by the browser loader.

Regenerate web/src/model.schema.json with scripts/generate_fixtures.py --schema-only.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, model_validator
from microdecide.spec import TaskSpec


class Artifact(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)


class OnnxRef(Artifact):
    file: str
    fp32_file: str | None = None
    dtype: str | None = None
    inputs: list[str]
    output: str


class Tokenizer(Artifact):
    file: str
    add_special_tokens: bool
    max_tokens: int = Field(gt=0)


class StaticTokenizer(Tokenizer):
    median_token_length: int = Field(gt=0)
    drop_token_ids: list[int]


class EncoderTokenizer(Tokenizer):
    truncation: bool


class Embeddings(Artifact):
    embeddings: str
    dtype: Literal["int8"]


class Head(Artifact):
    coef: list[list[float]]
    intercept: list[float]


class BaseConfig(Artifact):
    format: Literal["microdecide"]
    format_version: Literal[2]
    model: str
    labels: list[str]
    temperature: float = Field(gt=0)
    threshold: float = Field(ge=0, le=1.0 + 1e-9)
    max_chars: int = Field(gt=0)

    @model_validator(mode="after")
    def unique_labels(self):
        if len(set(self.labels)) != len(self.labels):
            raise ValueError("labels must be unique")
        return self


class StaticConfig(BaseConfig):
    tier: Literal["static"]
    kind: Literal["base"] | None = None
    onnx: OnnxRef | None = None
    normalize: bool
    dim: int = Field(gt=0)
    vocab_size: int = Field(gt=0)
    tokenizer: StaticTokenizer
    static: Embeddings
    head: Head

    @model_validator(mode="after")
    def head_shape(self):
        if len(self.head.coef) != len(self.labels) or len(self.head.intercept) != len(self.labels):
            raise ValueError("head rows must match labels")
        if any(len(row) != self.dim for row in self.head.coef):
            raise ValueError("head columns must match embedding dimension")
        if not self.labels and self.kind != "base":
            raise ValueError("only embedding bases may have no labels")
        if any(i < 0 or i >= self.vocab_size for i in self.tokenizer.drop_token_ids):
            raise ValueError("drop token id is outside vocabulary")
        return self


class EncoderConfig(BaseConfig):
    tier: Literal["encoder"]
    labels: list[str] = Field(min_length=2)
    tokenizer: EncoderTokenizer
    onnx: OnnxRef


MODEL_CONFIG = TypeAdapter(Annotated[StaticConfig | EncoderConfig, Field(discriminator="tier")])


def read_config(path: Path) -> dict:
    return MODEL_CONFIG.validate_json(path.read_text()).model_dump(mode="json", exclude_none=True)


def write_config(path: Path, value: dict) -> None:
    config = MODEL_CONFIG.validate_python(value)
    path.write_text(config.model_dump_json(exclude_none=True))


class ModelCard(BaseModel):
    # Training/evaluation metadata is extensible; the runtime fields are stable.
    model_config = ConfigDict(extra="allow", allow_inf_nan=False)
    artifact_version: Literal[1] = 1  # missing in legacy cards
    model: str
    tier: Literal["static", "encoder"]
    labels: list[str] = Field(min_length=2)
    temperature: float = Field(gt=0)
    threshold: float = Field(ge=0, le=1.0 + 1e-9)
    spec: TaskSpec

    @model_validator(mode="after")
    def labels_match_spec(self):
        if self.labels != self.spec.labels:
            raise ValueError("model card labels must match the task label order")
        return self


def read_card(path: Path) -> dict:
    return ModelCard.model_validate_json(path.read_text()).model_dump(mode="json")


def write_card(path: Path, value: dict) -> None:
    path.write_text(json.dumps(ModelCard.model_validate(value).model_dump(mode="json"), indent=2))
