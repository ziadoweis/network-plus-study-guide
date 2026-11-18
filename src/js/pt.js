import {store,esc,shuffle,rnd,pick,ip2int,int2ip,maskInt,isIp,sameNet,DOMAINS,OBJ,CHAPTERS,objTag,LABS,PT_META,head,markLab,timers,clearTimers,nav,state} from './core.js';
const main=document.getElementById('main');
const VIEWS={};
export {VIEWS};
import {PT_SETUP,PTLABS} from './pt-data.js';
import {DEVICES} from './pt-devices.js';
import {TOPOS,CABLING} from './pt-topos.js';
const devicesHtml=slug=>{const d=DEVICES[slug];if(!d)return '';
  return `<section class="ptdev"><h2>What to place in Packet Tracer</h2>${d.reuse?`<p>${d.reuse}</p>`:''}${d.place?`<div class="tw"><table><thead><tr><th>In this lab</th><th>Where in the device bar</th><th>Pick this model</th><th>Ports you\'ll use</th></tr></thead><tbody>${d.place.map(r=>`<tr><td><b>${r[0]}</b></td><td class="small">${r[1]}</td><td>${r[2]}</td><td class="small mono">${r[3]}</td></tr>`).join('')}</tbody></table></div>`:''}${cablingHtml(slug)}</section>`};
const cablingHtml=slug=>{const c=CABLING[slug];if(!c||!c.length)return '';
  return `<h3>How to cable it</h3><p class="small">Pick each cable from <b>Connections</b> (the lightning-bolt icon), click the first device and choose its port, then click the second device and choose its port.</p><div class="tw"><table><thead><tr><th>From</th><th>Port</th><th>To</th><th>Port</th><th>Cable</th></tr></thead><tbody>${c.map(l=>`<tr><td><b>${l.from}</b></td><td class="mono">${l.fp}</td><td><b>${l.to}</b></td><td class="mono">${l.tp}</td><td class="small">${l.cable}${l.note?`<br><span class="muted">${l.note}</span>`:''}</td></tr>`).join('')}</tbody></table></div>`};
/* ---------- Packet Tracer views ---------- */
VIEWS.pt=function(el){
  const done=store.get('pt',{});
  el.innerHTML=`${head('Packet Tracer','Packet Tracer labs',`${PTLABS.length} labs in the order the lessons reach them, each with a topology, an addressing table, every command, how to verify, experiments that break things on purpose, and questions to check yourself. They cover Network+ hands-on skills and lead straight into the CCNA.`)}
  <ul class="list">${PTLABS.map((p,i)=>`<li><a href="#${p.slug}">${i+1}. ${p.title}<span class="desc">${p.goal}</span></a><span class="meta">${p.after==='F'?'Final review':'After Lesson '+p.after} · ${done[p.slug]?'done':p.time}</span></li>`).join('')}</ul>
  <div class="lab">${PT_SETUP}</div>`;
};
function ptView(slug){return function(el){
  const idx=PTLABS.findIndex(p=>p.slug===slug),p=PTLABS[idx],done=store.get('pt',{});
  const prev=PTLABS[idx-1],next=PTLABS[idx+1];
  el.innerHTML=`<article class="lab"><div class="labhead"><p class="eyebrow">Packet Tracer lab ${idx+1} of ${PTLABS.length} · ${p.after==='F'?'final review':'after Lesson '+p.after}</p><h1>${p.title}</h1>
  <p class="meta">${p.obj.map(o=>objTag(o)).join('  ·  ')}  ·  ${p.time}</p><p class="lede">${p.goal}</p></div>
  ${TOPOS[slug]?`<h2>Topology</h2>${TOPOS[slug]}`:''}
  ${devicesHtml(slug)}
  ${p.body()}
  <h2>Check your understanding</h2><div class="qa">${p.qs.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>
  <label class="done-row"><input type="checkbox" id="ptdone" ${done[slug]?'checked':''}> I finished this lab</label>
  <div class="labnav"><span>${prev?`<a href="#${prev.slug}">← ${prev.title}</a>`:'<a href="#pt">← All labs</a>'}</span><span>${next?`<a href="#${next.slug}">${next.title} →</a>`:''}</span></div></article>`;
  const cap=store.get('cap',{});el.querySelectorAll('[data-cap]').forEach(c=>c.checked=!!cap[c.dataset.cap]);
  main.onchange=e=>{if(e.target.id==='ptdone'){const d=store.get('pt',{});d[slug]=e.target.checked;store.set('pt',d)}
    if(e.target.dataset.cap!=null){const c=store.get('cap',{});c[e.target.dataset.cap]=e.target.checked;store.set('cap',c)}};
}}


export {ptView};
