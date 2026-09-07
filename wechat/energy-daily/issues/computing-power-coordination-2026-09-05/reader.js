(() => {
  'use strict';

  const configElement = document.querySelector('#reader-config');
  if (!configElement) throw new Error('缺少 #reader-config。');

  let config;
  try {
    config = JSON.parse(configElement.textContent);
  } catch (error) {
    throw new Error(`Reader 公开配置无法解析：${error.message}`);
  }

  const totalPages = Number(config?.reader?.pageCount);
  const pageImage = config?.reader?.pageImage;
  const sourceChapters = config?.reader?.chapters;
  if (!Number.isInteger(totalPages) || totalPages < 5) throw new Error('reader.pageCount 必须是至少为 5 的整数。');
  if (!Array.isArray(sourceChapters) || sourceChapters.length !== 5) throw new Error('Reader 必须且只能配置五个章节。');
  if (!pageImage?.directory || !pageImage?.prefix || !pageImage?.extension) throw new Error('reader.pageImage 配置不完整。');

  const chapters = sourceChapters.map((chapter, index) => ({
    ...chapter,
    no: String(index + 1).padStart(2, '0'),
    endPage: index < sourceChapters.length - 1 ? Number(sourceChapters[index + 1].startPage) - 1 : totalPages
  }));
  const starts = chapters.map(chapter => Number(chapter.startPage));
  if (starts[0] !== 1 || starts.some((start, index) => !Number.isInteger(start) || start < 1 || start > totalPages || (index > 0 && start <= starts[index - 1]))) {
    throw new Error('五章 startPage 必须从 1 开始、严格递增且不超过总页数。');
  }

  const pageNumberWidth = Number(pageImage.digits);
  if (!Number.isInteger(pageNumberWidth) || pageNumberWidth < 2 || pageNumberWidth < String(totalPages).length) throw new Error('reader.pageImage.digits 无法容纳总页数。');
  const trimSlashes = value => String(value).replace(/\\/g, '/').replace(/\/+$/g, '');
  const imageDirectory = trimSlashes(pageImage.directory);
  const imageExtension = String(pageImage.extension).replace(/^\./, '');
  const pageLabel = page => String(page).padStart(pageNumberWidth, '0');
  const pageSource = page => `${imageDirectory}/${pageImage.prefix}${pageLabel(page)}.${imageExtension}`;
  const chapterForPage = page => chapters.find(chapter => page >= chapter.startPage && page <= chapter.endPage);

  const pages = document.querySelector('#report-pages');
  const currentPage = document.querySelector('#current-page');
  const progress = document.querySelector('#reading-progress-fill');
  const viewer = document.querySelector('#page-viewer');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerCounter = document.querySelector('#viewer-counter');
  const viewerClose = document.querySelector('#viewer-close');
  const viewerPrev = document.querySelector('#viewer-prev');
  const viewerNext = document.querySelector('#viewer-next');
  const viewerCanvas = viewer.querySelector('.viewer-canvas');
  const chapterLinks = [...document.querySelectorAll('.chapter-nav [data-chapter]')];
  let viewerPage = 1;
  let viewerTrigger = null;
  let observerPauseUntil = 0;
  let currentFigure = null;

  document.documentElement.style.setProperty('--page-aspect', `${config.reader.pageAspect.width} / ${config.reader.pageAspect.height}`);

  const chapterBreak = chapter => {
    const item = document.createElement('li');
    const number = document.createElement('b');
    const title = document.createElement('span');
    const note = document.createElement('small');
    item.className = 'chapter-break';
    item.setAttribute('aria-label', `第${chapter.no}节点 ${chapter.title}`);
    number.textContent = chapter.no;
    title.textContent = chapter.title;
    note.textContent = chapter.note || chapter.label;
    item.append(number, title, note);
    return item;
  };

  const reportPage = page => {
    const chapter = chapterForPage(page);
    const item = document.createElement('li');
    const figure = document.createElement('figure');
    const open = document.createElement('button');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');
    const captionChapter = document.createElement('span');
    const captionPage = document.createElement('b');
    const captionAction = document.createElement('span');

    figure.className = 'report-page';
    figure.id = `page-${page}`;
    figure.dataset.page = String(page);
    figure.dataset.chapter = chapter.key;

    open.className = 'page-open';
    open.type = 'button';
    open.dataset.viewerPage = String(page);
    open.setAttribute('aria-label', `放大查看报告第 ${page} 页`);

    image.className = 'page-image';
    image.src = pageSource(page);
    image.alt = `${config.content.title}，第 ${page} 页，${chapter.title}`;
    image.width = Number(pageImage.width);
    image.height = Number(pageImage.height);
    image.decoding = 'async';
    image.loading = page <= 2 ? 'eager' : 'lazy';
    if (page === 1) image.fetchPriority = 'high';

    captionChapter.textContent = chapter.title;
    captionPage.textContent = `${pageLabel(page)} / ${totalPages}`;
    captionAction.textContent = '点击放大';
    caption.append(captionChapter, captionPage, captionAction);
    open.append(image);
    figure.append(open, caption);
    item.append(figure);
    return item;
  };

  for (let page = 1; page <= totalPages; page += 1) {
    const chapter = chapterForPage(page);
    if (page === chapter.startPage) pages.append(chapterBreak(chapter));
    pages.append(reportPage(page));
  }

  const setCurrent = page => {
    const safePage = Math.min(totalPages, Math.max(1, Number(page) || 1));
    const activeChapter = chapterForPage(safePage).key;
    currentPage.textContent = String(safePage);
    progress.style.width = `${(safePage / totalPages) * 100}%`;
    if (currentFigure) currentFigure.classList.remove('is-current');
    currentFigure = document.querySelector(`.report-page[data-page="${safePage}"]`);
    if (currentFigure) currentFigure.classList.add('is-current');
    chapterLinks.forEach(link => {
      const active = link.dataset.chapter === activeChapter;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const reportPageElements = [...document.querySelectorAll('.report-page')];
  const isAtDocumentEnd = () => Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
  const syncCurrentFromScroll = () => {
    if (isAtDocumentEnd()) {
      setCurrent(totalPages);
      return;
    }
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

  chapterLinks.forEach(link => {
    link.addEventListener('click', event => {
      const chapter = chapters.find(item => item.key === link.dataset.chapter);
      if (!chapter) return;
      event.preventDefault();
      observerPauseUntil = performance.now() + 700;
      setCurrent(chapter.startPage);
      const target = document.querySelector(`#page-${chapter.startPage}`);
      history.replaceState(null, '', `#page-${chapter.startPage}`);
      target?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      window.setTimeout(() => {
        observerPauseUntil = 0;
        syncCurrentFromScroll();
      }, 720);
    });
  });

  const showViewerPage = page => {
    viewerPage = Math.min(totalPages, Math.max(1, Number(page) || 1));
    viewerImage.src = pageSource(viewerPage);
    viewerImage.alt = `${config.content.title}，第 ${viewerPage} 页`;
    viewerImage.width = Number(pageImage.width);
    viewerImage.height = Number(pageImage.height);
    viewerCounter.textContent = `${viewerPage} / ${totalPages} · 可双指缩放`;
    viewerPrev.disabled = viewerPage === 1;
    viewerNext.disabled = viewerPage === totalPages;
    viewerCanvas.scrollTo({ top: 0, left: 0 });
  };

  const openViewer = trigger => {
    viewerTrigger = trigger;
    showViewerPage(Number(trigger.dataset.viewerPage));
    document.body.classList.add('viewer-open');
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    viewerClose.focus();
  };

  const restoreViewerFocus = () => {
    const target = viewerTrigger;
    document.body.classList.remove('viewer-open');
    viewerTrigger = null;
    requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  };

  const closeViewer = () => {
    if (typeof viewer.close === 'function' && viewer.open) viewer.close();
    else {
      viewer.removeAttribute('open');
      restoreViewerFocus();
    }
  };

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-viewer-page]');
    if (trigger) openViewer(trigger);
  });

  viewerClose.addEventListener('click', closeViewer);
  viewerPrev.addEventListener('click', () => showViewerPage(viewerPage - 1));
  viewerNext.addEventListener('click', () => showViewerPage(viewerPage + 1));
  viewer.addEventListener('click', event => {
    if (event.target === viewer || event.target === viewerCanvas) closeViewer();
  });
  viewer.addEventListener('cancel', event => {
    event.preventDefault();
    closeViewer();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showViewerPage(viewerPage - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showViewerPage(viewerPage + 1);
    }
  });
  viewer.addEventListener('close', restoreViewerFocus);

  const hashPage = Number(location.hash.match(/^#page-(\d+)$/)?.[1]);
  setCurrent(Number.isInteger(hashPage) && hashPage >= 1 && hashPage <= totalPages ? hashPage : 1);
  document.documentElement.dataset.readerReady = 'true';
  requestScrollSync();
})();
