(() => {
'use strict';
const page = document.body.dataset.page;
const config = {
 models:{title:'能源模型',value:'从组件到系统',desc:'按能源方向组织模型资源，连接参数、接口与验证资料。',eyebrow:'模型资源',english:'EnerV Model',heading:'按能源方向，查看模型分类',intro:'按方向查模型，按需求确认资料。',action:'提交模型需求'},
 twin:{title:'数智孪生',value:'从规划到优化',desc:'连接设计验证、数据孪生与分析优化，清楚呈现能力状态。',eyebrow:'数智平台',english:'EnerV Systems',heading:'三类业务，串联六个产品',intro:'贯通模型与数据，按场景组合应用。',action:'提交软件项目需求'},
 teaching:{title:'教学软件',value:'从原理到实践',desc:'围绕模型、运行与分析，组织可复核的能源教学实践。',eyebrow:'虚拟实验',english:'Lab',heading:'三阶段教学，五步实践',intro:'理解原理、动手实践、记录成果。',action:'提交教学需求'},
 services:{title:'技术服务',value:'从建模到验证',desc:'以模型定制与仿真验证为核心，按项目条件组合技术服务。',eyebrow:'工程服务',english:'Engineering Services',heading:'三类业务，八项服务方向',intro:'明确任务与条件，约定成果与验收。',action:'提交服务需求'}
};
const c=config[page];
let viewGroup='all';
let group=page==='models'?'hydrogen':page==='twin'?'design':page==='teaching'?'practice':'core';
let selected=page==='models'?'0':page==='twin'?'sim':'model';
const icons = ['M5 9h10v10H5zM15 14h10v10H15zM10 5v4M25 19h4','M4 24V7M4 24h24M7 20l6-9 6 5 8-11','M6 8h20v17H6zM10 13h12M10 18h7','M7 7h18v18H7zM3 12h4M3 20h4M25 12h4M25 20h4','M5 22l7-14 6 14 8-14M5 27h22'];
const icon=n=>`<span class="icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="${icons[n%icons.length]}"/></svg></span>`;
const badge=(label,tone='')=>`<span class="badge ${tone}"><i class="status-dot" aria-hidden="true"></i>${label}</span>`;
function art(){
 const label=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
 let body='';
 if(page==='models') body=`<path class="wire" d="M58 37V56M20 56H96M20 56V77M96 56V77M20 105V130M96 105V130"/><rect class="node" x="35" y="12" width="46" height="25" rx="3"/>${label(58,29,'系统')}<rect class="node" x="2" y="77" width="38" height="27" rx="3"/><rect class="node" x="77" y="77" width="38" height="27" rx="3"/>${label(21,95,'设备')}${label(96,95,'控制')}<path class="orange" d="M40 91H77"/><rect class="node" x="7" y="131" width="26" height="19" rx="2"/><rect class="node" x="83" y="131" width="26" height="19" rx="2"/>${label(20,164,'组件')}${label(96,164,'接口')}`;
 if(page==='teaching') body=`<rect class="node" x="3" y="25" width="110" height="78" rx="5"/><path class="wire" d="M3 44H113M45 103V116M72 103V116M30 117H86"/><circle class="hot" cx="13" cy="35" r="2"/><path class="orange" d="M12 79L27 66 40 77 55 58 72 72 87 58 103 62"/><path class="wire" d="M14 133H103"/><circle class="node" cx="14" cy="133" r="4"/><circle class="hot" cx="58" cy="133" r="4"/><circle class="node" cx="103" cy="133" r="4"/>${label(20,153,'原理')}${label(58,153,'实践')}${label(99,153,'考评')}`;
 if(page==='twin') body=`<rect class="node" x="2" y="13" width="112" height="121" rx="4"/><path class="wire" d="M2 36H114M58 36V86M2 86H114"/>${label(58,29,'运行分析')}<path class="wire" d="M12 74V47M12 74H48"/><path class="orange" d="M15 68L23 59 31 63 39 51 47 54"/><circle class="wire" cx="85" cy="61" r="15"/><path class="orange" d="M85 46A15 15 0 0 1 100 61M85 61L94 52"/><path class="wire" d="M12 120H103"/><path class="orange" d="M15 114L35 104 54 109 74 96"/><path class="wire" stroke-dasharray="3 3" d="M74 96L91 98 104 91"/>${label(58,158,'数据 · 预测 · 优化')}`;
 if(page==='services') body=`<path class="wire" d="M30 39V61H85V91H30V126H85"/><path class="orange" d="M30 39V61H85V91"/><rect class="node" x="12" y="13" width="36" height="26" rx="3"/><path class="wire" d="M20 22H39M20 29H34"/><circle class="node" cx="85" cy="61" r="15"/><path class="wire" d="M77 61L82 66 93 55"/><rect class="node" x="14" y="89" width="32" height="27" rx="3"/><path class="wire" d="M20 108L26 99 32 104 40 96"/><circle class="hot" cx="85" cy="126" r="5"/>${label(83,26,'需求')}${label(28,77,'实施')}${label(84,101,'验证')}${label(84,150,'应用')}`;
 return `<div class="hero-art" aria-hidden="true"><svg viewBox="0 0 116 166">${body}</svg></div>`;
}
function groups(){return page==='models'?Object.fromEntries(['hydrogen','power','integrated','storage'].map(k=>[k,CATEGORY_DATA[k]])):page==='twin'?LAYERS:page==='teaching'?STAGES:GROUPS;}
const sectionTitle=(title,right='')=>`<div class="section-title"><h2>${title}</h2><small>${right}</small></div>`;
function selector(){
 if(page==='models')return `<section class="section">${sectionTitle(CATEGORY_DATA[group].label+'模型分类','4 个方向')}<div class="catalogue model-list">${CATEGORY_DATA[group].items.map((it,i)=>`<button class="item" data-item="${i}" aria-pressed="${selected===String(i)}">${icon(i)}<span class="item-copy"><strong>${it.name}</strong><small>${it.code}</small></span><span class="arrow" aria-hidden="true">${selected===String(i)?'✓':'›'}</span></button>`).join('')}</div><p class="selection-note">分类框架示意，不代表已形成可交付模型库存。</p></section>`;
 if(page==='teaching')return `<section class="section">${sectionTitle(STAGES[group].label,'5 项任务')}<div class="catalogue steps">${TASK_ORDER.map((key,i)=>`<button class="item" data-item="${key}" aria-pressed="${selected===key}"><span class="step-number">0${i+1}</span><span class="item-copy"><strong>${TASKS[key].label}</strong><small>${TASKS[key].sub}</small></span><span class="arrow" aria-hidden="true">${selected===key?'✓':'›'}</span></button>`).join('')}</div></section>`;
 const isTwin=page==='twin',data=isTwin?PRODUCTS:SERVICES,keys=(isTwin?PRODUCT_ORDER:SERVICE_ORDER).filter(k=>data[k][isTwin?'layer':'group']===group);
 return `<section class="section">${sectionTitle(groups()[group].label,keys.length+(isTwin?' 个产品':' 项服务'))}<div class="catalogue product-list">${keys.map((key,i)=>{const it=data[key];return `<button class="item" data-item="${key}" aria-pressed="${selected===key}">${icon(i)}<span class="item-copy"><strong>${isTwin?it.cn:it.name}</strong><span class="row-meta"><small>${isTwin?it.en:it.code}</small>${badge(it.shortStatus,it.shortStatus==='已验证'||it.shortStatus==='核心承接'?'verified':it.shortStatus==='条件评估'||it.shortStatus==='项目承接'?'conditional':'')}</span></span><span class="arrow" aria-hidden="true">${selected===key?'✓':'›'}</span></button>`}).join('')}</div></section>`;
}
function detail(){
 if(page==='models'){const item=CATEGORY_DATA[group].items[Number(selected)];return `<section class="section" id="detail">${sectionTitle('模型资源说明')}<article class="detail"><header class="detail-head"><span class="eyebrow">${CATEGORY_DATA[group].label} / ${item.name}</span><h3>从组件到场景的模型层级</h3><p class="subtitle">以下为通用资源组织方式，不是该分类的已交付清单。</p></header><dl><div><dt>模型层级</dt><dd>组件 → 设备 → 系统 → 场景</dd></div><div><dt>模型种类</dt><dd>数学模型、动态模型</dd></div><div><dt>关联资料</dt><dd>参数、接口、规格包、测试、案例、说明书</dd></div></dl><div class="boundary"><b>适用范围</b><br>具体对象、软件环境、资料状态与可交付范围需逐项确认。</div></article></section>`;}
 let title,status,rows,boundary,top;
 if(page==='services'){const s=SERVICES[selected];title=s.name;status=s.status;top=GROUPS[group].label;rows=[['客户问题',s.problem],['实施内容',s.work],['可交付成果',s.output]];boundary=s.boundary;}
 if(page==='twin'){const s=PRODUCTS[selected];title=s.cn;status=s.status;top=LAYERS[group].label+' / '+s.en;rows=[['核心问题',s.question],['使用内容',s.use],['主要输出',s.output]];boundary=s.boundary;}
 if(page==='teaching'){const s=TASKS[selected][group];title=s.title;status='教学实践方案 · 样例待开放';top=STAGES[group].label+' / '+TASKS[selected].label;rows=[['教学目标',s.focus],[group==='principle'?'学习任务':group==='assessment'?'考评任务':'操作任务',s.action],[group==='assessment'?'评阅记录':'形成记录',s.evidence]];boundary='教学练习、实践记录与考评结果不等于正式工程验证。';}
 return `<section class="section" id="detail">${sectionTitle(page==='services'?'服务详情':page==='twin'?'产品详情':'实践任务')}<article class="detail"><header class="detail-head"><span class="eyebrow">${top}</span><h3>${title}</h3><p class="subtitle">${status}</p></header><dl>${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><div class="boundary"><b>当前边界</b><br>${boundary}</div></article></section>`;
}
const support=(title,desc)=>`<article class="support"><h3>${title}</h3><p>${desc}</p></article>`;
function extra(){
 if(page==='services')return `<section class="section">${sectionTitle('交付配套','按项目范围组合')}<div class="support-grid">${support('软件实施','脚本工具、业务接口、流程自动化、部署与运行说明，按接口和环境评估。')}${support('技术资料','参数表、接口说明、Case、测试证据、报告、版本与文件清单。')}</div><p class="fineprint">软件实施不默认包含现场实时控制或工业系统接入；资料整理不能替代模型和工程正确性验证。</p></section><section class="section">${sectionTitle('能力建设方向','逐步验证')}<div class="route">${[['规划分析','方案与约束'],['数据孪生','数据与模型'],['诊断预测','异常与趋势'],['优化决策','建议与复核']].map(([a,b],i)=>`<div><small>0${i+1}</small><b>${a}</b><p>${b}</p></div>`).join('')}</div><p class="fineprint">这是能力建设路线，不表示以上方向均已产品化或形成标准服务。</p></section><section class="section">${sectionTitle('项目合作流程')}<div class="process">${[['需求澄清','说明对象、目标与现有条件'],['范围确认','约定接口、任务和验收要求'],['实施验证','形成过程记录与阶段成果'],['交付复核','按约定范围核对成果与资料']].map(([a,b],i)=>`<div class="process-row"><span class="step-number">0${i+1}</span><div><b>${a}</b><p>${b}</p></div></div>`).join('')}</div></section>`;
 if(page==='twin')return `<section class="section">${sectionTitle('共享基础','目标架构 · 待扩展')}<div class="support-grid">${support('资产模型中心 · Assets','统一组织项目、资产、模型、Case、场景、测点与参数版本。')}${support('系统设置中心 · Settings','组织客户侧用户、项目、运行环境、存储、界面偏好与授权信息查看。')}</div><p class="fineprint">EnerV Model 统一纳入 Assets 管理，不另列为第七个业务产品。实验、仿真、实测、分析与建议分别保留来源和适用边界。</p></section>`;
 if(page==='teaching')return `<section class="section">${sectionTitle('实践成果','随课程内容逐项形成')}<div class="process">${TASK_ORDER.map((key,i)=>`<div class="process-row"><span class="step-number">0${i+1}</span><div><b>${TASKS[key].label}</b><p>${TASKS[key].result}</p></div></div>`).join('')}</div></section>`;
 return '';
}
function scenarioSection(){if(page!=='twin')return '';return `<section class="section">${sectionTitle('业务场景组合','目标架构')}<div class="support-grid">${[['教学实验','Lab + Assets'],['工程验证','Plan → Sim + Assets'],['运行分析','Twin → Insight + Assets'],['优化建议','Insight → Optimize → 人工确认']].map(([title,chain])=>support(title,chain+' · 目标组合')).join('')}</div><p class="fineprint">按业务目标组合，不拆成六套软件。以上均为目标组合，共享资产模型中心与系统设置中心；实际范围按项目确认。</p></section>`;}
function footer(){const note=page==='services'?'本页同时展示当前可承接服务与能力建设方向。实际范围、周期、成果和责任以项目确认文件为准；预验证不等于第三方认证或现场验收。':page==='twin'?'目标架构不等于功能已经完成。实际可用能力以具体版本、授权范围、运行环境和验收证据为准。':page==='teaching'?'课程、软件功能、故障场景和考评规则需按教学目标设计并审核后开放。':'分类与资料项为结构示意，不代表已核实的模型数量、库存或交付范围。';return `<section class="cta"><h2>从具体需求开始</h2><p>${page==='services'?'说明对象、任务边界与预期成果，我们据此明确可实施的工作范围。':page==='models'?'说明模型对象、工况与软件环境，进一步确认资料与适用范围。':page==='teaching'?'说明课程对象、教学目标与使用环境，进一步明确教学任务。':'说明业务场景、现有数据与验证目标，进一步确认软件项目范围。'}</p><a class="request-link" href="/feedback.html?from=${({models:'04',teaching:'05',twin:'06',services:'07'})[page]}">${c.action}<span aria-hidden="true">↗</span></a></section><footer class="footer"><strong>西安星旭新能源科技有限公司</strong><p>${note}</p></footer>`;}
function catalogue(){
 const activeGroup=group;
 const keys=viewGroup==='all'?Object.keys(groups()):[group];
 const output=keys.map(key=>{
  group=key;
  let html=selector().replaceAll('data-item=',`data-owner="${key}" data-item=`);
  if(key!==activeGroup) html=html.replaceAll('aria-pressed="true"','aria-pressed="false"').replaceAll('✓','›');
  return html;
 }).join('');
 group=activeGroup;
 return output;
}
function render(){
 document.getElementById('app').innerHTML=`<header class="hero"><div class="brand"><img src="/wechat/tech-exhibition-v4/logo.png" alt="星旭新能源标志"><span>星旭新能源</span></div><div class="hero-layout"><div><h1><span>${c.title}</span><span>${c.value}</span></h1><i class="hero-rule"></i><p>${c.desc}</p></div>${art()}</div></header><nav class="tabs" style="--tabs:${Object.keys(groups()).length+1}" aria-label="${c.title}分类">${Object.entries({all:{label:'全部'},...groups()}).map(([key,item],index)=>`<button data-group="${key}" aria-pressed="${key===viewGroup}"><span class="nav-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><i class="nav-node" aria-hidden="true"></i><span class="nav-label">${item.label}</span></button>`).join('')}</nav><div class="content"><section class="overview"><div class="eyebrow"><span>${c.eyebrow}</span><small lang="en">${c.english}</small></div><h2>${c.heading}</h2><p>${c.intro}</p></section>${catalogue()}${detail()}${extra()}${scenarioSection()}${footer()}</div>`;
}
document.addEventListener('click',e=>{
 const g=e.target.closest('[data-group]'),i=e.target.closest('[data-item]');
 if(g){viewGroup=g.dataset.group;if(viewGroup!=='all'){group=viewGroup;selected=page==='models'?'0':page==='teaching'?selected:groups()[group].representative;}render();document.querySelector(`[data-group="${viewGroup}"]`).focus({preventScroll:true});}
 if(i){group=i.dataset.owner;selected=i.dataset.item;render();document.querySelector(`[data-owner="${group}"][data-item="${selected}"]`).focus({preventScroll:true});}
});
render();
})();