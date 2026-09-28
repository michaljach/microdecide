"""Encoder ONNX conversion, quantization, and reference inference."""

from __future__ import annotations
import shutil
from pathlib import Path
from typing import cast
import numpy as np
from nodd.calibrate import softmax
from nodd.runtime import Runtime
from nodd.encoder import EncoderClassifier
from nodd.artifacts import read_config
from nodd.exporters.common import Probs, OPSET, _mb, _write_config

TOKENIZER_FILES = ("tokenizer.json", "tokenizer_config.json", "special_tokens_map.json", "vocab.txt")


def _export_encoder(rt: Runtime, run_dir: Path, out: Path, config: dict, log) -> tuple[dict[str, Probs], str, dict]:
    clf = cast(EncoderClassifier, rt.model)
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
    common = [out / "tokenizer.json", out / "tokenizer_config.json", out / "config.json", out / "nodd.json"]
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

    config = read_config(export_dir / "nodd.json")
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
