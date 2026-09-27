import hashlib
from pathlib import Path

import numpy as np
import pytest

from microdecide.spec import load_spec

ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / "examples" / "comment_moderation.yaml"


def fake_embed(texts: list[str]) -> np.ndarray:
    """Hashed character-trigram bag: near-identical strings get cosine ≈ 1, no model download."""
    out = np.zeros((len(texts), 256), dtype=np.float32)
    for i, t in enumerate(texts):
        t = f"  {t.lower()}  "
        for j in range(len(t) - 2):
            out[i, int(hashlib.md5(t[j : j + 3].encode()).hexdigest(), 16) % 256] += 1
    return out


@pytest.fixture(autouse=True)
def _isolated_cache(tmp_path, monkeypatch):
    """Every test gets its own teacher cache; nothing touches the repo's .cache/."""
    monkeypatch.setenv("MICRODECIDE_CACHE_DIR", str(tmp_path / "cache"))
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)


@pytest.fixture
def spec():
    return load_spec(EXAMPLE)
