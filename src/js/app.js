import {store,DOMAINS,LABS,PT_META,CORRECTIONS,SITE_NAME,head,clearTimers,nav,state} from './core.js';

const PT_SHORT=['First LAN and SSH','VLANs and trunks','Inter-VLAN routing and DHCP','Static routing','OSPF','NAT and PAT','ACLs and screened subnet','DNS, NTP, syslog, SNMP','Switch security','Wireless LAN','IPv6 dual stack','Break and fix','Capstone'];
const main=document.getElementById('main'),rail=document.getElementById('rail');
const VIEWS={};

/* Sections load on first visit, then stay cached by the browser and the service worker. */
const load={quiz:()=>import('./quiz.js'),labs:()=>import('./labs.js'),pt:()=>import('./pt.js')};
function resolve(h){
  if(VIEWS[h])return Promise.resolve(VIEWS[h]);
  if(h==='quiz'||h==='exam')return load.quiz().then(m=>m.VIEWS[h]);
  if(h.startsWith('lab-'))return load.labs().then(m=>m.VIEWS[h]);
  if(h==='pt')return load.pt().then(m=>m.VIEWS.pt);
  if(PT_META.some(p=>p.slug===h))return load.pt().then(m=>m.ptView(h));
  return null;
}
const KNOWN=h=>VIEWS[h]||['quiz','exam','pt'].includes(h)||h.startsWith('lab-')&&LABS.some(l=>l.hash===h)||PT_META.some(p=>p.slug===h);

const NAV=[
 ['Start',[['overview','Overview']]],
 ['Practice',[['quiz','Quizzes'],['exam','Mock exam']]],
 ['Labs',LABS.map(l=>[l.hash,l.name])],
 ['Packet Tracer',[['pt','All Packet Tracer labs'],...PT_META.map((p,i)=>[p.slug,`${i+1}. ${PT_SHORT[i]}`])]],
 ['Reference',[['corrections','Corrections to your materials'],['roadmap','Roadmap']]]];
rail.innerHTML=`<div class="railhead"><div><div class="title">${SITE_NAME}</div><div class="sub">CompTIA N10-009</div></div><button type="button" class="menubtn" id="menubtn" aria-expanded="false" aria-controls="navlinks">Menu</button></div><div class="navlinks" id="navlinks">`+NAV.map(([h,items])=>`<h4>${h}</h4>`+items.map(([k,l])=>`<a href="#${k}" data-r="${k}">${l}</a>`).join('')).join('')+'</div>';
const menubtn=document.getElementById('menubtn');
const setMenu=open=>{rail.classList.toggle('open',open);menubtn.setAttribute('aria-expanded',String(open));menubtn.textContent=open?'Close':'Menu'};
menubtn.addEventListener('click',()=>setMenu(!rail.classList.contains('open')));
rail.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});

