import { expect, it } from "vitest";
import { withExamples } from "../demo/training/task";

it("merges labeled examples without mutating the persisted task or duplicating text", () => {
  const task = { name: "test", labels: ["good"], examples: [{ text: "a", label: "good" }] };
  const [next, added] = withExamples(task, [{ text: "a", label: "bad" }, { text: "b", label: "bad", weight: 0.8 }, { text: "c" }]);
  expect(added).toBe(1);
  expect(next.labels).toEqual(["bad", "good"]);
  expect(next.examples).toEqual([{ text: "a", label: "good" }, { text: "b", label: "bad", weight: 0.8 }]);
  expect(task.labels).toEqual(["good"]);
  expect(task.examples).toHaveLength(1);
});
