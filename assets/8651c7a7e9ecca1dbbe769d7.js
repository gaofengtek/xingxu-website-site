(function () {
  "use strict";

  var GROUPS = {
    core: {no: "01", label: "模型与验证", representative: "model", intro: "从模型边界、参数和 Case 出发，形成可复核的仿真结果与验证证据。"},
    collaboration: {no: "02", label: "科研与协同", representative: "research", intro: "围绕试验条件、科研任务与共同目标，按项目组织资源和阶段成果。"},
    intelligence: {no: "03", label: "数智与优化", representative: "twin", intro: "以试点验证为起点，逐步孵化数据孪生、诊断预测和优化决策能力。"}
  };

  var SERVICE_ORDER = ["model", "simulation", "hil", "research", "joint", "twin", "diagnosis", "efficiency"];
  var SERVICES = {
    model: {
      no: "01", code: "MODEL", name: "模型定制", group: "core", tone: "core", shortStatus: "核心承接", status: "核心承接 · 按对象与边界确认",
      problem: "设备、系统或控制对象缺少可复用、可追溯的工程模型",
      work: "梳理系统边界、参数、接口与目标场景，建设部件、设备或系统模型和典型 Case",
      output: "模型文件、参数与接口说明、典型 Case、版本记录",
      boundary: "按对象与数据条件建设；精度、覆盖范围和软件版本在立项时确认。"
    },
    simulation: {
      no: "02", code: "SIM", name: "仿真分析测试", group: "core", tone: "core", shortStatus: "核心承接", status: "核心承接 · 按工况与判据实施",
      problem: "模型、控制策略或系统方案在明确工况下表现怎样",
      work: "设计工况与测试矩阵，运行仿真并记录结果、异常、阶段证据和已知限制",
      output: "测试矩阵、结果图表、运行记录、验证报告、问题清单",
      boundary: "结论只适用于已覆盖工况；仿真不替代现场实测、型式试验或第三方认证。"
    },
    hil: {
      no: "03", code: "HIL", name: "实时仿真 HIL 测试", group: "collaboration", tone: "conditional", shortStatus: "条件评估", status: "条件评估 · 可联合实施",
      problem: "控制器或算法需要在实时环境和 I/O 接口下开展预验证",
      work: "按已有或合作平台评估模型实时化、步长、接口、信号映射与试验方案",
      output: "HIL 试验方案、接口清单、测试记录、问题与改进建议",
      boundary: "须先确认实时仿真平台、硬件接口和合作资源；不宣称自有完整硬件平台或法定检测资质。"
    },
    research: {
      no: "04", code: "RESEARCH", name: "科研配套", group: "collaboration", tone: "project", shortStatus: "项目承接", status: "项目承接 · 教学科研配套",
      problem: "课题、课程实验或论文研究需要工程化模型与验证支撑",
      work: "围绕研究问题配套模型、Case、实验设计、数据处理和技术图文",
      output: "研究模型、实验方案、数据图表、阶段材料与可复核记录",
      boundary: "不代写论文、不虚构数据；成果署名、知识产权和公开范围需预先约定。"
    },
    joint: {
      no: "05", code: "JOINT-RD", name: "联合研发", group: "collaboration", tone: "project", shortStatus: "项目承接", status: "项目承接 · 按里程碑协同",
      problem: "新方向缺少单方可独立完成的模型、数据、算法或试验条件",
      work: "共同定义目标、里程碑、角色分工、接口、数据和验证方法",
      output: "联合方案、原型或 PoC、阶段证据、评审材料与后续路线",
      boundary: "以协议、资源和阶段验收为准；联合研发不等于承诺产品化或商业效果。"
    },
    twin: {
      no: "06", code: "TWIN", name: "能源数字孪生", group: "intelligence", tone: "pilot", shortStatus: "联合试点", status: "方向孵化 · 联合试点",
      problem: "模型如何与经确认的现场数据建立资产和测点映射",
      work: "联合开展数据接入、质量检查、测点映射和模型—实测对照 PoC",
      output: "试点数据字典、映射关系、对照结果与阶段报告",
      boundary: "当前为试点方向，不表示已接入生产系统或已形成实时孪生产品。"
    },
    diagnosis: {
      no: "07", code: "INSIGHT", name: "诊断运维", group: "intelligence", tone: "pilot", shortStatus: "联合试点", status: "方向孵化 · 联合试点",
      problem: "如何从数据和模型线索识别异常、分析原因与变化趋势",
      work: "联合定义指标、规则或算法、验证数据集和人工复核流程",
      output: "试点诊断规则、分析结果、置信度、适用范围与问题清单",
      boundary: "不承诺 7×24 运维、自动告警闭环，也不替代现场专业判断。"
    },
    efficiency: {
      no: "08", code: "OPT", name: "能效优化", group: "intelligence", tone: "pilot", shortStatus: "联合试点", status: "方向孵化 · 联合试点",
      problem: "在目标与约束条件下，哪些运行或配置方案更值得比较",
      work: "构建目标函数与约束，开展情景比较、能效分析和建议验证",
      output: "候选方案、能效与收益对比、风险说明和决策建议",
      boundary: "建议须由人员确认；不保证节能收益，也不直接下发控制。"
    }
  };

  var currentGroup = "core";
  var currentService = "model";

  function logo() {
    return '<div class="hero-brand"><div class="hero-brandmark"><img src="/assets/310ca6dcbc9ba265d9208847.png" alt="星旭新能源科技"><span><strong>星旭新能源</strong><small>TECH EXHIBITION</small></span></div></div>';
  }

  function heroTrace() {
    return [
      '<div class="engineering-trace" data-service="model" aria-hidden="true">',
        '<header><span>工程证据链</span><b>核心主线</b></header>',
        '<svg viewBox="0 0 154 118" focusable="false">',
          '<path class="trace-grid" d="M0 23H154M0 46H154M0 69H154M0 92H154M31 0V118M62 0V118M93 0V118M124 0V118"/>',
          '<path class="trace-main" d="M10 47H44L58 61H96L110 47H145"/>',
          '<path class="trace-branch" d="M80 61V91H111M111 91H145"/>',
        '</svg>',
        '<div class="trace-node node-model"><i></i><span><b>模</b><small>MODEL</small></span></div>',
        '<div class="trace-node node-case"><i></i><span><b>况</b><small>CASE</small></span></div>',
        '<div class="trace-node node-sim"><i></i><span><b>仿</b><small>SIM</small></span></div>',
        '<div class="trace-node node-proof"><i></i><span><b>证</b><small>EVIDENCE</small></span></div>',
        '<div class="trace-node node-hil"><i></i><span><b>实</b><small>HIL</small></span></div>',
        '<div class="trace-node node-twin"><i></i><span><b>孪</b><small>TWIN</small></span></div>',
        '<div class="trace-node node-diagnosis"><i></i><span><b>诊</b><small>DIAG</small></span></div>',
        '<div class="trace-node node-opt"><i></i><span><b>优</b><small>OPT</small></span></div>',
        '<footer><span>软件实施</span><i></i><span>技术资料</span></footer>',
        '<small>条件路径以虚线表示</small>',
      '</div>'
    ].join("");
  }

  function groupTabs() {
    return '<nav class="page-tabs service-group-tabs" role="group" aria-label="技术服务业务分组">' + Object.keys(GROUPS).map(function (key) {
      var group = GROUPS[key];
      var selected = key === currentGroup;
      return '<button id="group-button-' + key + '" type="button" data-group-tab="' + key + '" aria-controls="service-switchboard" aria-pressed="' + selected + '" tabindex="' + (selected ? "0" : "-1") + '"><span><i>' + group.no + '</i>' + group.label + '</span></button>';
    }).join("") + '</nav>';
  }

  function serviceButton(key) {
    var service = SERVICES[key];
    var selected = key === currentService;
    return '<button id="service-' + key + '" type="button" role="tab" data-service="' + key + '" aria-controls="service-detail" aria-selected="' + selected + '" aria-pressed="' + selected + '" aria-label="' + service.name + '，' + service.shortStatus + '" tabindex="' + (selected ? "0" : "-1") + '">' +
      '<span class="service-no">' + service.no + '</span>' +
      '<span class="service-name"><b>' + service.name + '</b><small>' + service.code + '</small></span>' +
      '<em class="tone-' + service.tone + '"><i></i>' + service.shortStatus + '</em>' +
    '</button>';
  }

  function serviceRow(label, groupKey, keys) {
    return '<section class="service-row row-' + groupKey + '" data-group-panel="' + groupKey + '"><header><span>' + label + '</span><i>' + keys.length + ' 项</i></header><div>' + keys.map(serviceButton).join("") + '</div></section>';
  }

  function switchboard() {
    return [
      '<section class="service-switchboard" id="service-switchboard" data-active-group="core" aria-label="八项技术服务">',
        '<div class="switchboard-sequence"><span>服务结构</span><b>核心能力 → 项目协同 → 联合试点</b></div>',
        '<div class="service-rows" role="tablist" aria-label="八项业务方向">',
          serviceRow("核心承接", "core", ["model", "simulation"]),
          serviceRow("项目协同", "collaboration", ["hil", "research", "joint"]),
          serviceRow("联合试点", "intelligence", ["twin", "diagnosis", "efficiency"]),
        '</div>',
        '<div class="delivery-foundation-mini"><span><i>S</i><b>软件实施</b></span><p>工具 · 接口 · 流程 · 部署</p><span><i>D</i><b>技术资料</b></span></div>',
      '</section>'
    ].join("");
  }

  function detailMarkup(key) {
    var service = SERVICES[key];
    return [
      '<header class="service-detail-head">',
        '<span class="detail-code"><i>' + service.no + '</i><small>' + service.code + '</small></span>',
        '<div><span>' + GROUPS[service.group].label + '</span><h3>' + service.name + '</h3></div>',
        '<b class="tone-' + service.tone + '">' + service.status + '</b>',
      '</header>',
      '<div class="service-detail-rows">',
        '<p><span>客户问题</span><b>' + service.problem + '</b></p>',
        '<p><span>实施内容</span><b>' + service.work + '</b></p>',
        '<p><span>可交付成果</span><b>' + service.output + '</b></p>',
        '<p><span>当前边界</span><b>' + service.boundary + '</b></p>',
      '</div>'
    ].join("");
  }

  function foundationSection() {
    return [
      '<section class="service-foundation">',
        '<header><div><small>交付配套</small><h2>两项底座，贯穿全部项目</h2></div><span>按范围组合</span></header>',
        '<div class="foundation-pair">',
          '<article><i>S</i><div><b>软件实施</b><p>脚本工具、业务接口、流程自动化、部署与运行说明，按接口和环境评估。</p></div></article>',
          '<article><i>D</i><div><b>技术资料</b><p>参数表、接口说明、Case、测试证据、报告、版本与文件清单。</p></div></article>',
        '</div>',
        '<p class="foundation-boundary">软件实施不默认包含现场实时控制或工业系统接入；资料整理不能替代模型和工程正确性验证。</p>',
      '</section>'
    ].join("");
  }

  function incubationSection() {
    var steps = [
      {no: "01", name: "规划分析", note: "方案与约束"},
      {no: "02", name: "数据孪生", note: "数据与模型"},
      {no: "03", name: "诊断预测", note: "异常与趋势"},
      {no: "04", name: "优化决策", note: "建议与复核"}
    ];
    return '<section class="incubation-section"><header><div><small>能力孵化路线</small><h2>先验证，再进入数据与决策</h2></div><span>逐步建设</span></header><div class="incubation-route">' + steps.map(function (step) {
      return '<p><i>' + step.no + '</i><b>' + step.name + '</b><span>' + step.note + '</span></p>';
    }).join("") + '</div><small class="incubation-note">这是一条能力建设路线，不表示四项能力已经产品化或形成标准服务。</small></section>';
  }

  function deliverySection() {
    var steps = ["需求澄清", "范围确认", "实施验证", "交付复核"];
    return '<section class="delivery-process"><header><b>项目合作流程</b><span>边界确认后实施</span></header><div>' + steps.map(function (step, index) {
      return '<p><i>0' + (index + 1) + '</i><span>' + step + '</span></p>';
    }).join("") + '</div></section>';
  }

  function cta() {
    return '<button class="primary-action prototype-action" type="button"><span><small>技术服务 · 项目需求</small><b>说明项目需求</b></span><span aria-hidden="true">→</span></button>';
  }

  function renderPage() {
    document.getElementById("page-root").innerHTML = [
      '<article class="mobile-page ref04-page page07-v5 theme-service" data-page="07">',
        '<section class="page-hero">',
          logo(),
          '<div class="hero-copy"><h1>新能源技术服务<br>从模型走向验证</h1><p class="hero-summary">以模型工程与仿真验证为核心，配套软件、资料与教学科研服务。</p></div>',
          '<div class="hero-visual">', heroTrace(), '</div>',
        '</section>',
        groupTabs(),
        '<section class="page-content">',
          '<div class="section-head simple"><h2>三类业务，八项服务方向</h2></div>',
          '<div class="service-status"><strong>新能源模型工程 · 仿真验证</strong><span>核心 2 项</span><i>项目 3 项</i><em>试点 3 项</em></div>',
          switchboard(),
          '<article class="service-detail-v5 module-panel" id="service-detail" role="tabpanel" aria-labelledby="service-model" aria-live="polite">', detailMarkup("model"), '</article>',
          foundationSection(),
          incubationSection(),
          deliverySection(),
          '<div class="truth-callout"><strong>服务边界</strong><p>HIL、现场数据、诊断与优化须先确认平台、接口、数据、合作资源和验收目标；预验证不等于第三方认证或现场验收。</p></div>',
          cta(),
          '<p class="page-boundary">本页同时展示当前可承接服务与能力孵化方向；实际范围、周期、成果和责任以项目确认文件为准。</p>',
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

  function updateSelection(serviceKey) {
    currentService = serviceKey;
    currentGroup = SERVICES[serviceKey].group;

    var groupTabs = document.querySelector(".service-group-tabs");
    var groupButton = groupTabs.querySelector('[data-group-tab="' + currentGroup + '"]');
    setPressed(groupTabs, groupButton);

    var switchboard = document.getElementById("service-switchboard");
    var serviceButton = switchboard.querySelector('[data-service="' + currentService + '"]');
    setPressed(switchboard, serviceButton);
    switchboard.setAttribute("data-active-group", currentGroup);

    document.querySelector(".engineering-trace").setAttribute("data-service", currentService);

    var detail = document.getElementById("service-detail");
    detail.innerHTML = detailMarkup(currentService);
    detail.setAttribute("aria-labelledby", "service-" + currentService);
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
    toast.textContent = "本地审核稿：需求入口将在服务范围和承接方式确认后接入。";
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  function bind() {
    var groupTabs = document.querySelector(".service-group-tabs");
    groupTabs.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      updateSelection(GROUPS[button.getAttribute("data-group-tab")].representative);
    });
    bindArrowKeys(groupTabs);

    var switchboard = document.getElementById("service-switchboard");
    switchboard.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-service]");
      if (!button) return;
      updateSelection(button.getAttribute("data-service"));
    });
    bindArrowKeys(switchboard, "button[data-service]");

    document.querySelector(".prototype-action").addEventListener("click", showToast);
    updateSelection("model");
  }

  renderPage();
  bind();
})();