let seq=0;
function route(){
  clearTimers();
  main.onclick=main.onchange=main.oninput=main.onkeydown=null;document.onkeydown=null;
  let h=location.hash.slice(1);if(!KNOWN(h))h='overview';
  rail.querySelectorAll('a').forEach(a=>{const on=a.dataset.r===h;a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  const my=++seq;const p=resolve(h);
  const show=v=>{if(my!==seq)return;main.innerHTML='';v(main);const h1=main.querySelector('h1');document.title=h1&&h!=='overview'?`${h1.textContent} · ${SITE_NAME}`:SITE_NAME;window.scrollTo(0,0)};
  if(VIEWS[h])return show(VIEWS[h]);
  main.innerHTML='<p class="hint">Loading…</p>';
  p.then(show).catch(()=>{if(my===seq)main.innerHTML='<p>This section couldn\'t load. Check your connection and <a href="">reload</a>.</p>'});
}
nav.route=route;
window.addEventListener('hashchange',route);

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
  el.innerHTML=`${head('CompTIA Network+ · N10-009','Study plan and progress','Use this alongside your course and the Sybex book: after each chapter, take the matching quiz, do the lab, then build the Packet Tracer lab for that topic. Progress is saved in this browser only.')}
  <p class="small muted" style="margin-bottom:22px">Exam: up to 90 questions (multiple choice and performance-based), 90 minutes, pass mark 720 on a 100–900 scale. ${last?`Last mock exam: <b class="mono" style="color:var(--ink)">${last.pct}%</b>.`:'No mock exam taken yet.'}</p>
  <h2>Domains</h2>
  <div class="tw"><table><thead><tr><th>Domain</th><th>Weight</th><th>Book chapters</th><th>Best quiz</th><th></th></tr></thead><tbody>
  ${DOMAINS.map(d=>{const b=best[d.id];return `<tr><td>${d.id}.0 ${d.name}</td><td class="mono">${d.w}%</td><td class="mono small">${d.ch}</td><td class="mono ${b==null?'muted':b>=85?'ok':b<60?'no':''}">${b==null?'—':b+'%'}</td><td><button class="link" data-q="d${d.id}">Quiz</button></td></tr>`}).join('')}
  </tbody></table></div>
  <h2 style="margin-top:28px">Labs</h2>
  <ul class="list">${LABS.map(l=>`<li><a href="#${l.hash}">${l.name}<span class="desc">${l.desc}</span></a><span class="meta">Obj ${l.obj} · ${labState(l.id)}</span></li>`).join('')}</ul>
  <h2 style="margin-top:28px">Packet Tracer labs <span class="muted small">(${ptDone} of ${PT_META.length} done)</span></h2>
  <ul class="list">${PT_META.map((p,i)=>`<li><a href="#${p.slug}">${i+1}. ${p.title}</a><span class="meta">${pt[p.slug]?'done':p.time}</span></li>`).join('')}</ul>
  <h2 style="margin-top:28px">Suggested routine</h2>
  <ol class="steps small">
   <li>Read a book chapter or watch the matching course module.</li>
   <li>Take the quiz for that chapter (Quizzes → by book chapter). Read every explanation.</li>
   <li>Spend ten minutes a day on subnetting and ports.</li>
   <li>Build one Packet Tracer lab a week, in order. Several build on the previous file.</li>
   <li>Every two weeks, take a mock exam and re-quiz your weakest domain. Book the exam once you're at 85%+ consistently.</li>
  </ol>
  <p style="margin-top:30px"><button class="link" id="reset">Reset all progress</button></p>`;
  main.onclick=e=>{
    const q=e.target.closest('[data-q]');if(q){state.startQuiz=q.dataset.q;location.hash='quiz';return}
    if(e.target.id==='reset'){const b=e.target;if(b.dataset.armed){['quizBest','labs','asg','pt','cap'].forEach(k=>store.set(k,{}));store.set('exams',[]);route()}else{b.dataset.armed=1;b.textContent='Click again to erase all progress'}}
  };
};


/* ---------- corrections ---------- */
VIEWS.corrections=function(el){
  el.innerHTML=`${head('Reference','Corrections to your study materials','Places where your Sybex book, video handouts or quiz workbook disagree with the N10-009 objectives or the underlying standards. Learn the right-hand column for the exam.')}
  <div class="tw"><table><thead><tr><th>Where</th><th>What it says</th><th>What\'s correct</th></tr></thead><tbody>${CORRECTIONS.map(c=>`<tr><td class="small mono">${c[0]}</td><td class="small">${c[1]}</td><td class="small">${c[2]}</td></tr>`).join('')}</tbody></table></div>
  <h2 style="margin-top:26px">Terminology CompTIA uses now</h2>
  <div class="tw"><table><thead><tr><th>Older term</th><th>N10-009 term</th></tr></thead><tbody>${[['Man-in-the-middle','On-path attack'],['DMZ','Screened subnet'],['Mantrap','Access control vestibule'],['Whitelist / blacklist','Allow list / block list']].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`;
};


/* ---------- roadmap ---------- */
VIEWS.roadmap=function(el){
  el.innerHTML=`${head('Reference','Roadmap','How Network+, CCNA and the Windows Server certification fit together.')}
  <h2>1. CompTIA Network+ (N10-009)</h2>
  <p style="margin:8px 0 18px;max-width:70ch">Vendor-neutral foundations. Book it when every domain quiz is at 85%+, mock exams are consistently 85%+, and you can subnet a /26–/29 in under a minute. CompTIA retires exams about three years after launch (N10-009 launched June 2024), so check the objectives PDF on comptia.org before you book.</p>
  <h2>2. Cisco CCNA (200-301)</h2>
  <p style="margin:8px 0;max-width:70ch">This is where the concepts become configuration. Packet Tracer labs 2–9 and 12 are direct CCNA preparation. CCNA v1.1 can be taken until 2 February 2027; v2.0 replaces it on 3 February 2027 with the same exam code. If you start CCNA after Network+, you'll probably sit v2.0, so buy material labelled v2.0.</p>
  <h2 style="margin-top:18px">3. "MCSA" → Windows Server Administrator (AZ-802)</h2>
  <p style="margin:8px 0;max-width:70ch">Microsoft retired the MCSA in 2021. The closest current certification is Windows Server Administrator Associate (formerly Windows Server Hybrid Administrator), earned since 30 September 2026 with the single exam AZ-802, which replaced AZ-800 and AZ-801. Confirm with your manager that this is what they mean. If the role is cloud-focused, AZ-104 (Azure Administrator) may be the intended target. Your DNS, DHCP and AAA knowledge from Network+ carries straight over.</p>
  <h2 style="margin-top:18px">Links</h2>
  <ul class="steps small"><li><a href="https://www.comptia.org/certifications/network">CompTIA Network+</a>: download the N10-009 objectives PDF</li><li><a href="https://www.netacad.com">Cisco Networking Academy</a>: Packet Tracer</li><li><a href="https://learn.microsoft.com/en-us/credentials/certifications/windows-server-hybrid-administrator/">Microsoft Learn: Windows Server administrator certification</a></li></ul>`;
};


route();

/* Warm the other sections when the browser is idle so navigation is instant. */
const idle=window.requestIdleCallback||(f=>setTimeout(f,1500));
idle(()=>{load.quiz();load.labs();load.pt()});

/* Offline support on real hosting (not inside sandboxed previews). */
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')&&window.self===window.top){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{})});
}
