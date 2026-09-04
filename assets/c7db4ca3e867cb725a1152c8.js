(function () {
  "use strict";

  var TITLE_OPTIONS = {
    a: {
      label: "方案 A",
      title: "数字设备资源 研究测试基石",
      html: "数字设备资源<br><em>研究测试基石</em>"
    },
    b: {
      label: "方案 B",
      title: "按能源方向，查看相关模型",
      html: "按能源方向，<br><em>查看相关模型</em>"
    },
    c: {
      label: "方案 C",
      title: "从能源方向出发，查看不同种类模型",
      html: "从能源方向出发，<br><em>查看不同种类模型</em>"
    },
    d: {
      label: "方案 D",
      title: "面向不同能源场景，组织专业模型资源",
      html: "面向不同能源场景，<br><em>组织专业模型资源</em>"
    },
    e: {
      label: "方案 E",
      title: "能源系统模型资源，分类查看更清楚",
      html: "能源系统模型资源，<br><em>分类查看更清楚</em>"
    },
    f: {
      label: "方案 F",
      title: "模型分类更清楚，能源建模更高效",
      html: "模型分类更清楚，<br><em>能源建模更高效</em>"
    }
  };

  var LABEL_OPTIONS = {
    feature: "特性",
    model: "模型资料",
    technical: "技术资料",
    related: "关联资料",
    resources: "资源内容",
    delivery: "交付资料"
  };

  var CATEGORY_DATA = {
    power: {
      label: "电力",
      items: [
        { code: "WT", name: "风电", en: "WIND" },
        { code: "PV", name: "光伏", en: "SOLAR" },
        { code: "GRID", name: "电网", en: "POWER GRID" },
        { code: "LOAD", name: "负荷", en: "LOAD" }
      ]
    },
    hydrogen: {
      label: "氢能",
      items: [
        { code: "H2+", name: "制氢", en: "PRODUCTION" },
        { code: "H2", name: "储氢", en: "STORAGE" },
        { code: "PIPE", name: "输氢", en: "TRANSPORT" },
        { code: "FC", name: "用氢", en: "UTILIZATION" }
      ]
    },
    integrated: {
      label: "综合能源",
      items: [
        { code: "E", name: "电力", en: "ELECTRIC" },
        { code: "H", name: "热力", en: "HEAT" },
        { code: "C", name: "冷能", en: "COOLING" },
        { code: "G", name: "气体", en: "GAS" }
      ]
    },
    storage: {
      label: "储能",
      items: [
        { code: "BESS", name: "电化学", en: "BATTERY" },
        { code: "FESS", name: "飞轮", en: "FLYWHEEL" },
        { code: "SC", name: "超级电容", en: "SUPERCAP" },
        { code: "CAES", name: "压缩空气", en: "CAES" }
      ]
    }
  };

  var params = new URLSearchParams(window.location.search);
  var titleKey = Object.prototype.hasOwnProperty.call(TITLE_OPTIONS, params.get("title")) ? params.get("title") : "a";
  var labelKey = Object.prototype.hasOwnProperty.call(LABEL_OPTIONS, params.get("label")) ? params.get("label") : "feature";
  var currentCategory = "hydrogen";

  function modelVisual() {
    return [
      '<svg viewBox="0 0 190 180" role="img" aria-label="多能源模型资源关系示意图">',
        '<path class="visual-line" d="M97 89 L42 39 M97 89 L157 31 M97 89 L169 96 M97 89 L124 151"/>',
        '<path class="visual-line hot" d="M18 145 C66 134 119 126 171 96"/>',
        '<circle class="pulse-ring" cx="97" cy="89" r="47"/>',
        '<circle class="visual-node" cx="97" cy="89" r="32"/>',
        '<circle class="visual-node" cx="42" cy="39" r="19"/>',
        '<circle class="visual-node" cx="157" cy="31" r="19"/>',
        '<circle class="visual-node" cx="169" cy="96" r="19"/>',
        '<circle class="visual-node" cx="124" cy="151" r="19"/>',
        '<circle class="visual-node hot" cx="171" cy="96" r="3.5"/>',
        '<text class="visual-label" x="97" y="86">MODEL</text>',
        '<text class="visual-label" x="97" y="96">RESOURCE</text>',
        '<text class="visual-label" x="42" y="42">氢能</text>',
        '<text class="visual-label" x="157" y="34">电力</text>',
        '<text class="visual-label" x="169" y="99">综合</text>',
        '<text class="visual-label" x="124" y="154">储能</text>',
        '<text class="visual-micro" x="20" y="165">CATEGORY · TYPE · DOCUMENT</text>',
      '</svg>'
    ].join("");
  }

  function categoryTabs() {
    var keys = ["hydrogen", "power", "integrated", "storage"];
    return keys.map(function (key) {
      var selected = key === currentCategory;
      return '<button type="button" role="tab" data-category="' + key + '" aria-selected="' + selected + '" aria-pressed="' + selected + '"><span>' + CATEGORY_DATA[key].label + '</span></button>';
    }).join("");
  }

  function gridMarkup(categoryKey) {
    return CATEGORY_DATA[categoryKey].items.map(function (item, index) {
      return [
        '<button type="button" aria-pressed="', index === 0, '" data-model-item="', item.name, '">',
          '<span class="model-code">', item.code, '</span>',
          '<b>', item.name, '</b>',
          '<small>', item.en, '</small>',
        '</button>'
      ].join("");
    }).join("");
  }

  function render() {
    var title = TITLE_OPTIONS[titleKey];
    var label = LABEL_OPTIONS[labelKey];
    document.documentElement.dataset.titleOption = titleKey;
    document.documentElement.dataset.labelOption = labelKey;
    document.getElementById("page-root").innerHTML = [
      '<article class="mobile-page theme-model page04-v4 page04-v5" data-page="04" data-title-key="', titleKey, '">',
        '<section class="page-hero">',
          '<div class="hero-brand">',
            '<div class="hero-brandmark">',
              '<img src="/assets/310ca6dcbc9ba265d9208847.png" alt="星旭新能源科技">',
              '<span><strong>星旭新能源</strong><small>TECH EXHIBITION</small></span>',
            '</div>',
          '</div>',
          '<div class="hero-copy">',
            '<h1 class="hero-title" data-title-text="', title.title, '">', title.html, '</h1>',
            '<p class="hero-summary">氢能、电力、综合能源与储能模型，按种类和特性统一查看。</p>',
          '</div>',
          '<div class="hero-visual">', modelVisual(), '</div>',
        '</section>',
        '<nav class="page-tabs category-tabs" role="tablist" aria-label="能源分类">', categoryTabs(), '</nav>',
        '<section class="page-content">',
          '<div class="section-head"><div><h2>先选能源方向，再看模型种类</h2></div></div>',
          '<p class="category-current" aria-live="polite">当前分类：<strong id="category-name">氢能</strong><span>分类示意</span></p>',
          '<div class="taxonomy-grid" id="model-grid" data-active-category="hydrogen" aria-label="氢能模型分类">', gridMarkup(currentCategory), '</div>',
          '<div class="asset-ledger module-panel">',
            '<div class="ledger-row"><span>层级</span><strong>组件 → 设备 → 系统 → 场景</strong></div>',
            '<div class="ledger-row"><span>种类</span><div class="kind-tags"><i>数学模型</i><i>动态模型</i></div></div>',
            '<div class="ledger-row ledger-docs"><span>', label, '</span><strong>参数、接口、规格包、测试、案例、说明书</strong></div>',
          '</div>',
          '<button class="primary-action" type="button" data-prototype-action="查看模型分类">',
            '<span><small>ENERV MODEL · CATEGORY INDEX</small><b>查看模型分类</b></span><span aria-hidden="true">→</span>',
          '</button>',
          '<p class="page-boundary">分类与资料项为页面结构示意，不代表已核实的模型数量、库存或交付范围。</p>',
        '</section>',
      '</article>',
      '<div class="prototype-toast" role="status" aria-live="polite"></div>'
    ].join("");
  }

  function activateGridItem(button) {
    var grid = button.closest(".taxonomy-grid");
    if (!grid) return;
    grid.querySelectorAll("button").forEach(function (item) {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
  }

  function activateCategory(button) {
    currentCategory = button.dataset.category;
    document.querySelectorAll("[data-category]").forEach(function (item) {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });
    var grid = document.getElementById("model-grid");
    var category = CATEGORY_DATA[currentCategory];
    grid.innerHTML = gridMarkup(currentCategory);
    grid.dataset.activeCategory = currentCategory;
    grid.setAttribute("aria-label", category.label + "模型分类");
    document.getElementById("category-name").textContent = category.label;
  }

  function showToast(message) {
    var toast = document.querySelector(".prototype-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  render();

  document.addEventListener("click", function (event) {
    var category = event.target.closest("[data-category]");
    if (category) {
      activateCategory(category);
      return;
    }
    var modelItem = event.target.closest("[data-model-item]");
    if (modelItem) {
      activateGridItem(modelItem);
      return;
    }
    var action = event.target.closest("[data-prototype-action]");
    if (action) showToast("视觉审核稿：正式目录与跳转规则待内容确认后接入。 ");
  });

  window.__PAGE04_V5__ = {
    titleOption: titleKey,
    titleText: TITLE_OPTIONS[titleKey].title,
    labelOption: labelKey,
    labelText: LABEL_OPTIONS[labelKey],
    categories: Object.keys(CATEGORY_DATA)
  };
})();
