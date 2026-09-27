// Copy onnxruntime-web's wasm runtime and exported models into public/, so the demo is served
// entirely from its own origin (no CDN) and works offline once cached. Then write
// public/models/index.json, the catalog behind the Models page.
//   node scripts/sync-model.mjs [path/to/export ...]   (default: every ../runs/<task>/<version>/export)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const web = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runs = join(web, "../runs");
const models = join(web, "public/models");
const readJson = (f) => JSON.parse(readFileSync(f, "utf8"));
const dirs = (d) => (existsSync(d) ? readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);

const exports = process.argv.length > 2
  ? process.argv.slice(2).map((p) => resolve(p))
  : dirs(runs).flatMap((task) => dirs(join(runs, task)).map((v) => join(runs, task, v, "export")));
const found = exports.filter((d) => existsSync(join(d, "microdecide.json")));
if (!found.length) {
  console.error(`no export found in ${exports.join(", ") || runs} — run \`uv run microdecide export runs/<task>/<version>\` first`);
  process.exit(1);
}

const ortDist = join(web, "node_modules/onnxruntime-web/dist");
const ortOut = join(web, "public/ort");
mkdirSync(ortOut, { recursive: true });
for (const f of readdirSync(ortDist).filter((f) => /^ort-wasm.*\.(wasm|mjs)$/.test(f))) {
  cpSync(join(ortDist, f), join(ortOut, f));
}

for (const exportDir of found) {
  const { model } = readJson(join(exportDir, "microdecide.json"));
  const [task, version] = model.split("@");
  const dest = join(models, task, version);
  rmSync(dest, { recursive: true, force: true });
  cpSync(exportDir, dest, { recursive: true });
  // the evaluation report lives next to the export in the run folder; the model page shows it
  for (const f of ["report.json", "report.md"]) {
    if (existsSync(join(exportDir, "..", f))) cpSync(join(exportDir, "..", f), join(dest, f));
  }
  console.log(`model ${model} → public/models/${task}/${version}`);
}
console.log("onnxruntime wasm → public/ort");

// Demo inputs from the test split: the most confident short one per label, plus the least
// confident one (it shows escalation).
function examples(dir) {
  const f = join(dir, "parity.jsonl");
  if (!existsSync(f)) return [];
  const rows = readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l))
    .filter((r) => r.text.length <= 120)
    .map((r) => ({ ...r, conf: Math.max(...Object.values(r.probabilities)) }));
  const byLabel = new Map();
  for (const r of [...rows].sort((a, b) => b.conf - a.conf)) if (!byLabel.has(r.label)) byLabel.set(r.label, r.text);
  const unsure = [...rows].sort((a, b) => a.conf - b.conf)[0];
  return [...byLabel.values(), ...(unsure ? [unsure.text] : [])];
}

const catalog = [];
for (const task of dirs(models)) {
  for (const version of dirs(join(models, task))) {
    const dir = join(models, task, version);
    if (!existsSync(join(dir, "model_card.json"))) continue;
    const card = readJson(join(dir, "model_card.json"));
    const report = existsSync(join(dir, "report.json")) ? readJson(join(dir, "report.json")) : null;
    catalog.push({
      id: card.model,
      task,
      version,
      url: `/models/${task}/${version}`,
      description: card.spec.description.trim(),
      labels: card.spec.output.labels,
      tier: card.tier,
      base: card.base,
      threshold: card.threshold,
      created: card.created,
      data: card.data,
      sizeMB: report?.size_mb ?? null,
      metrics: report && {
        macroF1: report.test.macro_f1,
        accuracy: report.test.accuracy,
        testN: report.test.n,
        perLabel: report.test.per_label,
        coverage: report.escalation.coverage,
        accuracyOnCovered: report.escalation.accuracy_on_covered,
        targetPrecision: report.escalation.target_precision,
        eceBefore: report.calibration.test_ece_before,
        eceAfter: report.calibration.test_ece_after,
      },
      examples: examples(dir),
    });
  }
}
const vnum = (v) => Number(v.replace(/\D/g, "")) || 0;
catalog.sort((a, b) => a.task.localeCompare(b.task) || vnum(b.version) - vnum(a.version));
writeFileSync(join(models, "index.json"), JSON.stringify({ models: catalog }, null, 2));
console.log(`catalog: ${catalog.map((m) => m.id).join(", ")} → public/models/index.json`);
