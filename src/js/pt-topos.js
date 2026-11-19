/* Packet Tracer lab topologies and cabling, drawn with the same kit as the lesson diagrams.
   Each lab lists its devices and its links once; the diagram (with the port at both ends of every link)
   and the "How to cable it" table are both generated from that list, so they can never disagree. */
import {T,R,B,C,L,A,P,Z,SVG,FIG} from './lessons/svg.js';

/* ---------- devices ---------- */
const SIZE={rt:[22],sw:[84,30],pc:[70,30],srv:[90,30],wr:[140,44]};
const dev=(kind,x,y,name,o={})=>({kind,x,y,name,w:o.w||(SIZE[kind][0]),h:o.h||SIZE[kind][1],...o});
const drawDev=d=>{
  if(d.kind==='rt')return C(d.x,d.y,22,d.name,'dev','sm hd')+(d.under?T(d.x,d.y+35,d.under,'xs '+(d.underCls||'mo tm')):'');
  const base={sw:'d-sw',pc:'d-pc',srv:'d-srv',wr:'d-wl'}[d.kind];
  const cls=d.later==='bad'?'fb no':d.cls||base;
  const box=B(d.x-d.w/2,d.y-d.h/2,d.w,d.h,d.name,cls,d.kind==='sw'?'sm hd':'xs hd');
  const dash=d.later?`<rect x="${d.x-d.w/2}" y="${d.y-d.h/2}" width="${d.w}" height="${d.h}" rx="5" class="fn" style="stroke:#14171b;stroke-width:2;stroke-dasharray:3 4"/>`:'';
  return box+dash+(d.under?T(d.x,d.y+(d.h||44)/2+13,d.under,'xs '+(d.underCls||'mo tm')):'');
};
const edge=(d,ux,uy)=>{if(d.kind==='rt')return [d.x+ux*22,d.y+uy*22];const t=Math.min((d.w/2)/Math.abs(ux||1e-9),(d.h/2)/Math.abs(uy||1e-9));return [d.x+ux*t,d.y+uy*t]};

/* ---------- links ---------- */
const CABLE={st:'Copper Straight-Through',co:'Copper Cross-Over',con:'Console',wl:'Wireless (no cable)'};
const cw=s=>String(s).length*6.7;
/* full port names as Packet Tracer's port menu shows them */
const full=p=>p.replace(/ ?\.\d+ ?| \(trusted\)/g,'').trim().replace(/^Fa(?=\d)/,'FastEthernet').replace(/^Gi?(?=\d)/,'GigabitEthernet');
/* place a port label near one end of a link */
const portLabel=(x,y,ux,uy,s,where,dd)=>{
  if(!s)return '';
  if(where==='a'||where==='b'){const d=dd||cw(s)/2+7,px=x+ux*d,py=y+uy*d;return T(px,where==='b'?py+12:py-9,s,'xs mo ta')}
  const d=dd||16,px=x+ux*d,py=y+uy*d;return where==='r'?T(px+6,py,s,'xs mo ta','l'):T(px-6,py,s,'xs mo ta','r');
};
const drawLink=(D,[a,pa,b,pb,cable,o={}])=>{
  const A_=D[a],B_=D[b],sx=o.ap?o.ap[0]:A_.x,sy=o.ap?o.ap[1]:A_.y,ex=o.bp?o.bp[0]:B_.x,ey=o.bp?o.bp[1]:B_.y;
  const dx=ex-sx,dy=ey-sy,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;
  const [x1,y1]=o.ap||edge(A_,ux,uy),[x2,y2]=o.bp||edge(B_,-ux,-uy);
  const cls=o.cls||(o.trunk?'ac thick':cable==='wl'?'ac dash':o.later?(o.bad?'no dash':'dash'):'');
  const steep=Math.abs(ux)<0.6;
  return L(x1.toFixed(1),y1.toFixed(1),x2.toFixed(1),y2.toFixed(1),cls)+
    portLabel(x1,y1,ux,uy,pa,o.sa||(steep?'l':'a'),o.da)+portLabel(x2,y2,-ux,-uy,pb,o.sb||(steep?'l':'b'),o.db)+
    (o.mid?T((x1+x2)/2+(o.mx||0),(y1+y2)/2+(o.my??(steep?0:20)),o.mid,'xs '+(o.midCls||'tm'),o.ma||''):'');
};
const key=(x,y,wl)=>{const it=[[C(8,0,7,'','d-rt'),'router'],[R(-3,-7,22,14,'d-sw'),'switch'],[R(-3,-7,22,14,'d-pc'),'PC / host'],[R(-3,-7,22,14,'d-srv'),'server'],...(wl?[[R(-3,-7,22,14,'d-wl'),'wireless']]:[]),[L(-3,0,19,0,'ac thick'),'trunk'],[L(-3,0,19,0,'dash'),'later part'],[T(8,0,'Fa0','xs mo ta'),'port']];let cx=0;return `<g transform="translate(${x} ${y})">`+it.map(([g,t])=>{const o=`<g transform="translate(${cx} 0)">${g}${T(26,0,t,'xs tm','l')}</g>`;cx+=34+t.length*6.2;return o}).join('')+'</g>'};

