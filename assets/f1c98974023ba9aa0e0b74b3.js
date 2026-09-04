(function () {
  "use strict";

  var CATEGORY_ORDER = ["models", "documents", "tools", "reports"];
  var currentCategory = "models";

  var CATEGORIES = {
    models: {
      no: "01", code: "M", en: "MODEL", label: "模型仓库", status: "多种获取状态", tone: "mixed",
      title: "模型、参数与 Case 成组管理",
      intro: "按对象、版本和工程用途，把模型文件、参数接口、典型 Case 与测试证据成组管理。",
      scope: ["模型文件", "参数接口", "典型 Case", "测试证据"],
      entries: [
        {kind: "模型目录", title: "EnerV Model 新能源模型资源目录", meta: "对象分类 · 版本 · 接口 · 适用范围", state: "目录规划中", tone: "review", action: "审核后开放", disabled: true},
        {kind: "项目资料", title: "模型、Case 与测试资料", meta: "依据用途、授权与项目范围评估提供", state: "按用途评估", tone: "controlled", action: "说明用途", disabled: false}
      ]
    },
    documents: {
      no: "02", code: "D", en: "DOCUMENT", label: "技术文档", status: "多种获取状态", tone: "mixed",
      title: "把产品、模型与验证讲清楚",
      intro: "集中组织产品说明、用户手册、建模说明、测试报告与交付文档，保留版本和适用边界。",
      scope: ["产品说明", "用户手册", "测试报告", "交付文档"],
      entries: [
        {kind: "产品说明", title: "EnerV Systems 产品架构说明", meta: "六个业务产品、两个公共中心与能力边界", state: "资料待审", tone: "review", action: "审核后开放", disabled: true},
        {kind: "模型说明", title: "EnerV Model 模型资源说明", meta: "模型分类、参数、接口、Case 与版本边界", state: "资料待审", tone: "review", action: "审核后开放", disabled: true}
      ]
    },
    tools: {
      no: "03", code: "T", en: "TOOLS", label: "软件与工具", status: "多种获取状态", tone: "mixed",
      title: "软件产品与配套工具分开说明",
      intro: "按产品版本、运行环境和授权范围组织软件、安装包、工具组件及自动化脚本，不混同为通用下载。",
      scope: ["软件产品", "安装程序", "工具组件", "自动化脚本"],
      entries: [
        {kind: "软件产品", title: "EnerV Systems 软件与版本说明", meta: "拟说明具体版本、授权范围与验收边界", state: "条目规划中", tone: "versioned", action: "暂未开放", disabled: true},
        {kind: "配套工具", title: "工程工具与自动化组件", meta: "根据接口、运行环境和交付范围评估", state: "按项目评估", tone: "controlled", action: "说明场景", disabled: false}
      ]
    },
    reports: {
      no: "04", code: "R", en: "REPORT", label: "报告与演示", status: "多种获取状态", tone: "mixed",
      title: "日报、专题报告与演示统一归档",
      intro: "用于能源日报、行业分析、技术专题、项目汇报与产品演示，发布状态和文件版本分别记录。",
      scope: ["能源日报", "专题报告", "项目汇报", "产品演示"],
      entries: [
        {kind: "专题演示", title: "算电协同｜从绿电供给到双向调度", meta: "2026-09 · PPTX 本地候选；未上传、未创建草稿、未发布", state: "待人工审核", tone: "candidate", action: "审核后开放", disabled: true},
        {kind: "专题报告", title: "绿电直连｜政策与工程落地", meta: "v1 · 2026-09-02 · PPTX / 水印 PDF 本地候选；未上传、未发布", state: "待人工审核", tone: "candidate", action: "审核后开放", disabled: true}
      ]
    }
  };

  function logo() {
    return '<div class="hero-brand"><div class="hero-brandmark"><img src="/assets/310ca6dcbc9ba265d9208847.png" alt="星旭新能源科技"><span><strong>星旭新能源</strong><small>TECH EXHIBITION</small></span></div></div>';
  }

  function heroIndex() {
    return [
      '<div class="asset-index-map" data-category="models" aria-hidden="true">',
        '<header><span>技术资产索引</span><b>04 类</b></header>',
        '<div class="index-spine"><i></i><strong>ASSET<br>INDEX</strong></div>',
        '<div class="index-route route-models" data-index-route="models"><i>M</i><span>模型</span><b></b></div>',
        '<div class="index-route route-documents" data-index-route="documents"><i>D</i><span>文档</span><b></b></div>',
        '<div class="index-route route-tools" data-index-route="tools"><i>T</i><span>工具</span><b></b></div>',
        '<div class="index-route route-reports" data-index-route="reports"><i>R</i><span>报告</span><b></b></div>',
        '<footer>分类管理 · 状态分开记录</footer>',
      '</div>'
    ].join("");
  }

  function categoryTabs() {
    return '<nav class="page-tabs compact-tabs resource-category-tabs" role="tablist" aria-label="技术资料类别" aria-orientation="horizontal">' + CATEGORY_ORDER.map(function (key, index) {
      var category = CATEGORIES[key];
      var selected = index === 0;
      return '<button type="button" role="tab" id="category-tab-' + key + '" data-category-tab="' + key + '" aria-controls="category-panel" aria-selected="' + selected + '" tabindex="' + (selected ? "0" : "-1") + '"><span><i>' + category.no + '</i>' + category.label + '</span></button>';
    }).join("") + '</nav>';
  }

  function categoryOverview(category) {
    return [
      '<section class="asset-overview" aria-live="polite">',
        '<div class="asset-overview-code"><i id="category-code">', category.code, '</i><small id="category-english">', category.en, '</small></div>',
        '<div><span id="category-kicker">分类 ', category.no, ' / 04</span><h3 id="category-title">', category.title, '</h3><p id="category-intro">', category.intro, '</p></div>',
      '</section>',
      '<div class="asset-scope" id="asset-scope">', category.scope.map(function (item, index) {
        return '<span><i>0' + (index + 1) + '</i><b>' + item + '</b></span>';
      }).join(""), '</div>'
    ].join("");
  }

  function resourceEntries(category) {
    return category.entries.map(function (entry, index) {
      return [
        '<article class="asset-entry" data-entry-index="', index, '" data-search="', [entry.kind, entry.title, entry.meta, entry.state].join(" "), '">',
          '<div class="entry-file"><i>', category.code, '0', index + 1, '</i><b>', entry.kind, '</b></div>',
          '<div class="entry-copy"><span class="entry-state tone-', entry.tone, '">', entry.state, '</span><h3>', entry.title, '</h3><p>', entry.meta, '</p></div>',
          '<button type="button" class="entry-action ', entry.disabled ? 'is-disabled' : 'prototype-action', '" ', entry.disabled ? 'disabled aria-disabled="true"' : '', '><span>', entry.action, '</span><i aria-hidden="true">↗</i></button>',
        '</article>'
      ].join("");
    }).join("");
  }

  function accessGuide() {
    return [
      '<section class="access-guide">',
        '<header><div><small>获取规则</small><h2>类别与开放状态分开管理</h2></div><span>真实状态</span></header>',
        '<div>',
          '<p><i class="guide-review"></i><b>审核后开放</b><span>页面、内容和文件版本审定后再接入。</span></p>',
          '<p><i class="guide-controlled"></i><b>按用途评估</b><span>模型、工具和项目资料先说明使用对象与范围。</span></p>',
          '<p><i class="guide-internal"></i><b>内部留存</b><span>账号、凭据、运维记录和敏感数据不进入公开目录。</span></p>',
        '</div>',
      '</section>'
    ].join("");
  }

  function renderPage() {
    var category = CATEGORIES.models;
    document.getElementById("page-root").innerHTML = [
      '<article class="mobile-page ref04-page page08-v5 theme-resource" data-page="08">',
        '<section class="page-hero">',
          logo(),
          '<div class="hero-copy"><h1>技术资料中心<br>四类资产查找</h1><p class="hero-summary">模型仓库、技术文档、软件与工具、报告与演示，分类归档，状态清楚。</p></div>',
          '<div class="hero-visual">', heroIndex(), '</div>',
        '</section>',
        categoryTabs(),
        '<section class="page-content">',
          '<div class="section-head simple"><h2>四类技术资产，按用途进入</h2></div>',
          '<div class="asset-status"><strong id="category-label">', category.label, '</strong><span id="category-status" class="tone-', category.tone, '">', category.status, '</span><i id="category-position">01 / 04</i></div>',
          '<article class="category-panel" id="category-panel" role="tabpanel" aria-labelledby="category-tab-models">',
            categoryOverview(category),
            '<div class="asset-toolbar"><label><span class="search-icon" aria-hidden="true">⌕</span><input id="asset-query" type="search" autocomplete="off" aria-label="在当前类别中搜索" placeholder="在当前类别中搜索"><kbd aria-hidden="true">SEARCH</kbd></label><p id="asset-result-status" role="status" aria-live="polite" aria-atomic="true"><b id="asset-count">', category.entries.length, '</b> 项资料</p></div>',
            '<div class="asset-list" id="asset-list">', resourceEntries(category), '</div>',
            '<p class="asset-empty" id="asset-empty" role="status" aria-live="polite" hidden>当前类别没有匹配内容，请调整关键词。</p>',
          '</article>',
          accessGuide(),
          '<div class="truth-callout"><strong>资料边界</strong><p>进入目录不等于可以下载；是否开放以审核状态、用途、授权和具体版本为准。</p></div>',
          '<button class="primary-action purpose-action" type="button"><span><small>RESOURCE · PURPOSE BRIEF</small><b>说明资料用途</b></span><span aria-hidden="true">→</span></button>',
          '<p class="page-boundary">当前为技术资料分类视觉稿；未创建公众号草稿，未发表、未群发，未上传或开放任何文件。交付文档、项目汇报和自动化脚本仅限经脱敏并审核的公开版本。</p>',
        '</section>',
      '</article>'
    ].join("");
  }

  function setPressed(group, active) {
    Array.prototype.forEach.call(group.querySelectorAll("button"), function (button) {
      var selected = button === active;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
  }

  function updateCategory(key) {
    currentCategory = key;
    var category = CATEGORIES[key];
    var panel = document.getElementById("category-panel");
    var position = CATEGORY_ORDER.indexOf(key) + 1;

    document.querySelector(".asset-index-map").setAttribute("data-category", key);
    document.getElementById("category-label").textContent = category.label;
    document.getElementById("category-status").textContent = category.status;
    document.getElementById("category-status").className = "tone-" + category.tone;
    document.getElementById("category-position").textContent = "0" + position + " / 04";
    document.getElementById("category-code").textContent = category.code;
    document.getElementById("category-english").textContent = category.en;
    document.getElementById("category-kicker").textContent = "分类 " + category.no + " / 04";
    document.getElementById("category-title").textContent = category.title;
    document.getElementById("category-intro").textContent = category.intro;
    document.getElementById("asset-scope").innerHTML = category.scope.map(function (item, index) {
      return '<span><i>0' + (index + 1) + '</i><b>' + item + '</b></span>';
    }).join("");
    document.getElementById("asset-list").innerHTML = resourceEntries(category);
    document.getElementById("asset-query").value = "";
    panel.setAttribute("aria-labelledby", "category-tab-" + key);
    panel.classList.add("is-updating");
    window.setTimeout(function () { panel.classList.remove("is-updating"); }, 220);
    applySearch();
    bindEntryActions();
  }

  function applySearch() {
    var query = document.getElementById("asset-query").value.trim().toLowerCase();
    var count = 0;
    Array.prototype.forEach.call(document.querySelectorAll(".asset-entry"), function (entry) {
      var matched = !query || entry.getAttribute("data-search").toLowerCase().indexOf(query) >= 0;
      entry.hidden = !matched;
      if (matched) count += 1;
    });
    document.getElementById("asset-count").textContent = String(count);
    document.getElementById("asset-empty").hidden = count !== 0;
  }

  function showToast(message) {
    var toast = document.getElementById("prototype-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2400);
  }

  function bindEntryActions() {
    Array.prototype.forEach.call(document.querySelectorAll(".asset-entry .prototype-action"), function (button) {
      button.addEventListener("click", function () {
        showToast("本地审核稿：资料用途入口将在目录、开放规则和接收方式确认后接入。");
      });
    });
  }

  function bind() {
    var tabs = document.querySelector(".resource-category-tabs");
    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-category-tab]");
      if (!button) return;
      setPressed(tabs, button);
      updateCategory(button.getAttribute("data-category-tab"));
    });

    tabs.addEventListener("keydown", function (event) {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1) return;
      var buttons = Array.prototype.slice.call(tabs.querySelectorAll("button"));
      var index = buttons.indexOf(document.activeElement);
      if (index < 0) index = buttons.findIndex(function (button) { return button.getAttribute("aria-selected") === "true"; });
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = buttons.length - 1;
      else index = (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault();
      buttons[index].focus();
      buttons[index].click();
    });

    document.getElementById("asset-query").addEventListener("input", applySearch);
    document.querySelector(".purpose-action").addEventListener("click", function () {
      showToast("本地审核稿：资料用途入口将在页面分类和获取规则确认后接入。");
    });
    bindEntryActions();
  }

  renderPage();
  bind();
})();
