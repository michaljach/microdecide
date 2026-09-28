import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseModelConfig } from "../src/artifacts";
import { Model } from "../src/model";

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
});