const LABS={},ZONES={};
const lab=(slug,w,h,label,devs,links,extra,cap)=>{LABS[slug]={w,h,label,devs,links,extra,cap}};

/* 1 */
lab('pt-first-lan',640,300,'Lab 1 topology: three PCs on one switch, console cable from PC1',
 {PC1:dev('pc',110,75,'PC1',{under:'192.168.1.11'}),PC2:dev('pc',110,150,'PC2',{under:'192.168.1.12'}),PC3:dev('pc',110,225,'PC3',{under:'192.168.1.13'}),SW1:dev('sw',450,150,'SW1',{w:90,h:32,under:'VLAN 1: 192.168.1.2/24'})},
 [['PC1','Fa0','SW1','Fa0/1','st',{db:95}],['PC2','Fa0','SW1','Fa0/2','st',{db:95}],['PC3','Fa0','SW1','Fa0/3','st',{db:95}]],
 P('M110 60 L110 26 L450 26 L450 134','ac dash')+T(280,16,'Console cable','xs ta')+T(116,48,'RS 232','xs mo ta','l')+T(456,118,'Console','xs mo ta','l')+key(20,286),
 'One subnet, 192.168.1.0/24, so no gateway is needed. The console cable (PC1 RS 232 → SW1 Console) gives PC1 out-of-band access to SW1\'s CLI for Parts 4 and 5.');
LABS['pt-first-lan'].links.push(['PC1','RS 232','SW1','Console','con',{hide:1}]);

/* 2 */
lab('pt-static-routing',960,230,'Lab 2 topology: three routers in a line with a LAN at each end',
 {PCA:dev('pc',45,90,'PC-A',{w:62,under:'172.16.1.10'}),SWA:dev('sw',175,90,'SW-A',{w:76}),R1:dev('rt',310,90,'R1'),R2:dev('rt',490,90,'R2'),R3:dev('rt',670,90,'R3'),SWC:dev('sw',805,90,'SW-C',{w:76}),PCC:dev('pc',915,90,'PC-C',{w:62,under:'172.16.3.10'})},
 [['PCA','Fa0','SWA','Fa0/1','st'],['SWA','Gi0/1','R1','G0/0 .1','st'],['R1','G0/1 .1','R2','.2 G0/1','co',{mid:'10.0.12.0/30',my:34}],['R2','G0/2 .1','R3','.2 G0/1','co',{mid:'10.0.23.0/30',my:34}],['R3','G0/0 .1','SWC','Gi0/1','st'],['SWC','Fa0/1','PCC','Fa0','st']],
 T(480,176,'Router ↔ router: Copper Cross-Over. Everything else: Copper Straight-Through.','xs tm')+key(20,212),
 'Each router knows only its directly connected networks until you add static routes. The /30 links between routers have exactly two usable addresses, .1 and .2.');

