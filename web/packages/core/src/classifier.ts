/** Texts → Decisions with a loaded tokenizer + sequence classifier. Shared by @nodd/browser and @nodd/node. */
import { argmax, sliceCodePoints, softmax } from "./text.js";
import type { Decision, ModelConfig, ModelInfo } from "./types.js";

/** The transformers.js calls we use, typed structurally so core doesn't depend on transformers.js. */
export type Tokenize = (texts: string[], options: { padding: true; truncation: true; max_length: number }) => unknown;
export type Forward = (inputs: any) => Promise<{ logits: { data: ArrayLike<number>; dims: readonly number[] } }>;

export class Classifier {
  constructor(
    readonly config: ModelConfig,
    private readonly tokenize: Tokenize,
    private readonly forward: Forward,
  ) {}

  async logits(texts: string[]): Promise<Float64Array[]> {
    const clipped = texts.map((t) => sliceCodePoints(t, this.config.max_chars));
    const inputs = this.tokenize(clipped, { padding: true, truncation: true, max_length: this.config.tokenizer.max_tokens });
    const { logits } = await this.forward(inputs);
    const cols = logits.dims[1];
    return texts.map((_, i) => Float64Array.from({ length: cols }, (_, j) => logits.data[i * cols + j]));
  }

  async decideBatch(texts: string[]): Promise<Decision[]> {
    const t0 = performance.now();
    const logits = await this.logits(texts);
    const ms = (performance.now() - t0) / Math.max(texts.length, 1);
    return logits.map((z) => toDecision(this.config, z, ms));
  }
}

export function toDecision(config: ModelConfig, logits: ArrayLike<number>, latencyMs: number): Decision {
  const { labels, temperature, model } = config;
  const p = softmax(logits, temperature);
  const i = argmax(p);
  return {
    label: labels[i],
    probabilities: Object.fromEntries(labels.map((l, k) => [l, p[k]])),
    confidence: p[i],
    escalated: false,
    source: "micro",
    model,
    latency_ms: latencyMs,
  };
}

/** The public model API, the same in the browser and in Node. */
export class Decider {
  constructor(
    readonly info: ModelInfo,
    private readonly run: (texts: string[]) => Promise<Decision[]>,
  ) {}

  async decide(text: string): Promise<Decision> {
    return (await this.run([text]))[0];
  }

  decideBatch(texts: string[]): Promise<Decision[]> {
    return this.run(texts);
  }

  /** False → below the calibrated threshold: escalate to the teacher. */
  isConfident(d: Decision): boolean {
    return d.confidence >= this.info.threshold;
  }
}
