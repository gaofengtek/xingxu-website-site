const CATEGORY_DATA = {
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
const LAYERS = {
    design: {no: "01", label: "设计验证", en: "设计与验证", representative: "sim", intro: "从方案比较、实验认知进入正式仿真验证。"},
    twin: {no: "02", label: "数据孪生", en: "数据与孪生", representative: "twin", intro: "把经确认的现场数据映射到资产与模型上下文。"},
    intelligence: {no: "03", label: "分析优化", en: "分析与建议", representative: "insight", intro: "在证据和约束条件下形成诊断、预测与可复核建议。"}
  };
const PRODUCT_ORDER = ["plan", "lab", "sim", "twin", "insight", "optimize"];
const PRODUCTS = {
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
const STAGE_ORDER = ["principle", "practice", "assessment"];
const TASK_ORDER = ["model", "run", "analysis", "condition", "fault"];
const STAGES = {
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
const TASKS = {
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
const GROUPS = {
    core: {no: "01", label: "模型与验证", representative: "model", intro: "从模型边界、参数和 Case 出发，形成可复核的仿真结果与验证证据。"},
    collaboration: {no: "02", label: "科研与协同", representative: "research", intro: "围绕试验条件、科研任务与共同目标，按项目组织资源和阶段成果。"},
    intelligence: {no: "03", label: "数智与优化", representative: "twin", intro: "以试点验证为起点，逐步孵化数据孪生、诊断预测和优化决策能力。"}
  };
const SERVICE_ORDER = ["model", "simulation", "hil", "research", "joint", "twin", "diagnosis", "efficiency"];
const SERVICES = {
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