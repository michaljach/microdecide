const fields = new Set(['repo_id', 'name', 'task', 'description', 'size_mb', 'license', 'revision']);
const segment = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function validateCatalog(value) {
  if (!Array.isArray(value)) throw new Error('The catalog must be an array.');
  const seen = new Set();
  for (const [index, row] of value.entries()) {
    const fail = message => { throw new Error(`Listing ${index + 1}: ${message}`); };
    if (!row || typeof row !== 'object' || Array.isArray(row)) fail('expected an object.');
    if (Object.keys(row).some(key => !fields.has(key))) fail('unknown field.');
    for (const key of ['repo_id', 'name', 'task', 'description', 'license']) {
      if (typeof row[key] !== 'string' || !row[key].trim() || row[key] !== row[key].trim()) fail(`${key} must be a nonempty, trimmed string.`);
    }
    const parts = row.repo_id.split('/');
    if (parts.length !== 2 || parts.some(part => !segment.test(part))) fail('repo_id must be owner/model.');
    if (seen.has(row.repo_id.toLowerCase())) fail('duplicate repo_id.');
    seen.add(row.repo_id.toLowerCase());
    if (row.description.length > 300) fail('description is longer than 300 characters.');
    if (row.size_mb !== null && (typeof row.size_mb !== 'number' || !Number.isFinite(row.size_mb) || row.size_mb <= 0)) fail('size_mb must be positive or null.');
    if (row.revision !== undefined && (typeof row.revision !== 'string' || !row.revision.trim() || row.revision !== row.revision.trim())) fail('revision must be a nonempty, trimmed string.');
  }
  return value;
}

export function modelUrl(model) {
  const base = `https://huggingface.co/${model.repo_id}`;
  return model.revision ? `${base}/tree/${encodeURIComponent(model.revision)}` : base;
}

export function selectModels(models, { query = '', task = '', sort = 'name' } = {}) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const selected = models.filter(model => {
    if (task && model.task !== task) return false;
    const searchable = [model.name, model.task, model.description, model.repo_id, model.license].join(' ').toLocaleLowerCase();
    return terms.every(term => searchable.includes(term));
  });
  return selected.sort((a, b) => {
    let result = 0;
    if (sort === 'size') {
      if (a.size_mb === null || b.size_mb === null) result = a.size_mb === b.size_mb ? 0 : a.size_mb === null ? 1 : -1;
      else result = a.size_mb - b.size_mb;
    } else if (sort === 'task') result = a.task.localeCompare(b.task);
    else if (sort === 'author') result = a.repo_id.split('/')[0].localeCompare(b.repo_id.split('/')[0]);
    return result || a.name.localeCompare(b.name) || a.repo_id.localeCompare(b.repo_id);
  });
}
