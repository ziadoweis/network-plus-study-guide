import {store,DOMAINS,LABS,PT_META,CORRECTIONS,SITE_NAME,head,clearTimers,nav,state,registry} from './core.js';

const PT_SHORT=['First LAN and SSH','VLANs and trunks','Inter-VLAN routing and DHCP','Static routing','OSPF','NAT and PAT','ACLs and screened subnet','DNS, NTP, syslog, SNMP','Switch security','Wireless LAN','IPv6 dual stack','Break and fix','Capstone'];
const main=document.getElementById('main'),rail=document.getElementById('rail');
const VIEWS={};
registry.VIEWS=VIEWS;

/* Sections load on first visit, then stay cached by the browser and the service worker. */
const load={quiz:()=>import('./quiz.js'),labs:()=>import('./labs.js'),pt:()=>import('./pt.js'),study:()=>import('./study.js'),notes:()=>import('./notes.js')};
function resolve(h){
  if(VIEWS[h])return Promise.resolve(VIEWS[h]);
  if(h==='quiz'||h==='exam')return load.quiz().then(m=>m.VIEWS[h]);
  if(h==='study')return load.study().then(m=>m.VIEWS.study);
  if(/^do-[A-Za-z0-9-]+$/.test(h))return load.study().then(m=>m.itemView(h.slice(3)));
  if(h==='notes')return load.notes().then(m=>m.VIEWS.notes);
  if(/^notes-\d+$/.test(h))return load.notes().then(m=>m.notesView(+h.slice(6)));
  if(h.startsWith('lab-'))return load.labs().then(m=>m.VIEWS[h]);
  if(h==='pt')return load.pt().then(m=>m.VIEWS.pt);
  if(PT_META.some(p=>p.slug===h))return load.pt().then(m=>m.ptView(h));
  return null;
}
const KNOWN=h=>VIEWS[h]||/^do-[A-Za-z0-9-]+$/.test(h)||['quiz','exam','pt','study','notes'].includes(h)||/^notes-([1-9]|1\d|2[01])$/.test(h)||h.startsWith('lab-')&&LABS.some(l=>l.hash===h)||PT_META.some(p=>p.slug===h);

const NAV=[
 ['Start',[['overview','Overview'],['study','Study path'],['notes','Lessons']]],
 ['Practice',[['quiz','Quizzes'],['exam','Mock exam']]],
 ['Labs',LABS.map(l=>[l.hash,l.name])],
 ['Packet Tracer',[['pt','All Packet Tracer labs'],...PT_META.map((p,i)=>[p.slug,`${i+1}. ${PT_SHORT[i]}`])]],
 ['Reference',[['corrections','Corrections to your materials'],['roadmap','Roadmap']]]];
rail.innerHTML=`<div class="railhead"><div><div class="title">${SITE_NAME}</div><div class="sub">CompTIA N10-009</div></div><button type="button" class="menubtn" id="menubtn" aria-expanded="false" aria-controls="navlinks">Menu</button></div>
<div class="navlinks" id="navlinks"><div class="railtabs" role="tablist"><button type="button" role="tab" data-rt="course">Course</button><button type="button" role="tab" data-rt="pages">All pages</button></div>
<div id="rail-course" class="railpanel"><p class="hint">Loading course…</p></div>
<div id="rail-pages" class="railpanel">`+NAV.map(([h,items])=>`<h4>${h}</h4>`+items.map(([k,l])=>`<a href="#${k}" data-r="${k}">${l}</a>`).join('')).join('')+'</div></div>';
const menubtn=document.getElementById('menubtn'),coursePanel=document.getElementById('rail-course'),pagesPanel=document.getElementById('rail-pages');
const setMenu=open=>{rail.classList.toggle('open',open);menubtn.setAttribute('aria-expanded',String(open));menubtn.textContent=open?'Close':'Menu'};
menubtn.addEventListener('click',()=>setMenu(!rail.classList.contains('open')));
let railTab=store.get('railTab','course');
function setTab(t){railTab=t;store.set('railTab',t);rail.querySelectorAll('[data-rt]').forEach(b=>{const on=b.dataset.rt===t;b.classList.toggle('on',on);b.setAttribute('aria-selected',String(on))});coursePanel.hidden=t!=='course';pagesPanel.hidden=t!=='pages';if(t==='course')refreshOutline()}
rail.addEventListener('click',e=>{const b=e.target.closest('[data-rt]');if(b)setTab(b.dataset.rt)});
let studyMod=null;
function refreshOutline(){if(railTab!=='course')return;const cur=location.hash.startsWith('#do-')?location.hash.slice(4):null;
  (studyMod?Promise.resolve(studyMod):load.study().then(m=>studyMod=m)).then(m=>m.renderOutline(coursePanel,cur)).catch(()=>{coursePanel.innerHTML='<p class="hint">The course outline couldn\'t load.</p>'})}
