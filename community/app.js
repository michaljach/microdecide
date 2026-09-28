import { modelUrl, selectModels, validateCatalog } from './catalog.mjs';

const search = document.querySelector('#search');
const task = document.querySelector('#task');
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
  type.append(element('span', model.task, 'task'));
  const author = element('td');
  const owner = model.repo_id.split('/')[0];
  author.append(link(owner, `https://huggingface.co/${owner}`));
  tr.append(name, type, author,
    element('td', model.size_mb === null ? 'Not reported' : `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(model.size_mb)} MB`, 'number'),
    element('td', model.license, 'license'));
  return tr;
}

function render() {
  const selected = selectModels(models, { query: search.value, task: task.value, sort: sort.value });
  tbody.replaceChildren(...selected.map(row));
  status.textContent = `${selected.length} of ${models.length} ${models.length === 1 ? 'model' : 'models'}`;
  table.hidden = selected.length === 0;
  empty.hidden = selected.length !== 0;
  reset.hidden = !search.value && !task.value && sort.value === 'name';
  empty.querySelector('h2').textContent = models.length ? 'No matching models' : 'No models listed yet';
  empty.querySelector('p').textContent = models.length ? 'Try another search or clear your filters.' : 'Be the first to share a model using the contribution guide below.';
}

async function load() {
  retry.hidden = true;
  table.hidden = true;
  empty.hidden = true;
  reset.hidden = true;
  status.textContent = 'Loading models…';
  for (const control of [search, task, sort]) control.disabled = true;
  try {
    const response = await fetch('./models.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
    models = validateCatalog(await response.json());
    task.replaceChildren(new Option('All tasks', ''), ...[...new Set(models.map(model => model.task))].sort().map(name => new Option(name, name)));
    for (const control of [search, task, sort]) control.disabled = false;
    render();
  } catch (error) {
    console.error('Unable to load community catalog:', error);
    status.textContent = 'Could not load the model catalog. Please try again.';
    retry.hidden = false;
  }
}

search.addEventListener('input', render);
task.addEventListener('change', render);
sort.addEventListener('change', render);
reset.addEventListener('click', () => { search.value = ''; task.value = ''; sort.value = 'name'; render(); search.focus(); });
retry.addEventListener('click', load);
load();
