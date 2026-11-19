/* SVG kit for lesson and lab diagrams. Colours come from the site stylesheet (.dg rules), so every figure matches the dark theme.
   Device colours by type: router = amber, switch = teal, host/PC = slate, server = green, firewall/security = red, wireless = purple.
   Zones (Z) are tinted, labelled boundaries around networks and groups. Free-standing text gets a background halo (CSS) so it
   stays readable where it crosses a line; text inside a shape is marked .in and has no halo. */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const cl=c=>c?` class="${c}"`:'';
const MK={'':'ah',ac:'aha',ok:'ahg',no:'ahr'};
const mk=c=>{const k=(c||'').split(' ').find(x=>MK[x]&&x)||'';return MK[k]};
const DEFS='<defs>'+[['ah','m0'],['aha','m1'],['ahg','m2'],['ahr','m3']].map(([id,c])=>`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1L9,5L0,9z" class="${c}"/></marker>`).join('')+'</defs>';

/* device type from a box's label, so every diagram colours devices the same way */
export const kindOf=s=>{s=String(s);
  if(/fire ?wall|^outer|^inner|ASA|UTM|NGFW|concentrator|NAT router/i.test(s))return 'fw';
  if(/\bAP\d*\b|WLC|access point|WRT|wireless router/i.test(s))return 'wl';
  if(/server|NMS|resolver|authoritative|TLD|^Root|database|syslog|RADIUS|collector|DHCP|DNS|^Web|App server/i.test(s))return 'srv';
  if(/switch|^SW|leaf|spine|^Core$|distribution|^Access$|^Hub$|ToR/i.test(s))return 'sw';
  if(/router|^R\d*$|^GW$|^ISP$|^NAT$/i.test(s))return 'rt';
  return 'pc'};
const devCls=(c,label)=>c==='dev'?'d-'+kindOf(label):c;

/* text: '\n' makes extra lines; a = 'l' | 'r' | middle */
export const T=(x,y,s,c='',a='')=>{const L=String(s).split('\n');
  const body=L.length===1?esc(L[0]):L.map((l,i)=>`<tspan x="${x}" dy="${i?1.25:-(L.length-1)*0.625}em">${esc(l)}</tspan>`).join('');
  return `<text x="${x}" y="${y}" text-anchor="${a==='l'?'start':a==='r'?'end':'middle'}" dominant-baseline="central"${cl(c)}>${body}</text>`};
const TI=(x,y,s,c)=>T(x,y,s,('in '+(c||'')).trim());
export const R=(x,y,w,h,c='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5"${cl(c)}/>`;
export const B=(x,y,w,h,s='',c='',tc='')=>{const k=devCls(c,s);return R(x,y,w,h,k)+(s!==''?TI(x+w/2,y+h/2,s,tc):'')};
export const C=(x,y,r,s='',c='',tc='')=>{const k=c==='dev'&&s!==''?'d-rt':c==='dev'?'d-node':c;return `<circle cx="${x}" cy="${y}" r="${r}"${cl(k)}/>`+(s!==''?TI(x,y,s,tc):'')};
export const E=(x,y,rx,ry,s='',c='',tc='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${cl(c)}/>`+(s!==''?TI(x,y,s,tc):'');
export const L=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c}"/>`;
export const A=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c}" marker-end="url(#${mk(c)})"/>`;
export const AA=(x1,y1,x2,y2,c='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c}" marker-start="url(#${mk(c)})" marker-end="url(#${mk(c)})"/>`;
export const P=(d,c='',arrow=false)=>`<path d="${d}" class="ln ${c}"${arrow?` marker-end="url(#${mk(c)})"`:''}/>`;
export const PG=(pts,c='')=>`<polygon points="${pts}"${cl(c)}/>`;
/* zone: a tinted, labelled boundary. colour: blue | green | amber | purple | red | teal | pink | grey */
export const Z=(x,y,w,h,label='',color='grey',pos='tl')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="zone z-${color}"/>`+
  (label?T(pos[1]==='r'?x+w-10:x+10,pos[0]==='b'?y+h-11:y+12,label,`zl z-${color}`,pos[1]==='r'?'r':'l'):'');
/* devices */
export const RT=(x,y,s='R',r=20)=>C(x,y,r,s,'dev','sm hd');
export const SW=(x,y,s='Switch',w=76,h=28)=>B(x-w/2,y-h/2,w,h,s,'d-sw','sm hd');
export const PC=(x,y,s='PC',w=56,h=30,c='dev')=>B(x-w/2,y-h/2,w,h,s,c==='dev'?'d-pc':c,'sm');
export const SRV=(x,y,s='Server',w=80,h=30)=>B(x-w/2,y-h/2,w,h,s,'d-srv','sm');
export const NET=(x,y,rx,ry,s='Internet')=>E(x,y,rx,ry,s,'cloud','sm');
/* frame */
export const SVG=(w,h,label,body)=>`<svg class="dg" viewBox="0 0 ${w} ${h}" width="${w}" style="--w:${w}px" role="img" aria-label="${esc(label)}">${DEFS}${body}</svg>`;
export const FIG=(svg,cap)=>`<figure class="fig">${svg}<figcaption>${cap}</figcaption></figure>`;
