import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as tf from "@tensorflow/tfjs";
import { Bert, Trainer } from "../packages/browser/src/training/bert.js";
import { readBundle, readWeights, writeWeights } from "../packages/browser/src/training/bundle.js";
import { calibrate, dataset, metrics } from "../packages/browser/src/training/data.js";
import { Session, encodeText } from "../packages/browser/src/training/session.js";
import { BertTokenizer } from "@huggingface/transformers";
import { strFromU8 } from "fflate";
import { defaults } from "../packages/browser/src/training/types.js";

const bundle = () => { const b = readFileSync(new URL("./generated/training.zip", import.meta.url)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const rows = Array.from({ length: 20 }, (_, i) => ({ text: `${i % 2 ? "good" : "bad"} ${"neutral ".repeat(i + 1)}`, label: i % 2 ? "good" : "bad" }));

it("preserves BERT separator when truncating, matching Python inputs", () => {
  const b = readBundle(bundle());
  const tok = new BertTokenizer(JSON.parse(strFromU8(b.files["tokenizer.json"])), JSON.parse(strFromU8(b.files["tokenizer_config.json"])));
  expect(encodeText(tok, "good " + "neutral ".repeat(20), 8).ids).toEqual([2, 5, 7, 7, 7, 7, 7, 3]);
  expect(encodeText(tok, "good", 8).ids).toEqual([2, 5, 3, 0, 0, 0, 0, 0]);
});

describe("full encoder training", () => {
  it("matches PyTorch forward and AdamW update, including encoder embeddings", async () => {
    await tf.setBackend("cpu");
    const initialCount = tf.memory().numTensors;
    const b = readBundle(bundle());
    const model = new Bert(b.config, b.weights, ["bad", "good"]);
    const reference = JSON.parse(readFileSync(new URL("./generated/training_reference.json", import.meta.url), "utf8"));
    const ids = tf.tensor2d(reference.inputs.input_ids, undefined, "int32"), mask = tf.tensor2d(reference.inputs.attention_mask, undefined, "int32"), types = tf.tensor2d(reference.inputs.token_type_ids, undefined, "int32");
    const before = model.forward(ids, mask, types);
    const flat = (x: number[][]) => x.flat();
    Array.from(await before.data()).forEach((x, i) => expect(x).toBeCloseTo(flat(reference.before)[i], 5));
    before.dispose();
    const trainer = new Trainer(model, 0.001);
    const loss = await trainer.step(ids, mask, types, [1, 0], [1, 1]);
    expect(loss).toBeCloseTo(reference.loss, 5);
    const after = model.forward(ids, mask, types);
    Array.from(await after.data()).forEach((x, i) => expect(x).toBeCloseTo(flat(reference.after)[i], 4));
    const saved = await model.snapshot();
    for (const name of ["bert.embeddings.word_embeddings.weight", "bert.encoder.layer.0.attention.self.query.weight", "classifier.weight"]) {
      expect(saved[name].values.some((v, i) => Math.abs(v - b.weights[name].values[i]) > 1e-7)).toBe(true);
    }
    const decoded = readWeights(writeWeights(saved));
    expect(decoded["classifier.weight"].values).toEqual(saved["classifier.weight"].values);
    after.dispose(); trainer.dispose(); model.dispose(); tf.dispose([ids, mask, types]);
    expect(tf.memory().numTensors).toBe(initialCount);
  });

  it("checks real CPU training, trains, calibrates, and saves a reloadable checkpoint", async () => {
    const start = tf.memory().numTensors;
    const options = { ...defaults, maxTokens: 8, batchSize: 2, epochs: 2, learningRate: 0.001 };
    const session = new Session(options, () => {});
    try {
      const hw = await session.prepare(bundle(), JSON.stringify(rows), "cpu");
      expect(hw.backend).toBe("cpu"); expect(hw.parameters).toBeGreaterThan(1000);
      const result = await session.train();
      expect(result.history).toHaveLength(2); expect(result.test.count).toBe(4);
      const bytes = await session.download();
      const reloaded = readBundle(bytes.buffer as ArrayBuffer);
      expect(Object.keys(reloaded.weights)).toContain("bert.encoder.layer.0.attention.self.query.weight");
      expect((await session.predict("good")).label).toMatch(/good|bad/);
    } finally { session.dispose(); }
    expect(tf.memory().numTensors).toBe(start);
  });
});

it("preserves explicit holdouts, rejects duplicate leakage, and splits reproducibly", () => {
  const a = dataset(JSON.stringify(rows), 42), b = dataset(JSON.stringify(rows), 42);
  expect(a).toEqual(b); expect(a.train.length + a.val.length + a.test.length).toBe(rows.length);
  expect(dataset(JSON.stringify(a.rows), 9).rows).toEqual(a.rows);
  expect(() => dataset(JSON.stringify([...rows, rows[0]]), 42)).toThrow(/Duplicate/);
  expect(() => dataset(JSON.stringify(rows.map((r, i) => i ? r : { ...r, split: "test" })), 42)).toThrow(/every row/);
});

it("escalates every prediction when validation cannot reach target precision", () => {
  const logits = [[2, 0], [2, 0]], ys = [1, 1];
  const c = calibrate(logits, ys, 0.97);
  expect(c.targetReached).toBe(false); expect(c.threshold).toBeGreaterThan(1);
  expect(metrics(logits, ys, 2, c.temperature, c.threshold).coverage).toBe(0);
});