/* 3 */
lab('pt-ospf',820,310,'Lab 3 topology: three routers in a triangle running OSPF area 0',
 {PCA:dev('pc',40,220,'PC-A',{w:62}),SWA:dev('sw',165,220,'SW-A',{w:76}),R1:dev('rt',300,220,'R1',{under:'RID 1.1.1.1',underCls:'tm'}),R2:dev('rt',410,80,'R2'),R3:dev('rt',520,220,'R3',{under:'RID 3.3.3.3',underCls:'tm'}),SWC:dev('sw',655,220,'SW-C',{w:76}),PCC:dev('pc',780,220,'PC-C',{w:62})},
 [['PCA','Fa0','SWA','Fa0/1','st'],['SWA','Gi0/1','R1','G0/0','st'],['R1','G0/1','R2','G0/1','co',{mid:'10.0.12.0/30',mx:-46,my:0,ma:'r'}],['R2','G0/2','R3','G0/1','co',{sa:'r',sb:'r',mid:'10.0.23.0/30',mx:46,my:0,ma:'l'}],['R1','G0/2','R3','G0/2','co',{trunk:1,cls:'ac thick',mid:'10.0.13.0/30 (new link)',midCls:'ta',my:26}],['R3','G0/0','SWC','Gi0/1','st'],['SWC','Fa0/1','PCC','Fa0','st']],
 T(410,42,'R2 · router ID 2.2.2.2 · Loopback0 2.2.2.2/32','xs')+key(20,292),
 'Starting from lab 2, you add the direct R1–R3 link (thick). OSPF picks it as the lowest-cost path between the two LANs, and fails over through R2 when it goes down.');

/* 4 */
lab('pt-nat',930,296,'Lab 4 topology: a private LAN behind R1 doing NAT, and an ISP router with outside hosts',
 {PC1:dev('pc',50,55,'PC1',{w:62,under:'192.168.1.11'}),PC2:dev('pc',50,135,'PC2',{w:62,under:'192.168.1.12'}),WEBIN:dev('srv',50,215,'Web-In',{w:76,under:'192.168.1.100'}),SW1:dev('sw',235,135,'SW1',{w:76}),R1:dev('rt',370,135,'R1'),ISP:dev('rt',600,135,'ISP'),SW2:dev('sw',735,135,'SW2',{w:76}),WEBOUT:dev('srv',868,58,'Web-Out',{w:84}),PCOUT:dev('pc',868,214,'PC-Out',{w:72,under:'198.51.100.20'})},
 [['PC1','Fa0','SW1','Fa0/1','st',{db:40}],['PC2','Fa0','SW1','Fa0/2','st'],['WEBIN','Fa0','SW1','Fa0/3','st',{db:40}],['SW1','Gi0/1','R1','G0/0 .1','st'],['R1','G0/1 .2','ISP','.1 G0/1','co',{mid:'203.0.113.0/29',my:-24}],['ISP','G0/0 .1','SW2','Gi0/1','st'],['SW2','Fa0/1','WEBOUT','Fa0','st',{sa:'l',sb:'l',da:20,db:16}],['SW2','Fa0/2','PCOUT','Fa0','st',{sa:'l',sb:'l',da:20,db:16}]],
 T(868,34,'198.51.100.10','xs mo tm')+T(370,182,'NAT: G0/0 inside, G0/1 outside','xs ta')+key(20,282),
 'R1 translates the private 192.168.1.0/24 hosts to its public address 203.0.113.2 (PAT). The ISP router has no route to 192.168.1.0/24, just like a real ISP.');

