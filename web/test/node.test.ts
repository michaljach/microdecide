import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Nodd } from "@nodd/node";

const dir = resolve(__dirname, "generated/model");
const expected: { text: string; label: string; probabilities: Record<string, number> }[] = readFileSync(resolve(dir, "parity.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));

describe("@nodd/node", () => {
  it("gives Python's answers on the exported fixture (onnxruntime-node)", async () => {
    const m = await Nodd.load(dir);
    expect(m.info).toMatchObject({ model: "fixture@v1", labels: ["bad", "good"], device: "cpu", dtype: "q8" });
    const got = await m.decideBatch(expected.map((r) => r.text));
    got.forEach((d, i) => {
      expect(d.label, JSON.stringify(expected[i].text)).toBe(expected[i].label);
      for (const [label, p] of Object.entries(expected[i].probabilities)) expect(d.probabilities[label]).toBeCloseTo(p, 4);
    });
    expect((await m.decide(expected[0].text)).label).toBe(expected[0].label);
  });
});
