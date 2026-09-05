(() => {
  'use strict';

  const column = document.body.dataset.column;
  const setText = (selector, text) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  };
  const setHtml = (selector, html) => {
    const node = document.querySelector(selector);
    if (node) node.innerHTML = html;
  };
  const addNoteBefore = (selector, html) => {
    const node = document.querySelector(selector);
    if (node && !document.querySelector('.column-truth-note')) {
      node.insertAdjacentHTML('beforebegin', html);
    }
  };
  const replaceAction = (from, label, detail) => {
    const button = document.querySelector('.primary-action');
    if (!button) return;
    const link = document.createElement('a');
    link.className = 'primary-action column-feedback-link';
    link.href = `/feedback.html?from=${from}`;
    link.innerHTML = `<span><small>${detail}</small><b>${label}</b></span><span aria-hidden="true">→</span>`;
    button.replaceWith(link);
  };

  if (column === 'energy-models') {
    setHtml('.hero-title', '能源模型资源<br><em>分类查看更清楚</em>');
    setText('.hero-summary', '按能源方向和模型种类浏览分类框架，公开资料按核验进度逐项上线。');
    setText('.section-head h2', '先看分类框架，再确认可用资料');
    addNoteBefore('.asset-ledger', '<p class="column-truth-note"><strong>当前状态</strong> 本页展示模型分类框架，不代表全部模型已经形成可交付库存。</p>');
    replaceAction('04', '提交模型需求', '说明对象、工况与软件环境');
  }

  if (column === 'digital-twin') {
    setHtml('.hero-copy h1', '数智孪生<br>从规划到优化');
    setText('.hero-summary', '按设计验证、数据孪生和分析优化组织产品架构，并明确已验证、在建与规划能力。');
    addNoteBefore('.architecture-cutaway', '<p class="column-truth-note"><strong>阅读提示</strong> 先看能力状态，再查看每个中心的输入、输出和当前边界。</p>');
    replaceAction('06', '提交软件项目需求', '说明场景、数据与验证目标');
  }

  if (column === 'teaching-software') {
    setHtml('.hero-copy h1', '教学软件<br>从原理到实践');
    setText('.hero-summary', '围绕建模、运行、分析、工况与故障，组织可复核的教学实践过程。');
    addNoteBefore('.stage-overview', '<p class="column-truth-note"><strong>当前状态</strong> 本页展示教学实践方案；课程、软件功能和样例按教学目标审核后开放。</p>');
    setText('.page-boundary', '当前展示教学实践方案；课程、软件功能、故障场景和考评规则需按教学目标设计并审核后开放。');
    replaceAction('05', '提交教学需求', '说明课程对象、目标与教学环境');
  }

  if (column === 'technical-services') {
    setHtml('.hero-copy h1', '技术服务<br>从模型走向验证');
    setText('.hero-summary', '以模型定制和仿真验证为核心，按项目条件组合科研协同、软件实施与技术资料。');
    addNoteBefore('.service-switchboard', '<p class="column-truth-note"><strong>承接顺序</strong> 优先确认模型定制与仿真验证；HIL、孪生、诊断和优化按平台、数据与合作条件评估。</p>');
    replaceAction('07', '提交服务需求', '说明对象、任务边界与预期成果');
  }
})();
