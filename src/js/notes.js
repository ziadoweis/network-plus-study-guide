import {store,head,OBJ_VIDEO} from './core.js';
import {NOTES} from './notes-data.js';
const main=document.getElementById('main');
const VIEWS={};
const isRead=n=>!!store.get('notesRead',{})[n];

VIEWS.notes=function(el){
  el.innerHTML=`${head('Chapter notes','Study notes for each video chapter','Condensed to what the exam tests: tables, key facts and the traps CompTIA likes. Read the chapter\'s notes after each video, before its quiz. Your Sybex book is only needed for more depth.')}
  <ul class="list">${NOTES.map(c=>`<li><a href="#notes-${c.n}">Ch ${c.n}: ${c.title}</a><span class="meta">Obj ${c.obj} · ${isRead(c.n)?'read':'not read'}</span></li>`).join('')}</ul>`;
};
export function notesView(n){return function(el){
  const i=NOTES.findIndex(c=>c.n===n),c=NOTES[i],prev=NOTES[i-1],next=NOTES[i+1];
  el.innerHTML=`<article class="notes"><header class="vh"><p class="eyebrow">Chapter notes · Video Ch ${c.n} of 21</p><h1>${c.title}</h1>
  <p class="hint mono small">Objectives ${c.obj} · Book Ch. ${c.book} for more depth</p></header>
  ${c.html}
  <label class="done-row"><input type="checkbox" id="nread" ${isRead(c.n)?'checked':''}> I've read these notes (this ticks the reading task in the study path)</label>
  <div class="labnav"><span>${prev?`<a href="#notes-${prev.n}">← Ch ${prev.n}: ${prev.title}</a>`:'<a href="#notes">← All notes</a>'}</span><a href="#study">Study path</a><span>${next?`<a href="#notes-${next.n}">Ch ${next.n}: ${next.title} →</a>`:''}</span></div></article>`;
  main.onchange=e=>{if(e.target.id!=='nread')return;const r=store.get('notesRead',{});if(e.target.checked)r[c.n]=true;else delete r[c.n];store.set('notesRead',r)};
}}
export {VIEWS};
