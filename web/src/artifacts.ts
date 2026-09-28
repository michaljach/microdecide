/** Validate exported configs using the schema generated from Python's artifact contracts. */
import compiled from "./model-validator.js";
import type { ModelConfig } from "./types.js";

type ValidationError = { instancePath: string; message?: string };
const validate = compiled as typeof compiled & { errors?: ValidationError[] | null };

export function parseModelConfig(value: unknown): ModelConfig {
  if (!validate(value)) throw new Error(`Invalid model config: ${validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join("; ")}`);
  // Normalize nullable optional fields from the JSON schema to the TS representation.
  const config = structuredClone(value) as ModelConfig;
  if (config.onnx == null) delete config.onnx;
  else {
    if (config.onnx.fp32_file == null) delete config.onnx.fp32_file;
    if (config.onnx.dtype == null) delete config.onnx.dtype;
  }
  if (new Set(config.labels).size !== config.labels.length) throw new Error("Model labels must be unique");
  if (config.tier === "static") {
    if (config.head.coef.length !== config.labels.length || config.head.intercept.length !== config.labels.length) {
      throw new Error("Model head rows must match labels");
    }
    if (config.head.coef.some((row) => row.length !== config.dim)) throw new Error("Model head columns must match embedding dimension");
    if (config.tokenizer.drop_token_ids.some((id) => id < 0 || id >= config.vocab_size)) throw new Error("Drop token id is outside vocabulary");
  }
  return config;
}
