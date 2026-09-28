import { modelUrl, selectModels, validateCatalog } from './catalog.mjs';

const search = document.querySelector('#search');
const tags = document.querySelector('#tags');
const tagFilter = document.querySelector('#tag-filter');
const tagSummary = document.querySelector('#tags-summary');
const sort = document.querySelector('#sort');
const status = document.querySelector('#status');
const tbody = document.querySelector('#models');
const table = document.querySelector('.table-wrap');
const empty = document.querySelector('#empty');
const reset = document.querySelector('#reset');
const retry = document.querySelector('#retry');
let models = [];

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(text, href, className) {
  const node = element('a', text, className);
  node.href = href;
  node.target = '_blank';
  node.rel = 'noopener noreferrer';
  return node;
}

function row(model) {
  const tr = element('tr');
  const name = element('td');
  name.append(link(model.name, modelUrl(model), 'model-name'));
  if (model.revision) name.append(element('span', model.revision, 'revision'));
  name.append(element('p', model.description, 'description'));
  const type = element('td');
  const badges = element('div', undefined, 'tags');
  badges.append(...model.tags.map(tag => element('span', tag, 'tag')));
  type.append(badges);
  const author = element('td');
  const owner = model.repo_id.split('/')[0];
  author.append(link(owner, `https://huggingface.co/${owner}`));
  tr.append(name, type, author,
    element('td', model.size_mb === null ? 'Not reported' : `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(model.size_mb)} MB`, 'number'),
    element('td', model.license, 'license'));
  return tr;
}

function render() {
  const selectedTags = [...tags.querySelectorAll('input:checked')].map(input => input.value);
  tagSummary.textContent = selectedTags.length ? `${selectedTags.length} selected` : 'All tags';
  const selected = selectModels(models, { query: search.value, tags: selectedTags, sort: sort.value });
  tbody.replaceChildren(...selected.map(row));
  status.textContent = `${selected.length} of ${models.length} ${models.length === 1 ? 'model' : 'models'}`;
  table.hidden = selected.length === 0;
  empty.hidden = selected.length !== 0;
  reset.hidden = !search.value && !selectedTags.length && sort.value === 'name';
  empty.querySelector('h2').textContent = models.length ? 'No matching models' : 'No models listed yet';
  empty.querySelector('p').textContent = models.length ? 'Try another search or clear your filters.' : 'Be the first to share a model using the contribution guide below.';
}

async function load() {
  retry.hidden = true;
  table.hidden = true;
  empty.hidden = true;
  reset.hidden = true;
  status.textContent = 'Loading models…';
  for (const control of [search, tags, sort]) control.disabled = true;
  try {
    const response = await fetch('./models.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
    models = validateCatalog(await response.json());
    tags.replaceChildren(...[...new Set(models.flatMap(model => model.tags))].sort().map(tag => {
      const label = element('label');
      const input = element('input');
      input.type = 'checkbox';
      input.value = tag;
      label.append(input, document.createTextNode(tag));
      return label;
    }));
    for (const control of [search, tags, sort]) control.disabled = false;
    render();
  } catch (error) {
    console.error('Unable to load community catalog:', error);
    status.textContent = 'Could not load the model catalog. Please try again.';
    retry.hidden = false;
  }
}

search.addEventListener('input', render);
tags.addEventListener('change', render);
document.addEventListener('click', event => { if (!tagFilter.contains(event.target)) tagFilter.open = false; });
tagFilter.addEventListener('keydown', event => {
  if (event.key === 'Escape') { tagFilter.open = false; tagFilter.querySelector('summary').focus(); }
});
sort.addEventListener('change', render);
reset.addEventListener('click', () => { search.value = ''; for (const input of tags.querySelectorAll('input')) input.checked = false; tags.scrollTop = 0; tagFilter.open = false; sort.value = 'name'; render(); search.focus(); });
retry.addEventListener('click', load);
load();
