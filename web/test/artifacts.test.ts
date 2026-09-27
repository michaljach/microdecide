import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseModelConfig } from "../src/artifacts";
import { Model } from "../src/model";
import { modelFiles } from "../src/package";
import type { TrainReport } from "../src/train";

const root = resolve(__dirname, "generated");
const cases: { name: string; config: unknown; valid: boolean }[] = JSON.parse(readFileSync(resolve(root, "contract_cases.json"), "utf8"));
describe("Python/browser artifact contract", () => {
  it.each(cases)("$name", ({ config, valid }) => {
    if (valid) expect(parseModelConfig(config)).toBeDefined();
    else expect(() => parseModelConfig(config)).toThrow();
  });

  it("rejects malformed metadata before fetching weights", async () => {
    const files: string[] = [];
    await expect(Model.load("/invalid", {}, async (file) => {
      files.push(file);
      return new TextEncoder().encode('{"format_version":999}').buffer;
    })).rejects.toThrow("Invalid model config");
    expect(files).toEqual(["/invalid/microdecide.json"]);
  });

  it("loads a browser-packaged model through the same validated boundary", async () => {
    const config = parseModelConfig(cases[0].config);
    if (config.tier !== "static") throw new Error("Expected static fixture");
    const read = (file: string) => Uint8Array.from(readFileSync(resolve(root, "model", file))).buffer;
    const report = {
      head: { ...config.head, labels: config.labels, temperature: config.temperature, threshold: config.threshold },
      C: 1, valMacroF1ByC: {}, counts: {}, test: {}, calibration: {}, escalation: {},
    } as unknown as TrainReport;
    const files = modelFiles("roundtrip", { config, tokenizerJson: read("tokenizer.json"), tokenizerConfig: read("tokenizer_config.json"), table: read(config.static.embeddings) }, report);
    const model = await Model.load("/roundtrip", {}, async (url) => Uint8Array.from(files[url.replace("/roundtrip/", "")]).buffer);
    const [good, bad] = await model.decideBatch(["good", "bad"]);
    expect(good.label).toBe("good");
    expect(bad.label).toBe("bad");
  });
});
