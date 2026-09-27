"""Browser-first export (docs/SPEC.md §4.7). One folder per model, transformers.js layout.

  microdecide.json            runtime config: tier, labels, temperature, threshold, tokenizer rules
  tokenizer.json              HF tokenizer (+ tokenizer_config.json, config.json)
  onnx/model_quantized.onnx   logits graph for onnxruntime-web / transformers.js (WASM / WebGPU)

static tier:  + static/embeddings.i8 (int8 table, plain JS, no ONNX runtime) + head in microdecide.json
encoder tier: + onnx/model.onnx (fp32); model_quantized.onnx is dynamic int8 (q8)

Every export runs a parity check (training-time model vs each exported artifact, test split) and
writes parity.jsonl — the exported artifact's predictions — for the browser parity page.
`reference_probabilities` re-implements static-tier inference from the exported files only;
it is the spec the JS static engine mirrors."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Callable

import numpy as np

from microdecide.calibrate import softmax
from microdecide.data import read_jsonl, write_jsonl
from microdecide.runtime import Runtime

FORMAT = "microdecide"
FORMAT_VERSION = 2
STATIC_MAX_TOKENS = 512  # model2vec default max_length
OPSET = 18
MAX_F1_DROP = 0.02

Probs = Callable[[list[str]], np.ndarray]


class ExportError(RuntimeError):
    pass


def export(run_dir: str | Path, out: str | Path | None = None, log=print) -> dict:
    run_dir = Path(run_dir)
    out = Path(out) if out else run_dir / "export"
    rt = Runtime.load(run_dir)
    if out.exists():
        shutil.rmtree(out)
    (out / "onnx").mkdir(parents=True)

    base_config = {
        "format": FORMAT,
        "format_version": FORMAT_VERSION,
        "tier": rt.card["tier"],
        "model": rt.card["model"],
        "labels": rt.labels,
        "temperature": rt.temperature,
        "threshold": rt.threshold,
        "max_chars": rt.max_chars,
    }
    if rt.card["tier"] == "static":
        artifacts, primary, download = _export_static(rt, run_dir, out, base_config)
    elif rt.card["tier"] == "encoder":
        artifacts, primary, download = _export_encoder(rt, run_dir, out, base_config, log)
    else:
        raise ValueError(f"unknown tier {rt.card['tier']!r}")

    _record_file_sizes(out)

    # parity: training-time model vs every exported artifact, on the test split
    test = [r for r in read_jsonl(run_dir / "labeled.jsonl") if r["split"] == "test"]
    texts = [r["text"] for r in test]
    y = np.array([rt.labels.index(r["label"]) for r in test])
    p_model = rt.probabilities(texts)
    probs = {name: fn(texts) for name, fn in artifacts.items()}
    parity = {"n": len(texts), **{name: _compare(p_model, p, y) for name, p in probs.items()}}
    write_jsonl(
        out / "parity.jsonl",
        (
            {"text": t, "label": rt.labels[int(p.argmax())], "probabilities": dict(zip(rt.labels, map(float, p)))}
            for t, p in zip(texts, probs[primary])
        ),
    )
    info = {"format": FORMAT, "format_version": FORMAT_VERSION, "parity": parity, "parity_reference": primary, **download}
    failed = [f"{n} export F1 dropped {parity[n]['f1_drop']:.3f} (> {MAX_F1_DROP})" for n in artifacts if parity[n]["f1_drop"] > MAX_F1_DROP]
    if failed:
        info["failed"] = "; ".join(failed)  # kept for inspection; web/scripts/sync-model.mjs skips it
    (out / "model_card.json").write_text(json.dumps({**rt.card, "export": info}, indent=2))
    if failed:
        raise ExportError(info["failed"])
    sizes = ", ".join(f"{k.removesuffix('_download_mb')} {v} MB" for k, v in download.items())
    agree = ", ".join(f"{k} {parity[k]['label_agreement']:.2%}" for k in artifacts)
    log(f"exported → {out}  {sizes}; label agreement vs training model: {agree}")
    return info


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


def _write_config(out: Path, config: dict) -> None:
    (out / "microdecide.json").write_text(json.dumps(config))


def _record_file_sizes(out: Path) -> None:
    """Add {relative path: bytes} of the model files to microdecide.json. The browser uses them as the
    download total: servers that gzip on the fly send no Content-Length, or the compressed one."""
    config = json.loads((out / "microdecide.json").read_text())
    config["files"] = {
        p.relative_to(out).as_posix(): p.stat().st_size
        for p in sorted(out.rglob("*"))
        if p.is_file() and p.name not in {"microdecide.json", "model_card.json", "parity.jsonl", "bench.json"}
    }
    _write_config(out, config)


# --- static tier ---------------------------------------------------------------------------


def _export_static(rt: Runtime, run_dir: Path, out: Path, config: dict) -> tuple[dict[str, Probs], str, dict]:
    enc = rt.model.encoder
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
        "head": {"coef": rt.model.coef.tolist(), "intercept": rt.model.intercept.tolist()},
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
    build_static_onnx(enc.embedding, rt.model.coef, rt.model.intercept, out / "onnx" / "model_quantized.onnx")
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


def static_onnx_probabilities(export_dir: str | Path, texts: list[str]) -> np.ndarray:
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


# --- encoder tier --------------------------------------------------------------------------

TOKENIZER_FILES = ("tokenizer.json", "tokenizer_config.json", "special_tokens_map.json", "vocab.txt")


def _export_encoder(rt: Runtime, run_dir: Path, out: Path, config: dict, log) -> tuple[dict[str, Probs], str, dict]:
    clf = rt.model
    src = run_dir / "encoder"
    input_names = [n for n in clf.tokenizer.model_input_names if n in ("input_ids", "attention_mask", "token_type_ids")]
    config = {
        **config,
        "tokenizer": {"file": "tokenizer.json", "add_special_tokens": True, "max_tokens": clf.max_tokens, "truncation": True},
        "onnx": {
            "file": "onnx/model_quantized.onnx",
            "fp32_file": "onnx/model.onnx",
            "dtype": "q8",
            "inputs": input_names,
            "output": "logits",
        },
    }
    _write_config(out, config)
    for f in TOKENIZER_FILES:
        if (src / f).is_file():
            shutil.copy(src / f, out / f)
    shutil.copy(src / "config.json", out / "config.json")

    log("exporting encoder to ONNX (fp32) ...")
    fp32, q8 = out / "onnx" / "model.onnx", out / "onnx" / "model_quantized.onnx"
    export_encoder_onnx(clf, input_names, fp32)
    log("quantizing (dynamic int8) ...")
    quantize_q8(fp32, q8)
    common = [out / "tokenizer.json", out / "tokenizer_config.json", out / "config.json", out / "microdecide.json"]
    download = {"onnx_download_mb": _mb(q8, *common), "onnx_fp32_download_mb": _mb(fp32, *common)}
    return (
        {"onnx_fp32": lambda t: encoder_onnx_probabilities(out, t, fp32), "onnx_q8": lambda t: encoder_onnx_probabilities(out, t, q8)},
        "onnx_q8",
        download,
    )


def export_encoder_onnx(clf, input_names: list[str], path: Path) -> None:
    """torch.export-based ONNX export of `*ForSequenceClassification` → logits, dynamic batch/seq."""
    import torch

    class Logits(torch.nn.Module):
        def __init__(self, model):
            super().__init__()
            self.model = model

        def forward(self, input_ids, attention_mask, token_type_ids=None):
            kw = {"input_ids": input_ids, "attention_mask": attention_mask}
            if token_type_ids is not None:
                kw["token_type_ids"] = token_type_ids
            return self.model(**kw).logits

    enc = clf.encode(["an example input for tracing", "a second, slightly longer example input for tracing"])
    kwargs = {k: enc[k] for k in input_names}
    batch, seq = torch.export.Dim("batch"), torch.export.Dim("seq", max=clf.max_tokens)
    program = torch.onnx.export(
        Logits(clf.model.eval()),
        (),
        kwargs=kwargs,
        input_names=input_names,
        output_names=["logits"],
        dynamic_shapes={k: {0: batch, 1: seq} for k in input_names},
        opset_version=OPSET,
        dynamo=True,
    )
    program.save(str(path), external_data=False)


def quantize_q8(src: Path, dst: Path) -> None:
    """Dynamic int8 weights (transformers.js "q8"). The torch.export graph carries value_info that
    ONNX shape inference rejects inside the quantizer, so quantize a copy without it."""
    import onnx
    from onnxruntime.quantization import QuantType, quantize_dynamic

    model = onnx.load(str(src))
    model.graph.ClearField("value_info")
    tmp = dst.with_suffix(".prequant.onnx")
    onnx.save(model, str(tmp))
    try:
        quantize_dynamic(str(tmp), str(dst), weight_type=QuantType.QInt8)
    finally:
        tmp.unlink(missing_ok=True)


def encoder_onnx_probabilities(export_dir: Path, texts: list[str], model_path: Path) -> np.ndarray:
    import onnxruntime as ort
    from transformers import AutoTokenizer

    config = json.loads((export_dir / "microdecide.json").read_text())
    tok = AutoTokenizer.from_pretrained(export_dir)
    session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    names = [i.name for i in session.get_inputs()]
    out = []
    for i in range(0, len(texts), 64):
        batch = [t[: config["max_chars"]] for t in texts[i : i + 64]]
        enc = tok(batch, padding=True, truncation=True, max_length=config["tokenizer"]["max_tokens"], return_tensors="np")
        (logits,) = session.run(["logits"], {k: enc[k].astype(np.int64) for k in names})
        out.append(logits)
    return softmax(np.concatenate(out), config["temperature"])

