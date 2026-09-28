import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { modelUrl, selectModels, validateCatalog } from './catalog.mjs';
const catalog = JSON.parse(readFileSync(new URL('./models.json', import.meta.url), 'utf8'));

test('all submitted listings have valid metadata and unique model repositories', () => {
  validateCatalog(catalog);
});

test('invalid and duplicate repositories cannot create arbitrary links', () => {
  const base = { repo_id: 'alice/small-model', name: 'Small model', tags: ['sentiment', 'reviews'], description: 'Classifies sentiment.', size_mb: 12, license: 'mit' };
  for (const repo_id of ['https://example.com/model', '../evil', 'alice/model/extra', 'javascript:alert(1)', 'alice/..']) {
    assert.throws(() => validateCatalog([{ ...base, repo_id }]));
  }
  assert.throws(() => validateCatalog([base, { ...base, repo_id: 'ALICE/small-model' }]));
  assert.throws(() => validateCatalog([{ ...base, size_mb: -1 }]));
  assert.throws(() => validateCatalog([{ ...base, url: 'https://example.com' }]));
  assert.equal(modelUrl({ ...base, revision: 'release/v1' }), 'https://huggingface.co/alice/small-model/tree/release%2Fv1');
});

test('search combines terms and tag filters, and size sorting puts unknowns last', () => {
  const rows = [
    { repo_id: 'alice/one', name: 'Alpha', tags: ['sentiment', 'reviews'], description: 'Classifies reviews', license: 'mit', size_mb: null },
    { repo_id: 'bob/two', name: 'Beta', tags: ['moderation'], description: 'Detects spam', license: 'apache-2.0', size_mb: 20 },
    { repo_id: 'alice/three', name: 'Gamma', tags: ['sentiment', 'reviews'], description: 'Classifies reviews', license: 'mit', size_mb: 8 },
  ];
  assert.deepEqual(selectModels(rows, { query: ' ALICE reviews ', tags: ['sentiment', 'reviews'], sort: 'size' }).map(x => x.name), ['Gamma', 'Alpha']);
  assert.deepEqual(selectModels(rows, { query: 'alice', tags: ['moderation'] }), []);
  assert.deepEqual(selectModels(rows, { sort: 'size' }).map(x => x.name), ['Gamma', 'Beta', 'Alpha']);
  assert.deepEqual(rows.map(x => x.name), ['Alpha', 'Beta', 'Gamma']);
});


test('tag filters match all selected tags and search includes secondary tags', () => {
  const rows = [
    { repo_id: 'alice/one', name: 'Alpha', tags: ['sentiment', 'reviews'], description: 'Classifies text', license: 'mit', size_mb: 10 },
    { repo_id: 'alice/two', name: 'Beta', tags: ['sentiment', 'social'], description: 'Classifies text', license: 'mit', size_mb: 15 },
  ];
  assert.equal(selectModels(rows, { tags: ['sentiment'] }).length, 2);
  assert.deepEqual(selectModels(rows, { tags: ['sentiment', 'reviews'] }).map(x => x.name), ['Alpha']);
  assert.deepEqual(selectModels(rows, { tags: ['reviews', 'social'] }), []);
  assert.deepEqual(selectModels(rows, { query: 'SOCIAL' }).map(x => x.name), ['Beta']);
  assert.deepEqual(selectModels(rows, { tags: ['sentiment'], query: 'reviews' }).map(x => x.name), ['Alpha']);
  assert.deepEqual(selectModels(rows, { sort: 'tags' }).map(x => x.name), ['Alpha', 'Beta']);
  assert.deepEqual(rows[0].tags, ['sentiment', 'reviews']);
});

test('listings require a nonempty array of unique, normalized tags', () => {
  const base = { repo_id: 'alice/one', name: 'Alpha', tags: ['sentiment', 'reviews'], description: 'Classifies text', license: 'mit', size_mb: 10 };
  validateCatalog([base]);
  for (const tags of [undefined, null, 'sentiment', [], [''], [12], ['Sentiment'], ['sentiment', 'sentiment'], [' white-space'], ['two words']]) {
    assert.throws(() => validateCatalog([{ ...base, tags }]));
  }
  assert.throws(() => validateCatalog([{ ...base, task: 'Sentiment' }]));
});
