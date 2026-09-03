(() => {
  'use strict';
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const latest = document.querySelector('.latest');
  const history = document.querySelector('.history');
  const empty = document.querySelector('.content > .empty-state');
  const status = document.querySelector('.filter-status');
  const select = button => {
    const category = button.dataset.filter;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const visible = category === '全部' || latest.dataset.category === category;
    latest.hidden = !visible;
    history.hidden = !visible;
    empty.hidden = visible;
    status.textContent = `${category}：${visible ? 1 : 0}份报告。`;
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
