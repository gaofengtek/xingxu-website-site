(function () {
  'use strict';

  var catalogClient = window.XingxuResourceCatalog;
  var categories = catalogClient ? catalogClient.categories : {};
  var state = { resources: [], category: 'all', query: '' };
  var queryInput = document.querySelector('[data-mobile-query]');
  var clearButton = document.querySelector('[data-clear-query]');
  var categoryNav = document.querySelector('[data-mobile-categories]');
  var resultCount = document.querySelector('.mobile-result-count');
  var list = document.querySelector('[data-mobile-resource-list]');
  var empty = document.querySelector('[data-mobile-empty]');
  var catalogVersion = document.querySelector('[data-catalog-version]');
  var heroCount = document.querySelector('[data-hero-count]');

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
      var byDate = String(b.updatedAt).localeCompare(String(a.updatedAt));
      return byDate || Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    });
  }

  function matches(resource) {
    if (state.category !== 'all' && resource.category !== state.category) return false;
    if (!state.query) return true;
    var haystack = normalize([
      resource.title,
      resource.edition,
      resource.summary,
      resource.applicableTo
    ].concat(resource.topics || []).join(' '));
    return haystack.indexOf(normalize(state.query)) >= 0;
  }

  function buildCard(resource) {
    var detailPath = safePath(resource.detailPath, '/resources/');
    var filePath = safePath(resource.filePath, '/resources/files/');
    var topics = resource.topics.map(function (topic) {
      return '<span>' + escapeHTML(topic) + '</span>';
    }).join('');
    var article = document.createElement('article');
    article.className = 'mobile-resource-card';
    article.setAttribute('data-resource-id', resource.id);
    article.innerHTML = [
      '<div class="resource-card-head">',
        '<div class="resource-card-labels"><span class="resource-category-label">', escapeHTML(categories[resource.category]), '</span><span class="resource-published">已公开</span></div>',
        '<h3>', escapeHTML(resource.title), '</h3>',
        '<p class="resource-edition">', escapeHTML(resource.edition), '</p>',
        '<p class="resource-summary">', escapeHTML(resource.summary), '</p>',
        '<div class="resource-topics">', topics, '</div>',
      '</div>',
      '<dl class="resource-facts">',
        '<div><dt>版本</dt><dd>', escapeHTML(resource.version), '</dd></div>',
        '<div><dt>首次公开</dt><dd>', escapeHTML(resource.publishedAt), '</dd></div>',
        '<div><dt>更新</dt><dd>', escapeHTML(resource.updatedAt), '</dd></div>',
        '<div><dt>页数</dt><dd>', escapeHTML(resource.pageCount), ' 页</dd></div>',
        '<div><dt>文件</dt><dd>', escapeHTML(formatBytes(resource.sizeBytes)), '</dd></div>',
        '<div><dt>格式</dt><dd>', escapeHTML(resource.format), '</dd></div>',
      '</dl>',
      '<details class="resource-identity"><summary>查看 ', escapeHTML(resource.format), ' 文件身份</summary><code>', escapeHTML(resource.sha256), '</code></details>',
      '<div class="resource-actions">',
        '<a href="', escapeHTML(detailPath), '" aria-label="查看《', escapeHTML(resource.title), '》资料详情">查看资料详情 <span aria-hidden="true">→</span></a>',
        '<a href="', escapeHTML(filePath), '" aria-label="打开《', escapeHTML(resource.title), '》', escapeHTML(resource.format), '">打开 ', escapeHTML(resource.format), ' <span aria-hidden="true">↗</span></a>',
      '</div>'
    ].join('');
    return article;
  }

  function renderCategories() {
    var counts = { all: state.resources.length };
    var categoryKeys = Object.keys(categories);
    var i;
    for (i = 0; i < state.resources.length; i += 1) {
      var key = state.resources[i].category;
      counts[key] = (counts[key] || 0) + 1;
    }
    var keys = ['all'];
    for (i = 0; i < categoryKeys.length; i += 1) {
      if (counts[categoryKeys[i]] > 0) keys.push(categoryKeys[i]);
    }
    categoryNav.innerHTML = keys.map(function (key) {
      var active = state.category === key;
      var label = key === 'all' ? '全部资料' : categories[key];
      return '<button type="button" data-mobile-category="' + escapeHTML(key) + '" aria-pressed="' + String(active) + '">' + escapeHTML(label) + '<small>' + escapeHTML(counts[key] || 0) + '</small></button>';
    }).join('');
  }

  function removeCards() {
    var cards = list.querySelectorAll('.mobile-resource-card');
    for (var i = cards.length - 1; i >= 0; i -= 1) cards[i].parentNode.removeChild(cards[i]);
  }

  function render() {
    var visible = sorted(state.resources.filter(matches));
    removeCards();
    for (var i = 0; i < visible.length; i += 1) list.appendChild(buildCard(visible[i]));
    empty.hidden = visible.length !== 0;
    resultCount.innerHTML = state.query || state.category !== 'all'
      ? '当前显示 <b>' + visible.length + '</b> 项资料'
      : '与官网同步，共 <b>' + visible.length + '</b> 项公开资料';
    clearButton.hidden = !state.query;
  }

  function setLoading() {
    removeCards();
    var loading = list.querySelector('[data-mobile-loading]');
    if (!loading) {
      loading = document.createElement('div');
      loading.setAttribute('data-mobile-loading', '');
      list.insertBefore(loading, list.firstChild);
    }
    loading.className = 'mobile-loading';
    loading.innerHTML = '<span aria-hidden="true"></span><p>正在与官网资料中心同步……</p>';
    list.setAttribute('aria-busy', 'true');
    queryInput.disabled = true;
    clearButton.hidden = true;
    categoryNav.innerHTML = '';
    empty.hidden = true;
    resultCount.textContent = '正在读取统一资料清单……';
  }

  function showFailure() {
    var loading = list.querySelector('[data-mobile-loading]');
    if (loading) {
      loading.className = 'mobile-loading is-error';
      loading.innerHTML = '<div><h3>资料清单暂未同步</h3><p>网络较慢或目录正在更新，请重新同步。若多次失败，可返回官网首页联系我们。</p><button type="button" data-retry-catalog>重新同步</button><a href="/">返回官网首页</a></div>';
      loading.querySelector('[data-retry-catalog]').onclick = initialize;
    }
    list.setAttribute('aria-busy', 'false');
    queryInput.disabled = true;
    resultCount.textContent = '当前无法读取公开资料清单';
    catalogVersion.textContent = '同步未完成';
    heroCount.textContent = '—';
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
      var loading = list.querySelector('[data-mobile-loading]');
      if (loading && loading.parentNode) loading.parentNode.removeChild(loading);
      list.setAttribute('aria-busy', 'false');
      queryInput.disabled = false;
      heroCount.textContent = String(state.resources.length);
      catalogVersion.textContent = '目录 ' + (catalog.catalogVersion || catalog.updatedAt || '已同步');
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
    while (button && button !== categoryNav && !button.getAttribute('data-mobile-category')) button = button.parentNode;
    if (!button || button === categoryNav) return;
    state.category = button.getAttribute('data-mobile-category');
    var buttons = categoryNav.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i += 1) buttons[i].setAttribute('aria-pressed', String(buttons[i] === button));
    render();
  };

  initialize();
})();
