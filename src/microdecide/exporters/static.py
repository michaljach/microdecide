"""Static embedding artifacts, ONNX graph, and reference inference."""

from __future__ import annotations
import json
import shutil
from pathlib import Path
from typing import cast
import numpy as np
from microdecide.calibrate import softmax
from microdecide.runtime import Runtime
from microdecide.static import StaticClassifier
from microdecide.artifacts import read_config
from microdecide.exporters.common import ExportError, Probs, FORMAT, FORMAT_VERSION, STATIC_MAX_TOKENS, _mb, _write_config

def _export_static(rt: Runtime, run_dir: Path, out: Path, config: dict) -> tuple[dict[str, Probs], str, dict]:
    clf = cast(StaticClassifier, rt.model)
    enc = clf.encoder
    if enc.token_mapping is not None or enc.weights is not None:
        raise ExportError("static export does not support token_mapping/weights yet")
    if enc.embedding.dtype != np.int8:
        raise ExportError(f"expected int8 embeddings, got {enc.embedding.dtype}")
    (out / "static").mkdir()
    labels = rt.labels
    config = {
        **config,
        "normalize": bool(enc.normalize),
        "dim": int(enc.dim),
        "vocab_size": int(enc.embedding.shape[0]),
        "tokenizer": {
            "file": "tokenizer.json",
            "add_special_tokens": False,
            "median_token_length": int(enc.median_token_length),
            "max_tokens": STATIC_MAX_TOKENS,
            "drop_token_ids": [int(enc.unk_token_id)] if enc.unk_token_id is not None else [],
        },
        "static": {"embeddings": "static/embeddings.i8", "dtype": "int8"},
        "onnx": {"file": "onnx/model_quantized.onnx", "inputs": ["input_ids", "attention_mask"], "output": "logits"},
        "head": {"coef": clf.coef.tolist(), "intercept": clf.intercept.tolist()},
    }
    _write_config(out, config)
    np.ascontiguousarray(enc.embedding).tofile(out / "static" / "embeddings.i8")
    shutil.copy(run_dir / "embeddings" / "tokenizer.json", out / "tokenizer.json")
    (out / "tokenizer_config.json").write_text(
        json.dumps({"tokenizer_class": "BertTokenizer", "do_lower_case": True, "model_max_length": STATIC_MAX_TOKENS})
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
    build_static_onnx(enc.embedding, clf.coef, clf.intercept, out / "onnx" / "model_quantized.onnx")
    common = [out / "tokenizer.json", out / "microdecide.json"]
    download = {
        "static_download_mb": _mb(out / "static" / "embeddings.i8", *common),
        "onnx_download_mb": _mb(out / "onnx" / "model_quantized.onnx", *common),
    }
    return (
        {"static": lambda t: reference_probabilities(out, t), "onnx": lambda t: static_onnx_probabilities(out, t)},
        "static",
        download,
    )


def export_base(base: str, out: str | Path, max_chars: int = 2000, log=print) -> Path:
    """A static embedding base without a head, for training in the browser (web playground):
    same files and format as a static-tier export, with labels [] and an empty head."""
    from microdecide.static import load_encoder

    out = Path(out)
    enc = load_encoder(base)
    if out.exists():
        shutil.rmtree(out)
    (out / "static").mkdir(parents=True)
    config = {
        "format": FORMAT,
        "format_version": FORMAT_VERSION,
        "tier": "static",
        "kind": "base",
        "model": base,
        "labels": [],
        "temperature": 1.0,
        "threshold": 1.0,
        "max_chars": max_chars,
        "normalize": bool(enc.normalize),
        "dim": int(enc.dim),
        "vocab_size": int(enc.embedding.shape[0]),
        "tokenizer": {
            "file": "tokenizer.json",
            "add_special_tokens": False,
            "median_token_length": int(enc.median_token_length),
            "max_tokens": STATIC_MAX_TOKENS,
            "drop_token_ids": [int(enc.unk_token_id)] if enc.unk_token_id is not None else [],
        },
        "static": {"embeddings": "static/embeddings.i8", "dtype": "int8"},
        "head": {"coef": [], "intercept": []},
    }
    _write_config(out, config)
    np.ascontiguousarray(enc.embedding).tofile(out / "static" / "embeddings.i8")
    tmp = out / ".tok"
    enc.save_pretrained(tmp)
    shutil.copy(tmp / "tokenizer.json", out / "tokenizer.json")
    shutil.rmtree(tmp)
    (out / "tokenizer_config.json").write_text(
        json.dumps({"tokenizer_class": "BertTokenizer", "do_lower_case": True, "model_max_length": STATIC_MAX_TOKENS})
    )
    log(f"base {base} → {out} ({_mb(out / 'static' / 'embeddings.i8', out / 'tokenizer.json')} MB)")
    return out


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
    config = read_config(export_dir / "microdecide.json")
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


def static_onnx_probabilities(export_dir: str | Path, texts: list[str]) -> np.ndarray:
    import onnxruntime as ort

    export_dir = Path(export_dir)
    config = read_config(export_dir / "microdecide.json")
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


def build_static_onnx(table: np.ndarray, coef: np.ndarray, intercept: np.ndarray, path: Path) -> None:
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
    model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 17)], producer_name="microdecide")
    model.ir_version = 8  # widely supported by onnxruntime-web
    onnx.checker.check_model(model)
    onnx.save(model, str(path))