let pend=0;window.addEventListener('np:progress',()=>{if(!pend){pend=1;requestAnimationFrame(()=>{pend=0;refreshOutline()})}});
rail.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});

/* Toolbar: hide the sidebar, or read a page full screen */
const shell=document.querySelector('.shell'),tbRail=document.getElementById('tb-rail'),tbFull=document.getElementById('tb-full');
const TBI={side:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M6 2.5v11"/></svg>',
  full:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"/></svg>',
  exit:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4"/></svg>'};
let railHidden=!!store.get('railHidden',false),focusOn=false;
function applyRail(){shell.classList.toggle('norail',railHidden);tbRail.innerHTML=TBI.side+(railHidden?'Show sidebar':'Hide sidebar');tbRail.setAttribute('aria-pressed',String(railHidden))}
tbRail.addEventListener('click',()=>{railHidden=!railHidden;store.set('railHidden',railHidden);applyRail()});
function setFocus(on){
  focusOn=on;shell.classList.toggle('focus',on);tbFull.innerHTML=on?TBI.exit+'Exit full page':TBI.full+'Full page';tbFull.setAttribute('aria-pressed',String(on));
  if(on){try{const r=document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();if(r&&r.catch)r.catch(()=>{})}catch(e){}}
  else if(document.fullscreenElement){try{document.exitFullscreen().catch(()=>{})}catch(e){}}
}
tbFull.addEventListener('click',()=>setFocus(!focusOn));
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&focusOn)setFocus(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&focusOn&&!document.fullscreenElement)setFocus(false)});
applyRail();setFocus(false);

let seq=0;
function route(){
  clearTimers();
  main.onclick=main.onchange=main.oninput=main.onkeydown=null;document.onkeydown=null;
  let h=location.hash.slice(1);if(!KNOWN(h))h='overview';
  const navKey=h.startsWith('notes-')?'notes':h;
  rail.querySelectorAll('a').forEach(a=>{const on=a.dataset.r===navKey;a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  refreshOutline();
  tbFull.hidden=['overview','study','quiz','exam'].includes(h);if(tbFull.hidden&&focusOn)setFocus(false);
  const my=++seq;const p=resolve(h);
  const show=v=>{if(my!==seq)return;main.innerHTML='';v(main);const h1=main.querySelector('h1');document.title=h1&&h!=='overview'?`${h1.textContent} · ${SITE_NAME}`:SITE_NAME;window.scrollTo(0,0)};
  if(VIEWS[h])return show(VIEWS[h]);
  main.innerHTML='<p class="hint">Loading…</p>';
  p.then(show).catch(()=>{if(my===seq)main.innerHTML='<p>This section couldn\'t load. Check your connection and <a href="">reload</a>.</p>'});
}
nav.route=route;
window.addEventListener('hashchange',route);
setTab(railTab);

/* Copy buttons on Packet Tracer command blocks */
function selectPre(pre){const r=document.createRange();r.selectNodeContents(pre);const s=window.getSelection();s.removeAllRanges();s.addRange(r)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;const pre=b.closest('.cmd').querySelector('pre');
  const fail=()=>{selectPre(pre);b.textContent='Selected: press Ctrl+C'};
  try{navigator.clipboard.writeText(pre.textContent).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1400)},fail)}catch(err){fail()}});

