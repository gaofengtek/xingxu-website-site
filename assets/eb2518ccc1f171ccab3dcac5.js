(function () {
  "use strict";

  var STAGE_ORDER = ["principle", "practice", "assessment"];
  var TASK_ORDER = ["model", "run", "analysis", "condition", "fault"];
  var currentStage = "practice";
  var currentTask = "model";

  var STAGES = {
    principle: {
      no: "01",
      label: "原理分析",
      en: "PRINCIPLE",
      intro: "理解对象机理、模型结构和现象之间的因果关系。",
      verb: "阶段 01"
    },
    practice: {
      no: "02",
      label: "实践操作",
      en: "PRACTICE",
      intro: "亲自完成配置、运行、观察、比较和演练操作。",
      verb: "阶段 02"
    },
    assessment: {
      no: "03",
      label: "考评测试",
      en: "ASSESSMENT",
      intro: "依据任务结果、过程记录与判断结论，由教师或审核后的规则评阅。",
      verb: "阶段 03"
    }
  };

  var TASKS = {
    model: {
      no: "M01", label: "建模", en: "MODEL", sub: "对象结构", result: "模型与参数记录",
      principle: {title: "理解对象如何形成模型", focus: "对象机理、能量关系与模型边界", action: "辨识组成、参数、接口和连接关系", evidence: "原理图、结构标注与模型说明"},
      practice: {title: "完成模型搭建与配置", focus: "模块结构、参数设置与接口约束", action: "建立或配置模型，检查参数和连接", evidence: "模型文件、参数表与接口检查记录"},
      assessment: {title: "检验建模理解与操作", focus: "结构正确性、关键参数与边界认识", action: "独立完成建模任务和结构问答", evidence: "模型检查结果、答题与教师评阅记录"}
    },
    run: {
      no: "R02", label: "运行", en: "RUN", sub: "基准仿真", result: "运行过程记录",
      principle: {title: "理解模型如何正确运行", focus: "初始条件、求解设置与运行逻辑", action: "判断采样时间、初值和启动条件", evidence: "运行原理说明与预期现象"},
      practice: {title: "完成配置、启动与记录", focus: "求解器、初值、输入与运行控制", action: "启动、暂停、复位并保存关键数据", evidence: "运行记录、状态变化与关键波形"},
      assessment: {title: "检验独立运行能力", focus: "启动条件、稳定运行与异常识别", action: "按给定条件完成运行并记录异常", evidence: "运行结果、过程记录与教师评阅"}
    },
    analysis: {
      no: "A03", label: "分析", en: "ANALYZE", sub: "波形指标", result: "分析结论",
      principle: {title: "理解现象背后的因果", focus: "信号、功率、状态和控制之间的关系", action: "识别关键变量、观察区间与判断依据", evidence: "分析框架、预期现象与判据说明"},
      practice: {title: "完成波形与指标分析", focus: "波形对比、指标计算与偏差解释", action: "选择数据区间，比较变量并形成结论", evidence: "分析图表、计算结果与结论记录"},
      assessment: {title: "检验分析与表达能力", focus: "结果解释、误差判断与结论复核", action: "完成数据分析题并说明判断依据", evidence: "分析报告、复核意见与考评记录"}
    },
    condition: {
      no: "C04", label: "工况", en: "CONDITION", sub: "场景拓展", result: "工况对比报告",
      principle: {title: "理解工况拓展如何影响系统", focus: "负荷、资源和控制设定的影响路径", action: "分析正常、边界与扰动工况的差异", evidence: "工况逻辑图、响应预测与约束说明"},
      practice: {title: "完成工况拓展与对比", focus: "正常、边界和扰动条件下的系统响应", action: "调整设定后分别运行拓展工况并比较结果", evidence: "工况记录、对比波形与现象说明"},
      assessment: {title: "检验工况拓展与判断", focus: "工况设置、结果判定与边界识别", action: "完成指定工况并判断是否符合要求", evidence: "工况报告、判定结果与考评记录"}
    },
    fault: {
      no: "F05", label: "故障", en: "FAULT", sub: "演练观察", result: "故障演练记录",
      principle: {title: "理解故障、保护与恢复逻辑", focus: "故障机理、影响链和安全边界", action: "识别故障传播、保护动作与恢复顺序", evidence: "故障机理图、动作顺序与边界说明"},
      practice: {title: "完成受控故障演练", focus: "故障场景选择、保护观察、复位与恢复", action: "在受控环境选择故障场景并完成演练操作", evidence: "故障演练记录、保护动作与恢复步骤"},
      assessment: {title: "检验故障判断与恢复", focus: "故障辨识、保护解释与恢复操作", action: "完成故障辨识、原因判断和恢复测试", evidence: "故障测试记录、恢复步骤与考评记录"}
    }
  };

  function logo() {
    return '<div class="hero-brand"><div class="hero-brandmark"><img src="/assets/310ca6dcbc9ba265d9208847.png" alt="星旭新能源科技"><span><strong>星旭新能源</strong><small>TECH EXHIBITION</small></span></div></div>';
  }

  function heroMap() {
    return [
      '<div class="practice-hero-map" data-stage="practice" aria-hidden="true">',
        '<div class="hero-task-axis">',
          '<span><i></i><b>模</b></span><span><i></i><b>运</b></span><span><i></i><b>析</b></span><span><i></i><b>况</b></span><span><i></i><b>障</b></span>',
        '</div>',
        '<div class="hero-stage-axis">',
          '<span data-hero-stage="principle"><i>01</i><b>原理分析</b></span>',
          '<span data-hero-stage="practice"><i>02</i><b>实践操作</b></span>',
          '<span data-hero-stage="assessment"><i>03</i><b>考评测试</b></span>',
        '</div>',
        '<small>LEARN × PRACTICE × ASSESS</small>',
      '</div>'
    ].join("");
  }

  function stageTabs() {
    return '<nav class="page-tabs compact-tabs teaching-stage-tabs" role="tablist" aria-label="课程阶段" aria-orientation="horizontal">' + STAGE_ORDER.map(function (key) {
      var stage = STAGES[key];
      var selected = key === "practice";
      return '<button type="button" role="tab" id="stage-tab-' + key + '" data-stage="' + key + '" aria-controls="practice-detail" aria-selected="' + selected + '" aria-pressed="' + selected + '" tabindex="' + (selected ? "0" : "-1") + '"><span><i>' + stage.no + '</i>' + stage.label + '</span></button>';
    }).join("") + '</nav>';
  }

  function taskRail() {
    return '<div class="practice-task-rail" id="practice-task-rail" role="list" aria-label="五步教学实践任务">' + TASK_ORDER.map(function (key, index) {
      var task = TASKS[key];
      return '<button type="button" data-task="' + key + '" aria-pressed="' + (index === 0) + '" tabindex="' + (index === 0 ? "0" : "-1") + '"><i>' + task.no + '</i><span class="task-glyph glyph-' + key + '"></span><b>' + task.label + '</b><small>' + task.sub + '</small></button>';
    }).join("") + '</div>';
  }

  function detailMarkup(stageKey, taskKey) {
    var stage = STAGES[stageKey];
    var task = TASKS[taskKey];
    var detail = task[stageKey];
    var taskLabel = stageKey === "principle" ? "学习任务" : (stageKey === "practice" ? "操作任务" : "考评任务");
    var recordLabel = stageKey === "assessment" ? "评阅记录" : "形成记录";
    return [
      '<header class="practice-detail-head">',
        '<div class="detail-code"><i>', task.no, '</i><small>', task.en, '</small></div>',
        '<div><span>', stage.verb, ' · ', stage.label, '</span><h3>', detail.title, '</h3></div>',
        '<b>', stage.no, '/03</b>',
      '</header>',
      '<div class="practice-detail-rows">',
        '<p><span>教学目标</span><b>', detail.focus, '</b></p>',
        '<p><span>', taskLabel, '</span><b>', detail.action, '</b></p>',
        '<p><span>', recordLabel, '</span><b>', detail.evidence, '</b></p>',
      '</div>'
    ].join("");
  }

  function outputStrip() {
    return '<section class="learning-output"><header><b>实践成果链</b><span>随课程内容逐项形成</span></header><div>' + TASK_ORDER.map(function (key) {
      return '<p><i></i><span>' + TASKS[key].label + '</span><b>' + TASKS[key].result + '</b></p>';
    }).join("") + '</div></section>';
  }

  function cta() {
    return '<button class="primary-action prototype-action" type="button"><span><small>LAB · TEACHING PRACTICE BRIEF</small><b>说明教学实践需求</b></span><span aria-hidden="true">→</span></button>';
  }

  function renderPage() {
    document.getElementById("page-root").innerHTML = [
      '<article class="mobile-page ref04-page page05-v5 theme-lab" data-page="05">',
        '<section class="page-hero">',
          logo(),
          '<div class="hero-copy"><h1>能源教学实践<br>从原理到考评</h1><p class="hero-summary">围绕建模、运行、分析、工况与故障，贯通原理分析、实践操作和考评测试。</p></div>',
          '<div class="hero-visual">', heroMap(), '</div>',
        '</section>',
        stageTabs(),
        '<section class="page-content">',
          '<div class="section-head simple"><h2>三阶段教学，走完五步实践</h2></div>',
          '<div class="practice-status"><strong>Lab · 虚拟实验中心</strong><span>规划能力</span><i>样例待开放</i></div>',
          '<section class="stage-overview" aria-live="polite"><div><i id="stage-number">02</i><span><small id="stage-english">PRACTICE</small><b id="stage-label">实践操作</b></span></div><p id="stage-intro">', STAGES.practice.intro, '</p></section>',
          '<div class="task-rail-head"><b>五步实践链</b><span>建模 → 运行 → 分析 → 工况 → 故障</span></div>',
          taskRail(),
          '<article class="practice-detail module-panel" id="practice-detail" role="tabpanel" aria-labelledby="stage-tab-practice" aria-live="polite">', detailMarkup("practice", "model"), '</article>',
          outputStrip(),
          '<div class="truth-callout"><strong>结果边界</strong><p>教学练习、实践记录与考评结果不等于正式工程验证。</p></div>',
          cta(),
          '<p class="page-boundary">当前为教学实践方案视觉稿；课程、故障场景和考评规则需按教学目标设计并审核后开放。</p>',
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

  function updateStage(stageKey) {
    currentStage = stageKey;
    var stage = STAGES[stageKey];
    document.getElementById("stage-number").textContent = stage.no;
    document.getElementById("stage-english").textContent = stage.en;
    document.getElementById("stage-label").textContent = stage.label;
    document.getElementById("stage-intro").textContent = stage.intro;
    document.querySelector(".practice-hero-map").setAttribute("data-stage", stageKey);
    document.getElementById("practice-detail").setAttribute("aria-labelledby", "stage-tab-" + stageKey);
    updateDetail();
  }

  function updateTask(taskKey) {
    currentTask = taskKey;
    updateDetail();
  }

  function updateDetail() {
    var detail = document.getElementById("practice-detail");
    detail.innerHTML = detailMarkup(currentStage, currentTask);
    detail.classList.add("is-updating");
    window.setTimeout(function () { detail.classList.remove("is-updating"); }, 260);
  }

  function showToast(message) {
    var toast = document.getElementById("prototype-toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  function bind() {
    function bindArrowKeys(group) {
      group.addEventListener("keydown", function (event) {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].indexOf(event.key) === -1) return;
        var buttons = Array.prototype.slice.call(group.querySelectorAll("button"));
        var index = buttons.indexOf(document.activeElement);
        if (index < 0) index = buttons.findIndex(function (button) { return button.getAttribute("aria-pressed") === "true"; });
        if (event.key === "Home") index = 0;
        else if (event.key === "End") index = buttons.length - 1;
        else index = (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
        event.preventDefault();
        buttons[index].focus();
        buttons[index].click();
      });
    }

    var tabs = document.querySelector(".teaching-stage-tabs");
    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      setPressed(tabs, button);
      updateStage(button.getAttribute("data-stage"));
    });
    bindArrowKeys(tabs);

    var rail = document.getElementById("practice-task-rail");
    rail.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      setPressed(rail, button);
      updateTask(button.getAttribute("data-task"));
    });
    bindArrowKeys(rail);

    document.querySelector(".prototype-action").addEventListener("click", function () {
      showToast("本地审核稿：课程需求入口将在页面和教学内容确认后接入。");
    });
  }

  renderPage();
  bind();
})();
