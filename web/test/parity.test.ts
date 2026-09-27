/** Node-side parity: the exported model through the JS static engine vs Python (parity.jsonl). */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Model } from "../src/model";

const EXPORT = resolve(__dirname, process.env.MODEL_EXPORT ?? "../../runs/comment_moderation/v1/export");
const have = existsSync(resolve(EXPORT, "microdecide.json"));

describe.skipIf(!have)("exported model parity (static engine, Node)", () => {
  it("matches Python labels on the test split", async () => {
    const fetcher = async (url: string) => {
      const buf = readFileSync(url);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    };
    const model = await Model.load(EXPORT, { backend: "static", cache: false }, fetcher);
    const rows = readFileSync(resolve(EXPORT, "parity.jsonl"), "utf8")
      .trim()
      .split("\n")
      .map((l) => JSON.parse(l) as { text: string; label: string; probabilities: Record<string, number> });
    const decisions = await model.decideBatch(rows.map((r) => r.text));
    let same = 0;
    let maxDiff = 0;
    decisions.forEach((d, i) => {
      if (d.label === rows[i].label) same++;
      for (const [k, v] of Object.entries(rows[i].probabilities)) maxDiff = Math.max(maxDiff, Math.abs(v - d.probabilities[k]));
      expect(model.config.labels).toContain(d.label);
    });
    expect(same / rows.length).toBeGreaterThanOrEqual(0.995);
    expect(maxDiff).toBeLessThan(1e-6);
    console.log(`node parity: ${same}/${rows.length} labels, max |Δp| ${maxDiff.toExponential(2)}`);
  });
});
