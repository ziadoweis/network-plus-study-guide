/* Tiny SVG kit for lesson diagrams. Colours come from the site stylesheet (.dg rules), so every figure matches the dark theme.
   Shapes: routers = circles, switches/appliances = rounded boxes, hosts = small boxes, networks = dashed ellipses. */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const cl=c=>c?` class="${c}"`:'';
const MK={'':'ah',ac:'aha',ok:'ahg',no:'ahr'};
const mk=c=>{const k=(c||'').split(' ').find(x=>MK[x]&&x)||'';return MK[k]};
const DEFS='<defs>'+[['ah','m0'],['aha','m1'],['ahg','m2'],['ahr','m3']].map(([id,c])=>`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1L9,5L0,9z" class="${c}"/></marker>`).join('')+'</defs>';

/* text: '\n' makes extra lines; a = 'l' | 'r' | middle */
export const T=(x,y,s,c='',a='')=>{const L=String(s).split('\n');
  const body=L.length===1?esc(L[0]):L.map((l,i)=>`<tspan x="${x}" dy="${i?1.25:-(L.length-1)*0.625}em">${esc(l)}</tspan>`).join('');
  return `<text x="${x}" y="${y}" text-anchor="${a==='l'?'start':a==='r'?'end':'middle'}" dominant-baseline="central"${cl(c)}>${body}</text>`};
export const R=(x,y,w,h,c='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"${cl(c)}/>`;
export const B=(x,y,w,h,s='',c='',tc='')=>R(x,y,w,h,c)+(s!==''?T(x+w/2,y+h/2,s,tc):'');
export const C=(x,y,r,s='',c='',tc='')=>`<circle cx="${x}" cy="${y}" r="${r}"${cl(c)}/>`+(s!==''?T(x,y,s,tc):'');
export const E=(x,y,rx,ry,s='',c='',tc='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${cl(c)}/>`+(s!==''?T(x,y,s,tc):'');
export const L=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c}"/>`;
export const A=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c}" marker-end="url(#${mk(c)})"/>`;
export const AA=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c}" marker-start="url(#${mk(c)})" marker-end="url(#${mk(c)})"/>`;
export const P=(d,c='',arrow=false)=>`<path d="${d}" class="ln ${c}"${arrow?` marker-end="url(#${mk(c)})"`:''}/>`;
export const PG=(pts,c='')=>`<polygon points="${pts}"${cl(c)}/>`;
/* devices */
export const RT=(x,y,s='R',r=20)=>C(x,y,r,s,'dev','sm hd');
export const SW=(x,y,s='Switch',w=76,h=28)=>B(x-w/2,y-h/2,w,h,s,'dev','sm');
export const PC=(x,y,s='PC',w=56,h=30,c='dev')=>B(x-w/2,y-h/2,w,h,s,c,'sm');
export const NET=(x,y,rx,ry,s='Internet')=>E(x,y,rx,ry,s,'cloud','sm');
/* frame */
export const SVG=(w,h,label,body)=>`<svg class="dg" viewBox="0 0 ${w} ${h}" width="${w}" style="--w:${w}px" role="img" aria-label="${esc(label)}">${DEFS}${body}</svg>`;
export const FIG=(svg,cap)=>`<figure class="fig">${svg}<figcaption>${cap}</figcaption></figure>`;