/* ---------- overview ---------- */
VIEWS.overview=function(el){
  const best=store.get('quizBest',{}),labs=store.get('labs',{}),pt=store.get('pt',{}),exams=store.get('exams',[]);
  const last=exams[exams.length-1];
  const labState=id=>{const L=labs[id]||{};if(L.done)return 'done';if(L.n)return L.n+' solved';if(L.best!=null)return 'best '+L.best+'%';return '—'};
  const ptDone=PT_META.filter(p=>pt[p.slug]).length;
  el.innerHTML=`${head('CompTIA Network+ · N10-009','Your progress','Follow the Study path lesson by lesson: read each lesson, take its quiz, then do the labs and Packet Tracer builds that go with it. It highlights your next task. Progress is saved in this browser only.')}
  <div id="nextup" style="margin-bottom:22px"><div class="nextbox"><p class="hint">Loading your next task…</p></div></div>
  <p class="small muted" style="margin-bottom:22px">Exam: up to 90 questions (multiple choice and performance-based), 90 minutes, pass mark 720 on a 100–900 scale. ${last?`Last mock exam: <b class="mono" style="color:var(--ink)">${last.pct}%</b>.`:'No mock exam taken yet.'}</p>
  <h2>Domains</h2>
  <div class="tw"><table><thead><tr><th>Domain</th><th>Weight</th><th>Book chapters</th><th>Best quiz</th><th></th></tr></thead><tbody>
  ${DOMAINS.map(d=>{const b=best[d.id];return `<tr><td>${d.id}.0 ${d.name}</td><td class="mono">${d.w}%</td><td class="mono small">${d.ch}</td><td class="mono ${b==null?'muted':b>=85?'ok':b<60?'no':''}">${b==null?'—':b+'%'}</td><td><button class="link" data-q="d${d.id}">Quiz</button></td></tr>`}).join('')}
  </tbody></table></div>
  <h2 style="margin-top:28px">Labs</h2>
  <ul class="list">${LABS.map(l=>`<li><a href="#${l.hash}">${l.name}<span class="desc">${l.desc}</span></a><span class="meta">Obj ${l.obj} · ${labState(l.id)}</span></li>`).join('')}</ul>
  <h2 style="margin-top:28px">Packet Tracer labs <span class="muted small">(${ptDone} of ${PT_META.length} done)</span></h2>
  <ul class="list">${PT_META.map((p,i)=>`<li><a href="#${p.slug}">${i+1}. ${p.title}</a><span class="meta">${pt[p.slug]?'done':p.time}</span></li>`).join('')}</ul>
  <p style="margin-top:30px"><button class="link" id="reset">Reset all progress</button></p>`;
  load.study().then(m=>{const box=document.getElementById('nextup');if(box&&main.contains(box))box.innerHTML=m.nextBox(m.progress(),{showLink:true})}).catch(()=>{const box=document.getElementById('nextup');if(box)box.remove()});
  main.onclick=e=>{
    const g=e.target.closest('[data-go]');if(g){load.study().then(m=>m.goTo(g.dataset.go));return}
    const tk=e.target.closest('button[data-tick]');if(tk){const m=store.get('plan',{});m[tk.dataset.tick]=true;store.set('plan',m);route();return}
    const q=e.target.closest('[data-q]');if(q){state.startQuiz=q.dataset.q;location.hash='quiz';return}
    if(e.target.id==='reset'){const b=e.target;if(b.dataset.armed){['quizBest','quizKeyBest','plan','notesRead','labs','asg','pt','cap'].forEach(k=>store.set(k,{}));store.set('exams',[]);route()}else{b.dataset.armed=1;b.textContent='Click again to erase all progress'}}
  };
};