/* 5 */
lab('pt-services',720,320,'Lab 5 topology: two PCs and two servers on one switch behind R1',
 {PC1:dev('pc',250,45,'PC1',{w:100}),PC2:dev('pc',250,120,'PC2',{w:100}),CORE:dev('srv',250,195,'Server-Core',{w:100}),WEB:dev('srv',250,270,'Server-Web',{w:100}),SW1:dev('sw',480,157,'SW1',{w:76}),R1:dev('rt',640,157,'R1',{under:'192.168.1.1'})},
 [['PC1','Fa0','SW1','Fa0/1','st',{da:36,db:70}],['PC2','Fa0','SW1','Fa0/2','st',{da:22,db:70}],['CORE','Fa0','SW1','Fa0/3','st',{da:22,db:70}],['WEB','Fa0','SW1','Fa0/4','st',{da:22,db:70}],['SW1','Gi0/1','R1','G0/0','st']],
 T(190,45,'DHCP client','xs tm','r')+T(190,120,'DHCP client','xs tm','r')+T(190,195,'192.168.1.10\nDNS, NTP, Syslog','xs mo tm','r')+T(190,270,'192.168.1.20\nHTTP','xs mo tm','r')+T(640,232,'DHCP server,\nNTP & syslog client,\nSNMP agent','xs ta'),
 'Everything is on 192.168.1.0/24. R1 hands out DHCP leases and points clients at Server-Core for DNS. Parts 4 and 5 (after Lesson 20) send R1\'s logs and SNMP data to the servers.');

/* 6 */
const v=(n)=>n==='10'?{cls:'v10',underCls:'hd ta'}:{cls:'v20',underCls:'hd tk'};
lab('pt-vlans',680,290,'Lab 6 topology: two switches joined by an 802.1Q trunk, two VLANs on each',
 {SW1:dev('sw',180,90,'SW1'),SW2:dev('sw',500,90,'SW2'),PC1:dev('pc',90,210,'PC1',{w:62,under:'VLAN 10',...v('10')}),PC2:dev('pc',260,210,'PC2',{w:62,under:'VLAN 20',...v('20')}),PC3:dev('pc',420,210,'PC3',{w:62,under:'VLAN 10',...v('10')}),PC4:dev('pc',590,210,'PC4',{w:62,under:'VLAN 20',...v('20')})},
 [['SW1','Gi0/1','SW2','Gi0/1','co',{trunk:1,sa:'b',sb:'b',mid:'802.1Q trunk · native 99 · allowed 10, 20, 99',midCls:'ta',my:-14}],
  ['SW1','Fa0/1','PC1','Fa0','st',{ap:[160,105],sa:'l',sb:'l',da:22,db:22}],['SW1','Fa0/11','PC2','Fa0','st',{ap:[200,105],sa:'r',sb:'r',da:22,db:22}],['SW2','Fa0/1','PC3','Fa0','st',{ap:[480,105],sa:'l',sb:'l',da:22,db:22}],['SW2','Fa0/11','PC4','Fa0','st',{ap:[520,105],sa:'r',sb:'r',da:22,db:22}]],
 T(180,46,'SVI VLAN 99: 192.168.99.2','xs mo tm')+T(500,46,'SVI VLAN 99: 192.168.99.3','xs mo tm')+
 [[90,'192.168.10.11'],[260,'192.168.20.11'],[420,'192.168.10.12'],[590,'192.168.20.12']].map(([x,a])=>T(x,252,a,'xs mo tm')).join('')+key(20,276),
 'PCs in the same VLAN reach each other across the trunk; PCs in different VLANs can\'t, because there is no router yet. Blue = VLAN 10 (SALES), pink = VLAN 20 (HR).');

/* 7 and 12 share the same network */
const ivDevs=(server)=>({R1:dev('rt',220,52,'R1'),SW1:dev('sw',220,155,'SW1'),SW2:dev('sw',540,155,'SW2'),PC1:dev('pc',80,265,'PC1',{w:62,under:'VLAN 10',...v('10')}),PC2:dev('pc',200,265,'PC2',{w:62,under:'VLAN 20',...v('20')}),
 ...(server?{SRV:dev('srv',335,265,'Server-DHCP',{w:96,later:1,under:'Part 4 · VLAN 99 · .10',underCls:'tm'})}:{}),PC3:dev('pc',480,265,'PC3',{w:62,under:'VLAN 10',...v('10')}),PC4:dev('pc',610,265,'PC4',{w:62,under:'VLAN 20',...v('20')})});
