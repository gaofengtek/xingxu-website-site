(() => {
  'use strict';
  const page = document.documentElement.dataset.productionPage;
  const selectors = {
    '05': '.prototype-action',
    '06': '.prototype-action',
    '07': '.prototype-action',
    '08': '.purpose-action, .asset-entry .prototype-action'
  };
  if (!selectors[page]) return;
  document.addEventListener('click', event => {
    const action = event.target.closest(selectors[page]);
    if (!action || action.disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = new URL('/feedback.html', location.origin);
    target.searchParams.set('from', page);
    location.assign(target.href);
  }, true);
})();
