(() => {
  const toast = document.querySelector('.page-toast');
  let toastTimer = 0;

  const showToast = message => {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const copyText = async text => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  };

  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await copyText(button.dataset.copy || '');
        showToast(`${button.dataset.copyLabel || '内容'}已复制`);
      } catch {
        showToast('复制失败，请长按文字复制');
      }
    });
  });

  const form = document.querySelector('#feedback-form');
  const status = document.querySelector('#form-status');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (status) {
        status.textContent = '当前为本地视觉稿，接收接口尚未配置，本次内容没有发送。';
      }
      showToast('内容未发送：需先配置反馈接收接口');
    });
  }
})();
