// Copy onnxruntime-web's wasm runtime and an exported model into public/, so the demo is
// served entirely from its own origin (no CDN) and works offline once cached.
//   node scripts/sync-model.mjs [path/to/export]   (default: ../runs/comment_moderation/v1/export)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exportDir = resolve(process.argv[2] ?? join(web, "../runs/comment_moderation/v1/export"));
if (!existsSync(join(exportDir, "microdecide.json"))) {
  console.error(`no export at ${exportDir} — run \`uv run microdecide export runs/<task>/<version>\` first`);
  process.exit(1);
}

const ortDist = join(web, "node_modules/onnxruntime-web/dist");
const ortOut = join(web, "public/ort");
mkdirSync(ortOut, { recursive: true });
for (const f of readdirSync(ortDist).filter((f) => /^ort-wasm.*\.(wasm|mjs)$/.test(f))) {
  cpSync(join(ortDist, f), join(ortOut, f));
}

const { model } = JSON.parse(readFileSync(join(exportDir, "microdecide.json"), "utf8"));
const [task, version] = model.split("@");
const dest = join(web, "public/models", task, version);
rmSync(dest, { recursive: true, force: true });
cpSync(exportDir, dest, { recursive: true });
console.log(`model ${model} → public/models/${task}/${version}; onnxruntime wasm → public/ort`);
