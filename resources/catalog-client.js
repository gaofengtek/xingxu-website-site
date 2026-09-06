(function (window) {
  'use strict';

  var categories = {
    model: '模型与案例',
    document: '技术文档',
    tool: '软件与工具',
    report: '报告与演示'
  };
  var accessMethods = {
    direct: '直接下载',
    online: '在线阅读',
    apply: '申请获取',
    project: '仅限合作项目'
  };

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.replace(/^\s+|\s+$/g, '').length > 0;
  }

  function isPositiveNumber(value) {
    return typeof value === 'number' && isFinite(value) && value > 0;
  }

  function isPositiveInteger(value) {
    return isPositiveNumber(value) && Math.floor(value) === value;
  }

  function isDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
    var parts = value.split('-');
    var date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    return date.getUTCFullYear() === Number(parts[0]) && date.getUTCMonth() === Number(parts[1]) - 1 && date.getUTCDate() === Number(parts[2]);
  }

  function safePath(value, prefix) {
    var path = String(value || '').replace(/^\s+|\s+$/g, '');
    if (path.indexOf(prefix) !== 0) return '';
    if (path.indexOf('..') !== -1 || path.indexOf('\\') !== -1 || path.indexOf('//') !== -1) return '';
    if (/[^\u0020-\u007e]/.test(path)) return '';
    return path;
  }

  function validTopics(topics) {
    if (!Array.isArray(topics) || topics.length === 0) return false;
    for (var i = 0; i < topics.length; i += 1) {
      if (!isNonEmptyString(topics[i])) return false;
    }
    return true;
  }

  function isPublishedResource(resource) {
    var detailPath = safePath(resource && resource.detailPath, '/resources/');
    var filePath = safePath(resource && resource.filePath, '/resources/files/');
    return Boolean(
      resource &&
      resource.status === 'published' &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.id || '') &&
      Object.prototype.hasOwnProperty.call(categories, resource.category) &&
      isNonEmptyString(resource.title) &&
      isNonEmptyString(resource.edition) &&
      isNonEmptyString(resource.summary) &&
      validTopics(resource.topics) &&
      isNonEmptyString(resource.version) &&
      isDate(resource.updatedAt) &&
      isDate(resource.publishedAt) &&
      resource.format === 'PDF' &&
      isPositiveNumber(resource.sizeBytes) &&
      isPositiveInteger(resource.pageCount) &&
      isNonEmptyString(resource.applicableTo) &&
      resource.access === 'direct' &&
      detailPath === '/resources/' + resource.id + '/' &&
      filePath && /^\/resources\/files\/[a-z0-9][a-z0-9.-]*\.pdf$/.test(filePath) &&
      isNonEmptyString(resource.downloadName) && /\.pdf$/i.test(resource.downloadName) && !/[\\/\u0000-\u001f]/.test(resource.downloadName) &&
      /^[A-F0-9]{64}$/.test(resource.sha256 || '') &&
      isNonEmptyString(resource.notice) &&
      isPositiveInteger(resource.sortOrder)
    );
  }

  function validateCatalog(catalog) {
    if (!catalog || catalog.schemaVersion !== '1.0' || !Array.isArray(catalog.resources)) {
      throw new Error('UNSUPPORTED_CATALOG_SCHEMA');
    }
    var published = [];
    var ids = {};
    var details = {};
    var files = {};
    var downloadNames = {};
    for (var i = 0; i < catalog.resources.length; i += 1) {
      var resource = catalog.resources[i];
      if (!resource || resource.status !== 'published') throw new Error('PUBLIC_CATALOG_NON_PUBLISHED_RESOURCE:' + i);
      if (!isPublishedResource(resource)) throw new Error('INCOMPLETE_PUBLISHED_RESOURCE:' + String(resource && resource.id || i));
      if (ids[resource.id]) throw new Error('DUPLICATE_RESOURCE_ID:' + resource.id);
      if (details[resource.detailPath]) throw new Error('DUPLICATE_DETAIL_PATH:' + resource.detailPath);
      if (files[resource.filePath]) throw new Error('DUPLICATE_FILE_PATH:' + resource.filePath);
      if (downloadNames[resource.downloadName]) throw new Error('DUPLICATE_DOWNLOAD_NAME:' + resource.downloadName);
      ids[resource.id] = true;
      details[resource.detailPath] = true;
      files[resource.filePath] = true;
      downloadNames[resource.downloadName] = true;
      published.push(resource);
    }
    return {
      schemaVersion: catalog.schemaVersion,
      catalogVersion: catalog.catalogVersion || '',
      updatedAt: catalog.updatedAt || '',
      canonicalUrl: catalog.canonicalUrl || '',
      resources: published
    };
  }

  function load(callback) {
    var completed = false;
    var xhr = new XMLHttpRequest();
    var manualTimeout = null;
    function finish(error, catalog) {
      if (completed) return;
      completed = true;
      if (manualTimeout !== null) {
        clearTimeout(manualTimeout);
        manualTimeout = null;
      }
      callback(error, catalog);
    }
    xhr.open('GET', '/resources/catalog.json?v=20260906-link2', true);
    xhr.timeout = 9000;
    try { xhr.setRequestHeader('Cache-Control', 'no-cache'); } catch (error) {}
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          finish(null, validateCatalog(JSON.parse(xhr.responseText)));
        } catch (error) {
          finish(error);
        }
      } else {
        finish(new Error('CATALOG_HTTP_' + xhr.status));
      }
    };
    xhr.onerror = function () { finish(new Error('CATALOG_NETWORK_ERROR')); };
    xhr.ontimeout = function () { finish(new Error('CATALOG_TIMEOUT')); };
    manualTimeout = setTimeout(function () {
      finish(new Error('CATALOG_TIMEOUT'));
      try { xhr.abort(); } catch (error) {}
    }, 9000);
    try { xhr.send(); } catch (error) { finish(error); }
  }

  function formatBytes(bytes) {
    if (!isPositiveNumber(bytes)) return '—';
    var mb = bytes / 1024 / 1024;
    return (mb >= 10 ? mb.toFixed(1) : mb.toFixed(2)) + ' MB';
  }

  window.XingxuResourceCatalog = {
    categories: categories,
    accessMethods: accessMethods,
    safePath: safePath,
    formatBytes: formatBytes,
    validateCatalog: validateCatalog,
    load: load
  };
})(window);
