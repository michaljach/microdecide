import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { modelUrl, selectModels, validateCatalog } from './catalog.mjs';
const catalog = JSON.parse(readFileSync(new URL('./models.json', import.meta.url), 'utf8'));

test('all submitted listings have valid metadata and unique model repositories', () => {
  validateCatalog(catalog);
});

test('invalid and duplicate repositories cannot create arbitrary links', () => {
  const base = { repo_id: 'alice/small-model', name: 'Small model', task: 'Sentiment', description: 'Classifies sentiment.', size_mb: 12, license: 'mit' };
  for (const repo_id of ['https://example.com/model', '../evil', 'alice/model/extra', 'javascript:alert(1)', 'alice/..']) {
    assert.throws(() => validateCatalog([{ ...base, repo_id }]));
  }
  assert.throws(() => validateCatalog([base, { ...base, repo_id: 'ALICE/small-model' }]));
  assert.throws(() => validateCatalog([{ ...base, size_mb: -1 }]));
  assert.throws(() => validateCatalog([{ ...base, url: 'https://example.com' }]));
  assert.equal(modelUrl({ ...base, revision: 'release/v1' }), 'https://huggingface.co/alice/small-model/tree/release%2Fv1');
});

test('search combines terms and task filters, and size sorting puts unknowns last', () => {
  const rows = [
    { repo_id: 'alice/one', name: 'Alpha', task: 'Sentiment', description: 'Classifies reviews', license: 'mit', size_mb: null },
    { repo_id: 'bob/two', name: 'Beta', task: 'Moderation', description: 'Detects spam', license: 'apache-2.0', size_mb: 20 },
    { repo_id: 'alice/three', name: 'Gamma', task: 'Sentiment', description: 'Classifies reviews', license: 'mit', size_mb: 8 },
  ];
  assert.deepEqual(selectModels(rows, { query: ' ALICE reviews ', task: 'Sentiment', sort: 'size' }).map(x => x.name), ['Gamma', 'Alpha']);
  assert.deepEqual(selectModels(rows, { query: 'alice', task: 'Moderation' }), []);
  assert.deepEqual(selectModels(rows, { sort: 'size' }).map(x => x.name), ['Gamma', 'Beta', 'Alpha']);
  assert.deepEqual(rows.map(x => x.name), ['Alpha', 'Beta', 'Gamma']);
});
