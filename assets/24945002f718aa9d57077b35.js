(function () {
  "use strict";

  var LAYERS = {
    design: {no: "01", label: "设计验证", en: "设计与验证", representative: "sim", intro: "从方案比较、实验认知进入正式仿真验证。"},
    twin: {no: "02", label: "数据孪生", en: "数据与孪生", representative: "twin", intro: "把经确认的现场数据映射到资产与模型上下文。"},
    intelligence: {no: "03", label: "分析优化", en: "分析与建议", representative: "insight", intro: "在证据和约束条件下形成诊断、预测与可复核建议。"}
  };

  var PRODUCT_ORDER = ["plan", "lab", "sim", "twin", "insight", "optimize"];
  var PRODUCTS = {
    plan: {
      no: "01", en: "Plan", cn: "规划验证中心", layer: "design", tone: "planned", shortStatus: "未实现",
      status: "规划能力 · 未实现",
      question: "项目方案是否可行，资源与容量怎样配置更合理",
      use: "资源条件、容量边界、系统方案、经济性与碳效益",
      output: "目标输出：项目规划方案、容量建议、可行性报告",
      boundary: "处于目标架构规划，不表示已有可用的规划计算引擎。"
    },
    lab: {
      no: "02", en: "Lab", cn: "虚拟实验中心", layer: "design", tone: "concept", shortStatus: "概念设计",
      status: "概念设计 · 尚未形成产品闭环",
      question: "如何学习、实验、演练并观察能源系统过程",
      use: "教学任务、实验参数、观察指标、故障演练与回放",
      output: "目标输出：实验记录、实验结果、教学报告",
      boundary: "课程与实验样例需按教学目标设计并审核后开放。"
    },
    sim: {
      no: "03", en: "Sim", cn: "仿真验证中心", layer: "design", tone: "current", shortStatus: "已验证",
      status: "光伏单场景已验证 · 通用能力仍在建",
      question: "正式模型与明确工况下，系统动态行为是什么",
      use: "正式模型、Case、参数、工况、求解环境与验收判据",
      output: "已验证场景可形成：真实仿真结果、阶段证据、验证报告",
      boundary: "仅一个受控正式光伏并网仿真闭环已验证，其他对象和范围按版本与证据确认。"
    },
    twin: {
      no: "04", en: "Twin", cn: "数据孪生中心", layer: "twin", tone: "planned", shortStatus: "未实现",
      status: "规划能力 · 未实现",
      question: "经确认的现场数据反映了哪些资产状态与模型偏差",
      use: "现场数据、测点映射、数据质量、资产状态与模型对比",
      output: "目标输出：实测数据、孪生状态、偏差记录",
      boundary: "尚未形成实时孪生产品能力，也不表示已接入现场系统。"
    },
    insight: {
      no: "05", en: "Insight", cn: "诊断预测中心", layer: "intelligence", tone: "planned", shortStatus: "未实现",
      status: "规划能力 · 未实现",
      question: "异常为什么发生，健康状态与趋势可能怎样变化",
      use: "带来源的数据、异常特征、历史趋势、分析规则与适用边界",
      output: "目标输出：诊断结论、预测结果、置信度与依据",
      boundary: "诊断与预测必须标注数据来源、置信度和适用范围。"
    },
    optimize: {
      no: "06", en: "Optimize", cn: "优化建议中心", layer: "intelligence", tone: "planned", shortStatus: "未实现",
      status: "规划能力 · 未实现",
      question: "在目标和约束条件下，哪些调整方案更值得比较",
      use: "目标函数、约束条件、候选方案、收益风险与审批规则",
      output: "目标输出：优化建议、收益评估、风险与审批记录",
      boundary: "只形成供人复核的建议；是否采用及执行必须由人员确认。"
    }
  };

  var currentLayer = "design";
  var currentProduct = "sim";

  function logo() {
    return '<div class="hero-brand"><div class="hero-brandmark"><img src="/assets/310ca6dcbc9ba265d9208847.png" alt="星旭新能源科技"><span><strong>星旭新能源</strong><small>TECH EXHIBITION</small></span></div></div>';
  }

  function heroThread() {
    return [
      '<div class="digital-thread" data-product="sim" aria-hidden="true">',
        '<header><span>数智线程</span><b>目标架构</b></header>',
        '<svg viewBox="0 0 154 116" focusable="false">',
          '<path class="thread-grid" d="M0 23H154M0 46H154M0 69H154M0 92H154M31 0V116M62 0V116M93 0V116M124 0V116"/>',
        '<path class="thread-path base" d="M8 25H42L58 43H79"/>',
          '<path class="thread-path planned" d="M79 43H111L126 63V91H146"/>',
        '</svg>',
        '<div class="thread-node node-plan"><i></i><span><b>规</b><small>PLAN</small></span></div>',
        '<div class="thread-node node-lab"><i></i><span><b>教</b><small>LAB</small></span></div>',
        '<div class="thread-node node-sim"><i></i><span><b>仿</b><small>SIM</small></span></div>',
        '<div class="thread-node node-twin"><i></i><span><b>孪</b><small>TWIN</small></span></div>',
        '<div class="thread-node node-insight"><i></i><span><b>析</b><small>INSIGHT</small></span></div>',
        '<div class="thread-node node-optimize"><i></i><span><b>优</b><small>OPT</small></span></div>',
        '<footer><span>资产中心</span><i></i><span>系统设置</span></footer>',
        '<small>架构关系 ≠ 全部能力已实现</small>',
      '</div>'
    ].join("");
  }

  function layerTabs() {
    return '<nav class="page-tabs twin-layer-tabs" role="group" aria-label="数智孪生业务环节">' + Object.keys(LAYERS).map(function (key) {
      var layer = LAYERS[key];
      var selected = key === currentLayer;
      return '<button id="layer-button-' + key + '" type="button" data-layer-tab="' + key + '" aria-controls="product-space" aria-pressed="' + selected + '" tabindex="' + (selected ? "0" : "-1") + '"><span><i>' + layer.no + '</i>' + layer.label + '</span></button>';
    }).join("") + '</nav>';
  }

  function productButton(key) {
    var product = PRODUCTS[key];
    var selected = key === currentProduct;
    return '<button id="product-' + key + '" type="button" role="tab" data-product="' + key + '" aria-controls="systems-detail" aria-selected="' + selected + '" aria-pressed="' + selected + '" aria-label="' + product.cn + '，' + product.en + '，' + product.shortStatus + '" tabindex="' + (selected ? "0" : "-1") + '">' +
      '<span class="product-code"><i>' + product.no + '</i><b>' + product.en.toUpperCase() + '</b></span>' +
      '<span class="product-name"><b>' + product.cn.replace("中心", "") + '</b><small>' + product.en + '</small></span>' +
      '<em class="tone-' + product.tone + '"><i></i>' + product.shortStatus + '</em>' +
    '</button>';
  }

  function architectureCutaway() {
    return [
      '<section class="architecture-cutaway" id="product-space" aria-label="六产品业务链路">',
        '<div class="product-sequence"><span>业务顺序</span><b>规划 → 实验 → 仿真｜孪生｜诊断 → 优化</b></div>',
        '<div class="architecture-columns" role="tablist" aria-label="六个业务产品">',
          '<article class="architecture-layer layer-design" data-layer-panel="design">',
            '<header><i>01</i><span><b>设计验证</b><small>设计与验证</small></span></header>',
            '<div>', productButton("plan"), productButton("lab"), productButton("sim"), '</div>',
          '</article>',
          '<article class="architecture-layer layer-twin" data-layer-panel="twin">',
            '<header><i>02</i><span><b>数据孪生</b><small>数据与孪生</small></span></header>',
            '<div class="single-product">', productButton("twin"), '<span class="data-pulse" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>',
          '</article>',
          '<article class="architecture-layer layer-intelligence" data-layer-panel="intelligence">',
            '<header><i>03</i><span><b>分析优化</b><small>分析与建议</small></span></header>',
            '<div>', productButton("insight"), productButton("optimize"), '</div>',
          '</article>',
        '</div>',
        '<div class="foundation-bus"><span><i>A</i><b>Assets</b></span><p>共享项目 · 资产 · 模型 · 数据上下文</p><span><i>S</i><b>Settings</b></span></div>',
      '</section>'
    ].join("");
  }

  function detailMarkup(key) {
    var p = PRODUCTS[key];
    return [
      '<header class="systems-detail-head">',
        '<span class="detail-code"><i>' + p.no + '</i><small>' + p.en.toUpperCase() + '</small></span>',
        '<div><span>' + LAYERS[p.layer].label + ' · ' + p.en + '</span><h3>' + p.cn + '</h3></div>',
        '<b class="tone-' + p.tone + '">' + p.status + '</b>',
      '</header>',
      '<div class="systems-detail-rows">',
        '<p><span>核心问题</span><b>' + p.question + '</b></p>',
        '<p><span>使用内容</span><b>' + p.use + '</b></p>',
        '<p><span>主要输出</span><b>' + p.output + '</b></p>',
        '<p><span>当前边界</span><b>' + p.boundary + '</b></p>',
      '</div>'
    ].join("");
  }

  function foundationSection() {
    return [
      '<section class="foundation-section">',
        '<header><div><small>共享基础层</small><h2>两个公共中心，共用同一上下文</h2></div><span>目标架构 · 待扩展</span></header>',
        '<div class="foundation-list">',
          '<article><i>A</i><div><b>Assets · 资产模型中心</b><p>统一组织项目、资产、模型、Case、场景、测点与参数版本。</p></div><span>待扩展</span></article>',
          '<article><i>S</i><div><b>Settings · 系统设置中心</b><p>组织客户侧用户、项目、运行环境、存储、界面偏好与授权信息查看。</p></div><span>待扩展</span></article>',
        '</div>',
        '<p class="model-relation"><b>EnerV Model</b><span>→</span>模型资源体系统一纳入 Assets 管理，不另列为第七个业务产品。</p>',
      '</section>'
    ].join("");
  }

  function scenarioSection() {
    var routes = [
      {code: "01", name: "教学实验", chain: "Lab + Assets", status: "目标组合"},
      {code: "02", name: "工程验证", chain: "Plan → Sim + Assets", status: "目标组合"},
      {code: "03", name: "运行分析", chain: "Twin → Insight + Assets", status: "目标组合"},
      {code: "04", name: "优化建议", chain: "Insight → Optimize → 人工确认", status: "目标组合"}
    ];
    return '<section class="scenario-section"><header><div><small>业务场景组合</small><h2>按业务目标组合，不拆成六套软件</h2></div><span>架构示意</span></header><div>' + routes.map(function (route) {
      return '<p><i>' + route.code + '</i><b>' + route.name + '</b><span>' + route.chain + '</span><em>' + route.status + '</em></p>';
    }).join("") + '</div><small class="scenario-note">以上均为目标组合，共享资产模型中心与系统设置中心；实际范围按项目确认。</small></section>';
  }

  function cta() {
    return '<button class="primary-action prototype-action" type="button"><span><small>软件项目 · 需求说明</small><b>说明软件项目目标</b></span><span aria-hidden="true">→</span></button>';
  }

  function renderPage() {
    document.getElementById("page-root").innerHTML = [
      '<article class="mobile-page ref04-page page06-v5 theme-twin" data-page="06">',
        '<section class="page-hero">',
          logo(),
          '<div class="hero-copy"><h1>能源数智孪生<br>从规划到优化</h1><p class="hero-summary">EnerV Systems 用一套软件承载六个业务产品，统一组织项目、模型、数据与结果。</p></div>',
          '<div class="hero-visual">', heroThread(), '</div>',
        '</section>',
        layerTabs(),
        '<section class="page-content">',
          '<div class="section-head simple"><h2>三类业务环节，串联六个产品</h2></div>',
          '<div class="architecture-status"><strong>EnerV Systems · 目标架构</strong><span>Sim：光伏单场景已验证</span><i>其他按规划建设</i></div>',
          architectureCutaway(),
          '<article class="systems-detail module-panel" id="systems-detail" role="tabpanel" aria-labelledby="product-sim" aria-live="polite">', detailMarkup("sim"), '</article>',
          foundationSection(),
          scenarioSection(),
          '<div class="truth-callout"><strong>结果边界</strong><p>实验、仿真、实测、分析与建议分别保留来源和适用边界；目标架构不等于功能已经完成。</p></div>',
          cta(),
          '<p class="page-boundary">当前为产品架构视觉稿；实际可用能力以具体版本、授权范围、运行环境和验收证据为准。</p>',
        '</section>',
      '</article>'
    ].join("");
  }

  function setPressed(group, active) {
    Array.prototype.forEach.call(group.querySelectorAll("button"), function (button) {
      var selected = button === active;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      if (button.hasAttribute("role")) button.setAttribute("aria-selected", selected ? "true" : "false");
      button.setAttribute("tabindex", selected ? "0" : "-1");
    });
  }

  function updateSelection(productKey) {
    currentProduct = productKey;
    currentLayer = PRODUCTS[productKey].layer;

    var tabGroup = document.querySelector(".twin-layer-tabs");
    var layerButton = tabGroup.querySelector('[data-layer-tab="' + currentLayer + '"]');
    setPressed(tabGroup, layerButton);

    var architecture = document.getElementById("product-space");
    var productButton = architecture.querySelector('[data-product="' + currentProduct + '"]');
    setPressed(architecture, productButton);
    architecture.setAttribute("data-active-layer", currentLayer);

    var thread = document.querySelector(".digital-thread");
    thread.setAttribute("data-product", currentProduct);

    var detail = document.getElementById("systems-detail");
    detail.innerHTML = detailMarkup(currentProduct);
    detail.setAttribute("aria-labelledby", "product-" + currentProduct);
    detail.classList.add("is-updating");
    window.setTimeout(function () { detail.classList.remove("is-updating"); }, 220);
  }

  function bindArrowKeys(group, selector) {
    group.addEventListener("keydown", function (event) {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].indexOf(event.key) === -1) return;
      var buttons = Array.prototype.slice.call(group.querySelectorAll(selector || "button"));
      var index = buttons.indexOf(document.activeElement);
      if (index < 0) index = buttons.findIndex(function (button) { return button.getAttribute("aria-pressed") === "true"; });
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = buttons.length - 1;
      else index = (index + (["ArrowRight", "ArrowDown"].indexOf(event.key) >= 0 ? 1 : -1) + buttons.length) % buttons.length;
      event.preventDefault();
      buttons[index].focus();
      buttons[index].click();
    });
  }

  function showToast() {
    var toast = document.getElementById("prototype-toast");
    toast.textContent = "本地审核稿：项目目标入口将在页面与业务范围确认后接入。";
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  function bind() {
    var tabGroup = document.querySelector(".twin-layer-tabs");
    tabGroup.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      var layerKey = button.getAttribute("data-layer-tab");
      updateSelection(LAYERS[layerKey].representative);
    });
    bindArrowKeys(tabGroup);

    var architecture = document.getElementById("product-space");
    architecture.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-product]");
      if (!button) return;
      updateSelection(button.getAttribute("data-product"));
    });
    bindArrowKeys(architecture, "button[data-product]");

    document.querySelector(".prototype-action").addEventListener("click", showToast);
    updateSelection("sim");
  }

  renderPage();
  bind();
})();
