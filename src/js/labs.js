import {store,esc,shuffle,rnd,pick,ip2int,int2ip,maskInt,isIp,sameNet,DOMAINS,OBJ,CHAPTERS,objTag,LABS,PT_META,head,markLab,timers,clearTimers,nav,state} from './core.js';
const main=document.getElementById('main');
const VIEWS={};
export {VIEWS};
/* ---------- subnetting lab ---------- */
VIEWS['lab-subnet']=function(el){
  let tab='calc',streak=0,ans=null;
  const TABS=[['calc','Find the subnet'],['size','Size a subnet'],['bin','Binary'],['v6','IPv6 shorthand'],['eui','EUI-64']];
  function shell(){
    el.innerHTML=`${head('Lab · Lessons 6 and 12 · Obj 1.7, 1.8','Subnetting and addressing','Work it on paper first. The method from Lesson 6: block size = 256 − the mask value in the interesting octet; subnets start at multiples of the block; the broadcast is one less than the next subnet.')}
    <div class="tabs">${TABS.map(([k,l])=>`<button class="tab ${tab===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div>
    <p class="hint" style="margin-bottom:12px">Streak <span class="mono" id="streak">${streak}</span> · solved <span class="mono">${(store.get('labs',{}).subnet||{}).n||0}</span></p>
    <div id="pane"></div>
    <details class="reveal" style="margin-top:22px"><summary>Reference table</summary><div class="tw"><table><thead><tr><th>CIDR</th><th>Mask</th><th>Block</th><th>Usable hosts</th></tr></thead><tbody>
    ${[[24,0],[25,128],[26,192],[27,224],[28,240],[29,248],[30,252]].map(([c,m])=>`<tr class="mono"><td>/${c}</td><td>${c===24?'255.255.255.0':'255.255.255.'+m}</td><td>${256-m}</td><td>${2**(32-c)-2}</td></tr>`).join('')}
    <tr class="mono"><td>/31</td><td>255.255.255.254</td><td>2</td><td>2 (point-to-point only)</td></tr></tbody></table></div>
    <p class="hint">The same pattern repeats one octet left: /17 = 255.255.128.0 … /23 = 255.255.254.0. Bit weights: 128 64 32 16 8 4 2 1.</p></details>`;
    newProb();
  }
  const F=fs=>`<div class="fields">${fs.map(([id,l,ph])=>`<div class="field" id="f-${id}"><label for="in-${id}">${l}</label><input id="in-${id}" autocomplete="off" spellcheck="false" placeholder="${ph||''}"><span class="corr"></span></div>`).join('')}</div>`;
  const BTNS=`<div class="row"><button class="btn" data-act="check">Check</button><button class="btn ghost" data-act="show">Show working</button><button class="btn ghost" data-act="new">New problem</button></div><div id="ex" style="margin-top:16px"></div>`;
  function newProb(){
    const pane=document.getElementById('pane');
    if(tab==='calc'){
      const c=pick([16,19,20,21,22,23,24,25,26,26,27,27,28,28,29,29,30]);const fam=pick(['10','172','192']);
      const ip=fam==='10'?`10.${rnd(0,255)}.${rnd(0,255)}.${rnd(1,254)}`:fam==='172'?`172.${rnd(16,31)}.${rnd(0,255)}.${rnd(1,254)}`:`192.168.${rnd(0,255)}.${rnd(1,254)}`;
      const I=ip2int(ip),m=maskInt(c),net=(I&m)>>>0,bc=(net|(~m>>>0))>>>0;
      ans={ip,c,mask:int2ip(m),net:int2ip(net),first:int2ip(net+1),last:int2ip(bc-1),bc:int2ip(bc),hosts:String(2**(32-c)-2)};
      pane.innerHTML=`<p class="hint">Host address</p><p class="prob">${ip}/${c}</p>${F([['mask','Subnet mask'],['net','Subnet (network) address'],['first','First usable host'],['last','Last usable host'],['bc','Broadcast address'],['hosts','Usable hosts']])}${BTNS}`;
    }else if(tab==='size'){
      const h=pick([rnd(2,6),rnd(7,14),rnd(15,30),rnd(31,62),rnd(63,126),rnd(127,254),rnd(255,510),rnd(511,1022),rnd(1023,4000)]);
      let k=2;while(2**k-2<h)k++;ans={h,k,prefix:String(32-k),mask:int2ip(maskInt(32-k))};
      pane.innerHTML=`<p class="hint">Smallest subnet that holds this many usable hosts</p><p class="prob">${h} hosts</p>${F([['prefix','Prefix (CIDR)','/24'],['mask','Subnet mask']])}${BTNS}`;
    }else if(tab==='bin'){
      const v=pick([rnd(0,255),pick([128,192,224,240,248,252,254,255]),rnd(100,255)]);const toBin=Math.random()<.5;
      ans={v,bin:v.toString(2).padStart(8,'0'),toBin,val:toBin?v.toString(2).padStart(8,'0'):String(v)};
      pane.innerHTML=`<p class="hint">${toBin?'Convert to 8-bit binary':'Convert to decimal'}</p><p class="prob">${toBin?v:ans.bin}</p>${F([['val',toBin?'Binary (8 bits)':'Decimal']])}${BTNS}`;
    }else if(tab==='v6'){
      const hx=genV6(),full=hx.map(x=>x.toString(16).padStart(4,'0')).join(':'),comp=compress6(hx),dir=pick(['comp','comp','exp']);
      ans={dir,full,comp,v6:dir==='comp'?comp:full};
      pane.innerHTML=`<p class="hint">${dir==='comp'?'Write the shortest valid form (lowercase, drop leading zeros, one :: for the longest run of zero groups)':'Expand to the full 8 groups of 4 hex digits'}</p><p class="prob">${dir==='comp'?full:comp}</p>${F([['v6',dir==='comp'?'Shortest form':'Full form']])}${BTNS}`;
    }else{
      const mac=Array.from({length:6},()=>rnd(0,255));if(Math.random()<.6)mac[0]=mac[0]&0xfc;
      const id=eui64(mac);ans={mac,eui:id};
      pane.innerHTML=`<p class="hint">Build the EUI-64 interface ID from this MAC (four groups, e.g. 021a:2bff:fe3c:4d5e)</p><p class="prob">${mac.map(b=>b.toString(16).padStart(2,'0')).join(':').toUpperCase()}</p>${F([['eui','Interface ID']])}${BTNS}`;
    }
    const f=pane.querySelector('input');if(f)f.focus();
  }
  function norm(id,v){v=v.trim().toLowerCase().replace(/\s+/g,'');if(id==='prefix')v=v.replace(/^\//,'');if(id==='hosts')v=v.replace(/,/g,'');if(id==='eui')v=v.split(':').map(g=>g.replace(/^0+(?=.)/,'')).join(':');return v}
  function key(id){if(id==='eui')return ans.eui.split(':').map(g=>g.replace(/^0+(?=.)/,'')).join(':');return String(ans[id]).toLowerCase()}
  function explain(){
    const ex=document.getElementById('ex');let h='';
    if(tab==='calc'){const {ip,c}=ans,o=Math.floor(c/8);
      if(c%8===0)h=`<p>/${c} ends on an octet boundary: keep the first ${c/8} octets of ${ip}; the rest are 0 for the subnet and 255 for the broadcast.</p>`;
      else{const mv=(maskInt(c)>>>(24-8*o))&255,blk=256-mv,io=(ip2int(ip)>>>(24-8*o))&255,st=Math.floor(io/blk)*blk;
        h=`<p>/${c} = <code>${ans.mask}</code>. The interesting octet is octet ${o+1} (mask value ${mv}).</p><p>Block size = 256 − ${mv} = <b>${blk}</b>. Subnets: 0, ${blk}, ${blk*2}, ${blk*3}…</p><p>${io} falls in the block ${st}–${st+blk-1}.${o<3?' Later octets are 0 in the subnet address and 255 in the broadcast.':''}</p>`}
      h+=`<p>Subnet <code>${ans.net}</code>, hosts <code>${ans.first}</code>–<code>${ans.last}</code>, broadcast <code>${ans.bc}</code>, usable 2<sup>${32-c}</sup> − 2 = ${(+ans.hosts).toLocaleString()}.</p>`;}
    else if(tab==='size')h=`<p>${ans.h} hosts + 2 (subnet and broadcast) = ${ans.h+2}. The next power of two is 2<sup>${ans.k}</sup> = ${2**ans.k}, so ${ans.k} host bits.</p><p>Prefix 32 − ${ans.k} = /${ans.prefix}, mask <code>${ans.mask}</code>, ${2**ans.k-2} usable.</p>`;
    else if(tab==='bin'){const w=[128,64,32,16,8,4,2,1];h=`<p>${w.map((x,i)=>`<span class="mono">${x}:${ans.bin[i]}</span>`).join(' ')}</p><p>${ans.v} = ${w.filter((x,i)=>ans.bin[i]==='1').join(' + ')||'0'} = <code>${ans.bin}</code></p>`}
    else if(tab==='v6')h=`<p>Full <code>${ans.full}</code></p><p>Shortest <code>${ans.comp}</code></p><p>Drop leading zeros in each group; replace the longest run of two or more 0000 groups with :: (the leftmost if tied). Use :: only once; a single zero group is written 0.</p>`;
    else{const m=ans.mac.map(b=>b.toString(16).padStart(2,'0'));const f=(ans.mac[0]^2).toString(16).padStart(2,'0');
      h=`<p>1. Split the MAC: <code>${m.slice(0,3).join('')}</code> | <code>${m.slice(3).join('')}</code></p><p>2. Insert fffe: <code>${m.slice(0,3).join('')}fffe${m.slice(3).join('')}</code></p><p>3. Flip the 7th bit of the first byte: ${m[0]} → ${f}</p><p>Interface ID <code>${ans.eui}</code></p>`}
    ex.innerHTML=`<div class="explain">${h}</div>`;
  }
  main.onclick=e=>{
    const t=e.target.closest('[data-tab]');if(t){tab=t.dataset.tab;return shell()}
    const a=e.target.closest('[data-act]');if(!a)return;
    if(a.dataset.act==='new')return newProb();
    if(a.dataset.act==='show'){explain();streak=0;document.getElementById('streak').textContent=0;return}
    if(a.dataset.act==='check'){let all=true;
      document.querySelectorAll('#pane .field').forEach(f=>{const id=f.id.slice(2),ok=norm(id,f.querySelector('input').value)===key(id);f.classList.toggle('ok',ok);f.classList.toggle('no',!ok);f.querySelector('.corr').textContent=ok?'':'→ '+(id==='prefix'?'/':'')+ans[id];if(!ok)all=false});
      if(all){streak++;markLab('subnet',L=>({n:(L.n||0)+1}))}else streak=0;explain();document.getElementById('streak').textContent=streak}
  };
  main.onkeydown=e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'){const b=el.querySelector('[data-act="check"]');b&&b.click()}};
  shell();
};
function genV6(){const h=[0x2001,0x0db8];for(let i=2;i<8;i++){const r=Math.random();h.push(r<.3?0:r<.65?rnd(1,0xff):rnd(0x100,0xffff))}if(Math.random()<.85){const len=rnd(2,4),st=rnd(2,8-len);for(let j=st;j<st+len;j++)h[j]=0}return h}
function compress6(h){let bs=-1,bl=0;for(let i=0;i<8;){if(h[i]===0){let j=i;while(j<8&&h[j]===0)j++;if(j-i>bl){bs=i;bl=j-i}i=j}else i++}const s=h.map(x=>x.toString(16));if(bl<2)return s.join(':');return s.slice(0,bs).join(':')+'::'+s.slice(bs+bl).join(':')}
function eui64(mac){const b=[mac[0]^2,mac[1],mac[2],0xff,0xfe,mac[3],mac[4],mac[5]].map(x=>x.toString(16).padStart(2,'0'));return [b[0]+b[1],b[2]+b[3],b[4]+b[5],b[6]+b[7]].join(':')}

/* ---------- ports lab ---------- */
// [protocol, ports, transport, note, on N10-009 list?]
const PORTS=[
 ['FTP','20, 21','TCP','20 data, 21 control; clear text',1],['SSH / SFTP','22','TCP','Encrypted shell; SFTP runs over SSH',1],['Telnet','23','TCP','Clear-text shell: replace with SSH',1],['SMTP','25','TCP','Mail between servers',1],
 ['DNS','53','TCP/UDP','UDP for queries, TCP for zone transfers',1],['DHCP','67, 68','UDP','67 server, 68 client',1],['TFTP','69','UDP','No authentication; config and firmware',1],['HTTP','80','TCP','',1],
 ['NTP','123','UDP','Time sync',1],['SNMP','161, 162','UDP','161 polling, 162 traps',1],['LDAP','389','TCP/UDP','Directory queries',1],['HTTPS','443','TCP','HTTP over TLS (also DoH)',1],
 ['SMB','445','TCP','Windows file sharing',1],['Syslog','514','UDP','Log forwarding',1],['SMTPS','587','TCP','Mail submission with STARTTLS (465 = implicit TLS)',1],['LDAPS','636','TCP','LDAP over TLS',1],
 ['SQL Server','1433','TCP','Microsoft SQL Server',1],['RDP','3389','TCP','Remote Desktop',1],['SIP','5060, 5061','TCP/UDP','VoIP signaling; 5061 = TLS',1],
 ['POP3','110','TCP','Book/handouts, not the N10-009 list',0],['IMAP','143','TCP','Book/handouts',0],['IMAPS','993','TCP','Book/handouts',0],['POP3S','995','TCP','Book/handouts',0],['Kerberos','88','TCP/UDP','Book/handouts',0],
 ['TACACS+','49','TCP','Book/handouts',0],['RADIUS','1812, 1813','UDP','Auth and accounting (legacy 1645/1646)',0],['BGP','179','TCP','Book/handouts',0],['MySQL','3306','TCP','Book/handouts',0],['VNC','5900','TCP','Book/handouts',0],['IKE','500','UDP','IPsec key exchange (NAT-T 4500)',0],['DNS over TLS','853','TCP','Book/handouts',0]];
VIEWS['lab-ports']=function(el){
  const N=15;let qs=[],i=0,score=0,miss=[],t0=0,answered=false,extra=false;
  const pool=()=>PORTS.filter(p=>extra||p[4]);
  function intro(){qs=[];const best=(store.get('labs',{}).ports||{}).best;
    el.innerHTML=`${head('Lab · Lesson 8 · Obj 1.4','Ports and protocols','15 quick questions: type the port, name the protocol, or pick the transport. Enter both ports where there are two (for example 20, 21).')}
    <div class="row"><button class="btn" data-act="start">Start sprint</button><label class="small row" style="gap:6px"><input type="checkbox" id="extra" ${extra?'checked':''}> Include the extra ports from the book and handouts</label><span class="sp"></span>${best!=null?`<span class="hint">Best ${best}%</span>`:''}</div>
    <h2 style="margin-top:26px">Reference</h2><div class="tw"><table><thead><tr><th>Protocol</th><th>Port</th><th>Transport</th><th>Note</th></tr></thead><tbody>${PORTS.map(p=>`<tr class="${p[4]?'':'muted'}"><td>${p[0]}</td><td class="mono">${p[1]}</td><td class="mono">${p[2]}</td><td class="small">${p[3]}</td></tr>`).join('')}</tbody></table></div><p class="hint">Grey rows aren't on the N10-009 port list but appear in your book or handouts. Port ranges: well-known 0–1023, registered 1024–49151, dynamic 49152–65535.</p>`}
  function start(){const P=shuffle(pool());qs=Array.from({length:N},(_,k)=>{const p=P[k%P.length];const type=pick(['num','num','name','tp']);
      if(type==='name'){const wrong=shuffle(pool().filter(x=>x[1]!==p[1])).slice(0,3).map(x=>x[0]);return {type,p,opts:shuffle([p[0],...wrong])}}
      if(type==='tp')return {type,p,opts:['TCP','UDP','TCP/UDP']};return {type,p}});i=0;score=0;miss=[];t0=Date.now();render()}
  function render(){const q=qs[i];answered=false;let body;
    if(q.type==='num')body=`<h2 class="qtext">Which port${q.p[1].includes(',')?'s does':' does'} ${q.p[0]} use?</h2><div class="row"><input class="inp" id="pin" style="max-width:200px" autocomplete="off"><button class="btn" data-act="sub">Submit</button></div>`;
    else if(q.type==='name')body=`<h2 class="qtext">Which protocol uses port <span class="mono">${q.p[1]}</span>?</h2><div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-o="${esc(o)}"><span class="key">${k+1}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
    else body=`<h2 class="qtext">Which transport does ${q.p[0]} (port ${q.p[1]}) use?</h2><div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-o="${o}"><span class="key">${k+1}</span><span>${o==='TCP/UDP'?'Both':o}</span></button>`).join('')}</div>`;
    el.innerHTML=`<div class="qbar"><button class="link" data-act="quit">← Back</button><span>Ports sprint</span><span class="mono hint">${i+1} / ${N} · score ${score}</span></div>${body}<div id="pfb"></div>`;
    const inp=document.getElementById('pin');if(inp)inp.focus()}
  function grade(val){if(answered)return;answered=true;const q=qs[i];let ok;
    if(q.type==='num'){const a=(val.match(/\d+/g)||[]).sort().join(','),b=(q.p[1].match(/\d+/g)||[]).sort().join(',');ok=a===b}
    else if(q.type==='name')ok=PORTS.find(x=>x[0]===val)?.[1]===q.p[1];else ok=val===q.p[2];
    if(ok)score++;else miss.push(q.p);
    el.querySelectorAll('[data-o]').forEach(b=>{b.disabled=true;const v=b.dataset.o;const good=q.type==='name'?PORTS.find(x=>x[0]===v)?.[1]===q.p[1]:v===q.p[2];if(good)b.classList.add('right');else if(v===val)b.classList.add('wrong')});
    const inp=document.getElementById('pin');if(inp)inp.disabled=true;
    document.getElementById('pfb').innerHTML=`<div class="fb ${ok?'':'no'}"><b>${ok?'Correct.':`${q.p[0]}: ${q.p[1]} (${q.p[2]})`}</b>${q.p[3]?`<p class="small">${q.p[3]}</p>`:''}</div><div class="qnav"><span class="sp"></span><button class="btn" data-act="next">${i===N-1?'Finish':'Next'}</button></div>`;
    el.querySelector('[data-act="next"]').focus()}
  function finish(){const pct=Math.round(score/N*100),secs=Math.round((Date.now()-t0)/1000);qs=[];markLab('ports',L=>({best:Math.max(L.best??0,pct)}));
    el.innerHTML=`${head('Lab · Obj 1.4','Ports sprint results','')}<p class="mono" style="font-size:1.5rem">${pct}% <span class="hint" style="font-size:.9rem">${score}/${N} in ${secs}s</span></p><div class="row" style="margin:12px 0"><button class="btn" data-act="start">Run again</button><button class="btn ghost" data-act="quit">Back</button></div>${miss.length?`<h2>Drill these</h2><div class="tw"><table><tbody>${miss.map(p=>`<tr><td>${p[0]}</td><td class="mono">${p[1]}</td><td class="mono">${p[2]}</td></tr>`).join('')}</tbody></table></div>`:''}`}
  main.onclick=e=>{const a=e.target.closest('[data-act]'),o=e.target.closest('[data-o]');if(o&&!o.disabled)return grade(o.dataset.o);
    if(e.target.id==='extra'){extra=e.target.checked;return}
    if(!a)return;const act=a.dataset.act;if(act==='start')start();if(act==='quit')intro();if(act==='sub')grade(document.getElementById('pin').value);if(act==='next'){if(i<N-1){i++;render()}else finish()}};
  main.onkeydown=e=>{if(e.key==='Enter'&&e.target.id==='pin'){e.preventDefault();grade(e.target.value)}};
  document.onkeydown=e=>{if(!qs.length||e.target.tagName==='INPUT')return;if(/^[1-4]$/.test(e.key)){const b=el.querySelectorAll('[data-o]')[+e.key-1];b&&!b.disabled&&b.click()}};
  intro();
};

/* ---------- OSI lab ---------- */
const OSI_ITEMS=[['Hub',1,'A multiport repeater: one collision domain, no addressing.'],['Repeater / media converter',1,'Signal only.'],['Bits',1,'Layer 1 PDU.'],['Fiber optic cable',1,'Physical media.'],['RJ-45 connector',1,'Physical connector.'],
 ['Switch',2,'Forwards frames by MAC address table.'],['MAC address',2,'48-bit hardware address (24-bit OUI + 24 bits from the vendor).'],['Frame',2,'Layer 2 PDU, with an FCS trailer.'],['Wireless access point',2,'Bridges 802.11 to Ethernet.'],['802.1Q VLAN tag',2,'Inserted in the Ethernet header.'],['LLC and MAC sublayers',2,'The two parts of the Data Link layer.'],
 ['Router',3,'Forwards packets by IP address.'],['IP address',3,'Logical address.'],['Packet',3,'Layer 3 PDU.'],['ICMP',3,'Carried directly in IP; used by ping.'],['OSPF',3,'Routing protocol: builds Layer 3 paths.'],['IPsec',3,'Secures IP packets.'],
 ['TCP',4,'Connection-oriented and reliable.'],['UDP',4,'Connectionless, best effort.'],['Segment',4,'Layer 4 PDU for TCP (datagram for UDP).'],['Port numbers',4,'Identify the application endpoint.'],['Load balancer (port-aware)',4,'Distributes connections by IP and port.'],
 ['Session setup and teardown',5,'The Session layer opens, manages and closes sessions.'],['RPC',5,'Remote procedure calls sit at Layer 5.'],['NetBIOS session',5,'Session-layer service.'],
 ['TLS encryption',6,'Usually placed at Presentation for the exam.'],['JPEG / ASCII encoding',6,'Data representation.'],['Compression',6,'Presentation function.'],
 ['HTTP',7,'Application protocol.'],['DNS',7,'Application protocol.'],['SMTP',7,'Application protocol.'],['SNMP',7,'Application protocol.'],['DHCP',7,'Application protocol (over UDP).']];
const LAYERS=[[7,'Application','Data'],[6,'Presentation','Data'],[5,'Session','Data'],[4,'Transport','Segment / datagram'],[3,'Network','Packet'],[2,'Data Link','Frame'],[1,'Physical','Bits']];
VIEWS['lab-osi']=function(el){
  let items=[],i=0,score=0,locked=false;const N=14;
  function start(){items=shuffle(OSI_ITEMS).slice(0,N);i=0;score=0;render()}
  function render(){locked=false;const it=items[i];
    el.innerHTML=`${head('Lab · Lesson 1 · Obj 1.1','OSI layer sorter','Pick the layer for each item. Bottom up: <i>Please Do Not Throw Sausage Pizza Away</i>. Keys 1–7 choose a layer.')}
    <div class="labgrid"><div><p class="hint mono">${i+1} / ${N} · score ${score}</p><p class="osi-item">${esc(it[0])}</p><div id="ofb"></div></div>
    <div class="layers">${LAYERS.map(([n,name,pdu])=>`<button class="layer" data-l="${n}"><b>L${n}</b><span>${name}</span><span class="pdu">${pdu}</span></button>`).join('')}</div></div>`}
  function choose(n){if(locked)return;locked=true;const it=items[i],ok=n===it[1];if(ok)score++;
    el.querySelectorAll('.layer').forEach(b=>{b.disabled=true;const l=+b.dataset.l;if(l===it[1])b.classList.add('right');else if(l===n)b.classList.add('wrong')});
    document.getElementById('ofb').innerHTML=`<div class="fb ${ok?'':'no'}"><b>${ok?'Correct.':'Layer '+it[1]+'.'}</b><p class="small">${esc(it[2])}</p></div><div class="qnav"><button class="btn" data-act="next">${i===N-1?'Finish':'Next'}</button></div>`}
  function finish(){const pct=Math.round(score/N*100);markLab('osi',L=>({best:Math.max(L.best??0,pct)}));
    el.innerHTML=`${head('Lab · Obj 1.1','OSI layer sorter','')}<p class="mono" style="font-size:1.5rem">${pct}% <span class="hint" style="font-size:.9rem">${score} of ${N}</span></p><button class="btn" data-act="start" style="margin-top:12px">New round</button>`}
  main.onclick=e=>{const l=e.target.closest('[data-l]');if(l&&!l.disabled)return choose(+l.dataset.l);const a=e.target.closest('[data-act]');if(!a)return;if(a.dataset.act==='next'){if(i<N-1){i++;render()}else finish()}if(a.dataset.act==='start')start()};
  document.onkeydown=e=>{if(/^[1-7]$/.test(e.key)&&!locked&&items.length)choose(+e.key);else if(e.key==='Enter'&&locked){const b=el.querySelector('[data-act="next"]');b&&b.click()}};
  start();
};

/* ---------- cables, connectors and tools ---------- */
/* Each job is tagged with the lesson that teaches it and its kind: [job, answer, why, lesson, kind].
   A job's dropdown only offers answers of the same kind from the same lesson, plus the distractors below. */
const CABLE_Q=[
 ['Connect a PC to a switch port','Straight-through','Unlike devices.',2,'wiring'],
 ['Connect two older switches that lack Auto-MDI-X','Crossover','Like devices swap pairs 1↔3 and 2↔6.',2,'wiring'],
 ['Reach a new switch\'s CLI from a laptop before it has any IP','Rollover (console)','Out-of-band console access.',2,'wiring'],
 ['Cheapest category for new 1 Gbps desk runs','Cat 5e','The minimum for new installs; handles 1000BASE-T at 100 m.',2,'category'],
 ['10GBASE-T to a desk 90 m away','Cat 6a','Cat 6 only manages about 55 m at 10 Gbps.',2,'category'],
 ['40GBASE-T between racks 20 m apart','Cat 8','Cat 8 supports 25/40GBASE-T up to 30 m.',2,'category'],
 ['10 Gbps from a server to the top-of-rack switch, 2 m, lowest cost','DAC (twinax)','Direct-attach copper in SFP+ ports.',2,'coax'],
 ['Run through the air-return space above a drop ceiling','Plenum-rated cable','Fire-resistant, low smoke.',2,'jacket'],
 ['Connect a cable modem to the wall outlet','RG-6 with F-type','75 Ω coax for cable broadband.',2,'coax'],
 ['Connector usually found on SFP transceivers','LC connector','Small form factor, latching.',2,'connector'],
 ['Green connector with an 8° polished end face','APC connector','Never mate APC with UPC (blue).',2,'connector'],
 ['Link between buildings 8 km apart at 10 Gbps','Single-mode fiber + LR optics','10GBASE-LR reaches 10 km over SMF at 1310 nm.',4,'optics'],
 ['200 m 10 Gbps link inside one data center','Multimode fiber + SR optics','10GBASE-SR covers about 300–400 m on OM3/OM4.',4,'optics'],
 ['Two sites 35 km apart over single-mode fiber at 10 Gbps','Single-mode fiber + ER optics','10GBASE-ER reaches 40 km at 1550 nm.',4,'optics'],
 ['1 Gbps over multimode fiber to a building 400 m away','1000BASE-SX optics','Multimode at 850 nm, up to about 550 m.',4,'optics'],
 ['1 Gbps to a desk 80 m away over existing Cat 5e','1000BASE-T','Uses all four pairs of Cat 5e, up to 100 m.',4,'optics'],
 ['Module for a 10 Gbps fiber port on a switch','SFP+ module','SFP = 1G, SFP+ = 10G, SFP28 = 25G.',4,'module'],
 ['Module for a 100 Gbps uplink','QSFP28 module','QSFP+ = 40G, QSFP28 = 100G.',4,'module'],
 ['Only one fiber strand is available, but the link must send and receive','BiDi transceiver','Sends and receives on two different wavelengths over one strand.',4,'fiberkit'],
 ['Connect a copper-only switch port to a fiber run','Media converter','Converts the signal between copper and fiber.',4,'fiberkit'],
 ['Carry dozens of 10G channels over one long-haul fiber pair','DWDM','Dense wavelength-division multiplexing packs many wavelengths onto one fiber.',4,'fiberkit'],
 ['Find which patch panel port a wall jack lands on','Toner probe','"Fox and hound".',5,'tool'],
 ['Check a new patch cable\'s wire map for opens and crossed pairs','Cable tester','Continuity and pinout.',5,'tool'],
 ['Prove a new run meets the Cat 6 spec for a client handoff','Certifier','Tests performance against the category standard.',5,'tool'],
 ['Find how far down a copper run a break is','TDR','Time-domain reflectometer.',5,'tool'],
 ['Find how far down a fiber run a break is','OTDR','Optical TDR.',5,'tool'],
 ['See a fiber break or tight bend in a patch room by eye','Visual fault locator','A red laser glows at the fault.',5,'tool'],
 ['Measure received optical signal level in dBm','Optical light meter','Compare against the link\'s loss budget.',5,'tool'],
 ['Test whether a switch port or NIC transmits and receives','Loopback plug','It sends TX back to RX.',5,'tool'],
 ['Terminate cable on a 110 block','Punchdown tool','Also used for keystone jacks.',5,'tool'],
 ['Check voltage on a suspect power circuit','Multimeter','Voltage, resistance, continuity.',5,'tool'],
 ['Find which channels neighboring APs use','Wi-Fi analyzer','Shows SSIDs, channels and signal strength (Lesson 14).',14,'tool']];
const CABLE_EXTRA={category:[['Cat 6',2],['Cat 7',2]],coax:[['RG-59 with BNC',2],['Cat 6a patch cable',2],['Multimode fiber patch cord',2]],jacket:[['Riser-rated cable',2],['PVC (non-plenum) cable',2]],connector:[['SC connector',2],['ST connector',2],['UPC connector',2],['MPO connector',2]],
 optics:[['1000BASE-LX optics',4],['10GBASE-T',4]],module:[['SFP module',4],['QSFP+ module',4],['SFP28 module',4]],fiberkit:[['CWDM',4]],tool:[['Crimper',5],['Cable stripper',5]]};
const cableOpts=(kind,set)=>[...new Set([...CABLE_Q.filter(q=>q[4]===kind&&(!set||q[3]===set)).map(q=>q[1]),...(CABLE_EXTRA[kind]||[]).filter(([,l])=>!set||l===set).map(([a])=>a)])].sort((x,y)=>x.localeCompare(y,undefined,{numeric:true}));
export const CABLE_SETS=[[2,'Lesson 2: cables, categories and connectors'],[4,'Lesson 4: Ethernet standards, optics and transceivers'],[5,'Lesson 5: installation and test tools'],[0,'Mixed review: everything']];
const cableQs=set=>set?CABLE_Q.filter(q=>q[3]===set):CABLE_Q;
VIEWS['lab-cables']=function(el,opt={}){
  let set=[],cur=opt.set??(store.get('labs',{}).cables||{}).lastSet??2;
  function render(){const pool=cableQs(cur);set=shuffle(pool).slice(0,10);const L=(store.get('labs',{}).cables||{}),b=(L.sets||{})[cur];
    el.innerHTML=`${head('Lab · Lessons 2, 4 and 5 · Obj 1.5, 5.2','Cables, connectors and tools','A performance-based-style exercise: pick the right cable, optic or tool for each job. Each set only uses what its lesson teaches; take it right after that lesson.')}
    <div class="row" style="margin-bottom:16px"><label for="cset" class="small">Set</label><select class="inp" id="cset" style="max-width:420px">${CABLE_SETS.map(([k,n])=>`<option value="${k}"${k===cur?' selected':''}>${n} (${cableQs(k).length} jobs)</option>`).join('')}</select><span class="hint small">${b==null?'Not attempted yet':'Best '+b+'%'}</span></div>
    <div class="stack">${set.map((q,k)=>`<div class="field" id="cf${k}"><label for="cs${k}">${k+1}. ${esc(q[0])}</label><select id="cs${k}"><option value="">Choose…</option>${cableOpts(q[4],cur).map(a=>`<option>${esc(a)}</option>`).join('')}</select><span class="corr small"></span></div>`).join('')}</div>
    <div class="row" style="margin-top:18px"><button class="btn" data-act="check">Check</button><button class="btn ghost" data-act="new">New round</button><span class="hint" id="cres"></span></div>`;
    el.querySelector('#cset').addEventListener('change',e=>{cur=+e.target.value;markLab('cables',{lastSet:cur});render()})}
  main.onclick=e=>{const a=e.target.closest('[data-act]');if(!a||!el.contains(a))return;if(a.dataset.act==='new')return render();
    let r=0;set.forEach((q,k)=>{const v=el.querySelector('#cs'+k).value,f=el.querySelector('#cf'+k),ok=v===q[1];r+=ok;f.classList.toggle('ok',ok);f.classList.toggle('no',!ok);f.querySelector('.corr').textContent=ok?q[2]:`→ ${q[1]}. ${q[2]}`});
    const pct=Math.round(r/set.length*100);el.querySelector('#cres').textContent=`${r} / ${set.length}`;markLab('cables',L=>({best:Math.max(L.best??0,pct),sets:{...(L.sets||{}),[cur]:Math.max((L.sets||{})[cur]??0,pct)}}))};
  render();
};

/* ---------- terminal ---------- */
function makeTerm(box,{prompt,onCmd,banner}){
  box.innerHTML=`<div class="term" role="region" aria-label="Terminal"><pre></pre><div class="inrow"><span class="pr"></span><input aria-label="Command" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>`;
  const pre=box.querySelector('pre'),pr=box.querySelector('.pr'),inp=box.querySelector('input'),hist=[];let hi=0;
  const print=s=>{pre.textContent+=s;pre.scrollTop=pre.scrollHeight};const sync=()=>{pr.textContent=prompt()};
  if(banner)print(banner);sync();
  box.querySelector('.term').addEventListener('click',()=>{if(!window.getSelection().toString())inp.focus()});
  inp.addEventListener('keydown',e=>{
    if(e.key==='Enter'){const line=inp.value,p=prompt();inp.value='';if(line.trim())hist.push(line);hi=hist.length;print(p+line+'\n');const out=onCmd(line,p);if(out==='\x1bCLEAR')pre.textContent='';else if(out)print(out.endsWith('\n')?out:out+'\n');sync()}
    else if(e.key==='ArrowUp'){if(hi>0){hi--;inp.value=hist[hi]}e.preventDefault()}
    else if(e.key==='ArrowDown'){if(hi<hist.length-1){hi++;inp.value=hist[hi]}else{hi=hist.length;inp.value=''}e.preventDefault()}});
  return {print,focus:()=>inp.focus()};
}
/* ---------- CLI troubleshooting lab ---------- */
const NET={gw:'192.168.10.1',dnsIn:'192.168.10.5',
  local:{'192.168.10.1':'00-1a-2b-3c-4d-01','192.168.10.5':'00-15-5d-0a-05-05','192.168.10.20':'00-80-77-12-ab-20','192.168.10.31':'3c-52-82-11-07-31'},
  remote:{'192.168.20.15':['192.168.20.15'],'8.8.8.8':['203.0.113.1','198.51.100.9','8.8.8.8'],'1.1.1.1':['203.0.113.1','198.51.100.9','1.1.1.1'],'93.184.215.14':['203.0.113.1','198.51.100.9','93.184.215.14']},
  names:{'fileserver.corp.local':'192.168.20.15','printer.corp.local':'192.168.10.20','dc01.corp.local':'192.168.10.5','www.example.com':'93.184.215.14','example.com':'93.184.215.14'},
  pub:['www.example.com','example.com']};
const TICKETS=[
 {id:'t1',title:'Nothing works after a desk move',ticket:'Hana in Accounting can\'t reach anything: no email, no internet, no shared drive. Her desk was moved yesterday afternoon. She says the PC "looks normal".',
  host:{dhcp:true,media:'down',ip:'',mask:'',gw:'',dns:[]},
  opts:['The DNS server address is wrong','A physical-layer problem: the cable is unplugged or bad, or the wall jack is not patched','The DHCP server is down','The default gateway is wrong'],ans:1,
  why:'ipconfig shows "Media disconnected", and ping fails with "General failure" even to the gateway. The NIC sees no link, so nothing above Layer 1 can work. Start at the bottom of the OSI model: check link lights, reseat or replace the patch cable, test the jack with a cable tester or toner, and confirm the switch port is patched, enabled and in the right VLAN.'},
 {id:'t2',title:'Second floor, no network',ticket:'Several users on the second floor came in this morning and can\'t reach anything. Their link lights are on. Users on the first floor are fine.',
  host:{dhcp:true,media:'up',ip:'169.254.71.12',mask:'255.255.0.0',gw:'',dns:[]},dhcpDown:true,
  opts:['A bad patch cable on each PC','The PCs are not getting DHCP leases (DHCP server, scope or relay problem)','DNS server failure','Wrong subnet mask set by the user'],ans:1,
  why:'The 169.254.x.x (APIPA) address means DHCP Discover messages got no answer, and ipconfig /renew times out. Because several users on one floor are affected, look at what they share: the DHCP relay (ip helper-address) on that floor\'s VLAN interface, the DHCP scope (exhausted?), or the floor switch\'s uplink.'},
 {id:'t3',title:'Printer works, internet doesn\'t',ticket:'Omar can print to the local printer but can\'t open websites or reach the file server. His coworkers are fine. He says someone "set a static IP" on his PC last week.',
  host:{dhcp:false,media:'up',ip:'192.168.10.77',mask:'255.255.255.0',gw:'192.168.10.254',dns:['192.168.10.5']},
  opts:['The DNS server is down','The default gateway is set to the wrong address','The subnet mask is wrong','The file server is down'],ans:1,
  why:'Local hosts (printer .20, DNS server .5) reply, so Layers 1–3 on the LAN are fine. Anything off-subnet gets "Destination host unreachable" from his own IP, because the PC is trying to ARP for the gateway at 192.168.10.254, which doesn\'t exist. The real gateway is 192.168.10.1 (compare with route print on a coworker\'s PC). Fix the static config, or better, switch him back to DHCP.'},
 {id:'t4',title:'"Server not found" in the browser',ticket:'Yusuf\'s browser says "server not found" for every website, and Teams won\'t connect. A coworker at the next desk is fine.',
  host:{dhcp:false,media:'up',ip:'192.168.10.64',mask:'255.255.255.0',gw:'192.168.10.1',dns:['192.168.10.53']},
  opts:['Default gateway misconfigured','DNS: the PC points at a DNS server that doesn\'t exist','The ISP connection is down','Duplex mismatch'],ans:1,
  why:'ping 8.8.8.8 works, so the gateway and internet path are fine. Pinging any name fails with "could not find host", and nslookup times out against 192.168.10.53, which is not a DNS server (the real one is 192.168.10.5). Correct the DNS server setting, then run ipconfig /flushdns.'},
 {id:'t5',title:'Internet fine, file server unreachable',ticket:'Lina can browse the web, but can\'t reach the file share on fileserver (192.168.20.15). Others on her team can. Her PC was re-imaged and configured by hand.',
  host:{dhcp:false,media:'up',ip:'192.168.10.88',mask:'255.255.0.0',gw:'192.168.10.1',dns:['192.168.10.5']},
  opts:['The file server is down','The subnet mask is wrong (/16 instead of /24)','DNS has the wrong record for the file server','The default gateway is wrong'],ans:1,
  why:'With a 255.255.0.0 mask, the PC thinks 192.168.20.15 is on its own subnet, so it ARPs for it directly instead of sending to the gateway. That gives "Destination host unreachable" from her own IP. Internet traffic still works because 8.8.8.8 is clearly off-subnet. tracert to the file server stops at hop 1. Set the mask to 255.255.255.0.'},
 {id:'t6',title:'File share down for many users',ticket:'Starting about 10:15, users across several departments report that the file share on fileserver is unreachable. The internet works for everyone.',
  host:{dhcp:true,media:'up',ip:'192.168.10.142',mask:'255.255.255.0',gw:'192.168.10.1',dns:['192.168.10.5']},down:['192.168.20.15'],
  opts:['This PC\'s network settings are wrong','The problem is past the client: the file server or its network segment is down, so escalate to the server/network team','DNS on this PC is misconfigured','The local switch port is bad'],ans:1,
  why:'This PC\'s config is healthy: the gateway, DNS and internet all work, and the name resolves. tracert reaches the gateway, then times out toward 192.168.20.15. With many users across departments affected, the fault is shared infrastructure: the server, its switch or its VLAN. Gather what you found and escalate, and don\'t spend time changing client PCs.'}
];
VIEWS['lab-cli']=function(el){
  let cur=null,st=null,arp={};
  const solved=()=>(store.get('labs',{}).cli||{}).solved||[];
  function pickTicket(t){cur=t;st=JSON.parse(JSON.stringify(t.host));arp={};
    if(st.dhcp&&!t.dhcpDown&&st.media==='up'&&!st.ip){Object.assign(st,{ip:'192.168.10.'+rnd(100,199),mask:'255.255.255.0',gw:NET.gw,dns:[NET.dnsIn]})}
    render()}
  function render(){
    const sv=solved();
    el.innerHTML=`${head('Lab · Lessons 9 and 21 · Obj 5.3, 5.5','CLI troubleshooting tickets','Each ticket puts you at the user\'s Windows PC. Gather evidence with real commands, then submit your diagnosis. Start with the four-step ping test: 127.0.0.1, your own IP, the default gateway, then a remote host, and finally a name to test DNS. Type <code>help</code> for the supported commands.')}
    <div class="tabs">${TICKETS.map((t,k)=>`<button class="tab ${cur===t?'on':''}" data-t="${k}">${sv.includes(t.id)?'✓ ':''}Ticket ${k+1}</button>`).join('')}</div>
    <div class="labgrid"><div class="stack"><div class="ticket"><b>TICKET · ${esc(cur.title.toUpperCase())}</b><p>${esc(cur.ticket)}</p></div><div id="tbox"></div>
      <p class="hint">Try: <code>ipconfig /all</code> · <code>ping 192.168.10.1</code> · <code>ping www.example.com</code> · <code>tracert 8.8.8.8</code> · <code>nslookup fileserver</code> · <code>arp -a</code> · <code>ipconfig /renew</code>. Arrow keys recall earlier commands.</p></div>
    <section class="stack"><h3>Your diagnosis</h3><p class="hint small">Collect evidence first. A good tech can say which command proved it.</p>
      <div class="choices" id="dx">${cur.opts.map((o,k)=>`<label><input type="radio" name="dx" value="${k}"><span>${esc(o)}</span></label>`).join('')}</div>
      <div class="row"><button class="btn" data-act="dx">Submit diagnosis</button><button class="btn ghost" data-act="reset">Reset PC</button></div><div id="dxfb"></div>
      <details class="small"><summary>Network reference</summary><pre class="ascii" style="margin-top:8px">LAN 192.168.10.0/24
  Gateway (R1)     192.168.10.1
  DNS/DHCP (DC01)  192.168.10.5
  Printer          192.168.10.20
Server VLAN 192.168.20.0/24
  fileserver       192.168.20.15
Internet           8.8.8.8, www.example.com</pre></details></section></div>`;
    makeTerm(document.getElementById('tbox'),{prompt:()=>'C:\\Users\\user> ',banner:'Microsoft Windows [Version 10.0.22631]\n(c) Microsoft Corporation. All rights reserved.\n\n',onCmd:cmd}).focus();
  }
  const isLocalReal=t=>!!NET.local[t];
  function reach(t){
    if(t==='127.0.0.1'||(st.ip&&t===st.ip&&st.media==='up'))return 'ok';
    if(st.media!=='up'||!st.ip)return 'general';
    if(st.ip.startsWith('169.254.'))return sameNet(st.ip,t,'255.255.0.0')?'timeout':'general';
    const down=(cur.down||[]).includes(t);
    if(sameNet(st.ip,t,st.mask)){if(isLocalReal(t)&&sameNet(st.ip,NET.gw,'255.255.255.0')){if(!down)arp[t]=NET.local[t];return down?'timeout':'ok'}return 'unreach'}
    if(!st.gw||!sameNet(st.ip,st.gw,st.mask))return 'general';
    if(st.gw!==NET.gw)return 'unreach';
    arp[NET.gw]=NET.local[NET.gw];
    if(NET.remote[t])return down?'timeout':'ok';
    return 'timeout';
  }
  function resolve(name){
    let n=name.toLowerCase();if(isIp(n))return {ip:n,name:n};
    if(!n.includes('.'))n+='.corp.local';
    if(st.media!=='up'||!st.ip||st.ip.startsWith('169.254.'))return {fail:true,name:n};
    const d=st.dns[0];if(!d||reach(d)!=='ok'||(d!==NET.dnsIn&&d!=='8.8.8.8'))return {fail:true,name:n,timeout:true};
    const ip=NET.names[n];if(!ip||(d==='8.8.8.8'&&!NET.pub.includes(n)))return {fail:true,name:n,nx:true};
    return {ip,name:n};
  }
  const ms=t=>t.startsWith('192.168.10.')?'<1ms':t.startsWith('192.168.20.')?'1ms':rnd(14,22)+'ms';
  function ping(arg){
    if(!arg)return 'Usage: ping target_name';
    const r=resolve(arg);if(r.fail)return `Ping request could not find host ${arg}. Please check the name and try again.`;
    const t=r.ip,res=reach(t),hdr=`\nPinging ${r.name===t?t:r.name+' ['+t+']'} with 32 bytes of data:\n`;
    if(res==='ok'){const ttl=t.startsWith('192.168.10.')?128:t.startsWith('192.168.20.')?127:117;return hdr+Array(4).fill(`Reply from ${t}: bytes=32 time${ms(t).startsWith('<')?'':'='}${ms(t)} TTL=${ttl}`).join('\n')+`\n\nPing statistics for ${t}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`}
    if(res==='unreach')return hdr+Array(4).fill(`Reply from ${st.ip}: Destination host unreachable.`).join('\n')+`\n\nPing statistics for ${t}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`;
    if(res==='timeout')return hdr+Array(4).fill('Request timed out.').join('\n')+`\n\nPing statistics for ${t}:\n    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),`;
    return hdr+Array(4).fill('PING: transmit failed. General failure.').join('\n')+`\n\nPing statistics for ${t}:\n    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),`;
  }
  function tracert(arg){
    if(!arg)return 'Usage: tracert target_name';
    const r=resolve(arg);if(r.fail)return `Unable to resolve target system name ${arg}.`;
    const t=r.ip,res=reach(t);
    let o=`\nTracing route to ${r.name===t?t:r.name+' ['+t+']'}\nover a maximum of 30 hops:\n\n`;
    const line=(n,ip)=>`  ${String(n).padStart(2)}    ${ip.startsWith('192.168.10.')?'<1 ms    <1 ms    <1 ms':ip.startsWith('192.168.')?' 1 ms     1 ms     1 ms':' '+rnd(9,20)+' ms    '+rnd(9,20)+' ms    '+rnd(9,20)+' ms'}  ${ip}`;
    const to=n=>`  ${String(n).padStart(2)}     *        *        *     Request timed out.`;
    if(res==='general')return 'Transmit error: code 1231.';
    if(res==='unreach')return o+`  1  ${'WS-0142'} [${st.ip}]  reports: Destination host unreachable.\n\nTrace complete.`;
    if(sameNet(st.ip,t,st.mask)&&isLocalReal(t))return o+(res==='ok'?line(1,t):to(1))+'\n\nTrace complete.';
    const path=[NET.gw,...(NET.remote[t]||[])];
    if(res==='ok')return o+path.map((ip,k)=>line(k+1,ip)).join('\n')+'\n\nTrace complete.';
    const hops=path.slice(0,-1);return o+hops.map((ip,k)=>line(k+1,ip)).join('\n')+'\n'+[1,2,3].map(k=>to(hops.length+k)).join('\n')+'\n  ...  (continues to hop 30)\n\nTrace complete.';
  }
  function nslookup(arg){
    const d=st.dns[0]||'';const sname=d===NET.dnsIn?'dc01.corp.local':d==='8.8.8.8'?'dns.google':'UnKnown';
    if(!arg)return `Default Server:  ${sname}\nAddress:  ${d||'(none)'}\n\n(Interactive mode is not supported here; use nslookup <name>.)`;
    if(st.media!=='up'||!st.ip||st.ip.startsWith('169.254.')||!d)return `DNS request timed out.\n    timeout was 2 seconds.\nDefault Server:  UnKnown\nAddress:  ${d||'(none)'}\n\n*** Request to UnKnown timed-out`;
    const r=resolve(arg);
    if(r.timeout)return `DNS request timed out.\n    timeout was 2 seconds.\nServer:  UnKnown\nAddress:  ${d}\n\nDNS request timed out.\n    timeout was 2 seconds.\n*** Request to UnKnown timed-out`;
    if(r.nx)return `Server:  ${sname}\nAddress:  ${d}\n\n*** ${sname} can't find ${arg}: Non-existent domain`;
    return `Server:  ${sname}\nAddress:  ${d}\n\nName:    ${r.name}\nAddress:  ${r.ip}`;
  }
  function ipconfig(args){
    const a=args.join(' ').toLowerCase();
    if(a==='/release'){if(!st.dhcp)return '\nWindows IP Configuration\n\nThe operation failed as no adapter is in the state permissible for\nthis operation.';if(st.media!=='up')return '\nWindows IP Configuration\n\nNo operation can be performed on Ethernet while it has its media disconnected.';st.ip='0.0.0.0';st.mask='0.0.0.0';st.gw='';st.dns=[];return '\nWindows IP Configuration\n\n'+show(false)}
    if(a==='/renew'){if(!st.dhcp)return '\nWindows IP Configuration\n\nThe operation failed as no adapter is in the state permissible for\nthis operation.';if(st.media!=='up')return '\nWindows IP Configuration\n\nNo operation can be performed on Ethernet while it has its media disconnected.';
      if(cur.dhcpDown){st.ip='169.254.'+rnd(1,254)+'.'+rnd(1,254);st.mask='255.255.0.0';st.gw='';st.dns=[];return '\nWindows IP Configuration\n\nAn error occurred while renewing interface Ethernet : unable to contact your DHCP server. Request has timed out.'}
      if(!st.ip||st.ip==='0.0.0.0')st.ip='192.168.10.'+rnd(100,199);st.mask='255.255.255.0';st.gw=NET.gw;st.dns=[NET.dnsIn];return '\nWindows IP Configuration\n\n'+show(false)}
    if(a==='/flushdns')return '\nWindows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.';
    if(a==='/displaydns')return '\nWindows IP Configuration\n\n(DNS resolver cache is empty)';
    if(a&&a!=='/all')return `Error: unrecognized or incomplete command line.\n\nSupported here: ipconfig, ipconfig /all, /release, /renew, /flushdns`;
    return '\nWindows IP Configuration\n\n'+(a==='/all'?'   Host Name . . . . . . . . . . . . : WS-0142\n   Primary Dns Suffix  . . . . . . . : corp.local\n   Node Type . . . . . . . . . . . . : Hybrid\n\n':'')+show(a==='/all');
  }
  function show(all){
    let o='Ethernet adapter Ethernet:\n\n';
    if(st.media!=='up'){o+='   Media State . . . . . . . . . . . : Media disconnected\n   Connection-specific DNS Suffix  . : \n';if(all)o+='   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM\n   Physical Address. . . . . . . . . : 8C-16-45-2A-91-0E\n   DHCP Enabled. . . . . . . . . . . : '+(st.dhcp?'Yes':'No')+'\n';return o}
    const apipa=st.ip.startsWith('169.254.');
    o+=`   Connection-specific DNS Suffix  . : ${st.dhcp&&!apipa&&st.ip!=='0.0.0.0'?'corp.local':''}\n`;
    if(all)o+='   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM\n   Physical Address. . . . . . . . . : 8C-16-45-2A-91-0E\n   DHCP Enabled. . . . . . . . . . . : '+(st.dhcp?'Yes':'No')+'\n   Autoconfiguration Enabled . . . . : Yes\n';
    o+='   Link-local IPv6 Address . . . . . : fe80::4c1a:9e2b:7d10:3f21%12\n';
    if(st.ip&&st.ip!=='0.0.0.0'){o+=`   ${apipa?'Autoconfiguration IPv4 Address. . ':'IPv4 Address. . . . . . . . . . . '}: ${st.ip}${all&&!apipa?'(Preferred)':''}\n   Subnet Mask . . . . . . . . . . . : ${st.mask}\n`}
    if(all&&st.dhcp&&!apipa&&st.ip&&st.ip!=='0.0.0.0')o+='   Lease Obtained. . . . . . . . . . : Monday, 08:02:11\n   Lease Expires . . . . . . . . . . : Tuesday, 08:02:11\n';
    o+=`   Default Gateway . . . . . . . . . : ${st.gw||''}\n`;
    if(all){if(st.dhcp&&!apipa&&st.ip&&st.ip!=='0.0.0.0')o+='   DHCP Server . . . . . . . . . . . : 192.168.10.5\n';o+=`   DNS Servers . . . . . . . . . . . : ${st.dns.length?st.dns.join('\n                                       '):'fec0:0:0:ffff::1%1'}\n   NetBIOS over Tcpip. . . . . . . . : Enabled\n`}
    return o;
  }
  function cmd(line){
    const tk=line.trim().split(/\s+/),c=(tk[0]||'').toLowerCase(),args=tk.slice(1);
    switch(c){
      case '':return '';
      case 'help':case '?':return 'Supported commands:\n  ipconfig [/all | /release | /renew | /flushdns]\n  ping <host or IP>        tracert <host or IP>\n  nslookup <name>          arp -a\n  route print              netstat -an\n  hostname                 cls';
      case 'ipconfig':return ipconfig(args);
      case 'ping':return ping(args.filter(a=>!a.startsWith('-'))[0]);
      case 'tracert':case 'traceroute':return tracert(args.filter(a=>!a.startsWith('-'))[0]);
      case 'nslookup':return nslookup(args[0]);
      case 'hostname':return 'WS-0142';
      case 'cls':case 'clear':return '\x1bCLEAR';
      case 'arp':{if(st.media!=='up'||!st.ip||st.ip==='0.0.0.0')return 'No ARP Entries Found.';const e=Object.entries(arp);return `\nInterface: ${st.ip} --- 0xc\n  Internet Address      Physical Address      Type\n`+e.map(([i,m])=>`  ${i.padEnd(22)}${m.padEnd(22)}dynamic`).join('\n')+(e.length?'\n':'')+`  ${(st.ip.startsWith('169.254.')?'169.254.255.255':int2ip((ip2int(st.ip)|(~ip2int(st.mask)>>>0))>>>0)).padEnd(22)}ff-ff-ff-ff-ff-ff     static\n  224.0.0.22            01-00-5e-00-00-16     static`}
      case 'route':{if(st.media!=='up'||!st.ip)return 'IPv4 Route Table\n(no active routes)';const net=int2ip((ip2int(st.ip)&ip2int(st.mask))>>>0);return `IPv4 Route Table\n===========================================================================\nActive Routes:\nNetwork Destination        Netmask          Gateway       Interface  Metric\n${st.gw?`          0.0.0.0          0.0.0.0  ${st.gw.padStart(14)}  ${st.ip.padStart(14)}     25\n`:''}${net.padStart(17)}  ${st.mask.padStart(15)}         On-link  ${st.ip.padStart(14)}    281\n        127.0.0.0        255.0.0.0         On-link       127.0.0.1    331\n===========================================================================`}
      case 'netstat':return `\nActive Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING\n  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING\n  TCP    0.0.0.0:3389           0.0.0.0:0              LISTENING\n${st.ip&&reach('192.168.10.5')==='ok'?`  TCP    ${st.ip}:52114    192.168.10.5:389       ESTABLISHED\n`:''}  UDP    0.0.0.0:5353           *:*`;
      default:return `'${tk[0]}' is not recognized as an internal or external command,\noperable program or batch file. Type help for the supported commands.`;
    }
  }
  main.onclick=e=>{
    const t=e.target.closest('[data-t]');if(t)return pickTicket(TICKETS[+t.dataset.t]);
    const a=e.target.closest('[data-act]');if(!a)return;
    if(a.dataset.act==='reset')return pickTicket(cur);
    if(a.dataset.act==='dx'){const v=el.querySelector('input[name=dx]:checked');const fb=document.getElementById('dxfb');if(!v){fb.innerHTML='<p class="hint" style="margin-top:8px">Pick a diagnosis first.</p>';return}
      const k=+v.value,ok=k===cur.ans;el.querySelectorAll('#dx label').forEach((l,j)=>{l.classList.remove('right','wrong');if(j===cur.ans)l.classList.add('right');else if(j===k)l.classList.add('wrong')});
      if(ok){const s=solved();if(!s.includes(cur.id)){s.push(cur.id);markLab('cli',{solved:s,n:s.length,done:s.length===TICKETS.length})}}
      fb.innerHTML=`<div class="fb ${ok?'':'no'}"><strong>${ok?'Correct diagnosis.':'Not the root cause.'}</strong><p class="small">${esc(cur.why)}</p></div>`;
      if(ok){const tab=el.querySelectorAll('[data-t]')[TICKETS.indexOf(cur)];if(tab&&!tab.textContent.startsWith('✓'))tab.textContent='✓ '+tab.textContent}}
  };
  pickTicket(TICKETS[0]);
};

/* ---------- Cisco switch lab ---------- */
const SW_CONNECTED=new Set(['Fa0/1','Fa0/2','Fa0/3','Fa0/5','Fa0/8','Fa0/13','Fa0/14','Fa0/17','Gi0/1']);
function newSwitch(){const ifs={};for(let n=1;n<=24;n++)ifs['Fa0/'+n]={mode:'auto',access:1,native:1,allowed:'',shut:false,desc:'',noneg:false};ifs['Gi0/1']={mode:'auto',access:1,native:1,allowed:'',shut:false,desc:'',noneg:false};ifs['Gi0/2']={mode:'auto',access:1,native:1,allowed:'',shut:false,desc:'',noneg:false};
  return {host:'Switch',mode:'user',ctx:null,vlans:{1:'default'},ifs,svis:{1:{ip:'',mask:'',shut:true}},gw:'',secret:'',saved:false,startup:null,lastPrompt:''}}
const longIf=n=>n.replace(/^Fa/,'FastEthernet').replace(/^Gi/,'GigabitEthernet');
function parseIf(spec){spec=spec.toLowerCase();let m=spec.match(/^([a-z]+)(\d)\/(\d{1,2})$/);if(!m)return null;
  if(m[2]!=='0')return null;const n=+m[3];
  if('fastethernet'.startsWith(m[1])&&m[1].length>=1&&n>=1&&n<=24)return 'Fa0/'+n;
  if('gigabitethernet'.startsWith(m[1])&&n>=1&&n<=2)return 'Gi0/'+n;return null}
function parseRange(spec){spec=spec.toLowerCase();const out=[];for(const part of spec.split(',')){if(!part)return null;
  const m=part.match(/^([a-z]*)(\d)\/(\d{1,2})(?:-(\d{1,2}))?$/);if(!m)return null;
  let pre=m[1];if(!pre){if(!out.length)return null;pre=out[out.length-1].startsWith('Fa')?'fa':'gi'}
  const a=+m[3],b=m[4]?+m[4]:a;if(b<a)return null;for(let n=a;n<=b;n++){const nm=parseIf(pre+m[2]+'/'+n);if(!nm)return null;out.push(nm)}}return out}
function mk(tok,list){if(!tok)return null;tok=tok.toLowerCase();if(list.includes(tok))return tok;const c=list.filter(w=>w.startsWith(tok));return c.length===1?c[0]:c.length>1?'AMBIG':null}
function swPrompt(s){return s.host+({user:'>',priv:'#',config:'(config)#',if:'(config-if)#',range:'(config-if-range)#',vlan:'(config-vlan)#',svi:'(config-if)#'}[s.mode])}
function swErr(s,line,toks,idx){let pos=0;for(let k=0;k<idx;k++)pos=line.indexOf(toks[k],pos)+toks[k].length;pos=line.indexOf(toks[idx],pos);if(pos<0)pos=line.length;return ' '.repeat(s.lastPrompt.length+pos)+'^\n% Invalid input detected at \'^\' marker.'}
const INC='% Incomplete command.';
const changed=s=>{s.saved=false};
function swExec(s,raw,prompt){
  s.lastPrompt=prompt;const line=raw.replace(/\s+$/,'');if(!line.trim())return '';
  if(line.trim().endsWith('?'))return swHelp(s);
  let toks=line.trim().split(/\s+/);const lead=line.length-line.trimStart().length;s.lastPrompt=prompt+' '.repeat(lead);
  const inCfg=['config','if','range','vlan','svi'].includes(s.mode);
  if(inCfg&&toks[0].toLowerCase()==='do'){if(!toks[1])return INC;const sub=line.trimStart().slice(2).trimStart();s.lastPrompt=prompt+' '.repeat(line.length-sub.length);return swPriv(s,sub.split(/\s+/),sub,true)}
  if(s.mode==='user')return swUser(s,toks,line.trim());
  if(s.mode==='priv')return swPriv(s,toks,line.trim(),false);
  if(s.mode==='config')return swConfig(s,toks,line.trim());
  const r=swSub(s,toks,line.trim());if(r!==null)return r;return swConfig(s,toks,line.trim());
}
function swUser(s,toks,line){const c=mk(toks[0],['enable','exit','logout','show','ping']);
  if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
  if(c==='enable'){s.mode='priv';return ''}
  if(c==='exit'||c==='logout')return `\n${s.host} con0 is now available\n\nPress RETURN to get started.`;
  if(c==='show')return swShow(s,toks.slice(1),line,1);
  if(c==='ping')return 'Use privileged mode for this lab (type enable).';
  return swErr(s,line,toks,0)}
function swPriv(s,toks,line,viaDo){const c=mk(toks[0],['configure','copy','disable','enable','exit','show','write','reload','ping','clock']);
  if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
  if(viaDo&&['configure','disable','enable','exit'].includes(c))return swErr(s,line,toks,0);
  switch(c){
    case 'configure':if(toks[1]&&mk(toks[1],['terminal'])!=='terminal')return swErr(s,line,toks,1);s.mode='config';return 'Enter configuration commands, one per line.  End with CNTL/Z.';
    case 'disable':s.mode='user';return '';
    case 'enable':return '';
    case 'exit':s.mode='user';return `\n${s.host} con0 is now available\n\nPress RETURN to get started.`;
    case 'show':return swShow(s,toks.slice(1),line,1);
    case 'copy':{if(!toks[1]||!toks[2])return INC;if(mk(toks[1],['running-config'])!=='running-config')return swErr(s,line,toks,1);if(mk(toks[2],['startup-config'])!=='startup-config')return swErr(s,line,toks,2);s.saved=true;s.startup=swRun(s);return 'Destination filename [startup-config]? \nBuilding configuration...\n[OK]'}
    case 'write':{if(toks[1]&&mk(toks[1],['memory'])!=='memory')return swErr(s,line,toks,1);s.saved=true;s.startup=swRun(s);return 'Building configuration...\n[OK]'}
    case 'reload':return 'Reload is disabled in this lab. Use the Reset switch button instead.';
    case 'ping':return 'ping is not simulated in this lab.';
    case 'clock':return '';
    default:return swErr(s,line,toks,0)}}
function swConfig(s,toks,line){
  const c=mk(toks[0],['hostname','vlan','interface','enable','ip','exit','end','no','spanning-tree','service','line','banner','username']);
  if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
  switch(c){
    case 'hostname':if(!toks[1])return INC;s.host=toks[1];changed(s);return '';
    case 'vlan':{if(!toks[1])return INC;if(!/^\d+$/.test(toks[1])||+toks[1]<1||+toks[1]>4094)return swErr(s,line,toks,1);const n=+toks[1];if(n>=1002&&n<=1005)return `Default VLAN ${n} may not have its name changed.`;if(!s.vlans[n]){s.vlans[n]='VLAN'+String(n).padStart(4,'0');changed(s)}s.mode='vlan';s.ctx=n;return ''}
    case 'interface':{if(!toks[1])return INC;
      if(mk(toks[1],['range'])==='range'){const spec=toks.slice(2).join('');if(!spec)return INC;const list=parseRange(spec);if(!list)return swErr(s,line,toks,2);s.mode='range';s.ctx=list;return ''}
      const spec=toks.slice(1).join('');const vm=spec.match(/^([a-z]+)(\d+)$/i);
      if(vm&&'vlan'.startsWith(vm[1].toLowerCase())){const n=+vm[2];if(n<1||n>4094)return swErr(s,line,toks,1);if(!s.svis[n]){s.svis[n]={ip:'',mask:'',shut:true};changed(s)}s.mode='svi';s.ctx=n;return ''}
      const nm=parseIf(spec);if(!nm)return swErr(s,line,toks,1);s.mode='if';s.ctx=[nm];return ''}
    case 'enable':{const c2=mk(toks[1],['secret','password']);if(!toks[1])return INC;if(!c2||c2==='AMBIG')return swErr(s,line,toks,1);if(!toks[2])return INC;s.secret=toks[toks.length-1];changed(s);return ''}
    case 'ip':{const c2=mk(toks[1],['default-gateway','domain-name','ssh','routing']);if(!toks[1])return INC;if(c2==='default-gateway'){if(!toks[2])return INC;if(!isIp(toks[2]))return swErr(s,line,toks,2);s.gw=toks[2];changed(s);return ''}if(c2==='domain-name'||c2==='ssh')return '';return swErr(s,line,toks,1)}
    case 'exit':s.mode=s.mode==='config'?'priv':'config';s.ctx=null;return '';
    case 'end':s.mode='priv';s.ctx=null;return '';
    case 'no':{const c2=mk(toks[1],['vlan','ip','hostname','enable']);if(!toks[1])return INC;
      if(c2==='vlan'){const n=+toks[2];if(!toks[2])return INC;if(n===1)return '%Default VLAN 1 may not be deleted.';delete s.vlans[n];changed(s);return ''}
      if(c2==='ip'&&mk(toks[2],['default-gateway'])==='default-gateway'){s.gw='';changed(s);return ''}
      if(c2==='hostname'){s.host='Switch';changed(s);return ''}
      if(c2==='enable'){s.secret='';changed(s);return ''}
      return swErr(s,line,toks,1)}
    case 'spanning-tree':case 'service':case 'line':case 'banner':case 'username':return '(Accepted. This command isn\'t needed for this lab\'s objectives.)';
    default:return swErr(s,line,toks,0)}}
function swSub(s,toks,line){
  const end=()=>{s.mode='priv';s.ctx=null;return ''},exit=()=>{s.mode='config';s.ctx=null;return ''};
  if(s.mode==='vlan'){const c=mk(toks[0],['name','exit','end']);if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
    if(c==='name'){if(!toks[1])return INC;if(s.ctx===1)return '%Default VLAN 1 may not have its name changed.';s.vlans[s.ctx]=toks[1];changed(s);return ''}
    if(c==='exit')return exit();if(c==='end')return end();return null}
  if(s.mode==='svi'){const v=s.svis[s.ctx];const c=mk(toks[0],['ip','shutdown','no','description','exit','end']);if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
    if(c==='ip'){if(mk(toks[1],['address'])!=='address')return toks[1]?swErr(s,line,toks,1):INC;if(!toks[2]||!toks[3])return INC;if(!isIp(toks[2]))return swErr(s,line,toks,2);if(!isIp(toks[3]))return swErr(s,line,toks,3);v.ip=toks[2];v.mask=toks[3];changed(s);return ''}
    if(c==='shutdown'){v.shut=true;changed(s);return `%LINK-5-CHANGED: Interface Vlan${s.ctx}, changed state to administratively down`}
    if(c==='no'){const c2=mk(toks[1],['shutdown','ip']);if(c2==='shutdown'){v.shut=false;changed(s);return `%LINK-3-UPDOWN: Interface Vlan${s.ctx}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface Vlan${s.ctx}, changed state to up`}if(c2==='ip'){v.ip='';v.mask='';changed(s);return ''}return null}
    if(c==='description')return '';if(c==='exit')return exit();if(c==='end')return end();
    if(toks[0].toLowerCase().startsWith('sw'))return swErr(s,line,toks,0);return null}
  // physical interface / range
  const list=s.ctx.map(n=>s.ifs[n]);
  const c=mk(toks[0],['switchport','shutdown','no','description','exit','end','speed','duplex']);
  if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
  if(c==='switchport'){const c2=mk(toks[1],['mode','access','trunk','nonegotiate','port-security','voice']);if(!toks[1])return INC;
    if(c2==='mode'){const c3=mk(toks[2],['access','trunk','dynamic']);if(!toks[2])return INC;if(!c3||c3==='AMBIG')return swErr(s,line,toks,2);list.forEach(i=>i.mode=c3==='dynamic'?'auto':c3);changed(s);return ''}
    if(c2==='access'){if(mk(toks[2],['vlan'])!=='vlan')return toks[2]?swErr(s,line,toks,2):INC;if(!toks[3])return INC;const n=+toks[3];if(!/^\d+$/.test(toks[3])||n<1||n>4094)return swErr(s,line,toks,3);let msg='';if(!s.vlans[n]){s.vlans[n]='VLAN'+String(n).padStart(4,'0');msg=`% Access VLAN does not exist. Creating vlan ${n}`}list.forEach(i=>i.access=n);changed(s);return msg}
    if(c2==='trunk'){const c3=mk(toks[2],['native','allowed','encapsulation']);if(!toks[2])return INC;
      if(c3==='native'){if(mk(toks[3],['vlan'])!=='vlan')return toks[3]?swErr(s,line,toks,3):INC;if(!toks[4])return INC;const n=+toks[4];if(!/^\d+$/.test(toks[4]))return swErr(s,line,toks,4);list.forEach(i=>i.native=n);changed(s);return ''}
      if(c3==='allowed'){if(mk(toks[3],['vlan'])!=='vlan')return toks[3]?swErr(s,line,toks,3):INC;if(!toks[4])return INC;list.forEach(i=>i.allowed=toks.slice(4).join(' '));changed(s);return ''}
      if(c3==='encapsulation')return '';return swErr(s,line,toks,2)}
    if(c2==='nonegotiate'){list.forEach(i=>i.noneg=true);changed(s);return ''}
    if(c2==='port-security'||c2==='voice')return '(Accepted. Port security and voice VLANs aren\'t graded in this lab.)';
    return swErr(s,line,toks,1)}
  if(c==='shutdown'){list.forEach(i=>i.shut=true);changed(s);return s.ctx.map(n=>`%LINK-5-CHANGED: Interface ${longIf(n)}, changed state to administratively down`).join('\n')}
  if(c==='no'){const c2=mk(toks[1],['shutdown','switchport','description']);
    if(c2==='shutdown'){list.forEach(i=>i.shut=false);changed(s);return s.ctx.filter(n=>SW_CONNECTED.has(n)).map(n=>`%LINK-3-UPDOWN: Interface ${longIf(n)}, changed state to up`).join('\n')}
    if(c2==='switchport'){const c3=mk(toks[2],['access','trunk','mode','nonegotiate']);if(c3==='access')list.forEach(i=>i.access=1);else if(c3==='trunk')list.forEach(i=>{i.native=1;i.allowed=''});else if(c3==='mode')list.forEach(i=>i.mode='auto');else if(c3==='nonegotiate')list.forEach(i=>i.noneg=false);else return swErr(s,line,toks,2);changed(s);return ''}
    if(c2==='description'){list.forEach(i=>i.desc='');changed(s);return ''}
    return null}
  if(c==='description'){list.forEach(i=>i.desc=toks.slice(1).join(' '));changed(s);return ''}
  if(c==='speed'||c==='duplex')return '';
  if(c==='exit')return exit();if(c==='end')return end();
  if(toks[0].toLowerCase()==='ip')return swErr(s,line,toks,0);
  return null}
function swShow(s,toks,line,off){const all=line.split(/\s+/);
  const c=mk(toks[0],['vlan','running-config','startup-config','interfaces','ip','mac','version']);
  if(!toks[0])return INC;if(c==='AMBIG')return `% Ambiguous command:  "${line}"`;
  switch(c){
    case 'vlan':return swVlanBrief(s);
    case 'running-config':return swRun(s);
    case 'startup-config':return s.startup||'startup-config is not present';
    case 'interfaces':{const c2=mk(toks[1],['trunk','status']);if(c2==='trunk')return swTrunk(s);if(c2==='status')return swStatus(s);return 'Supported here: show interfaces status | show interfaces trunk'}
    case 'ip':{if(mk(toks[1],['interface'])==='interface'&&mk(toks[2],['brief'])==='brief')return swIpBrief(s);return 'Supported here: show ip interface brief'}
    case 'mac':return `          Mac Address Table\n-------------------------------------------\n\nVlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n${[['Fa0/1','0050.56a1.10f2'],['Fa0/2','0050.56a1.22c9'],['Fa0/13','00e0.4c68.13aa'],['Gi0/1','0019.aa01.9901']].filter(([p])=>SW_CONNECTED.has(p)&&!s.ifs[p].shut).map(([p,m])=>{const i=s.ifs[p];return `${String(i.mode==='trunk'?(i.native):i.access).padStart(4)}    ${m}    DYNAMIC     ${p}`}).join('\n')}\nTotal Mac Addresses for this criterion: 4`;
    case 'version':return 'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.2(7)E (lab simulation)\nModel number: WS-C2960-24TT-L';
    default:return swErr(s,line,all,off)}}
function swVlanBrief(s){
  let o='\nVLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n';
  const ids=Object.keys(s.vlans).map(Number).sort((a,b)=>a-b);
  for(const id of ids){const ports=Object.keys(s.ifs).filter(n=>s.ifs[n].mode!=='trunk'&&s.ifs[n].access===id);const lines=[];for(let k=0;k<ports.length;k+=4)lines.push(ports.slice(k,k+4).join(', '));
    o+=`${String(id).padEnd(5)}${s.vlans[id].slice(0,32).padEnd(33)}active    ${lines[0]||''}\n`;for(const l of lines.slice(1))o+=' '.repeat(48)+l+'\n'}
  // access ports pointing at deleted VLANs
  const orphan=Object.keys(s.ifs).filter(n=>s.ifs[n].mode!=='trunk'&&!s.vlans[s.ifs[n].access]);
  o+=`1002 fddi-default                     act/unsup \n1003 token-ring-default               act/unsup \n1004 fddinet-default                  act/unsup \n1005 trnet-default                    act/unsup `;
  if(orphan.length)o+=`\n\n(Inactive: ${orphan.join(', ')} are assigned to VLANs that don't exist.)`;return o}
function swRun(s){let o=`Building configuration...\n\nCurrent configuration : ${1400+Object.keys(s.vlans).length*40} bytes\n!\nversion 15.2\nno service pad\n!\nhostname ${s.host}\n!\n`;
  if(s.secret)o+='enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0\n!\n';
  for(const n of Object.keys(s.ifs)){const i=s.ifs[n];o+=`interface ${longIf(n)}\n`;if(i.desc)o+=` description ${i.desc}\n`;if(i.access!==1)o+=` switchport access vlan ${i.access}\n`;if(i.native!==1)o+=` switchport trunk native vlan ${i.native}\n`;if(i.allowed)o+=` switchport trunk allowed vlan ${i.allowed}\n`;if(i.mode!=='auto')o+=` switchport mode ${i.mode}\n`;if(i.noneg)o+=' switchport nonegotiate\n';if(i.shut)o+=' shutdown\n';o+='!\n'}
  for(const n of Object.keys(s.svis).map(Number).sort((a,b)=>a-b)){const v=s.svis[n];o+=`interface Vlan${n}\n${v.ip?` ip address ${v.ip} ${v.mask}\n`:' no ip address\n'}${v.shut?' shutdown\n':''}!\n`}
  if(s.gw)o+=`ip default-gateway ${s.gw}\n!\n`;
  return o+'line con 0\nline vty 0 4\n login\n!\nend'}
function swTrunk(s){const tr=Object.keys(s.ifs).filter(n=>s.ifs[n].mode==='trunk'&&!s.ifs[n].shut&&SW_CONNECTED.has(n));if(!tr.length)return '';
  return `\nPort        Mode             Encapsulation  Status        Native vlan\n${tr.map(n=>`${n.padEnd(12)}on               802.1q         trunking      ${s.ifs[n].native}`).join('\n')}\n\nPort        Vlans allowed on trunk\n${tr.map(n=>`${n.padEnd(12)}${s.ifs[n].allowed||'1-4094'}`).join('\n')}\n\nPort        Vlans allowed and active in management domain\n${tr.map(n=>`${n.padEnd(12)}${Object.keys(s.vlans).join(',')}`).join('\n')}`}
function swStatus(s){return `\nPort      Name               Status       Vlan       Duplex  Speed Type\n`+Object.keys(s.ifs).map(n=>{const i=s.ifs[n];const st=i.shut?'disabled':SW_CONNECTED.has(n)?'connected':'notconnect';const gi=n.startsWith('Gi');return `${n.padEnd(10)}${(i.desc||'').slice(0,18).padEnd(19)}${st.padEnd(13)}${String(i.mode==='trunk'?'trunk':i.access).padEnd(11)}${st==='connected'?'a-full ':'  auto '} ${st==='connected'?(gi?'a-1000':' a-100'):'  auto'} ${gi?'10/100/1000BaseTX':'10/100BaseTX'}`}).join('\n')}
function swIpBrief(s){let o='Interface              IP-Address      OK? Method Status                Protocol\n';
  for(const n of Object.keys(s.svis).map(Number).sort((a,b)=>a-b)){const v=s.svis[n];const up=!v.shut&&(n===1||Object.values(s.ifs).some(i=>!i.shut&&(i.mode==='trunk'||i.access===n)));o+=`${('Vlan'+n).padEnd(23)}${(v.ip||'unassigned').padEnd(16)}YES ${v.ip?'manual':'unset '} ${(v.shut?'administratively down':up?'up':'down').padEnd(22)}${v.shut?'down':up?'up':'down'}\n`}
  for(const n of Object.keys(s.ifs)){const i=s.ifs[n];const st=i.shut?'administratively down':SW_CONNECTED.has(n)?'up':'down';o+=`${longIf(n).padEnd(23)}unassigned      YES unset  ${st.padEnd(22)}${!i.shut&&SW_CONNECTED.has(n)?'up':'down'}\n`}return o}
function swHelp(s){const m={user:'Exec commands:\n  enable     Turn on privileged commands\n  exit       Exit from the EXEC\n  show       Show running system information',
  priv:'Exec commands:\n  configure  Enter configuration mode (configure terminal)\n  copy       Copy from one file to another (copy running-config startup-config)\n  disable    Turn off privileged commands\n  show       vlan brief | running-config | interfaces trunk | interfaces status | ip interface brief | mac address-table\n  write      Write running configuration to memory',
  config:'Configure commands:\n  enable           enable secret <password>\n  end              Exit to privileged mode\n  exit             Exit from configure mode\n  hostname         Set system\'s network name\n  interface        Select an interface (interface fa0/1 | interface range fa0/1 - 12 | interface vlan 99)\n  ip               ip default-gateway <address>\n  no               Negate a command\n  vlan             VLAN commands (vlan 10)\n  do               Run an exec command (do show vlan brief)',
  vlan:'VLAN configuration commands:\n  name   Ascii name of the VLAN\n  exit   Apply changes and exit\n  end    Exit to privileged mode',
  if:'Interface configuration commands:\n  description  Interface specific description\n  no           Negate a command (no shutdown)\n  shutdown     Shutdown the selected interface\n  switchport   mode access|trunk · access vlan <n> · trunk native vlan <n> · trunk allowed vlan <list> · nonegotiate\n  exit / end',
  svi:'Interface configuration commands:\n  ip address <ip> <mask>\n  no shutdown\n  shutdown\n  exit / end'};
  return m[s.mode==='range'?'if':s.mode]}
const SW_OBJ=[
 ['Set the hostname to SW1',s=>s.host==='SW1','hostname SW1'],
 ['Create VLAN 10 named SALES and VLAN 20 named HR',s=>(s.vlans[10]||'').toUpperCase()==='SALES'&&(s.vlans[20]||'').toUpperCase()==='HR','vlan 10\n name SALES\nvlan 20\n name HR'],
 ['Make Fa0/1–12 access ports in VLAN 10',s=>Array.from({length:12},(_,k)=>s.ifs['Fa0/'+(k+1)]).every(i=>i.mode==='access'&&i.access===10),'interface range fa0/1 - 12\n switchport mode access\n switchport access vlan 10'],
 ['Make Fa0/13–20 access ports in VLAN 20',s=>Array.from({length:8},(_,k)=>s.ifs['Fa0/'+(k+13)]).every(i=>i.mode==='access'&&i.access===20),'interface range fa0/13 - 20\n switchport mode access\n switchport access vlan 20'],
 ['Create VLAN 99 named MGMT, and make Gi0/1 a trunk with native VLAN 99',s=>(s.vlans[99]||'').toUpperCase()==='MGMT'&&s.ifs['Gi0/1'].mode==='trunk'&&s.ifs['Gi0/1'].native===99,'vlan 99\n name MGMT\ninterface gi0/1\n switchport mode trunk\n switchport trunk native vlan 99'],
 ['Shut down the unused ports Fa0/21–24',s=>[21,22,23,24].every(n=>s.ifs['Fa0/'+n].shut),'interface range fa0/21 - 24\n shutdown'],
 ['Give interface VLAN 99 the IP 192.168.99.2/24, bring it up, and set the default gateway to 192.168.99.1',s=>{const v=s.svis[99];return !!v&&v.ip==='192.168.99.2'&&v.mask==='255.255.255.0'&&!v.shut&&s.gw==='192.168.99.1'},'interface vlan 99\n ip address 192.168.99.2 255.255.255.0\n no shutdown\nexit\nip default-gateway 192.168.99.1'],
 ['Save the configuration (after everything above is done)',s=>s.saved&&SW_OBJ.slice(0,7).every(o=>o[1](s)),'end\ncopy running-config startup-config']];
VIEWS['lab-switch']=function(el){
  let s=newSwitch();
  el.innerHTML=`${head('Lab · Lesson 11 · Obj 2.2 · CCNA preview','Switch configuration (Cisco IOS)','A simulated Catalyst 2960. Abbreviations work (<code>conf t</code>, <code>int ra fa0/1 - 12</code>, <code>sh vlan br</code>), as do <code>?</code> and <code>do</code> from config mode. Objectives tick off as you go.')}
  <div class="labgrid"><div class="stack"><div id="sbox"></div><div class="row"><button class="btn ghost sm" data-act="reset">Reset switch</button><span class="hint">Verify your work with <code>show vlan brief</code>, <code>show interfaces trunk</code> and <code>show ip interface brief</code>.</span></div></div>
  <aside class="stack"><section class="box"><h3 style="margin-bottom:8px">Objectives</h3><ul class="objs" id="objs"></ul></section>
  <section class="box"><h3 style="margin-bottom:8px">Topology</h3><pre class="ascii">            [ R1 ]  192.168.99.1
              | Gi0/1  trunk, native VLAN 99
           [ SW1 ]  mgmt SVI 192.168.99.2
     ________|____________________
    |              |              |
 Fa0/1-12      Fa0/13-20     Fa0/21-24
 VLAN 10       VLAN 20       unused:
 SALES         HR            shut down</pre></section></aside></div>`;
  const drawObjs=()=>{document.getElementById('objs').innerHTML=SW_OBJ.map(([t,f,h])=>`<li class="${f(s)?'done':''}"><span class="mk">${f(s)?'✓':'○'}</span><div><span class="t">${t}</span><details><summary class="hint">Hint</summary><code>${esc(h)}</code></details></div></li>`).join('');
    if(SW_OBJ.every(o=>o[1](s)))markLab('switch',{done:true})};
  const mount=()=>{makeTerm(document.getElementById('sbox'),{prompt:()=>swPrompt(s),banner:'Switch con0 is now available\n\nPress RETURN to get started.\n\n',onCmd:(l,p)=>{const out=swExec(s,l,p);drawObjs();return out}}).focus();drawObjs()};
  main.onclick=e=>{const a=e.target.closest('[data-act]');if(a&&a.dataset.act==='reset'){s=newSwitch();mount()}};
  mount();
};

/* ---------- firewall / ACL lab ---------- */
const ACLS=[
 {name:'Edge firewall: inbound to the screened subnet',intro:'This firewall filters traffic from the Internet into the screened subnet. Rules are checked top-down; the first match wins. Anything that matches no rule hits the implicit deny.',
  rules:[['deny','ip','192.0.2.0/24','any','any'],['allow','tcp','any','203.0.113.10','443'],['allow','tcp','any','203.0.113.10','80'],['allow','tcp','198.51.100.0/24','203.0.113.20','22'],['allow','udp','any','203.0.113.53','53']],
  packets:[['tcp','45.33.10.2','203.0.113.10',443],['tcp','192.0.2.77','203.0.113.10',443],['tcp','198.51.100.40','203.0.113.20',22],['tcp','45.33.10.2','203.0.113.20',22],['udp','8.8.4.4','203.0.113.53',53],['tcp','8.8.4.4','203.0.113.53',53],['icmp','45.33.10.2','203.0.113.10',null],['tcp','45.33.10.2','203.0.113.10',3389]],
  q:null},
 {name:'Internal ACL: guest VLAN and the database',intro:'Security asked to block the guest VLAN (10.10.50.0/24) from the SQL server at 10.10.5.10. A junior admin added rule 2 below. Evaluate the packets, then answer the question underneath.',
  rules:[['allow','ip','10.10.0.0/16','any','any'],['deny','tcp','10.10.50.0/24','10.10.5.10','1433'],['allow','udp','any','10.10.5.5','53']],
  packets:[['tcp','10.10.50.20','10.10.5.10',1433],['tcp','10.10.20.14','10.10.5.10',1433],['udp','172.16.4.9','10.10.5.5',53],['tcp','172.16.4.9','10.10.5.10',1433]],
  q:{text:'Why does the guest VLAN still reach the SQL server?',opts:['Rule 2 has the wrong port number','Rule 2 is shadowed: rule 1 already matches that traffic, so rule 2 is never reached. Move the specific deny above the broad allow.','ACLs only filter UDP','The implicit deny should be removed'],ans:1}}];
function inCidr(ip,c){if(c==='any')return true;const [n,b]=c.includes('/')?c.split('/'):[c,'32'];const m=maskInt(+b);return ((ip2int(ip)&m)>>>0)===((ip2int(n)&m)>>>0)}
function aclEval(rules,p){for(let k=0;k<rules.length;k++){const [act,pr,src,dst,port]=rules[k];if(pr!=='ip'&&pr!==p[0])continue;if(!inCidr(p[1],src)||!inCidr(p[2],dst))continue;if(port!=='any'&&(p[0]==='icmp'||+port!==p[3]))continue;return {act,rule:k+1}}return {act:'deny',rule:0}}
VIEWS['lab-acl']=function(el){
  let idx=0;
  function render(){const A=ACLS[idx];
    el.innerHTML=`${head('Lab · Lesson 19 · Obj 4.3','Firewall rule evaluation','For each packet, decide whether it is allowed and which rule decides it. This mirrors the performance-based questions where you read or fix a firewall table.')}
    <div class="tabs">${ACLS.map((a,k)=>`<button class="tab ${k===idx?'on':''}" data-x="${k}">${k+1}. ${a.name}</button>`).join('')}</div>
    <section class="stack"><p class="small">${A.intro}</p>
      <div class="tw"><table class="rules"><thead><tr><th>#</th><th>Action</th><th>Protocol</th><th>Source</th><th>Destination</th><th>Dest port</th></tr></thead><tbody>
      ${A.rules.map((r,k)=>`<tr><td>${k+1}</td><td class="${r[0]}">${r[0].toUpperCase()}</td><td>${r[1].toUpperCase()}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('')}
      <tr><td>—</td><td class="deny">DENY</td><td>ANY</td><td>any</td><td>any</td><td>any</td></tr></tbody></table></div>
      <p class="hint">The last row is the implicit deny at the end of every rule set.</p></section>
    <section class="box" style="margin-top:16px"><h3 style="margin-bottom:4px">Packets</h3>
      ${A.packets.map((p,k)=>`<div class="pk" id="pk${k}"><span class="desc">${p[0].toUpperCase()} ${p[1]} → ${p[2]}${p[3]!=null?':'+p[3]:''}</span>
        <span class="seg" data-pk="${k}"><button data-v="allow">Allow</button><button data-v="deny">Deny</button></span>
        <select class="inp" style="width:auto" id="rs${k}" aria-label="Matching rule for packet ${k+1}"><option value="">Matched by…</option>${A.rules.map((_,j)=>`<option value="${j+1}">Rule ${j+1}</option>`).join('')}<option value="0">Implicit deny</option></select><span class="res"></span></div>`).join('')}
      ${A.q?`<div class="stack" style="margin-top:16px"><h3>${A.q.text}</h3><div class="choices" id="aq">${A.q.opts.map((o,k)=>`<label><input type="radio" name="aq" value="${k}"><span>${esc(o)}</span></label>`).join('')}</div></div>`:''}
      <div class="row" style="margin-top:14px"><button class="btn" data-act="check">Check answers</button><span id="ascore" class="hint"></span></div></section>`;
  }
  const picks={};
  main.onclick=e=>{
    const x=e.target.closest('[data-x]');if(x){idx=+x.dataset.x;for(const k in picks)delete picks[k];return render()}
    const v=e.target.closest('[data-v]');if(v){const seg=v.parentElement;picks[seg.dataset.pk]=v.dataset.v;seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===v));return}
    const a=e.target.closest('[data-act]');if(a&&a.dataset.act==='check'){const A=ACLS[idx];let right=0,total=A.packets.length*2;
      A.packets.forEach((p,k)=>{const r=aclEval(A.rules,p),sel=document.getElementById('rs'+k).value;const okA=picks[k]===r.act,okR=sel!==''&&+sel===r.rule;right+=okA+okR;
        const row=document.getElementById('pk'+k);row.classList.toggle('ok',okA&&okR);row.classList.toggle('no',!(okA&&okR));
        const why=r.rule?`Rule ${r.rule} is the first match`+(idx===1&&k===0?' (the deny in rule 2 is never reached)':''):'No rule matches'+(p[0]==='icmp'?' (no rule allows ICMP)':p[0]==='tcp'&&p[3]===53?' (rule 5 allows only UDP 53; TCP 53 is used for zone transfers)':'')+', so the implicit deny drops it';
        row.querySelector('.res').innerHTML=`<span style="color:var(--${okA&&okR?'good':'bad'})">${okA&&okR?'✓':'✗'} ${r.act.toUpperCase()}.</span> <span class="muted">${why}.</span>`});
      if(A.q){total++;const c=el.querySelector('input[name=aq]:checked');el.querySelectorAll('#aq label').forEach((l,j)=>{l.classList.remove('right','wrong');if(j===A.q.ans)l.classList.add('right');else if(c&&+c.value===j)l.classList.add('wrong')});if(c&&+c.value===A.q.ans)right++}
      const pct=Math.round(right/total*100);document.getElementById('ascore').textContent=`${right} / ${total} correct (${pct}%)`;
      markLab('acl',L=>{const b=Object.assign({},L.by||{});b[idx]=Math.max(b[idx]||0,pct);const vals=ACLS.map((_,k)=>b[k]||0);return {by:b,best:Math.round(vals.reduce((x,y)=>x+y,0)/ACLS.length),done:vals.every(v=>v===100)}})}
  };
  render();
};

/* ---------- methodology lab ---------- */
const STEPS=['Identify the problem','Establish a theory of probable cause','Test the theory to determine the cause','Establish a plan of action and identify potential effects','Implement the solution or escalate as necessary','Verify full system functionality and implement preventive measures','Document findings, actions, outcomes and lessons learned'];
const ACTIONS=[['Ask the user what changed and when the problem started',0],['Try to reproduce the problem on another workstation',0],['Question the obvious and pick an approach: OSI top-to-bottom, bottom-to-top, or divide and conquer',1],['Swap the patch cable to see if the link comes up',2],['Schedule the switch replacement in the maintenance window and warn users who will be affected',3],['Replace the switch, or hand off to the network team if it\'s outside your access',4],['Confirm users can reach every service, and enable port monitoring to catch a repeat',5],['Record the root cause, fix and outcome in the ticket',6]];
VIEWS['lab-method']=function(el){
  let order=shuffle(STEPS.map((_,k)=>k));const acts=shuffle(ACTIONS);
  function render(){
    el.innerHTML=`${head('Lab · Lesson 21 · Obj 5.1','Troubleshooting methodology','Exam questions often describe an action and ask which step it belongs to, or what comes next. Know this cold.')}
    <div class="grid2"><section class="stack"><h3>Part 1: Put the steps in order</h3><ol class="order" id="ord">${order.map((k,p)=>`<li data-k="${k}"><span>${STEPS[k]}</span><button class="mv" data-up="${p}" aria-label="Move up" ${p===0?'disabled':''}>↑</button><button class="mv" data-dn="${p}" aria-label="Move down" ${p===order.length-1?'disabled':''}>↓</button></li>`).join('')}</ol></section>
    <section class="stack"><h3>Part 2: Which step is each action?</h3>${acts.map(([a],k)=>`<div class="field" id="ma${k}"><label for="sa${k}">${esc(a)}</label><select id="sa${k}"><option value="">Choose a step…</option>${STEPS.map((s,j)=>`<option value="${j}">${j+1}. ${s}</option>`).join('')}</select></div>`).join('')}</section></div>
    <div class="row" style="margin-top:16px"><button class="btn" data-act="check">Check both parts</button><button class="btn ghost" data-act="again">Shuffle again</button><span id="mscore" class="hint"></span></div>`;
  }
  main.onclick=e=>{
    const up=e.target.closest('[data-up]'),dn=e.target.closest('[data-dn]');
    if(up){const p=+up.dataset.up;[order[p-1],order[p]]=[order[p],order[p-1]];return render()}
    if(dn){const p=+dn.dataset.dn;[order[p+1],order[p]]=[order[p],order[p+1]];return render()}
    const a=e.target.closest('[data-act]');if(!a)return;
    if(a.dataset.act==='again'){order=shuffle(STEPS.map((_,k)=>k));return render()}
    if(a.dataset.act==='check'){let r1=0,r2=0;el.querySelectorAll('#ord li').forEach((li,p)=>{const ok=+li.dataset.k===p;li.classList.toggle('right',ok);li.classList.toggle('wrong',!ok);r1+=ok});
      acts.forEach(([t,ans],k)=>{const v=document.getElementById('sa'+k).value;const f=document.getElementById('ma'+k);const ok=v!==''&&+v===ans;f.classList.toggle('ok',ok);f.classList.toggle('no',!ok);f.querySelector('select').style.borderColor=ok?'var(--good)':'var(--bad)';r2+=ok});
      document.getElementById('mscore').textContent=`Order: ${r1}/7 · Actions: ${r2}/${acts.length}`;if(r1===7&&r2===acts.length)markLab('method',{done:true});}
  };
  render();
};



