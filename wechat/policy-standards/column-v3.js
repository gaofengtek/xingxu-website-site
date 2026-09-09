// Cards remain in the HTML for link auditing. Each filter has one latest card.
// The publication service prepends new cards at the existing section anchor.
(() => {
  const latest = document.querySelector('[data-policy-latest]');
  const history = document.querySelector('[data-policy-history]');
  if (!latest || !history) return;
  const cards = [...document.querySelectorAll('article.policy-card')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const empty = document.querySelector('.empty');
  const historyHeading = history.querySelector('.section-heading');
  // Assign across the whole column before filtering. Existing issue IDs are
  // authoritative; new cards are prepended by the publication service.
  let lastIssue = Math.max(0, ...cards.map(card => Number(card.dataset.issue) || 0));
  [...cards].reverse().forEach(card => {
    if (!card.dataset.issue) card.dataset.issue = String(++lastIssue);
  });
  cards.forEach(card => {
    const heading = card.querySelector('h3');
    heading?.querySelectorAll('br').forEach(br => br.replaceWith(''));
    const issue = card.querySelector('.issue');
    if (issue) issue.textContent = `第${card.dataset.issue}期`;
    card.querySelectorAll('.badge.latest').forEach(badge => badge.remove());
  });
  function select(button) {
    const filter = button.dataset.filter;
    const matches = cards.filter(card => filter === '全部' || card.dataset.category === filter);
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => {
      card.hidden = !matches.includes(card);
      card.querySelectorAll('.badge.latest').forEach(badge => badge.remove());
      history.append(card);
    });
    if (matches.length) {
      latest.insertBefore(matches[0], empty);
      const badge = document.createElement('span');
      badge.className = 'badge latest';
      badge.textContent = '最新';
      matches[0].querySelector('.meta')?.prepend(badge);
    }
    history.hidden = matches.length <= 1;
    historyHeading.querySelector('span').textContent = `${Math.max(0, matches.length - 1)}篇`;
    empty.hidden = matches.length !== 0;
    empty.querySelector('h3').textContent = `暂无${filter === '全部' ? '' : filter}内容`;
    document.querySelector('[role="status"]').textContent = `${filter}：${matches.length}篇内容。`;
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % buttons.length
        : event.key === 'ArrowLeft' ? (index + buttons.length - 1) % buttons.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); buttons[next].focus(); select(buttons[next]);
    });
  });
  document.querySelector('[data-reset]').addEventListener('click', () => select(buttons[0]));
  select(buttons[0]);
})();
