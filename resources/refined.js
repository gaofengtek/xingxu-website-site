(() => {
 'use strict';
 const client=window.XingxuResourceCatalog, list=document.querySelector('[data-list]'), input=document.querySelector('[data-query]'), empty=document.querySelector('[data-empty]'), status=document.querySelector('[data-status]'), nav=document.querySelector('[data-categories]');
 let resources=[],category='all';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(){
  const query=input.value.trim().toLowerCase();
  const visible=resources.filter(r=>(category==='all'||r.category===category)&&[r.title,r.edition,r.summary,...r.topics].join(' ').toLowerCase().includes(query));
  list.innerHTML=visible.map(r=>`<article class="library-card" data-resource-id="${esc(r.id)}"><h3>${esc(r.title)}</h3><p class="library-edition">${esc(r.edition)}</p><p class="library-meta"><span>${esc(r.updatedAt)}</span><span>PDF · ${r.pageCount} 页</span><span>${esc(client.formatBytes(r.sizeBytes))}</span></p><div class="library-actions"><a href="${esc(client.safePath(r.filePath,'/resources/files/'))}" target="_blank" rel="noopener">打开 PDF <span aria-hidden="true">↗</span></a><a class="primary" href="/resources/save/?id=${encodeURIComponent(r.id)}">下载 PDF <span aria-hidden="true">↓</span></a></div><details><summary>资料说明</summary><p>${esc(r.summary)}</p><dl><div><dt>版本</dt><dd>${esc(r.version)}</dd></div><div><dt>适用范围</dt><dd>${esc(r.applicableTo)}</dd></div><div><dt>使用说明</dt><dd>${esc(r.notice)}</dd></div><div><dt>SHA-256</dt><dd><code>${esc(r.sha256)}</code></dd></div></dl></details></article>`).join('');
  empty.hidden=visible.length>0; status.textContent=`找到 ${visible.length} 份资料`;
 }
 function load(){
  input.disabled=true;list.setAttribute('aria-busy','true');list.innerHTML='<p>正在读取资料…</p>';
  if(!client){list.setAttribute('aria-busy','false');list.innerHTML='<p>页面组件未能载入，请刷新后重试。</p>';return;}
  client.load((error,catalog)=>{
   list.setAttribute('aria-busy','false');
   if(error){list.innerHTML='<div><h3>资料暂时未能载入</h3><p>请检查网络后重试。</p><button type="button" data-retry>重新加载</button></div>';list.querySelector('[data-retry]').onclick=load;status.textContent='资料载入失败';return;}
   resources=catalog.resources.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||a.sortOrder-b.sortOrder);input.disabled=false;
   const types=[...new Set(resources.map(r=>r.category))];nav.hidden=types.length<2;
   nav.innerHTML=['all',...types].map(type=>`<button type="button" data-category="${esc(type)}" aria-pressed="${type===category}">${esc(type==='all'?'全部':client.categories[type])}</button>`).join('');render();
  });
 }
 input.addEventListener('input',render);document.querySelector('[data-reset]').onclick=()=>{input.value='';category='all';nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.category==='all'));render();input.focus();};
 nav.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;category=button.dataset.category;nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b===button));render();});load();
})();
