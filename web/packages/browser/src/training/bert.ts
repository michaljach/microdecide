import * as tf from "@tensorflow/tfjs";
import type { BertConfig } from "./types.js";
import type { Weights } from "./bundle.js";

/** PyTorch-compatible BERT, including the pooler. Every tensor is trainable. */
export class Bert {
  readonly weights: Record<string, tf.Variable> = Object.create(null);
  private dropoutSeed = 0;
  constructor(readonly config: BertConfig, initial: Weights, readonly labels: string[], seed = 42) {
    const expected = shapes(config, labels.length);
    try {
      for (const [name, shape] of Object.entries(expected)) {
        const w = initial[name];
        const head = name.startsWith("classifier.");
        const sameLabels = labels.every((label, i) => config.id2label?.[String(i)] === label);
        if ((!w || w.shape.join() !== shape.join()) && !head) throw new Error(`Missing or mismatched encoder weight: ${name}`);
        this.weights[name] = tf.tidy(() => {
          const tensor = w && w.shape.join() === shape.join() && (!head || sameLabels)
            ? tf.tensor(w.values, shape) : name.endsWith("bias") ? tf.zeros(shape) : tf.randomNormal(shape, 0, 0.02, "float32", seed);
          return tf.variable(tensor);
        });
      }
    } catch (err) { this.dispose(); throw err; }
    this.dropoutSeed = seed;
  }
  get variables() { return Object.values(this.weights); }
  get parameters() { return this.variables.reduce((sum, w) => sum + w.size, 0); }
  dispose() { this.variables.forEach(w => w.dispose()); }
  async snapshot(): Promise<Weights> {
    const out: Weights = Object.create(null);
    for (const [name, w] of Object.entries(this.weights)) out[name] = { shape: w.shape, values: new Float32Array(await w.data()) };
    return out;
  }
  restore(weights: Weights) {
    tf.tidy(() => { for (const [name, w] of Object.entries(weights)) this.weights[name].assign(tf.tensor(w.values, w.shape)); });
  }
  forward(ids: tf.Tensor2D, mask: tf.Tensor2D, types: tf.Tensor2D, training = false): tf.Tensor2D {
    return tf.tidy(() => {
      const c = this.config, [batch, seq] = ids.shape, h = c.hidden_size, heads = c.num_attention_heads, depth = h / heads;
      const dense = (x: tf.Tensor, prefix: string) => {
        const w = this.weights[`${prefix}.weight`];
        return tf.matMul(x.reshape([-1, x.shape.at(-1)!]), w as tf.Tensor2D, false, true)
          .add(this.weights[`${prefix}.bias`]).reshape([...x.shape.slice(0, -1), w.shape[0]]);
      };
      const norm = (x: tf.Tensor, prefix: string) => {
        const { mean, variance } = tf.moments(x, -1, true);
        return x.sub(mean).mul(tf.rsqrt(variance.add(c.layer_norm_eps))).mul(this.weights[`${prefix}.weight`]).add(this.weights[`${prefix}.bias`]);
      };
      const drop = (x: tf.Tensor, rate: number) => training && rate ? tf.dropout(x, rate, undefined, this.dropoutSeed++) : x;
      const prefix = "bert.embeddings";
      const word = tf.gather(this.weights[`${prefix}.word_embeddings.weight`], ids);
      const pos = tf.gather(this.weights[`${prefix}.position_embeddings.weight`], tf.range(0, seq, 1, "int32"));
      const type = tf.gather(this.weights[`${prefix}.token_type_embeddings.weight`], types);
      let x = drop(norm(word.add(pos).add(type), `${prefix}.LayerNorm`), c.hidden_dropout_prob);
      const attentionMask = tf.scalar(1).sub(mask.toFloat()).mul(-10000).reshape([batch, 1, 1, seq]);
      for (let i = 0; i < c.num_hidden_layers; i++) {
        const p = `bert.encoder.layer.${i}`;
        const project = (name: string) => dense(x, `${p}.attention.self.${name}`).reshape([batch, seq, heads, depth]).transpose([0, 2, 1, 3]);
        const q = project("query"), k = project("key"), v = project("value");
        const scores = tf.matMul(q, k, false, true).div(Math.sqrt(depth)).add(attentionMask);
        const probs = drop(tf.softmax(scores, -1), c.attention_probs_dropout_prob);
        const context = tf.matMul(probs, v).transpose([0, 2, 1, 3]).reshape([batch, seq, h]);
        x = norm(x.add(drop(dense(context, `${p}.attention.output.dense`), c.hidden_dropout_prob)), `${p}.attention.output.LayerNorm`);
        const intermediate = dense(x, `${p}.intermediate.dense`);
        const gelu = intermediate.mul(0.5).mul(tf.erf(intermediate.div(Math.SQRT2)).add(1));
        x = norm(x.add(drop(dense(gelu, `${p}.output.dense`), c.hidden_dropout_prob)), `${p}.output.LayerNorm`);
      }
      const cls = x.slice([0, 0, 0], [batch, 1, h]).reshape([batch, h]);
      const pooled = tf.tanh(dense(cls, "bert.pooler.dense"));
      return dense(drop(pooled, c.classifier_dropout ?? c.hidden_dropout_prob), "classifier") as tf.Tensor2D;
    });
  }
}