const fan=(x,y)=>({ap:[x,y],da:24,db:22});
const ivLinks=(server)=>[['R1','G0/0','SW1','Gi0/2','st',{trunk:1,sa:'r',sb:'r'}],['SW1','Gi0/1','SW2','Gi0/1','co',{trunk:1,sa:'a',sb:'a'}],['SW1','Fa0/1','PC1','Fa0','st',{...fan(190,170),sa:'l',sb:'l'}],['SW1','Fa0/11','PC2','Fa0','st',{...fan(210,170),sa:'r',sb:'l',da:30}],
 ...(server?[['SW1','Fa0/24','SRV','Fa0','st',{later:'Part 4',...fan(245,170),sa:'r',sb:'r',da:48}]]:[]),['SW2','Fa0/1','PC3','Fa0','st',{...fan(525,170),sa:'l',sb:'l'}],['SW2','Fa0/11','PC4','Fa0','st',{...fan(555,170),sa:'r',sb:'r'}]];
lab('pt-intervlan-dhcp',700,340,'Lab 7 topology: router on a stick added to the lab 6 switches',ivDevs(true),ivLinks(true),
 T(262,52,'G0/0.10  192.168.10.1  (VLAN 10)\nG0/0.20  192.168.20.1  (VLAN 20)\nG0/0.99  192.168.99.1  (VLAN 99, native)','xs mo','l')+key(20,326),
 'One physical link from R1 G0/0 to SW1 Gi0/2 carries all three VLANs as a trunk. Each subinterface is the default gateway for its VLAN. Server-DHCP (dashed) arrives in Part 4.');
lab('pt-break-fix',700,340,'Lab 12 topology: the lab 7 network you troubleshoot',ivDevs(false),ivLinks(false),
 T(262,52,'G0/0.10 · .20 · .99 = VLAN gateways\nDHCP from R1 (or relay to Server-DHCP)','xs mo','l')+key(20,326),
 'Same network as lab 7. Each ticket breaks one thing on it; work out where from the symptom before you open the answer.');

/* 8 */
lab('pt-ipv6',780,240,'Lab 8 topology: dual-stack router between two LANs',
 {PC1:dev('pc',45,110,'PC1',{w:62,under:'SLAAC',underCls:'tm'}),SW1:dev('sw',190,110,'SW1',{w:76}),R1:dev('rt',390,110,'R1'),SW2:dev('sw',590,110,'SW2',{w:76}),PC2:dev('pc',735,110,'PC2',{w:62,under:'SLAAC',underCls:'tm'})},
 [['PC1','Fa0','SW1','Fa0/1','st'],['SW1','Gi0/1','R1','G0/0','st',{mid:'2001:db8:acad:10::/64\n192.168.10.0/24',midCls:'mo',my:44}],['R1','G0/1','SW2','Gi0/1','st',{mid:'2001:db8:acad:20::/64\n192.168.20.0/24',midCls:'mo',my:44}],['SW2','Fa0/1','PC2','Fa0','st']],
 T(390,56,'ipv6 unicast-routing: R1 sends Router Advertisements\nlink-local fe80::1 on both interfaces','xs ta')+T(390,210,'Both IPv4 and IPv6 run on every link (dual stack).','xs tm'),
 'R1 advertises each /64 prefix in Router Advertisements, so the PCs build their own global addresses with SLAAC. IPv4 runs alongside on the same links.');

