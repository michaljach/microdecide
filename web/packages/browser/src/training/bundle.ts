import { unzipSync, zipSync, strFromU8, strToU8 } from "fflate";
import type { BertConfig } from "./types.js";

export interface Weight { shape: number[]; values: Float32Array }
export type Weights = Record<string, Weight>;
export interface Bundle { config: BertConfig; files: Record<string, Uint8Array>; weights: Weights }
const product = (s: number[]) => s.reduce((a, b) => a * b, 1);

export function validateConfig(c: BertConfig) {
  if (c.model_type !== "bert" || c.hidden_act !== "gelu" || c.is_decoder || c.add_cross_attention ||
      (c.position_embedding_type && c.position_embedding_type !== "absolute")) {
    throw new Error("Training supports BERT/MiniLM encoders with GELU and absolute positions only.");
  }
  for (const n of [c.hidden_size, c.intermediate_size, c.num_hidden_layers, c.num_attention_heads,
    c.vocab_size, c.max_position_embeddings, c.type_vocab_size]) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Invalid encoder dimensions.");
  }
  if (c.hidden_size % c.num_attention_heads || c.num_hidden_layers > 12 || c.hidden_size > 768 ||
      c.vocab_size > 100000 || c.intermediate_size > 3072 || c.max_position_embeddings > 2048 || c.type_vocab_size > 16) {
    throw new Error("Encoder exceeds the small-model training limits.");
  }
  if (!(c.layer_norm_eps > 0 && Number.isFinite(c.layer_norm_eps))) throw new Error("Invalid layer norm epsilon.");
  for (const p of [c.hidden_dropout_prob, c.attention_probs_dropout_prob, c.classifier_dropout ?? 0]) {
    if (!(p >= 0 && p < 1)) throw new Error("Invalid dropout probability.");
  }
}

export function readWeights(bytes: Uint8Array): Weights {
  if (bytes.length < 8) throw new Error("Missing safetensors header.");
  const size = Number(new DataView(bytes.buffer, bytes.byteOffset, 8).getBigUint64(0, true));
  if (!Number.isSafeInteger(size) || size < 2 || size > 1_000_000 || size + 8 > bytes.length) throw new Error("Invalid safetensors header.");
  const header = JSON.parse(strFromU8(bytes.subarray(8, 8 + size)));
  const result: Weights = Object.create(null);
  for (const [name, raw] of Object.entries(header)) {
    if (name === "__metadata__") continue;
    const w = raw as { dtype: string; shape: number[]; data_offsets: number[] };
    if (w.dtype !== "F32" || !Array.isArray(w.shape) || !w.shape.length || !w.shape.every(n => Number.isSafeInteger(n) && n > 0) ||
        !Array.isArray(w.data_offsets) || w.data_offsets.length !== 2) throw new Error(`Invalid FP32 weight: ${name}`);
    const [start, end] = w.data_offsets;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end - start !== product(w.shape) * 4 || end > bytes.length - 8 - size) throw new Error(`Invalid offsets: ${name}`);
    const values = new Float32Array(bytes.slice(8 + size + start, 8 + size + end).buffer);
    if (!values.every(Number.isFinite)) throw new Error(`Non-finite weight: ${name}`);
    result[name] = { shape: w.shape, values };
  }
  return result;
}

export function writeWeights(weights: Weights): Uint8Array {
  let offset = 0;
  const header: Record<string, unknown> = { __metadata__: { format: "pt" } };
  for (const [name, w] of Object.entries(weights)) {
    header[name] = { dtype: "F32", shape: w.shape, data_offsets: [offset, offset + w.values.byteLength] };
    offset += w.values.byteLength;
  }
  let text = JSON.stringify(header);
  text += " ".repeat((8 - strToU8(text).length % 8) % 8);
  const encoded = strToU8(text);
  const result = new Uint8Array(8 + encoded.length + offset);
  new DataView(result.buffer).setBigUint64(0, BigInt(encoded.length), true);
  result.set(encoded, 8);
  offset = 8 + encoded.length;
  for (const w of Object.values(weights)) {
    result.set(new Uint8Array(w.values.buffer, w.values.byteOffset, w.values.byteLength), offset);
    offset += w.values.byteLength;
  }
  return result;
}

export function readBundle(buffer: ArrayBuffer): Bundle {
  if (buffer.byteLength > 250_000_000) throw new Error("Training bundle must be smaller than 250 MB.");
  let expanded = 0;
  const allowed = new Set(["config.json", "tokenizer.json", "tokenizer_config.json", "special_tokens_map.json", "model.safetensors", "training.json"]);
  const files = unzipSync(new Uint8Array(buffer), { filter: (f) => {
    if (!allowed.has(f.name)) return false;
    expanded += f.originalSize;
    if (expanded > 250_000_000) throw new Error("Expanded bundle exceeds 250 MB.");
    return true;
  } });
  for (const name of ["config.json", "tokenizer.json", "tokenizer_config.json", "model.safetensors"]) {
    if (!files[name]) throw new Error(`Bundle missing ${name}. Prepare it with nodd prepare-browser-training.`);
  }
  const config = JSON.parse(strFromU8(files["config.json"])) as BertConfig;
  validateConfig(config);
  return { config, files, weights: readWeights(files["model.safetensors"]) };
}

export function pack(files: Record<string, Uint8Array>): Uint8Array { return zipSync(files, { level: 0 }); }
export const jsonBytes = (value: unknown) => strToU8(JSON.stringify(value));
