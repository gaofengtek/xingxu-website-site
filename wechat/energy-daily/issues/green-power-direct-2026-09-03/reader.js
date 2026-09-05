(() => {
  'use strict';

  const TOTAL_PAGES = 22;
  const chapters = [
    { key: 'overview', start: 1, end: 7, no: '01', title: '报告概览', note: '政策、方案与测算总览' },
    { key: 'admission', start: 8, end: 10, no: '02', title: '项目准入', note: '概念关系、模式选择与比例校核' },
    { key: 'calculation', start: 11, end: 15, no: '03', title: '计量测算', note: '数据闭环、储能角色与费用边界' },
    { key: 'validation', start: 16, end: 20, no: '04', title: '验证实施', note: '证据层级、工况矩阵与工作包' },
    { key: 'sources', start: 21, end: 22, no: '05', title: '来源结论', note: '最新口径、结论与下一步' }
  ];

  const pages = document.querySelector('#report-pages');
  const currentPage = document.querySelector('#current-page');
  const progress = document.querySelector('#reading-progress-fill');
  const viewer = document.querySelector('#page-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerCounter = document.querySelector('#viewer-counter');
  const viewerClose = document.querySelector('#viewer-close');
  const viewerPrev = document.querySelector('#viewer-prev');
  const viewerNext = document.querySelector('#viewer-next');
  let viewerPage = 1;
  let observerPauseUntil = 0;

  const chapterForPage = page => chapters.find(chapter => page >= chapter.start && page <= chapter.end);
  const pageLabel = page => String(page).padStart(2, '0');

  const chapterBreak = chapter => {
    const item = document.createElement('li');
    item.className = 'chapter-break';
    item.setAttribute('aria-label', `第${chapter.no}节点 ${chapter.title}`);
    item.innerHTML = `<b>${chapter.no}</b><span>${chapter.title}</span><small>${chapter.note}</small>`;
    return item;
  };

  const reportPage = page => {
    const chapter = chapterForPage(page);
    const item = document.createElement('li');
    const figure = document.createElement('figure');
    const open = document.createElement('button');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');

    figure.className = 'report-page';
    figure.id = `page-${page}`;
    figure.dataset.page = String(page);
    figure.dataset.chapter = chapter.key;

    open.className = 'page-open';
    open.type = 'button';
    open.dataset.viewerPage = String(page);
    open.setAttribute('aria-label', `放大查看报告第 ${page} 页`);

    image.className = 'page-image';
    image.src = `assets/pages/page-${pageLabel(page)}.webp`;
    image.alt = `绿电直连项目研判与工程实施，第 ${page} 页，${chapter.title}`;
    image.width = 1600;
    image.height = 900;
    image.decoding = 'async';
    image.loading = page <= 2 ? 'eager' : 'lazy';
    if (page === 1) image.fetchPriority = 'high';

    caption.innerHTML = `<span>${chapter.title}</span><b>${pageLabel(page)} / ${TOTAL_PAGES}</b><span>点击放大</span>`;
    open.append(image);
    figure.append(open, caption);
    item.append(figure);
    return item;
  };

  for (let page = 1; page <= TOTAL_PAGES; page += 1) {
    const chapter = chapterForPage(page);
    if (page === chapter.start) pages.append(chapterBreak(chapter));
    pages.append(reportPage(page));
  }

  const chapterLinks = [...document.querySelectorAll('[data-chapter]')];
  const setCurrent = page => {
    const safePage = Math.min(TOTAL_PAGES, Math.max(1, page));
    const activeChapter = chapterForPage(safePage).key;
    currentPage.textContent = String(safePage);
    progress.style.width = `${(safePage / TOTAL_PAGES) * 100}%`;
    document.querySelectorAll('.report-page').forEach(element => {
      element.classList.toggle('is-current', Number(element.dataset.page) === safePage);
    });
    chapterLinks.forEach(link => {
      const active = link.dataset.chapter === activeChapter;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const reportPageElements = [...document.querySelectorAll('.report-page')];
  const syncCurrentFromScroll = () => {
    if (performance.now() < observerPauseUntil) return;
    const marker = document.querySelector('.site-bar').offsetHeight + document.querySelector('.chapter-nav').offsetHeight + 12;
    let selected = reportPageElements[0];
    for (const element of reportPageElements) {
      if (element.getBoundingClientRect().top <= marker) selected = element;
      else break;
    }
    setCurrent(Number(selected.dataset.page));
  };
  let scrollFrame = 0;
  const requestScrollSync = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      syncCurrentFromScroll();
    });
  };

  window.addEventListener('scroll', requestScrollSync, { passive: true });
  window.addEventListener('resize', requestScrollSync);
  setCurrent(1);

  chapterLinks.forEach(link => {
    link.addEventListener('click', () => {
      const chapter = chapters.find(item => item.key === link.dataset.chapter);
      if (!chapter) return;
      observerPauseUntil = performance.now() + 700;
      setCurrent(chapter.start);
      window.setTimeout(() => {
        observerPauseUntil = 0;
        syncCurrentFromScroll();
      }, 720);
    });
  });

  const showViewerPage = page => {
    viewerPage = Math.min(TOTAL_PAGES, Math.max(1, page));
    viewerImage.src = `assets/pages/page-${pageLabel(viewerPage)}.webp`;
    viewerImage.alt = `绿电直连项目研判与工程实施，第 ${viewerPage} 页`;
    viewerCounter.textContent = `${viewerPage} / ${TOTAL_PAGES} · 可双指缩放`;
    viewerPrev.disabled = viewerPage === 1;
    viewerNext.disabled = viewerPage === TOTAL_PAGES;
    viewer.querySelector('.viewer-canvas').scrollTo({ top: 0, left: 0 });
  };

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-viewer-page]');
    if (!trigger) return;
    showViewerPage(Number(trigger.dataset.viewerPage));
    if (!viewer.open) viewer.showModal();
  });

  viewerClose.addEventListener('click', () => viewer.close());
  viewerPrev.addEventListener('click', () => showViewerPage(viewerPage - 1));
  viewerNext.addEventListener('click', () => showViewerPage(viewerPage + 1));
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showViewerPage(viewerPage - 1);
    if (event.key === 'ArrowRight') showViewerPage(viewerPage + 1);
  });
})();