/* 9 */
lab('pt-wireless',680,348,'Lab 9 topology: WRT300N wireless router with wired and wireless clients',
 {WRT:dev('wr',330,70,'WRT300N\n192.168.0.1'),PCW:dev('pc',130,215,'PC-Wired',{w:84,under:'DHCP 192.168.0.100+'}),AAA:dev('srv',310,280,'Server-AAA',{w:96,later:1,under:'stretch goal · 192.168.0.10',underCls:'tm'}),LAP:dev('pc',470,215,'Laptop',{w:74,under:'WPC300N card',underCls:'tm'}),TAB:dev('pc',600,215,'Tablet',{w:74,under:'Wi-Fi only',underCls:'tm'})},
 [['WRT','Ethernet 1','PCW','Fa0','st',{ap:[285,92],sa:'l',sb:'l',da:34,db:20}],['WRT','Ethernet 2','AAA','Fa0','st',{later:'stretch goal',ap:[320,92],sa:'r',sb:'r',da:60,db:20}],['WRT','','LAP','Wireless0','wl',{ap:[370,92],sb:'r',db:24}],['WRT','','TAB','Wireless0','wl',{ap:[395,92],sb:'r',db:30}]],
 [0,1,2].map(i=>P(`M${406+i*10} ${58-i*5} Q${416+i*12} 70 ${406+i*10} ${82+i*5}`,'ac')).join('')+T(450,60,'SSID LabNet · channel 6\nWPA2-Personal (AES)','xs ta','l')+T(560,338,'dashed blue = Wi-Fi association','xs tm'),
 'The WRT300N is router, switch, DHCP server and access point in one, like a home router. Clients associate over WPA2 and lease addresses from 192.168.0.100 upward.');

/* 10 */
lab('pt-acl',720,314,'Lab 10 topology: R1 with inside, guest and screened-subnet networks',
 {R1:dev('rt',110,164,'R1'),SWIN:dev('sw',340,74,'SW-IN',{w:84}),SWG:dev('sw',340,164,'SW-GUEST',{w:100}),SWS:dev('sw',340,254,'SW-SCR',{w:84}),
  STAFF:dev('pc',560,49,'PC-Staff',{w:90}),HR:dev('srv',560,104,'Server-HR',{w:90}),GUEST:dev('pc',560,164,'PC-Guest',{w:90}),WEB:dev('srv',560,254,'Server-Web',{w:90})},
 [['R1','G0/0 .1','SWIN','Gi0/1','st',{da:70}],['R1','G0/1 .1','SWG','Gi0/1','st',{da:70}],['R1','G0/2 .1','SWS','Gi0/1','st',{da:70}],['SWIN','Fa0/1','STAFF','Fa0','st',{ap:[382,66],sb:'a'}],['SWIN','Fa0/2','HR','Fa0','st',{ap:[382,82],sa:'b'}],['SWG','Fa0/1','GUEST','Fa0','st'],['SWS','Fa0/1','WEB','Fa0','st']],
 
 T(615,49,'.10','xs mo tm','l')+T(615,104,'.100','xs mo tm','l')+T(615,164,'.10','xs mo tm','l')+T(615,254,'.10','xs mo tm','l')+
 T(110,236,'ACLs, inbound:\nG0/1 GUEST-IN\nG0/2 SCREENED-IN','xs tb'),
 'R1 routes between three networks. The ACLs (red) are applied inbound on the interfaces where guest and screened-subnet traffic enters, as close to the source as possible.');

