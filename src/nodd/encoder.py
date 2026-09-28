"""Encoder tier: small sentence encoder fine-tuned with a sequence-classification head.

Standard `*ForSequenceClassification` architectures so the ONNX export runs in transformers.js
unchanged. Trains on CPU in well under a minute for ~1k examples."""

from __future__ import annotations

import json
import os
import time
from pathlib import Path

import numpy as np

# (base, estimated q8 download MB ≈ params + tokenizer), smallest first; without model.base,
# train.best_fit picks among those within budget
CANDIDATES = (
    ("sentence-transformers/paraphrase-MiniLM-L3-v2", 18.4),
    ("sentence-transformers/all-MiniLM-L6-v2", 23.7),
    ("BAAI/bge-small-en-v1.5", 34.4),
)
MAX_TOKENS = 256
EPOCHS = 6
LR = 1e-4
BATCH = 32
WARMUP = 0.1


def device() -> str:
    return os.environ.get("NODD_DEVICE", "cpu")  # cpu = reproducible; "mps"/"cuda" to speed up


class EncoderClassifier:
    tier = "encoder"

    def __init__(self, model, tokenizer, labels: list[str], max_tokens: int = MAX_TOKENS):
        self.model = model.eval()
        self.tokenizer = tokenizer
        self.labels = labels
        self.max_tokens = max_tokens

    def encode(self, texts: list[str]):
        return self.tokenizer(
            list(texts), padding=True, truncation=True, max_length=self.max_tokens, return_tensors="pt"
        )

    def logits(self, texts: list[str], batch: int = 64) -> np.ndarray:
        import torch

        out = []
        with torch.no_grad():
            for i in range(0, len(texts), batch):
                enc = self.encode(texts[i : i + batch]).to(self.model.device)
                out.append(self.model(**enc).logits.float().cpu().numpy())
        return np.concatenate(out) if out else np.zeros((0, len(self.labels)))

    def download_mb(self) -> float:
        """Estimate for the q8 ONNX export: ~1 byte per parameter + tokenizer."""
        return sum(p.numel() for p in self.model.parameters()) / 1e6 + 1.0

    def save(self, out: Path) -> None:
        self.model.save_pretrained(out / "encoder")
        self.tokenizer.save_pretrained(out / "encoder")
        (out / "encoder" / "nodd.json").write_text(json.dumps({"labels": self.labels, "max_tokens": self.max_tokens}))

    @classmethod
    def load(cls, run_dir: Path) -> EncoderClassifier:
        from transformers import AutoModelForSequenceClassification, AutoTokenizer

        d = run_dir / "encoder"
        meta = json.loads((d / "nodd.json").read_text())
        model = AutoModelForSequenceClassification.from_pretrained(d)
        return cls(model, AutoTokenizer.from_pretrained(d), meta["labels"], meta["max_tokens"])


def fit(base: str, data: dict, labels: list[str], seed: int, log) -> tuple[EncoderClassifier, dict]:
    """Fine-tune `base`; keep the epoch with the best val macro F1."""
    import torch
    from sklearn.metrics import f1_score
    from transformers import AutoModelForSequenceClassification, AutoTokenizer
    from transformers.utils import logging as hf_logging

    hf_logging.set_verbosity_error()
    torch.manual_seed(seed)
    rng = np.random.RandomState(seed)
    dev = device()
    tokenizer = AutoTokenizer.from_pretrained(base)
    model = AutoModelForSequenceClassification.from_pretrained(
        base,
        num_labels=len(labels),
        id2label=dict(enumerate(labels)),
        label2id={k: i for i, k in enumerate(labels)},
    ).to(dev)
    clf = EncoderClassifier(model, tokenizer, labels)
    (tx, y, w), (vx, yv, _) = data["train"], data["val"]
    steps_per_epoch = (len(tx) + BATCH - 1) // BATCH
    total = EPOCHS * steps_per_epoch
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=0.01)
    sched = torch.optim.lr_scheduler.LambdaLR(
        opt, lambda s: min(1.0, (s + 1) / max(1, WARMUP * total)) * max(0.0, (total - s) / total)
    )
    y_t, w_t = torch.tensor(y), torch.tensor(w, dtype=torch.float32)
    history, best = [], (-1.0, None, 0)
    t0 = time.perf_counter()
    for epoch in range(EPOCHS):
        model.train()
        order = rng.permutation(len(tx))
        for i in range(0, len(order), BATCH):
            idx = order[i : i + BATCH]
            enc = clf.encode([tx[j] for j in idx]).to(dev)
            loss = torch.nn.functional.cross_entropy(model(**enc).logits, y_t[idx].to(dev), reduction="none")
            (loss * w_t[idx].to(dev)).mean().backward()  # teacher confidence as sample weight
            opt.step()
            sched.step()
            opt.zero_grad()
        model.eval()
        f1 = float(f1_score(yv, clf.logits(vx).argmax(1), average="macro", labels=list(range(len(labels))), zero_division=0))
        history.append(round(f1, 4))
        log(f"  epoch {epoch + 1}/{EPOCHS}: val macro F1 {f1:.3f} ({time.perf_counter() - t0:.0f}s)")
        if f1 > best[0]:
            best = (f1, {k: v.detach().clone() for k, v in model.state_dict().items()}, epoch + 1)
    model.load_state_dict(best[1])
    model.to("cpu").eval()
    info = {
        "val_macro_f1": round(best[0], 4),
        "best_epoch": best[2],
        "val_macro_f1_by_epoch": history,
        "epochs": EPOCHS,
        "lr": LR,
        "batch": BATCH,
        "max_tokens": MAX_TOKENS,
        "device": dev,
    }
    return EncoderClassifier(model, tokenizer, labels), info