/* ---------- corrections ---------- */
VIEWS.corrections=function(el){
  el.innerHTML=`${head('Reference','Corrections to your study materials','Places where your Sybex book, course handouts or quiz workbook disagree with the N10-009 objectives or the underlying standards. Learn the right-hand column for the exam.')}
  <div class="tw"><table><thead><tr><th>Where</th><th>What it says</th><th>What\'s correct</th><th>Lesson</th></tr></thead><tbody>${CORRECTIONS.map(c=>`<tr><td class="small mono">${c[0]}</td><td class="small">${c[1]}</td><td class="small">${c[2]}</td><td class="small">${c[3]?`<a href="#notes-${c[3]}">Lesson ${c[3]}</a>`:'—'}</td></tr>`).join('')}</tbody></table></div>
  <h2 style="margin-top:26px">Terminology CompTIA uses now</h2>
  <div class="tw"><table><thead><tr><th>Older term</th><th>N10-009 term</th></tr></thead><tbody>${[['Man-in-the-middle','On-path attack'],['DMZ','Screened subnet'],['Mantrap','Access control vestibule'],['Whitelist / blacklist','Allow list / block list']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`;
};


/* ---------- roadmap ---------- */
VIEWS.roadmap=function(el){
  el.innerHTML=`${head('Reference','Roadmap','How Network+, CCNA and the Windows Server certification fit together.')}
  <h2>1. CompTIA Network+ (N10-009)</h2>
  <p class="prose" style="margin:8px 0 18px">Vendor-neutral foundations. Book it when every domain quiz is at 85%+, mock exams are consistently 85%+, and you can subnet a /26–/29 in under a minute. CompTIA retires exams about three years after launch (N10-009 launched June 2024), so check the objectives PDF on comptia.org before you book.</p>
  <h2>2. Cisco CCNA (200-301)</h2>
  <p class="prose" style="margin:8px 0">This is where the concepts become configuration. Packet Tracer labs 2–7 and 10–12 are direct CCNA preparation. CCNA v1.1 can be taken until 2 February 2027; v2.0 replaces it on 3 February 2027 with the same exam code. If you start CCNA after Network+, you'll probably sit v2.0, so buy material labelled v2.0.</p>
  <h2 style="margin-top:18px">3. "MCSA" → Windows Server Administrator (AZ-802)</h2>
  <p class="prose" style="margin:8px 0">Microsoft retired the MCSA in 2021. The closest current certification is Windows Server Administrator Associate (formerly Windows Server Hybrid Administrator), earned since 30 September 2026 with the single exam AZ-802, which replaced AZ-800 and AZ-801. Confirm with your manager that this is what they mean. If the role is cloud-focused, AZ-104 (Azure Administrator) may be the intended target. Your DNS, DHCP and AAA knowledge from Network+ carries straight over.</p>
  <h2 style="margin-top:18px">Links</h2>
  <ul class="steps small"><li><a href="https://www.comptia.org/certifications/network">CompTIA Network+</a>: download the N10-009 objectives PDF</li><li><a href="https://www.netacad.com">Cisco Networking Academy</a>: Packet Tracer</li><li><a href="https://learn.microsoft.com/en-us/credentials/certifications/windows-server-hybrid-administrator/">Microsoft Learn: Windows Server administrator certification</a></li></ul>`;
};


route();

/* Warm the other sections when the browser is idle so navigation is instant. */
const idle=window.requestIdleCallback||(f=>setTimeout(f,1500));
idle(()=>{load.study();load.notes();load.quiz();load.labs();load.pt()});

/* Offline support on real hosting (not inside sandboxed previews). */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')&&window.self===window.top){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{})});
}
