import {store,head} from './core.js';
import {LESSON_META} from './lesson-meta.js';
const main=document.getElementById('main');
const VIEWS={};
const isRead=n=>!!store.get('notesRead',{})[n];
/* Lesson text is split into four parts that load only when a lesson in them is opened. */
const PARTS={1:()=>import('./lessons/part1.js'),2:()=>import('./lessons/part2.js'),3:()=>import('./lessons/part3.js'),4:()=>import('./lessons/part4.js')};

VIEWS.notes=function(el){
  const done=LESSON_META.filter(l=>isRead(l.n)).length;
  el.innerHTML=`${head('Lessons','21 lessons, read in order',`Each lesson teaches its topic in full: explanations, diagrams, worked examples, key points and exam traps. Each one gives you everything its quiz, labs and Packet Tracer tasks need. ${done} of 21 read.`)}
  <ul class="list">${LESSON_META.map(l=>`<li><a href="#notes-${l.n}">Lesson ${l.n}: ${l.title}</a><span class="meta">Obj ${l.obj} · ${l.min} min · ${isRead(l.n)?'read':'not read'}</span></li>`).join('')}</ul>`;
};
export async function notesView(n){
  const m=LESSON_META.find(l=>l.n===n);
  const {LESSONS}=await PARTS[m.part]();
  const c=LESSONS.find(l=>l.n===n);let fig=0;const html=c.html.replace(/<figcaption>/g,()=>`<figcaption><span class="fnum">Figure ${n}.${++fig}</span>`);
  const i=LESSON_META.indexOf(m),prev=LESSON_META[i-1],next=LESSON_META[i+1];
  return function(el){
    el.innerHTML=`<article class="notes"><header class="vh"><p class="eyebrow">Lesson ${c.n} of 21 · ${m.min} min read</p><h1>${c.title}</h1>
    <p class="hint mono small">Objectives ${c.obj} · Book Ch. ${c.book}</p></header>
    <p class="lead">${c.intro}</p>
    ${html}
    <label class="done-row"><input type="checkbox" id="nread" ${isRead(c.n)?'checked':''}> I've read this lesson (this ticks it in the study path)</label>
    <div class="labnav"><span>${prev?`<a href="#notes-${prev.n}">← Lesson ${prev.n}: ${prev.title}</a>`:'<a href="#notes">← All lessons</a>'}</span><a href="#study">Study path</a><span>${next?`<a href="#notes-${next.n}">Lesson ${next.n}: ${next.title} →</a>`:''}</span></div></article>`;
    main.onchange=e=>{if(e.target.id!=='nread')return;const r=store.get('notesRead',{});if(e.target.checked)r[c.n]=true;else delete r[c.n];store.set('notesRead',r)};
  };
}
export {VIEWS};
