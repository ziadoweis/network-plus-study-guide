import {store,esc,shuffle,rnd,pick,ip2int,int2ip,maskInt,isIp,sameNet,DOMAINS,OBJ,CHAPTERS,objTag,LABS,PT_META,head,markLab,timers,clearTimers,nav,state} from './core.js';
const main=document.getElementById('main');
const VIEWS={};
export {VIEWS};
import {QB} from './qb.js';
/* ---------- quizzes ---------- */
const qDom=q=>+q[0][0];
const isMulti=q=>Array.isArray(q[3]);
const isRight=(q,p)=>isMulti(q)?Array.isArray(p)&&p.length===q[3].length&&p.every(x=>q[3].includes(x)):p===q[3];
const ansText=(q,p)=>p==null?'(no answer)':(Array.isArray(p)?p:[p]).map(k=>q[2][k]).join(' + ');
function quizSet(key){
  if(key==='all')return {qs:QB,title:'All domains'};
  if(key[0]==='d'){const d=+key.slice(1);return {qs:QB.filter(q=>qDom(q)===d),title:`${d}.0 ${DOMAINS[d-1].name}`,domain:d}}
  if(key[0]==='c'){const c=+key.slice(1);return {qs:QB.filter(q=>OBJ[q[0]][1].includes(c)),title:`Book Ch. ${c}: ${CHAPTERS[c-1]}`}}
  if(key[0]==='o'){const o=key.slice(1);return {qs:QB.filter(q=>q[0]===o),title:`Objective ${o}: ${OBJ[o][0]}`}}
}
VIEWS.quiz=function(el){
  if(state.startQuiz){const s=quizSet(state.startQuiz);state.startQuiz=null;return runQuiz(el,shuffle(s.qs),s)}
  const best=store.get('quizBest',{});
  const chCount=c=>QB.filter(q=>OBJ[q[0]][1].includes(c)).length;
  el.innerHTML=`${head('Practice','Quizzes',`${QB.length} questions written to the N10-009 objectives. Each shows its objective and the book chapter to reread. Some are "choose two". Keys 1–4 answer, Enter continues.`)}
  <h2>By domain</h2>
  <ul class="list">${DOMAINS.map(d=>{const n=QB.filter(q=>qDom(q)===d.id).length,b=best[d.id];return `<li><button class="link" data-k="d${d.id}">${d.id}.0 ${d.name}</button><span class="meta">${n} questions · ${b==null?'not attempted':'best '+b+'%'}</span></li>`}).join('')}
  <li><button class="link" data-k="all">All domains, shuffled</button><span class="meta">${QB.length} questions</span></li></ul>
  <h2 style="margin-top:26px">By book chapter</h2>
  <p class="hint">Questions from the objectives each Sybex chapter covers. Take it right after you finish the chapter.</p>
  <div class="row" style="margin-top:10px"><select class="inp" id="chsel" style="max-width:420px">${CHAPTERS.map((c,i)=>`<option value="c${i+1}">Ch. ${i+1} ${c} (${chCount(i+1)})</option>`).join('')}</select><button class="btn" data-go="ch">Start</button></div>
  <h2 style="margin-top:26px">By objective</h2>
  <div class="row" style="margin-top:10px"><select class="inp" id="obsel" style="max-width:420px">${Object.keys(OBJ).map(o=>`<option value="o${o}">${o} ${OBJ[o][0]} (${QB.filter(q=>q[0]===o).length})</option>`).join('')}</select><button class="btn" data-go="ob">Start</button></div>`;
  main.onclick=e=>{const k=e.target.closest('[data-k]');let key=k&&k.dataset.k;const g=e.target.closest('[data-go]');
    if(g)key=document.getElementById(g.dataset.go==='ch'?'chsel':'obsel').value;
    if(!key)return;const s=quizSet(key);if(!s.qs.length)return;runQuiz(el,shuffle(s.qs),s)};
};
VIEWS.exam=function(el){
  const exams=store.get('exams',[]);
  el.innerHTML=`${head('Practice','Mock exam','30 questions weighted like the real exam (7 / 6 / 6 / 4 / 7 by domain) with 30 minutes on the clock. No feedback until you submit; you can move between questions and change answers.')}
  <button class="btn" id="go">Start mock exam</button>
  ${exams.length?`<h2 style="margin-top:28px">Past attempts</h2><div class="tw"><table><thead><tr><th>Date</th><th>Score</th>${DOMAINS.map(d=>`<th>${d.id}.0</th>`).join('')}</tr></thead><tbody>${exams.slice(-10).reverse().map(x=>`<tr><td class="mono small">${x.date}</td><td class="mono">${x.pct}%</td>${DOMAINS.map(d=>`<td class="mono small">${x.by[d.id]??'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}`;
  main.onclick=e=>{if(e.target.id!=='go')return;const per={1:7,2:6,3:6,4:4,5:7};let qs=[];DOMAINS.forEach(d=>{qs=qs.concat(shuffle(QB.filter(q=>qDom(q)===d.id)).slice(0,per[d.id]))});
    runQuiz(el,shuffle(qs),{title:'Mock exam',exam:true,minutes:30})};
};
function runQuiz(el,qs,o){
  const items=qs.map(q=>({q,order:shuffle(q[2].map((_,k)=>k))}));
  const picked=new Array(items.length).fill(null),draft=new Array(items.length).fill(null);
  let i=0,doneFlag=false;const end=o.exam?Date.now()+o.minutes*60000:0;
  function render(){
    const it=items[i],q=it.q,p=picked[i],multi=isMulti(q),fbOn=!o.exam&&p!==null,last=i===items.length-1;
    const cur=o.exam?p:(draft[i]??p);
    const opts=it.order.map((k,pos)=>{let c='opt';
      if(fbOn){const good=multi?q[3].includes(k):k===q[3];const mine=multi?p.includes(k):k===p;if(good)c+=' right';else if(mine)c+=' wrong'}
      else if(multi?(cur||[]).includes(k):cur===k)c+=' sel';
      return `<button type="button" class="${c}" data-k="${k}" ${fbOn?'disabled':''}><span class="key">${pos+1}</span><span>${esc(q[2][k])}</span></button>`}).join('');
    const fb=fbOn?`<div class="fb ${isRight(q,p)?'':'no'}"><b>${isRight(q,p)?'Correct.':'Not quite. Answer: '+esc(ansText(q,q[3]))}</b><p class="small">${esc(q[4])}</p><p class="hint">Review: ${objTag(q[0])} (${OBJ[q[0]][0]})</p></div>`:'';
    const needN=multi?q[3].length:1;
    let nav;
    if(o.exam)nav=`<button class="btn ghost" data-act="prev" ${i===0?'disabled':''}>Previous</button><button class="btn ghost" data-act="next" ${last?'disabled':''}>Next</button><span class="sp"></span><button class="btn" data-act="submit">Submit (${picked.filter(x=>x!==null).length}/${items.length} answered)</button>`;
    else if(fbOn)nav=`<span class="sp"></span><button class="btn" data-act="next">${last?'See results':'Next'}</button>`;
    else if(multi)nav=`<span class="hint">Choose ${needN}.</span><span class="sp"></span><button class="btn" data-act="lock" ${(draft[i]||[]).length===needN?'':'disabled'}>Check answer</button>`;
    else nav='';
    el.innerHTML=`<div class="qbar"><button class="link" data-act="quit">← Back</button><span>${esc(o.title)}</span><span class="mono hint">${i+1} / ${items.length}</span>${o.exam?'<span class="mono timer" id="timer" style="margin-left:auto"></span>':''}</div>
    <p class="qmeta">${objTag(q[0])}</p><h2 class="qtext">${esc(q[1])}</h2><div class="opts">${opts}</div>${fb}<div class="qnav">${nav}</div>
    ${o.exam?`<div class="jump">${items.map((_,j)=>`<button data-j="${j}" class="${picked[j]!==null?'a':''} ${j===i?'c':''}" aria-label="Question ${j+1}">${j+1}</button>`).join('')}</div>`:''}`;
    tick();
  }
  function tick(){if(!o.exam)return;const t=document.getElementById('timer');if(!t)return;const ms=Math.max(0,end-Date.now());t.textContent=`${Math.floor(ms/60000)}:${String(Math.floor(ms%60000/1000)).padStart(2,'0')} left`;t.classList.toggle('low',ms<300000);if(ms<=0&&!doneFlag)finish()}
  if(o.exam)timers.push(setInterval(tick,1000));
  function choose(k){const q=items[i].q;
    if(isMulti(q)){if(!o.exam&&picked[i]!==null)return;const src=o.exam?picked[i]:draft[i];let a=(src||[]).slice();a=a.includes(k)?a.filter(x=>x!==k):a.concat(k);if(a.length>q[3].length)a.shift();if(o.exam)picked[i]=a.length?a:null;else draft[i]=a;return render()}
    if(!o.exam&&picked[i]!==null)return;picked[i]=k;render()}
  function finish(){
    doneFlag=true;clearTimers();
    const right=items.filter((it,j)=>isRight(it.q,picked[j])).length,pct=Math.round(right/items.length*100);
    const by={};DOMAINS.forEach(d=>{const ds=items.map((it,j)=>[it,j]).filter(([it])=>qDom(it.q)===d.id);if(ds.length)by[d.id]=Math.round(ds.filter(([it,j])=>isRight(it.q,picked[j])).length/ds.length*100)});
    if(o.domain){const b=store.get('quizBest',{});b[o.domain]=Math.max(b[o.domain]??0,pct);store.set('quizBest',b)}
    if(o.exam){const ex=store.get('exams',[]);ex.push({date:new Date().toISOString().slice(0,10),pct,by});store.set('exams',ex)}
    const missed=items.map((it,j)=>[it,j]).filter(([it,j])=>!isRight(it.q,picked[j]));
    const objs=[...new Set(missed.map(([it])=>it.q[0]))].sort();
    el.innerHTML=`<div class="qbar"><button class="link" data-act="quit">← Back</button><span>${esc(o.title)}: results</span></div>
    <p style="font-size:1.6rem" class="mono">${pct}% <span class="hint" style="font-size:.9rem">${right} of ${items.length} correct</span></p>
    ${o.exam?`<p class="hint">A rough guide only: 85%+ here is a good sign of readiness. CompTIA's 100–900 scaling isn't published.</p>`:''}
    <div class="row" style="margin:14px 0"><button class="btn" data-act="retry">Try again</button></div>
    ${Object.keys(by).length>1?`<div class="tw"><table><thead><tr><th>Domain</th><th>Score</th></tr></thead><tbody>${Object.entries(by).map(([d,v])=>`<tr><td>${d}.0 ${DOMAINS[d-1].name}</td><td class="mono ${v>=85?'ok':v<60?'no':''}">${v}%</td></tr>`).join('')}</tbody></table></div>`:''}
    ${objs.length?`<h2 style="margin-top:22px">Reread</h2><ul class="steps small">${objs.map(ob=>`<li>${objTag(ob)}: ${OBJ[ob][0]}</li>`).join('')}</ul>`:''}
    ${missed.length?`<h2 style="margin-top:22px">What you missed</h2>${missed.map(([it,j])=>`<div class="miss"><b>${esc(it.q[1])}</b><span class="small no">Your answer: ${esc(ansText(it.q,picked[j]))}</span><span class="small ok">Correct: ${esc(ansText(it.q,it.q[3]))}</span><span class="small muted">${esc(it.q[4])}</span></div>`).join('')}`:'<p>Every answer correct.</p>'}`;
  }
  main.onclick=e=>{
    const a=e.target.closest('[data-act]'),k=e.target.closest('[data-k]'),j=e.target.closest('[data-j]');
    if(k&&!k.disabled)return choose(+k.dataset.k);
    if(j){i=+j.dataset.j;return render()}
    if(!a)return;const act=a.dataset.act;
    if(act==='quit'){clearTimers();return nav.route()}
    if(act==='retry')return runQuiz(el,shuffle(qs),o);
    if(act==='lock'){picked[i]=draft[i];return render()}
    if(act==='prev'&&i>0){i--;render()}
    if(act==='next'){if(i<items.length-1){i++;render()}else finish()}
    if(act==='submit')finish();
  };
  document.onkeydown=e=>{if(doneFlag||['INPUT','SELECT'].includes(e.target.tagName))return;const it=items[i];
    if(/^[1-4]$/.test(e.key)){const pos=+e.key-1;if(pos<it.order.length)choose(it.order[pos])}
    else if(e.key==='Enter'){const b=el.querySelector('[data-act="lock"]:not([disabled])')||el.querySelector('[data-act="next"]:not([disabled])');if(b&&(o.exam||picked[i]!==null||b.dataset.act==='lock'))b.click()}
    else if(e.key==='ArrowRight'&&o.exam&&i<items.length-1){i++;render()}
    else if(e.key==='ArrowLeft'&&o.exam&&i>0){i--;render()}};
  render();
}

