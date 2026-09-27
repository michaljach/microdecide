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


def tiny_static_model(dim: int = 32, int8: bool = True):
    """A real model2vec StaticModel over a small word vocab: no download, save/load works."""
    from model2vec import StaticModel
    from tokenizers import Tokenizer, models, pre_tokenizers

    words = sorted({w for t in TOY_TEXTS for w in t.lower().replace(",", " ").replace("!", " ").split()})
    vocab = {"[UNK]": 0, "[PAD]": 1, **{w: i + 2 for i, w in enumerate(words)}}
    tok = Tokenizer(models.WordLevel(vocab, unk_token="[UNK]"))
    tok.pre_tokenizer = pre_tokenizers.Whitespace()
    rng = np.random.default_rng(0)
    vectors = rng.normal(size=(len(vocab), dim)).astype(np.float32)
    for w, i in vocab.items():  # make label-ish words point in consistent directions
        if w in {"buy", "cheap", "followers", "discount", "click", "casino", "loans"}:
            vectors[i, 0] += 4
        if w in {"idiot", "moron", "loser", "stupid", "clown", "pathetic"}:
            vectors[i, 1] += 4
    if int8:  # like real runs (train.EMBEDDING_DTYPE): global-scale symmetric int8
        vectors = np.clip(np.rint(vectors / (np.abs(vectors).max() / 127)), -127, 127).astype(np.int8)
    return StaticModel(vectors=vectors, tokenizer=tok, normalize=True, config={"normalize": True})


_OK = ["great update thanks", "love the dark mode", "does export support csv", "sync broke on android please fix",
       "nice post about remote work", "is there a linux version", "the new sidebar is confusing", "thanks for the changelog"]
_SPAM = ["buy cheap followers now", "click here for discount", "cheap casino bonus click", "fast loans buy now",
         "buy followers cheap discount", "click for cheap loans", "casino discount click now", "buy cheap stuff click"]
_TOXIC = ["you are an idiot", "shut up loser", "what a moron", "stupid clown team", "pathetic idiot devs",
          "you stupid loser", "moron clown author", "pathetic stupid post"]
TOY_TEXTS = _OK + _SPAM + _TOXIC
TOY_ROWS = (
    [(t, "ok") for t in _OK] + [(t, "spam") for t in _SPAM] + [(t, "toxic") for t in _TOXIC]
)


def tiny_encoder_dir(path):
    """A 1-layer, 16-dim BERT + WordPiece tokenizer over the toy vocab, saved locally (no download)."""
    from transformers import BertConfig, BertModel, BertTokenizerFast

    words = sorted({w for t in TOY_TEXTS for w in t.split()})
    path.mkdir(parents=True, exist_ok=True)
    (path / "vocab.txt").write_text("\n".join(["[PAD]", "[UNK]", "[CLS]", "[SEP]", "[MASK]", *words]) + "\n")
    tok = BertTokenizerFast(vocab_file=str(path / "vocab.txt"), do_lower_case=True)
    import torch

    torch.manual_seed(0)
    cfg = BertConfig(vocab_size=len(words) + 5, hidden_size=16, num_hidden_layers=1, num_attention_heads=2,
                     intermediate_size=32, max_position_embeddings=512)
    BertModel(cfg).save_pretrained(path)
    tok.save_pretrained(path)
    return path


@pytest.fixture
def toy_run(tmp_path, spec, monkeypatch):
    """A labeled dataset of the toy rows (4x, with suffixes) + the tiny encoder patched into training."""
    from microdecide import data, encoder, static

    rows, splits = [], ["train"] * 6 + ["val", "test"]
    for rep in range(4):
        for i, (text, label) in enumerate(TOY_ROWS):
            split = splits[i % len(splits)] if rep else "train"
            rows.append({"text": f"{text} {'!' * rep}".strip(), "source": "synthetic", "label": label,
                         "confidence": 0.95, "teacher": "fake", "probabilities": {}, "split": split})
    runs = tmp_path / "runs"
    data.write_jsonl(data.data_dir(spec, runs) / "labeled.jsonl", rows)
    model = tiny_static_model()
    monkeypatch.setattr(static, "load_encoder", lambda base, quantize_to=None: model)
    monkeypatch.setattr(static, "CANDIDATES", (("tiny-a", 0.1), ("tiny-b", 0.2)))
    monkeypatch.setattr(encoder, "CANDIDATES", ((str(tiny_encoder_dir(tmp_path / "tiny-bert")), 0.15),))
    return runs


