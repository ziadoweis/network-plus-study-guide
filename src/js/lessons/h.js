/* Markup helpers for lessons */
export const H=t=>`<h2>${t}</h2>`;
export const H3=t=>`<h3>${t}</h3>`;
export const P=(...t)=>t.map(x=>`<p>${x}</p>`).join('');
export const UL=(...li)=>`<ul class="nl">${li.map(x=>`<li>${x}</li>`).join('')}</ul>`;
export const OL=(...li)=>`<ol class="nl">${li.map(x=>`<li>${x}</li>`).join('')}</ol>`;
export const TB=(head,rows)=>`<div class="tw"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export const EX=(title,...body)=>`<div class="ex"><p class="exh">${title}</p>${body.join('')}</div>`;
export const PRE=t=>`<pre class="topo">${t}</pre>`;
export const KEY=(...t)=>`<div class="keys"><b>Key points to remember</b><ul>${t.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
export const TRAPS=(...t)=>`<div class="traps"><b>Exam traps</b><ul>${t.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
