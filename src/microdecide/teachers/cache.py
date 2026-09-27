"""On-disk cache for teacher and generator calls. Re-running the pipeline must be free."""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

from microdecide.spec import Decision, TaskSpec
from microdecide.teachers.base import Teacher


def default_cache_dir() -> Path:
    return Path(os.environ.get("MICRODECIDE_CACHE_DIR", ".cache/microdecide"))


class DiskCache:
    def __init__(self, root: Path | None = None):
        self.root = Path(root) if root else default_cache_dir()

    @staticmethod
    def key(*parts: str) -> str:
        return hashlib.sha256(json.dumps(parts, ensure_ascii=False).encode()).hexdigest()

    def _path(self, key: str) -> Path:
        return self.root / key[:2] / f"{key}.json"

    def get(self, key: str):
        p = self._path(key)
        return json.loads(p.read_text()) if p.is_file() else None

    def put(self, key: str, value) -> None:
        p = self._path(key)
        p.parent.mkdir(parents=True, exist_ok=True)
        tmp = p.with_suffix(".tmp")
        tmp.write_text(json.dumps(value, ensure_ascii=False))
        tmp.replace(p)


class CachedTeacher:
    """Wraps a teacher: only inputs missing from the cache reach it."""

    def __init__(self, inner: Teacher, cache: DiskCache | None = None):
        self.inner = inner
        self.cache = cache or DiskCache()
        self.name = inner.name
        self.hits = 0
        self.calls = 0  # inputs actually sent to the inner teacher

    def fingerprint(self, spec: TaskSpec) -> str:
        return self.inner.fingerprint(spec)

    def label(self, spec: TaskSpec, inputs: list[str]) -> list[Decision | None]:
        fp = self.inner.fingerprint(spec)
        keys = [DiskCache.key("teacher", self.name, fp, text) for text in inputs]
        out: list[Decision | None] = [None] * len(inputs)
        missing = []
        for i, k in enumerate(keys):
            hit = self.cache.get(k)
            if hit is not None:
                out[i] = spec.check_decision(Decision.model_validate(hit))
                self.hits += 1
            else:
                missing.append(i)
        if missing:
            self.calls += len(missing)
            fresh = self.inner.label(spec, [inputs[i] for i in missing])
            for i, d in zip(missing, fresh):
                if d is not None:
                    out[i] = spec.check_decision(d)
                    self.cache.put(keys[i], d.model_dump())
        return out
