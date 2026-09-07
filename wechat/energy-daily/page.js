(() => {
  'use strict';
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const latest = document.querySelector('.latest');
  const history = document.querySelector('.history');
  const historyItems = [...document.querySelectorAll('.history .report-item')];
  const empty = document.querySelector('.content > .empty-state');
  const status = document.querySelector('.filter-status');
  const select = button => {
    const category = button.dataset.filter;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const latestVisible = category === '全部' || latest.dataset.category === category;
    latest.hidden = !latestVisible;
    const visibleHistory = historyItems.filter(item => {
      const visible = category === '全部' || item.dataset.category === category;
      item.hidden = !visible;
      return visible;
    });
    history.hidden = visibleHistory.length === 0;
    const count = Number(latestVisible) + visibleHistory.length;
    empty.hidden = count > 0;
    status.textContent = `${category}：${count}份报告。`;
  };
  buttons.forEach(button => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      const index = buttons.indexOf(button);
      const next = event.key === 'ArrowRight' ? (index + 1) % buttons.length
        : event.key === 'ArrowLeft' ? (index + buttons.length - 1) % buttons.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      buttons[next].focus();
      select(buttons[next]);
    });
  });
})();
