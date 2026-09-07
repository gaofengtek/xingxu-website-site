(() => {
  document.querySelectorAll('.policy-card:not([data-category])').forEach(card => { card.dataset.category = '政策'; });
  const buttons = [...document.querySelectorAll('[data-filter]')];
  if (!buttons.length) return;
  const select = button => {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== '全部' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    });
    document.querySelectorAll('[data-section]').forEach(section => {
      section.hidden = ![...section.querySelectorAll('[data-category]')].some(card => !card.hidden);
    });
    document.querySelector('.empty').hidden = count !== 0;
    const emptyTitle = document.querySelector('[data-empty-title]');
    if(emptyTitle) emptyTitle.textContent = `暂无${button.dataset.filter === '全部' ? '' : button.dataset.filter}内容`;
    const unit = document.querySelector('.categories').dataset.unit || '份报告';
    document.querySelector('[role=status]').textContent = `${button.dataset.filter}：${count}${unit}。`;
    const historyEmpty = document.querySelector('[data-history-empty]');
    if(historyEmpty) historyEmpty.textContent = button.dataset.filter === '全部' ? '暂无往期内容' : `暂无往期${button.dataset.filter}内容`;
  };
  buttons.forEach((button,index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', e => {
      const next = e.key === 'ArrowRight' ? (index+1)%buttons.length : e.key === 'ArrowLeft' ? (index+buttons.length-1)%buttons.length : e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 : null;
      if (next === null) return;
      e.preventDefault();buttons[next].focus();select(buttons[next]);
    });
  });
  document.querySelector('[data-reset]').addEventListener('click', () => select(buttons[0]));
})();
