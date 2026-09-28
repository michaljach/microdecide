#!/usr/bin/env bash
# Build the demo for GitHub Pages and force-push it as a single-commit `gh-pages` branch.
#   scripts/deploy-pages.sh            (from web/; needs exported models, see CLAUDE.md)
#   scripts/deploy-pages.sh --reuse-models  (use existing public/ artifacts without runs/)
# Site: https://<owner>.github.io/<repo>/  — the base path is taken from the origin remote.
set -euo pipefail
cd "$(dirname "$0")/.."

remote=$(git remote get-url origin)
repo=$(basename -s .git "$remote")
export BASE="/$repo/"

case "${1:-}" in
  "") node scripts/sync-model.mjs ;;
  --reuse-models)
    [ -f public/models/index.json ] && [ -d public/ort ] || {
      echo "missing public/models/index.json or public/ort; restore the deployed artifacts first"
      exit 1
    }
    ;;
  *) echo "usage: $0 [--reuse-models]"; exit 1 ;;
esac
npx vite build

# lean site: the fp32 encoder (70 MB) is only an optional WebGPU variant
find dist-demo/models -path '*/onnx/model.onnx' -delete
for cfg in dist-demo/models/*/*/microdecide.json; do
  node -e 'const f=process.argv[1],fs=require("fs"),c=JSON.parse(fs.readFileSync(f));if(c.onnx)delete c.onnx.fp32_file;fs.writeFileSync(f,JSON.stringify(c))' "$cfg"
done
touch dist-demo/.nojekyll
big=$(find dist-demo -type f -size +95M)
[ -z "$big" ] || { echo "files over GitHub's 100 MB limit:"; echo "$big"; exit 1; }
echo "site: $(du -sh dist-demo | cut -f1)"

cd dist-demo
rm -rf .git
trap 'rm -rf .git' EXIT
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" \
  commit -q -m "Deploy demo ($(git -C .. rev-parse --short HEAD))"
# authenticate as the gh CLI's active account (other credential helpers may hold other accounts)
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -q -f "$remote" gh-pages
echo "pushed gh-pages → https://$(gh api user -q .login).github.io/$repo/"
