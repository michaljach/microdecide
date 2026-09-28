/** Validate exported configs using the schema generated from Python's artifact contracts. */
import compiled from "./model-validator.js";
import type { ModelConfig } from "./types.js";

type ValidationError = { instancePath: string; message?: string };
const validate = compiled as typeof compiled & { errors?: ValidationError[] | null };

export function parseModelConfig(value: unknown): ModelConfig {
  if (!validate(value)) throw new Error(`Invalid model config: ${validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join("; ")}`);
  // Normalize nullable optional fields from the JSON schema to the TS representation.
  const config = structuredClone(value) as ModelConfig;
  if (config.onnx.fp32_file == null) delete config.onnx.fp32_file;
  if (config.onnx.dtype == null) delete config.onnx.dtype;
  if (new Set(config.labels).size !== config.labels.length) throw new Error("Model labels must be unique");
  return config;
}
