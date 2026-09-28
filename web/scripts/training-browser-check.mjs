// Real worker, full backward pass, UI state transitions, checkpoint download, native import/export.
// No network models or teacher APIs: the fixture is generated locally.
import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";
import { preview } from "vite";

const web = fileURLToPath(new URL("../", import.meta.url));
const server = await preview({ configFile: join(web, "vite.config.ts"), preview: { port: 0 }, logLevel: "error" });
const output = join(web, "test-results/training");
mkdirSync(output, { recursive: true });
const rows = Array.from({ length: 20 }, (_, i) => ({ text: `${i % 2 ? "good" : "bad"} ${"neutral ".repeat(i + 1)}`, label: i % 2 ? "good" : "bad" }));
let browser;
try {
  browser = await chromium.launch({ channel: "chromium" });
  const context = await browser.newContext({ acceptDownloads: true, serviceWorkers: "block" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  const base = server.resolvedUrls.local[0];
  await page.goto(`${base}train.html`);
  await page.locator("#checkpoint").setInputFiles(join(web, "test/generated/training.zip"));
  await page.locator("#training-data").fill(JSON.stringify(rows));
  await page.getByText("Training settings", { exact: true }).click();
  await page.getByLabel("Maximum tokens", { exact: true }).fill("8");
  await page.getByLabel("Epochs", { exact: true }).fill("2");
  await page.getByLabel("Learning rate", { exact: true }).fill("0.001");
  await page.getByLabel("Compute backend", { exact: true }).selectOption("cpu");
  assert.equal(await page.getByRole("button", { name: "Start full training", exact: true }).isDisabled(), true);
  await page.getByRole("button", { name: "Check browser & model", exact: true }).click();
  await page.getByRole("heading", { name: "Browser check passed" }).waitFor({ timeout: 60_000 });
  await page.getByRole("button", { name: "Start full training", exact: true }).click();
  await page.getByRole("heading", { name: "Trained model", exact: true }).waitFor({ timeout: 60_000 });
  await page.locator("#try-trained").fill("good");
  await page.getByRole("button", { name: "Classify", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("#try-trained")?.parentElement?.textContent.includes('"probabilities"'));
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download trained checkpoint", exact: true }).click();
  const download = await downloadPromise;
  const checkpoint = join(output, "checkpoint.zip");
  await download.saveAs(checkpoint);
  await page.screenshot({ path: join(output, "trained.png"), fullPage: true });
  const run = execFileSync("uv", ["run", "nodd", "import-browser-training", checkpoint, "--runs", join(output, "runs")], { cwd: join(web, ".."), encoding: "utf8" }).trim().split("\n").at(-1);
  execFileSync("uv", ["run", "nodd", "eval", run], { cwd: join(web, ".."), stdio: "pipe" });
  execFileSync("uv", ["run", "nodd", "export", run], { cwd: join(web, ".."), stdio: "pipe" });
  assert.equal(JSON.parse(readFileSync(join(run, "model_card.json"), "utf8")).training.source, "browser");
  // A changed batch invalidates the successful capability check and releases the old worker.
  await page.getByLabel("Batch size", { exact: true }).fill("1");
  assert.equal(await page.getByRole("button", { name: "Start full training", exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole("heading", { name: "Browser check passed" }).count(), 0);
  // Stop destroys even a worker that is compiling/checking, without leaving the page locked.
  await page.getByRole("button", { name: "Check browser & model", exact: true }).click();
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Check browser & model", exact: true }).isEnabled(), true);
  assert.equal(await page.getByRole("button", { name: "Start full training", exact: true }).isDisabled(), true);
  // Exercise automatic GPU selection with real gradients when this browser exposes it.
  await page.getByLabel("Compute backend", { exact: true }).selectOption("auto");
  await page.getByRole("button", { name: "Check browser & model", exact: true }).click();
  await page.getByRole("heading", { name: "Browser check passed" }).waitFor({ timeout: 60_000 });
  console.log("Automatic hardware result:", await page.locator("section").first().innerText());
  await page.getByRole("button", { name: "Start full training", exact: true }).click();
  await page.getByRole("heading", { name: "Trained model", exact: true }).waitFor({ timeout: 60_000 });
  const autoDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download trained checkpoint", exact: true }).click();
  const autoCheckpoint = join(output, "automatic-checkpoint.zip");
  await (await autoDownloadPromise).saveAs(autoCheckpoint);
  execFileSync("uv", ["run", "nodd", "import-browser-training", autoCheckpoint, "--runs", join(output, "runs")], { cwd: join(web, ".."), stdio: "pipe" });
  if (process.env.NODD_REAL_TRAINING === "1") {
    await page.locator("#checkpoint").setInputFiles(join(web, "public/training/minilm-l3.zip"));
    await page.getByLabel("Epochs", { exact: true }).fill("1");
    await page.getByLabel("Maximum tokens", { exact: true }).fill("64");
    await page.getByLabel("Batch size", { exact: true }).fill("2");
    await page.getByLabel("Learning rate", { exact: true }).fill("0.0001");
    await page.getByRole("button", { name: "Check browser & model", exact: true }).click();
    await page.getByRole("heading", { name: "Browser check passed" }).waitFor({ timeout: 120_000 });
    console.log("MiniLM-L3 hardware result:", await page.locator("section").first().innerText());
    await page.getByRole("button", { name: "Start full training", exact: true }).click();
    await page.getByRole("heading", { name: "Trained model", exact: true }).waitFor({ timeout: 180_000 });
    const realDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download trained checkpoint", exact: true }).click();
    const realCheckpoint = join(output, "minilm-checkpoint.zip");
    await (await realDownloadPromise).saveAs(realCheckpoint);
    execFileSync("uv", ["run", "nodd", "import-browser-training", realCheckpoint, "--runs", join(output, "runs")], { cwd: join(web, ".."), stdio: "pipe" });
    console.log("Real MiniLM-L3 full training and native prediction parity passed.");
  }
  assert.deepEqual(errors, []);
  console.log("Training browser acceptance passed: full training, calibrated prediction, checkpoint, Python parity/import/eval/ONNX export, invalidation, cancellation, hardware probe.");
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
