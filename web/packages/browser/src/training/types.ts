export interface BertConfig {
  model_type: string; hidden_act: string; hidden_size: number; intermediate_size: number;
  num_hidden_layers: number; num_attention_heads: number; vocab_size: number;
  max_position_embeddings: number; type_vocab_size: number; layer_norm_eps: number;
  hidden_dropout_prob: number; attention_probs_dropout_prob: number; classifier_dropout?: number | null;
  id2label: Record<string, string>; label2id: Record<string, number>;
  is_decoder?: boolean; add_cross_attention?: boolean; position_embedding_type?: string;
}
export interface Row { text: string; label: string; split?: "train" | "val" | "test"; confidence?: number }
export interface Options { epochs: number; batchSize: number; maxTokens: number; learningRate: number; seed: number; targetPrecision: number; task: string }
export const defaults: Options = { epochs: 6, batchSize: 2, maxTokens: 64, learningRate: 0.0001, seed: 42, targetPrecision: 0.97, task: "browser_model" };
export interface Hardware {
  backend: string; cores: number | null; memoryGB: number | null; webgpu: boolean;
  gpu: string | null;
  estimatedMB: number; stepMs: number; parameters: number; notes: string[];
}
export interface Progress { phase: string; step?: number; total?: number; loss?: number; epoch?: number; validationF1?: number }
export interface Metrics { macroF1: number; accuracy: number; count: number; coverage: number; precision: number | null }
export interface Result { labels: string[]; temperature: number; threshold: number; targetReached: boolean; validation: Metrics; test: Metrics; bestEpoch: number; trainSeconds: number; history: { epoch: number; loss: number; validationF1: number }[] }
export type Request =
  | { kind: "check"; bundle: ArrayBuffer; data: string; options: Options; backend?: "auto" | "cpu" | "webgpu" | "webgl" }
  | { kind: "train" }
  | { kind: "download" }
  | { kind: "predict"; text: string };
