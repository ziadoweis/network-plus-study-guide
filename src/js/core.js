/* Shared state and helpers used by the shell and every lazy-loaded section. */
export * from './util.js';
export {DOMAINS,OBJ,CHAPTERS,objTag,LABS,CORRECTIONS,OBJ_PRACTICE} from './data.js';
export {PT_META} from './pt-meta.js';
import {store} from './util.js';

export const SITE_NAME='Network+ Study Guide';
export const head=(eb,t,l)=>`<header class="vh"><p class="eyebrow">${eb}</p><h1>${t}</h1>${l?`<p class="lede">${l}</p>`:''}</header>`;
export function markLab(id,patch){const L=store.get('labs',{});L[id]=Object.assign(L[id]||{},typeof patch==='function'?patch(L[id]||{}):patch);store.set('labs',L)}
export const timers=[];
export function clearTimers(){timers.forEach(clearInterval);timers.length=0}
export const nav={route:()=>{}};
export const state={startQuiz:null};
export const registry={VIEWS:{}};
