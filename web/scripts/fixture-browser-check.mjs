// Offline acceptance check using the same generated fixtures as the contract tests.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { chromium } from "playwright";
import { preview } from "vite";

const web = fileURLToPath(new URL("../", import.meta.url));
const fixtures = join(web, "test/generated/model");
const server = await preview({ configFile: join(web, "vite.config.ts"), preview: { port: 0 }, logLevel: "error" });
let browser;
try {
  browser = await chromium.launch({ channel: "chromium" });
  const context = await browser.newContext({ serviceWorkers: "block" });
  await context.route("**/models/index.json", (route) => route.fulfill({ json: [] }));
  await context.route("**/bases/potion-base-8M/**", (route) => {
    const file = new URL(route.request().url()).pathname.split("/bases/potion-base-8M/")[1];
    if (file === "microdecide.json") {
      const config = JSON.parse(readFileSync(join(fixtures, file), "utf8"));
      delete config.onnx;
      return route.fulfill({ json: { ...config, kind: "base", labels: [], head: { coef: [], intercept: [] } } });
    }
    return route.fulfill({ body: readFileSync(join(fixtures, file)), contentType: file.endsWith(".json") ? "application/json" : "application/octet-stream" });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const base = server.resolvedUrls.local[0];
  await page.goto(`${base}playground.html`);
  const rows = ["text,label", ...Array.from({ length: 30 }, (_, i) => `${i < 15 ? "good" : "bad"} sample${i},${i < 15 ? "good" : "bad"}`)];
  await page.locator('input[type="file"]').setInputFiles({ name: "fixture.csv", mimeType: "text/csv", buffer: Buffer.from(rows.join("\n")) });
  await page.waitForFunction(() => document.querySelector("#count")?.textContent === "30 labeled");
  await page.click("#train");
  await page.waitForFunction(() => window.__playground?.result, null, { timeout: 30_000 });
  await page.click("#save");
  await page.waitForFunction(() => window.__playground?.saved, null, { timeout: 30_000 });
  const saved = await page.evaluate(async () => {
    const { MicroDecide, result, saved } = window.__playground;
    for (const worker of [true, false]) {
      const model = await MicroDecide.load(saved, { worker });
      const decisions = await model.decideBatch(result.predictions.map((row) => row.text));
      if (!decisions.every((d, i) => d.label === result.predictions[i].predicted)) throw new Error("Saved model parity failed");
      model.dispose();
    }
    return saved;
  });
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#download")]);
  assert.equal(await download.failure(), null);
  await page.waitForFunction(() => JSON.parse(localStorage.getItem("microdecide-playground-v1"))?.examples.length === 30);
  await page.reload();
  assert.equal(await page.locator("#count").textContent(), "30 labeled");
  assert.equal(await page.locator(".app").evaluate((element) => getComputedStyle(element).maxWidth), "1200px");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#count").textContent(), "30 labeled");
  await page.locator(".chip").filter({ hasText: "good" }).getByRole("button", { name: "Remove good", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  assert.equal(await page.locator("#count").textContent(), "15 labeled");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete", exact: true }).click();
  assert.equal(await page.locator("#count").textContent(), "0 labeled");
  await page.getByRole("button", { name: "Paste…", exact: true }).click();
  const pasted = page.getByPlaceholder("CSV with a header", { exact: false });
  await pasted.fill("queued one\nqueued two");
  await page.getByRole("button", { name: "Queue lines for labeling" }).click();
  await pasted.focus();
  await page.keyboard.press("1");
  assert.equal(await page.locator("#count").textContent(), "0 labeled");
  await page.getByLabel("Labeling queue").focus();
  await page.keyboard.press("1");
  assert.equal(await page.locator("#count").textContent(), "1 labeled");
  await page.keyboard.press("s");
  assert.equal(await page.locator(".queue").count(), 0);
  await page.goto(`${base}model.html?model=${encodeURIComponent(saved)}`);
  await page.waitForFunction(() => window.__last, null, { timeout: 30_000 });
  assert.equal(await page.title(), "microdecide · Model");
  await page.fill("#text", "good");
  await page.waitForFunction(() => window.__last?.label === "good");
  assert.deepEqual(errors, []);
  console.log("Browser fixture check passed: train, save, worker/main-thread parity, zip, persistence, React confirmations, keyboard labeling, layout, model page.");
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
