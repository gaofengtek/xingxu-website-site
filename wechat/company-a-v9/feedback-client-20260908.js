/* Dedicated customer form integration. The API base comes from the approved page's data-feedback-api. */
(()=>{'use strict';const form=document.querySelector('#form');if(!form)return;
const status=document.querySelector('.status'),button=form.querySelector('[type=submit]');
const base=(document.body.dataset.feedbackApi||'').replace(/\/$/,'');
const counter=document.querySelector('#count'),description=document.querySelector('#description');
let inflight=false,attempt=null;
description.addEventListener('input',()=>{counter.textContent=description.value.length});
const trap=document.createElement('input');trap.name='website';trap.type='text';trap.autocomplete='off';trap.tabIndex=-1;trap.setAttribute('aria-hidden','true');trap.hidden=true;form.append(trap);
// This script replaces the old page.js on feedback.html; it must not coexist with the demo submit handler.
form.addEventListener('submit',async event=>{event.preventDefault();if(inflight||!form.reportValidity())return;
if(!base){status.textContent='在线反馈暂未开放，请致电15592546088咨询。';return}
const origin=new URL(base,location.href);if(origin.protocol!=='https:'&&!(location.hostname==='127.0.0.1'&&origin.hostname==='127.0.0.1')){status.textContent='提交服务未正确配置，请电话咨询。';return}
const source=new URLSearchParams(location.search).get('from');
const payload={direction:form.querySelector('[name=direction]:checked').value,contact:document.querySelector('#contact').value.trim(),description:description.value.trim(),source:['04','05','06','07'].includes(source)?source:'direct',website:trap.value};
if(payload.description.length<5||payload.contact.length<3){status.textContent='请填写有效联系方式，并用至少5个字说明需求。';return}
const serialized=JSON.stringify(payload);
if(!attempt||attempt.payload!==serialized)attempt={key:crypto.randomUUID(),payload:serialized};
// Keep the same idempotency key on network failures. Customer content stays in page memory only.
inflight=true;button.disabled=true;status.textContent='正在提交，请稍候…';
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
try{const response=await fetch(base+'/api/feedback',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':attempt.key},body:serialized,signal:controller.signal,credentials:'omit'});let data;try{data=await response.json()}catch{throw Error('服务暂时无法响应，请稍后重试。')}
if(!response.ok){if(response.status===409)attempt=null;throw Error(typeof data.detail==='string'?data.detail:'提交未完成，请稍后重试。')}
if(data.saved!==true||!/^XX-\d{8}-[A-F0-9]{10}$/.test(data.id))throw Error('未获得有效接收回执，请稍后重试。');
status.textContent='需求已提交成功。编号：'+data.id+'。我们将通过你填写的联系方式与你沟通。';form.reset();counter.textContent='0';attempt=null;
}catch(error){status.textContent=error.name==='AbortError'?'请求超时，接收结果尚未确认。请保持页面并重试，系统会避免重复记录。':error.message||'提交未完成，请稍后重试。'}finally{clearTimeout(timer);inflight=false;button.disabled=false}});
})();
