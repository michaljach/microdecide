// Drive the demo pages in headless Chromium.
//   node scripts/browser-check.mjs parity    browser labels vs Python (exit 1 if < 99.5%)
//   node scripts/browser-check.mjs bench     load time, p50/p95, WASM vs WebGPU → <export>/bench.json
//   node scripts/browser-check.mjs offline   classify with the network cut (model from Cache API)
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { build, preview } from "vite";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] ?? "parity";
const model = process.env.MODEL ?? "/models/comment_moderation/v1";

// production build + preview: what users get, and realistic benchmark numbers
const configFile = join(web, "vite.config.ts");
await build({ configFile, logLevel: "error" });
const server = await preview({ configFile, preview: { port: 0 }, logLevel: "error" });
const base = server.resolvedUrls.local[0].replace(/\/$/, "");
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
      for (const dir of [join(web, "public", model), join(web, "..", "runs", task, version, "export")]) {
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
  } else {
    throw new Error(`unknown mode ${mode}`);
  }
} catch (err) {
  console.error(err);
  exitCode = 1;
} finally {
  await browser.close();
  await server.close?.();
  server.httpServer?.close();
}
process.exit(exitCode);