/* 11 */
lab('pt-switch-security',700,360,'Lab 11 topology: SW1 with PCs, a rogue DHCP server, a rogue switch and an attacker laptop',
 {R1:dev('rt',330,45,'R1'),SW1:dev('sw',330,155,'SW1',{w:100,h:32}),PC1:dev('pc',100,265,'PC1',{w:62}),PC2:dev('pc',240,265,'PC2',{w:62}),ROGSW:dev('sw',430,265,'SW-Rogue',{w:90,later:'bad',under:'Part 4 · BPDU Guard',underCls:'tb'}),ROGDHCP:dev('srv',590,265,'Rogue-DHCP',{w:100,later:'bad',under:'Part 2 · 192.168.10.250',underCls:'tb'}),ATT:dev('pc',100,335,'Attacker',{w:80,later:'bad'})},
 [['R1','G0/0','SW1','Gi0/1 (trusted)','st',{cls:'ok thick',sa:'r',sb:'r'}],['SW1','Fa0/1','PC1','Fa0','st',{...fan(290,171),sa:'l',sb:'l'}],['SW1','Fa0/2','PC2','Fa0','st',{...fan(312,171),sa:'l',sb:'l',da:40}],['SW1','Fa0/3','ROGSW','Gi0/1','co',{later:'Part 4',bad:1,...fan(350,171),sa:'r',sb:'r'}],['SW1','Fa0/5','ROGDHCP','Fa0','st',{later:'Part 2',bad:1,...fan(368,171),sa:'r',sb:'a',da:40}]],
 T(362,40,'G0/0 192.168.10.1 · legitimate DHCP','xs','l')+T(390,155,'all user ports in VLAN 10','xs tm','l')+
 A(100,318,100,282,'no dash')+T(150,335,'Part 3: Attacker (Fa0) plugs into SW1 Fa0/1 in place of PC1','xs tb','l'),
 'PC1 and PC2 use DHCP. The only trusted port is the uplink to R1, so DHCP snooping drops offers from Rogue-DHCP. Red dashed devices are the attacks you add in Parts 2–4.');
LABS['pt-switch-security'].links.push(['ATT','Fa0','SW1','Fa0/1','st',{hide:1,note:'Part 3, after removing PC1\'s cable'}]);

/* 13 */
lab('pt-capstone',800,350,'Lab 13 suggested topology: R1 with two floor switches and an ISP link',
 {R1:dev('rt',240,55,'R1'),ISP:dev('rt',490,55,'ISP'),WEB:dev('srv',680,55,'Web server',{w:96,under:'198.51.100.10'}),SWF1:dev('sw',240,165,'SW-F1',{w:84}),SWF2:dev('sw',560,165,'SW-F2',{w:84}),
  S1:dev('pc',110,280,'Staff',{w:70,under:'VLAN 10',underCls:'tm'}),G1:dev('pc',240,280,'Guest',{w:70,under:'VLAN 20',underCls:'tm'}),D1:dev('srv',360,280,'DNS + web',{w:90,under:'VLAN 30',underCls:'tm'}),
  S2:dev('pc',472,280,'Staff',{w:70,under:'VLAN 10',underCls:'tm'}),G2:dev('pc',575,280,'Guest',{w:70,under:'VLAN 20',underCls:'tm'}),AD:dev('pc',690,280,'Admin PC',{w:76,under:'VLAN 99',underCls:'tm'})},
 [['R1','G0/1 .2','ISP','.1 G0/1','co',{mid:'203.0.113.0/30'}],['ISP','G0/0','WEB','Fa0','co'],['R1','G0/0','SWF1','Gi0/1','st',{trunk:1,sa:'r',sb:'r'}],['SWF1','Gi0/2','SWF2','Gi0/1','co',{trunk:1,sa:'a',sb:'a'}],
  ['SWF1','Fa0/1','S1','Fa0','st',{...fan(212,180),sa:'l',sb:'l'}],['SWF1','Fa0/11','G1','Fa0','st',{...fan(240,180),sa:'l',sb:'l',da:40}],['SWF1','Fa0/21','D1','Fa0','st',{...fan(268,180),sa:'r',sb:'r'}],['SWF2','Fa0/1','S2','Fa0','st',{...fan(532,180),sa:'l',sb:'l'}],['SWF2','Fa0/11','G2','Fa0','st',{...fan(560,180),sa:'l',sb:'l',da:40}],['SWF2','Fa0/24','AD','Fa0','st',{...fan(588,180),sa:'r',sb:'r'}]],
 T(20,20,'10.20.0.0/22 inside','xs hd','l')+T(170,108,'trunk: VLANs\n10, 20, 30, 99','xs ta','r')+
 T(400,336,'A suggested layout. You plan the addressing; a few hosts per VLAN are enough to test every requirement.','xs tm'),
 'One router does router-on-a-stick for all four VLANs and PAT to the ISP. Both floor switches carry Staff and Guest; the servers sit in VLAN 30 and management in VLAN 99.');


