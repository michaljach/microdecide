"""Labels from a file (human labels, or labels produced offline). Looks inputs up by normalized text."""

from __future__ import annotations

import hashlib
from pathlib import Path

from microdecide.data import normalize, read_rows
from microdecide.spec import Decision, TaskSpec
from microdecide.teachers.base import TeacherError, make_decision, spread


class CSVTeacher:
    def __init__(self, path: str | Path):
        self.path = Path(path)
        self.name = f"csv:{self.path.name}"
        self._table: dict[str, tuple[str, float]] | None = None

    def fingerprint(self, spec: TaskSpec) -> str:
        return hashlib.sha256(self.path.read_bytes()).hexdigest()

    def _load(self, spec: TaskSpec) -> dict[str, tuple[str, float]]:
        if self._table is None:
            table = {}
            for i, row in enumerate(read_rows(self.path)):
                label = (row.get("label") or "").strip()
                if label not in spec.labels:
                    raise TeacherError(f"{self.path}: row {i + 1} has label {label!r} not in {spec.labels}")
                conf = float(row.get("confidence") or 1.0)
                if not 0 < conf <= 1:
                    raise TeacherError(f"{self.path}: row {i + 1} has confidence {conf} outside (0, 1]")
                table[normalize(row["text"])] = (label, conf)
            self._table = table
        return self._table

    def label(self, spec: TaskSpec, inputs: list[str]) -> list[Decision | None]:
        table = self._load(spec)
        out = []
        for text in inputs:
            hit = table.get(normalize(text))
            if hit is None:
                out.append(None)
                continue
            label, conf = hit
            out.append(make_decision(spec, self.name, label, spread(spec.labels, label, conf)))
        return out
