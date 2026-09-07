(function () {
  'use strict';

  var catalogClient = window.XingxuResourceCatalog;
  var categories = catalogClient ? catalogClient.categories : {};
  var state = { resources: [], category: 'all', query: '' };
  var queryInput = document.querySelector('[data-query]');
  var clearButton = document.querySelector('[data-clear]');
  var categoryNav = document.querySelector('[data-categories]');
  var list = document.querySelector('[data-list]');
  var empty = document.querySelector('[data-empty]');

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
    });
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase('zh-CN');
  }

  function safePath(value, prefix) {
    return catalogClient ? catalogClient.safePath(value, prefix) : '';
  }

  function formatBytes(bytes) {
    return catalogClient ? catalogClient.formatBytes(bytes) : '—';
  }

  function sorted(resources) {
    return resources.slice().sort(function (a, b) {
      return String(b.updatedAt).localeCompare(String(a.updatedAt)) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    });
  }

  function matches(resource) {
    if (state.category !== 'all' && resource.category !== state.category) return false;
    if (!state.query) return true;
    var content = [resource.title, resource.edition, resource.summary, resource.applicableTo].concat(resource.topics || []).join(' ');
    return normalize(content).indexOf(normalize(state.query)) >= 0;
  }

  function buildItem(resource) {
    var filePath = safePath(resource.filePath, '/resources/files/');
    var position = sorted(state.resources).indexOf(resource) + 1;
    var itemNumber = ('0' + position).slice(-2);
    var downloadName = resource.downloadName || (resource.title + '.pdf');
    var article = document.createElement('article');
    article.className = 'resource-item';
    article.setAttribute('data-resource-id', resource.id);
    article.innerHTML = [
      '<div class="resource-topline">',
        '<p class="resource-label"><span class="resource-index">', escapeHTML(itemNumber), '</span><span>', escapeHTML(categories[resource.category]), '</span></p>',
      '</div>',
      '<h3>', escapeHTML(resource.title), '</h3>',
      '<p class="resource-edition">', escapeHTML(resource.edition), '</p>',
      '<div class="resource-actions">',
        '<a class="open-pdf" href="', escapeHTML(filePath), '" target="_blank" rel="noopener">打开 PDF <span aria-hidden="true">↗</span></a>',
        '<a class="primary download-pdf" href="', escapeHTML(filePath), '" download="', escapeHTML(downloadName), '">下载 PDF <span aria-hidden="true">↓</span></a>',
      '</div>'
    ].join('');
    return article;
  }

  function renderCategories() {
    var counts = { all: state.resources.length };
    var categoryKeys = Object.keys(categories);
    var i;
    for (i = 0; i < state.resources.length; i += 1) {
      counts[state.resources[i].category] = (counts[state.resources[i].category] || 0) + 1;
    }
    var keys = ['all'];
    for (i = 0; i < categoryKeys.length; i += 1) {
      if (counts[categoryKeys[i]] > 0) keys.push(categoryKeys[i]);
    }
    categoryNav.innerHTML = keys.map(function (key) {
      var label = key === 'all' ? '全部' : categories[key];
      return '<button type="button" data-category="' + escapeHTML(key) + '" aria-pressed="' + String(state.category === key) + '">' + escapeHTML(label) + '<small>' + escapeHTML(counts[key] || 0) + '</small></button>';
    }).join('');
  }

  function removeItems() {
    var items = list.querySelectorAll('.resource-item');
    for (var i = items.length - 1; i >= 0; i -= 1) items[i].parentNode.removeChild(items[i]);
  }

  function render() {
    var visible = sorted(state.resources.filter(matches));
    removeItems();
    for (var i = 0; i < visible.length; i += 1) list.appendChild(buildItem(visible[i]));
    empty.hidden = visible.length !== 0;
    clearButton.hidden = !state.query;
  }

  function setLoading() {
    removeItems();
    var loading = list.querySelector('[data-loading]');
    if (!loading) {
      loading = document.createElement('div');
      loading.setAttribute('data-loading', '');
      list.insertBefore(loading, list.firstChild);
    }
    loading.className = 'loading';
    loading.innerHTML = '<span aria-hidden="true"></span><p>正在载入……</p>';
    list.setAttribute('aria-busy', 'true');
    queryInput.disabled = true;
    clearButton.hidden = true;
    categoryNav.innerHTML = '';
    empty.hidden = true;
  }

  function showFailure() {
    var loading = list.querySelector('[data-loading]');
    if (loading) {
      loading.className = 'loading is-error';
      loading.innerHTML = '<div><h3>资料目录暂未载入</h3><p>请检查网络后重试。</p><button type="button" data-retry>重新载入</button></div>';
      loading.querySelector('[data-retry]').onclick = initialize;
    }
    list.setAttribute('aria-busy', 'false');
    queryInput.disabled = true;
  }

  function initialize() {
    setLoading();
    if (!catalogClient) {
      showFailure();
      return;
    }
    catalogClient.load(function (error, catalog) {
      if (error) {
        showFailure();
        return;
      }
      state.resources = catalog.resources.slice();
      state.category = 'all';
      state.query = '';
      queryInput.value = '';
      var loading = list.querySelector('[data-loading]');
      if (loading && loading.parentNode) loading.parentNode.removeChild(loading);
      list.setAttribute('aria-busy', 'false');
      queryInput.disabled = false;
      renderCategories();
      render();
    });
  }

  queryInput.oninput = function () {
    state.query = queryInput.value.replace(/^\s+|\s+$/g, '');
    render();
  };
  clearButton.onclick = function () {
    queryInput.value = '';
    state.query = '';
    queryInput.focus();
    render();
  };
  categoryNav.onclick = function (event) {
    var button = event.target;
    while (button && button !== categoryNav && !button.getAttribute('data-category')) button = button.parentNode;
    if (!button || button === categoryNav) return;
    state.category = button.getAttribute('data-category');
    renderCategories();
    render();
  };

  initialize();
})();
