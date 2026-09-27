// Drive the demo pages in headless Chromium.
//   node scripts/browser-check.mjs parity    browser labels vs Python (exit 1 if < 99.5%)
//   node scripts/browser-check.mjs bench     load time, p50/p95, WASM vs WebGPU → <export>/bench.json
//   node scripts/browser-check.mjs offline   classify with the network cut (model from Cache API)
//   node scripts/browser-check.mjs playground  train in the browser, save, reload with MicroDecide.load
// BASE=/microdecide/ builds + previews under a sub-path; SITE=https://… checks a deployed site instead.
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { build, preview } from "vite";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] ?? "parity";
const site = process.env.SITE?.replace(/\/?$/, "/");
const basePath = site ? new URL(site).pathname : (process.env.BASE ?? "/");
const model = process.env.MODEL ?? `${basePath}models/comment_moderation/v3`;

// production build + preview: what users get, and realistic benchmark numbers
const configFile = join(web, "vite.config.ts");
let server = null;
let base;
if (site) {
  base = site.replace(/\/$/, "");
} else {
  await build({ configFile, logLevel: "error" });
  server = await preview({ configFile, preview: { port: 0 }, logLevel: "error" });
  base = server.resolvedUrls.local[0].replace(/\/$/, "");
}
// full Chromium in new-headless mode gets the real GPU (Metal on macOS); the default
// headless shell only offers SwiftShader, a software WebGPU that makes benchmarks meaningless
const browser = await chromium.launch({
  channel: "chromium",
  args: ["--enable-unsafe-webgpu", "--ignore-gpu-blocklist", "--enable-gpu", "--use-angle=metal"],
});
const page = await (await browser.newContext()).newPage();
page.on("pageerror", (e) => console.error("page error:", e.message));

let exitCode = 0;
try {
  if (mode === "parity" || mode === "bench") {
    await page.goto(`${base}/${mode}.html?model=${model}`);
    const result = await page.waitForFunction(() => window.__result, null, { timeout: 600_000, polling: 500 }).then((h) => h.jsonValue());
    console.log(JSON.stringify(result, null, 2));
    if (mode === "parity" && !result.pass) exitCode = 1;
    if (mode === "bench") {
      // save next to the served model and, if it came from runs/, into that export too
      // (`microdecide eval` then adds a Browser section to report.md)
      const json = JSON.stringify({ ...result, date: new Date().toISOString() }, null, 2);
      const [task, version] = model.split("/").slice(-2);
      const served = join(web, "public", "models", task, version);
      for (const dir of site ? [] : [served, join(web, "..", "runs", task, version, "export")]) {
        if (existsSync(dir)) {
          writeFileSync(join(dir, "bench.json"), json);
          console.log(`→ ${join(dir, "bench.json")}`);
        }
      }
    }
  } else if (mode === "offline") {
    // 1st visit online: service worker installs; 2nd visit online: shell + model get cached
    await page.goto(`${base}/index.html?model=${model}`);
    await page.waitForFunction(() => window.__last && navigator.serviceWorker.controller, null, { timeout: 60_000 });
    await page.reload();
    await page.waitForFunction(() => window.__last, null, { timeout: 60_000 });
    // cut the network and reload everything: page, worker, and model must come from caches
    await page.context().setOffline(true);
    await page.reload();
    await page.waitForFunction(() => window.__last, null, { timeout: 60_000 });
    await page.fill("#text", "Buy cheap followers now at fastfollowz dot example!!!");
    await page.waitForFunction(() => window.__last?.label === "spam", null, { timeout: 10_000 });
    const d = await page.evaluate(() => window.__last);
    const status = await page.textContent("#status");
    console.log(`offline reload OK — ${status}`);
    console.log(`offline decision: ${d.label} (${(d.confidence * 100).toFixed(1)}%)`);
  } else if (mode === "playground") {
    await page.goto(`${base}/playground.html`);
    await page.click("#load-example");
    await page.waitForFunction(() => /^\d{3,} labeled/.test(document.getElementById("count").textContent), null, { timeout: 30_000 });
    if (process.env.EMBEDDINGS) await page.selectOption("#base", process.env.EMBEDDINGS); // e.g. bases/potion-base-32M
    const t0 = Date.now();
    await page.click("#train");
    await page.waitForFunction(() => window.__playground?.result, null, { timeout: 120_000 });
    const wall = Date.now() - t0;
    await page.click("#save");
    await page.waitForFunction(() => window.__playground?.saved, null, { timeout: 60_000 });
    const check = await page.evaluate(async () => {
      const { MicroDecide, result, saved } = window.__playground;
      const m = await MicroDecide.load(saved);
      const ds = await m.decideBatch(result.predictions.map((p) => p.text));
      let same = 0;
      let maxDiff = 0;
      ds.forEach((d, i) => {
        const p = result.predictions[i];
        if (d.label === p.predicted) same++;
        Object.values(d.probabilities).forEach((v, k) => (maxDiff = Math.max(maxDiff, Math.abs(v - p.probabilities[k]))));
      });
      m.dispose();
      return { saved, n: ds.length, agreement: same / ds.length, maxDiff, model: m.info.model, loadMs: m.info.loadMs };
    });
    const r = await page.evaluate(() => window.__playground.result);
    const [download] = await Promise.all([page.waitForEvent("download"), page.click("#download")]);
    const zipPath = join(web, "test-results", "playground.zip");
    await download.saveAs(zipPath);
    await page.reload();
    const persisted = await page.textContent("#count");
    console.log(JSON.stringify({ trainWallMs: wall, ms: r.ms, testMacroF1: r.test.macroF1, testAccuracy: r.test.accuracy,
      coverage: r.escalation.testCoverage, counts: r.counts, C: r.C, reload: check, zip: zipPath, persistedAfterReload: persisted }, null, 2));
    if (check.agreement < 0.995 || !persisted.startsWith(String(r.counts.train + r.counts.val + r.counts.test))) exitCode = 1;
  } else {
    throw new Error(`unknown mode ${mode}`);
  }
} catch (err) {
  console.error(err);
  exitCode = 1;
} finally {
  await browser.close();
  await server?.close?.();
  server?.httpServer?.close();
}
process.exit(exitCode);