export function shapes(c: BertConfig, labels: number): Record<string, number[]> {
  const out: Record<string, number[]> = {}, h = c.hidden_size;
  const dense = (p: string, a: number, b: number) => { out[`${p}.weight`] = [b, a]; out[`${p}.bias`] = [b]; };
  const norm = (p: string) => { out[`${p}.weight`] = [h]; out[`${p}.bias`] = [h]; };
  out["bert.embeddings.word_embeddings.weight"] = [c.vocab_size, h];
  out["bert.embeddings.position_embeddings.weight"] = [c.max_position_embeddings, h];
  out["bert.embeddings.token_type_embeddings.weight"] = [c.type_vocab_size, h];
  norm("bert.embeddings.LayerNorm");
  for (let i = 0; i < c.num_hidden_layers; i++) {
    const p = `bert.encoder.layer.${i}`;
    for (const k of ["query", "key", "value"]) dense(`${p}.attention.self.${k}`, h, h);
    dense(`${p}.attention.output.dense`, h, h); norm(`${p}.attention.output.LayerNorm`);
    dense(`${p}.intermediate.dense`, h, c.intermediate_size);
    dense(`${p}.output.dense`, c.intermediate_size, h); norm(`${p}.output.LayerNorm`);
  }
  dense("bert.pooler.dense", h, h); dense("classifier", h, labels);
  return out;
}

/** AdamW with the same weighted cross entropy used by the Python trainer. */
export class Trainer {
  private readonly adam: tf.AdamOptimizer;
  constructor(readonly model: Bert, readonly learningRate: number) { this.adam = tf.train.adam(learningRate, 0.9, 0.999, 1e-8); }
  async step(ids: tf.Tensor2D, mask: tf.Tensor2D, types: tf.Tensor2D, labels: number[], confidence: number[], lr = this.learningRate) {
    // Adam's learningRate is exposed at runtime, but protected in the public TS declaration.
    (this.adam as unknown as { learningRate: number }).learningRate = lr;
    const loss = tf.tidy(() => {
      const ys = tf.oneHot(tf.tensor1d(labels, "int32"), this.model.labels.length);
      const weights = tf.tensor1d(confidence);
      const { value, grads } = tf.variableGrads(() => {
        const logits = this.model.forward(ids, mask, types, true);
        return tf.logSoftmax(logits).mul(ys).sum(-1).neg().mul(weights).mean() as tf.Scalar;
      }, this.model.variables);
      // Decoupled weight decay, applied to the pre-update weights (matching torch AdamW).
      for (const w of this.model.variables) w.assign(w.mul(1 - lr * 0.01));
      this.adam.applyGradients(Object.entries(grads).map(([name, tensor]) => ({ name, tensor })));
      return value;
    });
    try {
      const value = (await loss.data())[0];
      if (!Number.isFinite(value)) throw new Error("Training produced a non-finite loss. Reduce the learning rate.");
      return value;
    } finally { loss.dispose(); }
  }
  dispose() { this.adam.dispose(); }
}
