(() => {
  'use strict';

  const TOTAL_PAGES = 32;
  const chapters = [
    { key: 'intro', start: 1, end: 2, no: '00', title: '封面与导读', note: '阅读路径与内容边界' },
    { key: 'conditions', start: 3, end: 10, no: '01', title: '项目条件', note: '准入、边界与基础资料' },
    { key: 'calculation', start: 11, end: 21, no: '02', title: '方案计算', note: '源荷储配置、运行限额与费用' },
    { key: 'delivery', start: 22, end: 28, no: '03', title: '工程与交付', note: '从计划到控制、验证与交付' },
    { key: 'appendix', start: 29, end: 32, no: '+', title: '附录与来源', note: '输入、公式、复算与官方来源' }
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

  const chapterForPage = page => chapters.find(chapter => page >= chapter.start && page <= chapter.end);
  const pageLabel = page => String(page).padStart(2, '0');

  const chapterBreak = chapter => {
    const item = document.createElement('li');
    item.className = 'chapter-break';
    item.setAttribute('aria-label', `第${chapter.no}章 ${chapter.title}`);
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
    image.alt = `绿电直连工程应用与星旭技术路线，第 ${page} 页，${chapter.title}`;
    image.width = 1601;
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
    chapterLinks.forEach(link => link.classList.toggle('active', link.dataset.chapter === activeChapter));
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible.length) setCurrent(Number(visible[0].target.dataset.page));
  }, { rootMargin: '-18% 0px -52% 0px', threshold: [0.05, 0.35, 0.7] });

  document.querySelectorAll('.report-page').forEach(page => observer.observe(page));
  setCurrent(1);

  const showViewerPage = page => {
    viewerPage = Math.min(TOTAL_PAGES, Math.max(1, page));
    viewerImage.src = `assets/pages/page-${pageLabel(viewerPage)}.webp`;
    viewerImage.alt = `绿电直连工程应用与星旭技术路线，第 ${viewerPage} 页`;
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
