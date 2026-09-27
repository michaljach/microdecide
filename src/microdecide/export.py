"""Browser-first export (docs/SPEC.md §4.7).

Static tier → one folder, transformers.js layout, two interchangeable formats:
  microdecide.json          runtime config: labels, temperature, threshold, head, tokenizer rules
  tokenizer.json            HF tokenizer (+ tokenizer_config.json, config.json)
  static/embeddings.i8      int8 embedding table, row-major [vocab, dim] — plain JS, no ONNX runtime
  onnx/model_quantized.onnx input_ids + attention_mask → logits (onnxruntime-web: WASM / WebGPU)

`reference_probabilities` re-implements inference from the exported files only; it is the
spec the JS runtime must match."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np

from microdecide.calibrate import softmax
from microdecide.data import read_jsonl, write_jsonl
from microdecide.runtime import Runtime

FORMAT = "microdecide-static"
FORMAT_VERSION = 1
MAX_TOKENS = 512  # model2vec default max_length
OPSET = 17
MAX_F1_DROP = 0.02


class ExportError(RuntimeError):
    pass


def export(run_dir: str | Path, out: str | Path | None = None, log=print) -> dict:
    run_dir = Path(run_dir)
    out = Path(out) if out else run_dir / "export"
    rt = Runtime.load(run_dir)
    card = rt.card
    enc = rt.model.encoder
    if enc.token_mapping is not None or enc.weights is not None:
        raise ExportError("static export does not support token_mapping/weights yet")
    if enc.embedding.dtype != np.int8:
        raise ExportError(f"expected int8 embeddings, got {enc.embedding.dtype}")

    if out.exists():
        shutil.rmtree(out)
    (out / "static").mkdir(parents=True)
    (out / "onnx").mkdir()

    labels = rt.labels
    config = {
        "format": FORMAT,
        "format_version": FORMAT_VERSION,
        "model": card["model"],
        "labels": labels,
        "temperature": rt.temperature,
        "threshold": rt.threshold,
        "max_chars": rt.max_chars,
        "normalize": bool(enc.normalize),
        "dim": int(enc.dim),
        "vocab_size": int(enc.embedding.shape[0]),
        "tokenizer": {
            "file": "tokenizer.json",
            "add_special_tokens": False,
            "median_token_length": int(enc.median_token_length),
            "max_tokens": MAX_TOKENS,
            "drop_token_ids": [int(enc.unk_token_id)] if enc.unk_token_id is not None else [],
        },
        "static": {"embeddings": "static/embeddings.i8", "dtype": "int8"},
        "onnx": {"file": "onnx/model_quantized.onnx", "inputs": ["input_ids", "attention_mask"], "output": "logits"},
        "head": {"coef": rt.model.coef.tolist(), "intercept": rt.model.intercept.tolist()},
    }
    (out / "microdecide.json").write_text(json.dumps(config))
    np.ascontiguousarray(enc.embedding).tofile(out / "static" / "embeddings.i8")
    shutil.copy(run_dir / "embeddings" / "tokenizer.json", out / "tokenizer.json")
    (out / "tokenizer_config.json").write_text(
        json.dumps({"tokenizer_class": "BertTokenizer", "do_lower_case": True, "model_max_length": MAX_TOKENS})
    )
    (out / "config.json").write_text(
        json.dumps(
            {
                "model_type": "microdecide-static",
                "architectures": ["MicroDecideStatic"],
                "id2label": dict(enumerate(labels)),
                "label2id": {k: i for i, k in enumerate(labels)},
                "hidden_size": int(enc.dim),
                "vocab_size": int(enc.embedding.shape[0]),
            }
        )
    )
    build_onnx(enc.embedding, rt.model.coef, rt.model.intercept, out / "onnx" / "model_quantized.onnx")

    # parity: training-time model vs exported static format vs exported ONNX, on the test split
    test = [r for r in read_jsonl(run_dir / "labeled.jsonl") if r["split"] == "test"]
    texts = [r["text"] for r in test]
    y = np.array([labels.index(r["label"]) for r in test])
    p_model = rt.probabilities(texts)
    p_static = reference_probabilities(out, texts)
    p_onnx = onnx_probabilities(out, texts)
    parity = {
        "n": len(texts),
        "static": _compare(p_model, p_static, y),
        "onnx": _compare(p_model, p_onnx, y),
    }
    write_jsonl(
        out / "parity.jsonl",
        ({"text": t, "label": labels[int(p.argmax())], "probabilities": dict(zip(labels, map(float, p)))} for t, p in zip(texts, p_model)),
    )

    sizes = {
        "static_download_mb": _mb(out / "static" / "embeddings.i8", out / "tokenizer.json", out / "microdecide.json"),
        "onnx_download_mb": _mb(out / "onnx" / "model_quantized.onnx", out / "tokenizer.json", out / "microdecide.json"),
    }
    export_card = {**card, "export": {"format": FORMAT, "format_version": FORMAT_VERSION, "parity": parity, **sizes}}
    (out / "model_card.json").write_text(json.dumps(export_card, indent=2))

    for name in ("static", "onnx"):
        if parity[name]["f1_drop"] > MAX_F1_DROP:
            raise ExportError(f"{name} export F1 dropped {parity[name]['f1_drop']:.3f} (> {MAX_F1_DROP})")
    log(
        f"exported → {out}  static {sizes['static_download_mb']} MB, onnx {sizes['onnx_download_mb']} MB; "
        f"label agreement static {parity['static']['label_agreement']:.2%}, onnx {parity['onnx']['label_agreement']:.2%}"
    )
    return export_card["export"]


def _mb(*files: Path) -> float:
    return round(sum(f.stat().st_size for f in files) / 1e6, 2)


def _compare(p_ref: np.ndarray, p: np.ndarray, y: np.ndarray) -> dict:
    from sklearn.metrics import f1_score

    f_ref = f1_score(y, p_ref.argmax(1), average="macro")
    f = f1_score(y, p.argmax(1), average="macro")
    return {
        "label_agreement": float((p_ref.argmax(1) == p.argmax(1)).mean()),
        "max_abs_prob_diff": float(np.abs(p_ref - p).max()),
        "macro_f1": float(f),
        "f1_drop": float(f_ref - f),
    }


# --- reference implementation over exported files (the JS runtime mirrors this) ---------------


class ExportedTokenizer:
    def __init__(self, export_dir: Path, config: dict):
        from tokenizers import Tokenizer

        self.tok = Tokenizer.from_file(str(export_dir / config["tokenizer"]["file"]))
        t = config["tokenizer"]
        self.max_chars = config["max_chars"]
        self.char_cap = t["max_tokens"] * t["median_token_length"]
        self.max_tokens = t["max_tokens"]
        self.drop = set(t["drop_token_ids"])

    def ids(self, text: str) -> list[int]:
        # Python slices by code point; the JS side must do the same (not UTF-16 units)
        text = text[: self.max_chars][: self.char_cap]
        ids = self.tok.encode(text, add_special_tokens=False).ids
        return [i for i in ids if i not in self.drop][: self.max_tokens]


def reference_probabilities(export_dir: str | Path, texts: list[str]) -> np.ndarray:
    export_dir = Path(export_dir)
    config = json.loads((export_dir / "microdecide.json").read_text())
    table = np.fromfile(export_dir / config["static"]["embeddings"], dtype=np.int8).reshape(config["vocab_size"], config["dim"])
    tok = ExportedTokenizer(export_dir, config)
    coef, intercept = np.array(config["head"]["coef"]), np.array(config["head"]["intercept"])
    emb = np.zeros((len(texts), config["dim"]))
    for i, text in enumerate(texts):
        ids = tok.ids(text)
        if ids:
            emb[i] = table[ids].astype(np.float64).mean(axis=0)
    if config["normalize"]:
        emb /= np.linalg.norm(emb, axis=1, keepdims=True) + 1e-32
    return softmax(emb @ coef.T + intercept, config["temperature"])


def onnx_probabilities(export_dir: str | Path, texts: list[str]) -> np.ndarray:
    import onnxruntime as ort

    export_dir = Path(export_dir)
    config = json.loads((export_dir / "microdecide.json").read_text())
    tok = ExportedTokenizer(export_dir, config)
    session = ort.InferenceSession(str(export_dir / config["onnx"]["file"]), providers=["CPUExecutionProvider"])
    ids = [tok.ids(t) for t in texts]
    width = max(1, max(map(len, ids)))
    input_ids = np.zeros((len(ids), width), dtype=np.int64)
    mask = np.zeros_like(input_ids)
    for i, row in enumerate(ids):
        input_ids[i, : len(row)] = row
        mask[i, : len(row)] = 1
    (logits,) = session.run(["logits"], {"input_ids": input_ids, "attention_mask": mask})
    return softmax(logits, config["temperature"])


def build_onnx(table: np.ndarray, coef: np.ndarray, intercept: np.ndarray, path: Path) -> None:
    """Masked mean of int8 embedding rows → L2 normalize → linear head. Outputs raw logits
    (temperature is applied by the runtime, like transformers.js sequence classifiers)."""
    import onnx
    from onnx import TensorProto, helper, numpy_helper

    F = TensorProto.FLOAT
    inits = [
        numpy_helper.from_array(np.ascontiguousarray(table), "embeddings"),
        numpy_helper.from_array(np.ascontiguousarray(coef.T.astype(np.float32)), "head_weight"),
        numpy_helper.from_array(intercept.astype(np.float32), "head_bias"),
        numpy_helper.from_array(np.array([-1], dtype=np.int64), "axis_last"),
        numpy_helper.from_array(np.array([1], dtype=np.int64), "axis_seq"),
        numpy_helper.from_array(np.array(1.0, dtype=np.float32), "one"),
        numpy_helper.from_array(np.array(1e-32, dtype=np.float32), "eps"),
    ]
    n = helper.make_node
    nodes = [
        n("Gather", ["embeddings", "input_ids"], ["tok_i8"]),
        n("Cast", ["tok_i8"], ["tok"], to=F),
        n("Unsqueeze", ["attention_mask", "axis_last"], ["mask3"]),
        n("Cast", ["mask3"], ["maskf"], to=F),
        n("Mul", ["tok", "maskf"], ["masked"]),
        n("ReduceSum", ["masked", "axis_seq"], ["summed"], keepdims=0),
        n("ReduceSum", ["maskf", "axis_seq"], ["count"], keepdims=0),
        n("Max", ["count", "one"], ["count1"]),
        n("Div", ["summed", "count1"], ["mean"]),
        n("Mul", ["mean", "mean"], ["sq"]),
        n("ReduceSum", ["sq", "axis_last"], ["sqsum"], keepdims=1),
        n("Sqrt", ["sqsum"], ["norm"]),
        n("Add", ["norm", "eps"], ["norm_eps"]),
        n("Div", ["mean", "norm_eps"], ["pooled"]),
        n("MatMul", ["pooled", "head_weight"], ["xw"]),
        n("Add", ["xw", "head_bias"], ["logits"]),
    ]
    graph = helper.make_graph(
        nodes,
        "microdecide_static",
        [
            helper.make_tensor_value_info("input_ids", TensorProto.INT64, ["batch", "seq"]),
            helper.make_tensor_value_info("attention_mask", TensorProto.INT64, ["batch", "seq"]),
        ],
        [helper.make_tensor_value_info("logits", F, ["batch", len(intercept)])],
        initializer=inits,
    )
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", OPSET)], producer_name="microdecide")
    model.ir_version = 8  # widely supported by onnxruntime-web
    onnx.checker.check_model(model)
    onnx.save(model, str(path))
