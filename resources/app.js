const categories = {
  model: '模型与案例',
  document: '技术文档',
  tool: '软件与工具',
  report: '报告与演示'
};

const accessMethods = {
  direct: '直接下载',
  online: '在线阅读',
  apply: '申请获取',
  project: '仅限合作项目'
};

const resources = Array.isArray(window.XINGXU_RESOURCES) ? [...window.XINGXU_RESOURCES] : [];
const state = { category: 'all', query: '', format: 'all', access: 'all', sort: 'updated-desc' };
const categoryButtons = [...document.querySelectorAll('.rc-category-button')];
const queryInput = document.querySelector('[data-query]');
const formatSelect = document.querySelector('[data-format]');
const accessSelect = document.querySelector('[data-access]');
const sortSelect = document.querySelector('[data-sort]');
const list = document.querySelector('[data-resource-list]');
const listHead = list?.querySelector('.rc-resource-list-head');
const resultCount = document.querySelector('[data-result-count]');
const activeFilters = document.querySelector('[data-active-filters]');
const resetButton = document.querySelector('[data-reset]');
const emptyState = document.querySelector('[data-empty]');
const dialog = document.querySelector('[data-dialog]');

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function safeHref(value) {
  const href = String(value || '').trim();
  return /^(?:https:\/\/|[a-z0-9._~/-]+(?:\?[a-z0-9._~!$&'()*+,;=:@%/?-]*)?)$/i.test(href) ? href : '';
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const mb = bytes / 1024 / 1024;
  return `${mb >= 10 ? mb.toFixed(1) : mb.toFixed(2)} MB`;
}

function uniqueValues(key) {
  return [...new Set(resources.map(resource => resource[key]).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'zh-CN'));
}

function addOptions(select, values, labels = {}) {
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = labels[value] || value;
    select?.append(option);
  });
}

function normalize(value) {
  return String(value || '').toLocaleLowerCase('zh-CN');
}

function matches(resource) {
  const categoryMatch = state.category === 'all' || resource.category === state.category;
  const formatMatch = state.format === 'all' || resource.format === state.format;
  const accessMatch = state.access === 'all' || resource.access === state.access;
  const haystack = normalize([
    resource.title,
    resource.edition,
    resource.summary,
    resource.applicableTo,
    ...(resource.topics || [])
  ].join(' '));
  return categoryMatch && formatMatch && accessMatch && (!state.query || haystack.includes(normalize(state.query)));
}

function sorted(resourcesToSort) {
  const output = [...resourcesToSort];
  if (state.sort === 'title-asc') return output.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  return output.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function buildRow(resource) {
  const row = document.createElement('article');
  row.className = 'rc-resource-row';
  row.dataset.resourceId = resource.id;

  const tags = (resource.topics || []).map(topic => `<span>${escapeHTML(topic)}</span>`).join('');
  const pages = resource.pageCount ? `${resource.pageCount} 页` : resource.applicableTo;
  const accessLabel = resource.accessLabel || accessMethods[resource.access] || resource.access;
  row.innerHTML = `
    <div class="rc-resource-main">
      <p>${escapeHTML(categories[resource.category] || resource.category)}</p>
      <h3>${escapeHTML(resource.title)}${resource.edition ? `<small>${escapeHTML(resource.edition)}</small>` : ''}</h3>
      <small>${escapeHTML(resource.summary)}</small>
      <div class="rc-resource-tags">${tags}</div>
    </div>
    <div class="rc-resource-version"><b>${escapeHTML(resource.version)}</b><small>${escapeHTML(resource.updatedAt)}</small></div>
    <div class="rc-resource-format"><b>${escapeHTML(resource.format)}</b><small>${escapeHTML(formatBytes(resource.sizeBytes))}</small></div>
    <div class="rc-resource-access"><span class="rc-access-pill">${escapeHTML(accessLabel)}</span><small>${escapeHTML(pages || '')}</small></div>
    <div class="rc-resource-action"><button type="button" data-open-detail="${escapeHTML(resource.id)}">查看详情</button></div>`;
  return row;
}

function updateCounts() {
  const counts = { all: resources.length, model: 0, document: 0, tool: 0, report: 0 };
  resources.forEach(resource => { if (resource.category in counts) counts[resource.category] += 1; });
  Object.entries(counts).forEach(([key, value]) => {
    const target = document.querySelector(`[data-category-count="${key}"]`);
    if (target) target.textContent = `${value} 项`;
  });
}

function updateFilterTokens() {
  const tokens = [];
  if (state.category !== 'all') tokens.push(categories[state.category]);
  if (state.query) tokens.push(`关键词：${state.query}`);
  if (state.format !== 'all') tokens.push(state.format);
  if (state.access !== 'all') tokens.push(accessMethods[state.access] || state.access);
  if (activeFilters) activeFilters.innerHTML = tokens.map(token => `<span>${escapeHTML(token)}</span>`).join('');
  if (resetButton) resetButton.hidden = tokens.length === 0;
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.category !== 'all') params.set('category', state.category);
  if (state.query) params.set('q', state.query);
  if (state.format !== 'all') params.set('format', state.format);
  if (state.access !== 'all') params.set('access', state.access);
  if (state.sort !== 'updated-desc') params.set('sort', state.sort);
  const query = params.toString();
  try { history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`); } catch {}
}

function render() {
  list?.querySelectorAll('.rc-resource-row').forEach(row => row.remove());
  const visible = sorted(resources.filter(matches));
  visible.forEach(resource => list?.append(buildRow(resource)));
  if (resultCount) resultCount.textContent = String(visible.length);
  if (emptyState) emptyState.hidden = visible.length !== 0;
  if (listHead) listHead.hidden = visible.length === 0;
  updateFilterTokens();
  updateUrl();
}

function setCategory(category) {
  state.category = category;
  categoryButtons.forEach(button => {
    const active = button.dataset.category === category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  render();
}

function restoreFromUrl() {
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  const format = params.get('format');
  const access = params.get('access');
  const sort = params.get('sort');
  state.category = category && (category in categories) ? category : 'all';
  state.query = params.get('q') || '';
  state.format = format && uniqueValues('format').includes(format) ? format : 'all';
  state.access = access && uniqueValues('access').includes(access) ? access : 'all';
  state.sort = sort === 'title-asc' ? sort : 'updated-desc';
  if (queryInput) queryInput.value = state.query;
  if (formatSelect) formatSelect.value = state.format;
  if (accessSelect) accessSelect.value = state.access;
  if (sortSelect) sortSelect.value = state.sort;
  categoryButtons.forEach(button => {
    const active = button.dataset.category === state.category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function openDialog(resource) {
  if (!dialog || !resource) return;
  dialog.querySelector('[data-dialog-category]').textContent = categories[resource.category] || resource.category;
  dialog.querySelector('[data-dialog-title]').textContent = resource.title;
  dialog.querySelector('[data-dialog-edition]').textContent = resource.edition || '';
  dialog.querySelector('[data-dialog-summary]').textContent = resource.summary;
  dialog.querySelector('[data-dialog-version]').textContent = resource.version;
  dialog.querySelector('[data-dialog-date]').textContent = resource.updatedAt;
  dialog.querySelector('[data-dialog-applicable]').textContent = resource.applicableTo || '以资料说明为准';
  dialog.querySelector('[data-dialog-file]').textContent = `${resource.format} · ${formatBytes(resource.sizeBytes)}${resource.pageCount ? ` · ${resource.pageCount} 页` : ''}`;
  dialog.querySelector('[data-dialog-hash]').textContent = resource.sha256;
  dialog.querySelector('[data-dialog-notice]').textContent = resource.notice || '请按页面标注的获取方式使用。';
  const action = dialog.querySelector('[data-dialog-action]');
  const href = safeHref(resource.href);
  if (href) {
    action.innerHTML = `<a href="${escapeHTML(href)}">${escapeHTML(resource.actionLabel || accessMethods[resource.access] || '查看资料')}</a>`;
  } else {
    action.innerHTML = '<button type="button" disabled>当前尚未开放</button>';
  }
  dialog.showModal();
}

addOptions(formatSelect, uniqueValues('format'));
const accessLabels = Object.fromEntries(resources.map(resource => [
  resource.access,
  resource.accessLabel || accessMethods[resource.access] || resource.access
]));
addOptions(accessSelect, uniqueValues('access'), accessLabels);
updateCounts();
restoreFromUrl();
render();

categoryButtons.forEach(button => button.addEventListener('click', () => setCategory(button.dataset.category)));
queryInput?.addEventListener('input', () => { state.query = queryInput.value.trim(); render(); });
formatSelect?.addEventListener('change', () => { state.format = formatSelect.value; render(); });
accessSelect?.addEventListener('change', () => { state.access = accessSelect.value; render(); });
sortSelect?.addEventListener('change', () => { state.sort = sortSelect.value; render(); });
resetButton?.addEventListener('click', () => {
  state.query = '';
  state.format = 'all';
  state.access = 'all';
  state.sort = 'updated-desc';
  if (queryInput) queryInput.value = '';
  if (formatSelect) formatSelect.value = 'all';
  if (accessSelect) accessSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'updated-desc';
  setCategory('all');
});

document.querySelector('[data-hero-search]')?.addEventListener('submit', event => {
  event.preventDefault();
  const value = event.currentTarget.querySelector('input')?.value.trim() || '';
  state.query = value;
  if (queryInput) queryInput.value = value;
  render();
  document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth' });
});

list?.addEventListener('click', event => {
  const button = event.target.closest('[data-open-detail]');
  if (!button) return;
  openDialog(resources.find(resource => resource.id === button.dataset.openDetail));
});

dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
