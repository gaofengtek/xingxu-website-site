(() => {
  const page = document.documentElement.dataset.refinement;
  document.querySelectorAll('img[src="/assets/310ca6dcbc9ba265d9208847.png"]').forEach(img => {img.src='/assets/310ca6dcbc9ba265d9208847.png';});
  if (page === '04') {
    const tabs = document.querySelector('.category-tabs');
    const keys = ['ArrowLeft','ArrowRight','Home','End'];
    tabs.addEventListener('keydown', event => {
      if (!keys.includes(event.key)) return;
      const buttons = [...tabs.querySelectorAll('button')];
      const index = buttons.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length-1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault(); buttons[next].focus(); buttons[next].click();
    });
  }
  if (!['02','03'].includes(page)) return;
  const toast = document.createElement('p'); toast.className='list-toast'; toast.setAttribute('role','status'); document.body.append(toast);
  let timer;
  const message = () => { toast.textContent='本地视觉审核示例，未连接真实文章；未发表或发送内容。';toast.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('visible'),3000); };
  ['featureCta','more'].forEach(id => { const old=document.getElementById(id);const b=document.createElement('button');b.type='button';b.id=id;b.className=old.className;b.textContent=old.textContent;old.replaceWith(b);b.addEventListener('click',message); });
  document.querySelectorAll('.item').forEach(item => { const b=document.createElement('button');b.type='button';b.className='item-action';b.setAttribute('aria-label','查看'+item.querySelector('h3').textContent);item.append(b);b.addEventListener('click',message); });
  const filters=[...document.querySelectorAll('.cat')];
  filters.forEach((b,i) => { b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{ filters.forEach(other=>{other.classList.toggle('active',other===b);other.setAttribute('aria-pressed',String(other===b));});toast.textContent='已选“'+b.textContent+'”。这里仅预览选中效果，示例列表不代表真实筛选结果。';toast.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('visible'),3000); }); });
  document.querySelector('.categories').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const i=filters.indexOf(document.activeElement);const n=e.key==='Home'?0:e.key==='End'?filters.length-1:(i+(e.key==='ArrowRight'?1:-1)+filters.length)%filters.length;e.preventDefault();filters[n].focus();filters[n].click();});
})();
