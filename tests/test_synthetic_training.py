"""Offline augmentation must never change or duplicate the baseline holdouts."""
import importlib.util
from pathlib import Path
import shutil

import numpy as np
import pytest

from nodd.data import normalize, read_jsonl, write_jsonl

MODULE = importlib.util.spec_from_file_location('train_synthetic', Path(__file__).parents[1] / 'scripts/train_synthetic.py')
synthetic = importlib.util.module_from_spec(MODULE)
MODULE.loader.exec_module(synthetic)


def setup_baseline(tmp_path, monkeypatch):
    (tmp_path / 'examples').mkdir()
    shutil.copy(synthetic.ROOT / 'examples/sentiment.yaml', tmp_path / 'examples/sentiment.yaml')
    baseline = tmp_path / 'runs/sentiment/v1'
    rows = [
        {'text': 'I tried the hotel on Tuesday and kept the receipt.', 'label': 'neutral', 'split': 'test'},
        {'text': 'A held-out validation example.', 'label': 'positive', 'split': 'val'},
        {'text': 'An existing training example.', 'label': 'negative', 'split': 'train'},
    ]
    write_jsonl(baseline / 'labeled.jsonl', rows)
    monkeypatch.setattr(synthetic, 'ROOT', tmp_path)
    return baseline, rows


def test_preserves_holdouts_and_is_reproducible(tmp_path, monkeypatch):
    baseline, original = setup_baseline(tmp_path, monkeypatch)
    def embed(texts):
        # The original test text is also in the generated pool: reject it and its prefix variants.
        return np.array([[1., 0.] if 'kept the receipt' in text or 'held-out' in text else [0., 1.] for text in texts])
    first, second = tmp_path / 'first', tmp_path / 'second'
    manifest = synthetic.prepare('sentiment', baseline, 1000, 42, embed, first)
    synthetic.prepare('sentiment', baseline, 1000, 42, embed, second)
    rows = read_jsonl(first / 'labeled.jsonl')
    assert (first / 'labeled.jsonl').read_bytes() == (second / 'labeled.jsonl').read_bytes()
    assert rows[:len(original)] == original
    assert all(row['split'] == 'train' for row in rows[len(original):])
    assert len({normalize(row['text']) for row in rows}) == len(rows)
    assert manifest['added_per_label'] == {'positive': 1000, 'neutral': 1000, 'negative': 1000}
    assert manifest['rejected']['neutral'] > 0
    assert not any('kept the receipt' in row['text'] for row in rows[len(original):])


def test_fails_if_holdout_filter_exhausts_pool(tmp_path, monkeypatch):
    baseline, _ = setup_baseline(tmp_path, monkeypatch)
    with pytest.raises(ValueError, match='survive holdout filtering'):
        synthetic.prepare('sentiment', baseline, 2, 42, lambda texts: np.ones((len(texts), 2)), tmp_path / 'out')
    assert not (tmp_path / 'out/labeled.jsonl').exists()
