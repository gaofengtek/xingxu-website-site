document.addEventListener('DOMContentLoaded', function () {
  var body = document.body;
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-navigation');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    nav.classList.toggle('is-open', open);
    body.classList.toggle('nav-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  var year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealItems.forEach(function (item) { item.classList.add('is-pending'); });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  }

  var energyCarousel = document.querySelector('[data-energy-carousel]');
  if (energyCarousel) {
    var energySlides = Array.prototype.slice.call(energyCarousel.querySelectorAll('.energy-scene'));
    var energyPanels = Array.prototype.slice.call(energyCarousel.querySelectorAll('.scene-copy-panel'));
    var energyTabs = Array.prototype.slice.call(energyCarousel.querySelectorAll('[role="tab"]'));
    var energyStatus = energyCarousel.querySelector('[data-carousel-status]');
    var energyPause = energyCarousel.querySelector('[data-carousel-pause]');
    var energyPrev = energyCarousel.querySelector('[data-carousel-prev]');
    var energyNext = energyCarousel.querySelector('[data-carousel-next]');
    var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var activeEnergyIndex = 0;
    var energyTimer = null;
    var manualEnergyPause = false;
    var pointerEnergyPause = false;
    var focusEnergyPause = false;

    function energyIsReduced() {
      return reduceMotion || (motionQuery && motionQuery.matches);
    }

    function ensureEnergyImage(index) {
      var slide = energySlides[index];
      if (!slide) return;
      var image = slide.querySelector('img[data-src]');
      if (image) {
        image.src = image.getAttribute('data-src');
        image.removeAttribute('data-src');
        image.decoding = 'async';
      }
    }

    function clearEnergyTimer() {
      if (energyTimer) {
        window.clearTimeout(energyTimer);
        energyTimer = null;
      }
    }

    function canAutoAdvance() {
      return !energyIsReduced() && !manualEnergyPause && !pointerEnergyPause && !focusEnergyPause && !document.hidden;
    }

    function scheduleEnergyAdvance() {
      clearEnergyTimer();
      if (!canAutoAdvance()) return;
      energyTimer = window.setTimeout(function () {
        activateEnergyScene(activeEnergyIndex + 1, 'auto');
      }, 8000);
    }

    function setEnergyPauseButton() {
      if (!energyPause) return;
      energyPause.setAttribute('aria-pressed', manualEnergyPause ? 'true' : 'false');
      energyPause.setAttribute('aria-label', manualEnergyPause ? '继续自动播放' : '暂停自动播放');
      energyPause.textContent = manualEnergyPause ? '▶' : 'Ⅱ';
      energyPause.classList.toggle('is-paused', manualEnergyPause);
    }

    function activateEnergyScene(index, source) {
      if (!energySlides.length) return;
      activeEnergyIndex = (index + energySlides.length) % energySlides.length;
      energySlides.forEach(function (slide, slideIndex) {
        var active = slideIndex === activeEnergyIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      energyPanels.forEach(function (panel, panelIndex) {
        var active = panelIndex === activeEnergyIndex;
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      energyTabs.forEach(function (tab, tabIndex) {
        var active = tabIndex === activeEnergyIndex;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.setAttribute('tabindex', active ? '0' : '-1');
      });
      ensureEnergyImage(activeEnergyIndex);
      ensureEnergyImage((activeEnergyIndex + 1) % energySlides.length);
      if (energyStatus && source !== 'auto') {
        var activeTab = energyTabs[activeEnergyIndex];
        var activeLabel = activeTab ? (activeTab.getAttribute('aria-label') || activeTab.textContent.trim()) : '';
        energyStatus.textContent = '当前场景：' + activeLabel;
      }
      scheduleEnergyAdvance();
    }

    energyTabs.forEach(function (tab, tabIndex) {
      tab.addEventListener('click', function () {
        activateEnergyScene(tabIndex, 'manual');
      });
    });

    var energyTablist = energyCarousel.querySelector('[role="tablist"]');
    if (energyTablist) {
      energyTablist.addEventListener('keydown', function (event) {
        var targetIndex = activeEnergyIndex;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') targetIndex += 1;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') targetIndex -= 1;
        else if (event.key === 'Home') targetIndex = 0;
        else if (event.key === 'End') targetIndex = energyTabs.length - 1;
        else return;
        event.preventDefault();
        activateEnergyScene(targetIndex, 'manual');
        if (energyTabs[activeEnergyIndex]) energyTabs[activeEnergyIndex].focus();
      });
    }

    if (energyPrev) energyPrev.addEventListener('click', function () { activateEnergyScene(activeEnergyIndex - 1, 'manual'); });
    if (energyNext) energyNext.addEventListener('click', function () { activateEnergyScene(activeEnergyIndex + 1, 'manual'); });
    if (energyPause) {
      energyPause.addEventListener('click', function () {
        manualEnergyPause = !manualEnergyPause;
        setEnergyPauseButton();
        scheduleEnergyAdvance();
      });
    }

    energyCarousel.addEventListener('mouseenter', function () {
      pointerEnergyPause = true;
      clearEnergyTimer();
    });
    energyCarousel.addEventListener('mouseleave', function () {
      pointerEnergyPause = false;
      scheduleEnergyAdvance();
    });
    energyCarousel.addEventListener('focusin', function () {
      focusEnergyPause = true;
      clearEnergyTimer();
    });
    energyCarousel.addEventListener('focusout', function (event) {
      if (!energyCarousel.contains(event.relatedTarget)) {
        focusEnergyPause = false;
        scheduleEnergyAdvance();
      }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearEnergyTimer();
      else scheduleEnergyAdvance();
    });
    if (motionQuery) {
      var motionChange = function () { scheduleEnergyAdvance(); };
      if (motionQuery.addEventListener) motionQuery.addEventListener('change', motionChange);
      else if (motionQuery.addListener) motionQuery.addListener(motionChange);
    }

    setEnergyPauseButton();
    activateEnergyScene(0, 'init');
    window.setTimeout(function () { ensureEnergyImage(1); }, 1200);
    window.setTimeout(function () { ensureEnergyImage(2); }, 4200);
  }

  var privacyBanner = document.querySelector('[data-privacy-banner]');
  var acceptAnalytics = document.querySelector('[data-analytics-accept]');
  var rejectAnalytics = document.querySelector('[data-analytics-reject]');
  var consent = null;

  try {
    consent = window.localStorage.getItem('xingxuAnalyticsConsent');
  } catch (error) {
    consent = 'unavailable';
  }

  function rememberConsent(value) {
    try { window.localStorage.setItem('xingxuAnalyticsConsent', value); } catch (error) { /* 本地存储不可用时仅保持本次选择 */ }
  }

  function loadAnalytics() {
    if (!/^(www\.)?xingxutek\.com$/.test(window.location.hostname)) return;
    window._hmt = window._hmt || [];
    var script = document.createElement('script');
    script.src = 'https://hm.baidu.com/hm.js?4e7e7a96ab11a7a02c850b5ba16cb30c';
    script.async = true;
    document.head.appendChild(script);
  }

  if (privacyBanner && consent === 'accepted') {
    loadAnalytics();
  } else if (consent === null && navigator.doNotTrack !== '1' && privacyBanner) {
    privacyBanner.hidden = false;
  }

  if (acceptAnalytics) {
    acceptAnalytics.addEventListener('click', function () {
      rememberConsent('accepted');
      if (privacyBanner) privacyBanner.hidden = true;
      loadAnalytics();
    });
  }

  if (rejectAnalytics) {
    rejectAnalytics.addEventListener('click', function () {
      rememberConsent('rejected');
      if (privacyBanner) privacyBanner.hidden = true;
    });
  }
});