/* zones: tinted, labelled boundaries drawn behind each topology */
Object.assign(ZONES,{
 'pt-first-lan':Z(30,42,520,226,'LAN 192.168.1.0/24','blue','br'),
 'pt-static-routing':Z(6,48,214,94,'LAN A 172.16.1.0/24','blue')+Z(740,48,214,94,'LAN C 172.16.3.0/24','green','tr')+Z(276,48,428,94,'Router links (/30)','grey'),
 'pt-ospf':Z(4,14,812,262,'OSPF area 0','amber','tr')+Z(10,174,214,84,'LAN A 172.16.1.0/24','blue','bl')+Z(596,174,214,84,'LAN C 172.16.3.0/24','green','bl'),
 'pt-nat':Z(4,12,476,252,'Inside (private) 192.168.1.0/24','blue','tl')+Z(490,12,436,252,'Outside (public) 198.51.100.0/24','grey','bl'),
 'pt-services':Z(4,8,710,300,'LAN 192.168.1.0/24','blue','tr'),
 'pt-ipv6':Z(6,74,232,96,'LAN 1','blue')+Z(542,74,232,96,'LAN 2','green','tr'),
 'pt-wireless':Z(40,22,632,302,'SOHO network 192.168.0.0/24','purple','tr'),
 'pt-acl':Z(284,8,430,114,'Inside 192.168.10.0/24','blue','tr')+Z(284,130,430,72,'Guest 192.168.50.0/24','purple','tr')+Z(284,212,430,80,'Screened subnet 172.16.100.0/24','amber','tr'),
 'pt-switch-security':Z(40,118,620,232,'VLAN 10 · 192.168.10.0/24','blue','tr'),
 'pt-capstone':Z(56,134,360,190,'Floor 1','teal')+Z(424,134,316,190,'Floor 2','teal','tr')+Z(452,22,290,84,'ISP / Internet','grey','tr'),
});

/* ---------- output ---------- */
export const TOPOS={},CABLING={};
for(const [slug,o] of Object.entries(LABS)){
  const body=(ZONES[slug]||'')+o.links.filter(l=>!(l[5]||{}).hide).map(l=>drawLink(o.devs,l)).join('')+Object.values(o.devs).map(drawDev).join('')+o.extra;
  TOPOS[slug]=FIG(SVG(o.w,o.h,o.label,body),o.cap);
  CABLING[slug]=o.links.map(([a,pa,b,pb,c,x={}])=>({from:o.devs[a].name.split('\n')[0],fp:full(pa)||'Wi-Fi radio',to:o.devs[b].name.split('\n')[0],tp:full(pb)||'Wi-Fi radio',cable:CABLE[c],note:x.note||(x.later?(typeof x.later==='string'?x.later:'added in a later part'):'')+(x.trunk?'trunk':'')}));
}
/* lab 7 adds R1 and Server-DHCP to the lab 6 network */
CABLING['pt-intervlan-dhcp']=CABLING['pt-intervlan-dhcp'].map(l=>l.from==='R1'||l.to==='Server-DHCP'?l:{...l,note:'already cabled in lab 6'});
/* lab 3 adds one cable to the lab 2 network */
CABLING['pt-ospf']=CABLING['pt-ospf'].filter(l=>l.fp==='GigabitEthernet0/2'&&l.tp==='GigabitEthernet0/2').map(l=>({...l,note:'new link; everything else is already cabled from lab 2'}));
