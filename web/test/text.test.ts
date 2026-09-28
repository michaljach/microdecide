import { describe, expect, it } from "vitest";
import { argmax, sliceCodePoints, softmax } from "../packages/core/src/text";

describe("sliceCodePoints", () => {
  it("counts code points like Python, not UTF-16 units", () => {
    expect(sliceCodePoints("a😀b", 2)).toBe("a😀");
    expect("a😀b".slice(0, 2)).not.toBe("a😀"); // why this helper exists
    expect(sliceCodePoints("héllo", 3)).toBe("hél");
    expect(sliceCodePoints("short", 100)).toBe("short");
    expect(sliceCodePoints("", 3)).toBe("");
    expect(sliceCodePoints("abc", 0)).toBe("");
  });
});

describe("softmax", () => {
  it("normalizes and respects temperature", () => {
    const p = softmax([1, 2, 3]);
    expect(p.reduce((a, b) => a + b)).toBeCloseTo(1, 12);
    expect(argmax(p)).toBe(2);
    const sharp = softmax([1, 2, 3], 0.5);
    expect(sharp[2]).toBeGreaterThan(p[2]);
    expect(softmax([1000, 1000])).toEqual([0.5, 0.5]); // no overflow
  });
});
