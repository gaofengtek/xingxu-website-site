(function () {
  'use strict';
  var title = document.getElementById('title'), status = document.getElementById('status');
  var save = document.getElementById('save'), retry = document.getElementById('retry');
  var hint = document.getElementById('hint'), objectUrl = null, resource;
  function release() { if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; } }
  async function prepare() {
    release(); save.hidden = true; retry.hidden = true; hint.hidden = true;
    status.textContent = '正在准备文件，请稍候…';
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 45000);
    try {
      var response = await fetch(resource.filePath, {signal: controller.signal});
      if (!response.ok) throw new Error('HTTP');
      var data = await response.arrayBuffer();
      var signature = String.fromCharCode.apply(null, new Uint8Array(data.slice(0, 5)));
      if (signature !== '%PDF-' || data.byteLength !== resource.sizeBytes) throw new Error('FILE');
      if (window.crypto && window.crypto.subtle) {
        var digest = await crypto.subtle.digest('SHA-256', data);
        var hash = Array.from(new Uint8Array(digest), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        if (hash.toUpperCase() !== resource.sha256) throw new Error('HASH');
      }
      objectUrl = URL.createObjectURL(new Blob([data], {type: 'application/octet-stream'}));
      save.href = objectUrl; save.download = resource.downloadName;
      save.hidden = false; hint.hidden = false;
      status.textContent = '文件已准备好，点击下方按钮保存。';
    } catch (error) {
      status.textContent = '文件准备失败，请检查网络后重试。'; retry.hidden = false;
    } finally { clearTimeout(timer); }
  }
  retry.addEventListener('click', prepare);
  window.addEventListener('pagehide', release);
  window.addEventListener('pageshow', function (event) { if (event.persisted && resource && !/MicroMessenger/i.test(navigator.userAgent)) prepare(); });
  XingxuResourceCatalog.load(function (error, catalog) {
    var id = new URLSearchParams(location.search).get('id');
    resource = !error && catalog.resources.find(function (item) { return item.id === id; });
    if (!resource) { title.textContent = '暂时无法获取该资料'; status.textContent = '请返回资料下载页面重新选择。'; return; }
    title.textContent = resource.title;
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      status.textContent = '微信内可能只能预览 PDF，保存文件请使用手机浏览器。';
      document.getElementById('wechat').hidden = false;
      var link = document.getElementById('link'); link.value = location.href;
      document.getElementById('copy').addEventListener('click', async function () {
        try { await navigator.clipboard.writeText(link.value); document.getElementById('copy-status').textContent = '链接已复制，请粘贴到手机浏览器。'; }
        catch (error) { link.focus(); link.select(); document.getElementById('copy-status').textContent = '请长按链接并选择复制。'; }
      });
    } else { prepare(); }
  });
})();
