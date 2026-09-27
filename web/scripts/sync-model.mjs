// Copy onnxruntime-web's wasm runtime and exported models into public/, so the demo is served
// entirely from its own origin (no CDN) and works offline once cached. Writes public/models/index.json.
//   node scripts/sync-model.mjs [export dirs...]   (default: every ../runs/*/v*/export)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runs = join(web, "../runs");
let exports = process.argv.slice(2).map((p) => resolve(p));
if (!exports.length && existsSync(runs)) {
  for (const task of readdirSync(runs)) {
    const dir = join(runs, task);
    if (!statSync(dir).isDirectory()) continue;
    for (const v of readdirSync(dir).filter((v) => /^v\d+$/.test(v))) exports.push(join(dir, v, "export"));
  }
}
exports = exports.filter((d) => existsSync(join(d, "microdecide.json")));
if (!exports.length) {
  console.error("no exports found — run `uv run microdecide export runs/<task>/<version>` first");
  process.exit(1);
}

const ortDist = join(web, "node_modules/onnxruntime-web/dist");
const ortOut = join(web, "public/ort");
mkdirSync(ortOut, { recursive: true });
for (const f of readdirSync(ortDist).filter((f) => /^ort-wasm.*\.(wasm|mjs)$/.test(f))) cpSync(join(ortDist, f), join(ortOut, f));

const index = [];
for (const src of exports) {
  const cfg = JSON.parse(readFileSync(join(src, "microdecide.json"), "utf8"));
  if (cfg.format !== "microdecide" || cfg.format_version !== 2) {
    console.warn(`skip ${src}: old export format (re-run microdecide export)`);
    continue;
  }
  const card = JSON.parse(readFileSync(join(src, "model_card.json"), "utf8"));
  const [task, version] = cfg.model.split("@");
  const dest = join(web, "public/models", task, version);
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
  const e = card.export;
  index.push({
    id: cfg.model,
    path: `/models/${task}/${version}`,
    tier: cfg.tier,
    base: card.base,
    downloadMB: cfg.tier === "static" ? e.static_download_mb : e.onnx_download_mb,
  });
  console.log(`model ${cfg.model} (${cfg.tier}) → public/models/${task}/${version}`);
}
index.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
writeFileSync(join(web, "public/models/index.json"), JSON.stringify(index, null, 2));
console.log(`onnxruntime wasm → public/ort; ${index.length} models in public/models/index.json`);
