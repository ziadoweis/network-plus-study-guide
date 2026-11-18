/* Packet Tracer lab topologies, drawn with the same kit as the lesson diagrams.
   Routers = circles, switches = wide boxes, PCs = small boxes, servers = green boxes. Interface names are blue. */
import {T,R,B,C,E,L,A,AA,P,SVG,FIG} from './lessons/svg.js';

const rt=(x,y,s,r=22)=>C(x,y,r,s,'dev','sm hd');
const sw=(x,y,s,w=84,h=30)=>B(x-w/2,y-h/2,w,h,s,'dev','sm hd');
const pc=(x,y,s,w=70,h=30,c='dev')=>B(x-w/2,y-h/2,w,h,s,c,'xs hd');
const srv=(x,y,s,w=86,h=30)=>pc(x,y,s,w,h,'fg ok');
const add=(x,y,s,w=86,h=30,c='fn')=>B(x-w/2,y-h/2,w,h,'',c)+`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="4" class="fn" style="stroke-dasharray:4 3"/>`+T(x,y,s,'xs hd');
const ifl=(x,y,s,a='')=>T(x,y,s,'xs mo ta',a);
const sub=(x,y,s,a='')=>T(x,y,s,'xs tm',a);
const ip=(x,y,s,a='')=>T(x,y,s,'xs mo tm',a);
const key=(x,y)=>`<g transform="translate(${x} ${y})">${C(8,0,7,'','dev')}${T(20,0,'router','xs tm','l')}${R(66,-7,22,14,'dev')}${T(94,0,'switch','xs tm','l')}${R(142,-7,22,14,'dev')}${T(170,0,'PC','xs tm','l')}${R(196,-7,22,14,'fg ok')}${T(224,0,'server','xs tm','l')}${L(268,0,292,0,'ac thick')}${T(298,0,'trunk / key link','xs tm','l')}</g>`;
const fig=(w,h,label,body,cap)=>FIG(SVG(w,h,label,body),cap);

export const TOPOS={
/* 1 */
'pt-first-lan':fig(620,280,'Lab 1 topology: three PCs on one switch, console cable from PC1',
  P('M110 55 L110 26 L420 26 L420 124','ac dash')+T(265,16,'Console cable: PC1 RS 232 → SW1 Console','xs ta')+
  [[70,'PC1','192.168.1.11',1],[140,'PC2','192.168.1.12',2],[210,'PC3','192.168.1.13',3]].map(([y,n,a,k])=>L(146,y,375,140)+pc(110,y,n)+ip(110,y+25,a)+ifl(152,y-9,'Fa0','l')+ifl(300,y+(140-y)*0.672-9,'Fa0/'+k)).join('')+
  sw(420,140,'SW1',90,32)+ip(420,170,'VLAN 1: 192.168.1.2/24')+sub(420,186,'2960 · 192.168.1.0/24')+key(20,262),
  'One subnet, 192.168.1.0/24, so no gateway is needed. The console cable gives PC1 out-of-band access to SW1\'s CLI for Parts 4 and 5.'),
/* 2 */
'pt-static-routing':fig(820,210,'Lab 2 topology: three routers in a line with a LAN at each end',
  L(78,90,112,90)+L(188,90,228,90)+L(272,90,388,90)+L(432,90,548,90)+L(592,90,632,90)+L(708,90,732,90)+
  pc(45,90,'PC-A',62)+ip(45,115,'172.16.1.10')+sw(150,90,'SW-A',76)+rt(250,90,'R1')+rt(410,90,'R2')+rt(570,90,'R3')+sw(670,90,'SW-C',76)+pc(762,90,'PC-C',62)+ip(762,115,'172.16.3.10')+
  ifl(226,72,'.1 G0/0','r')+ifl(274,72,'G0/1 .1','l')+ifl(386,72,'.2 G0/1','r')+ifl(434,72,'G0/2 .1','l')+ifl(546,72,'.2 G0/1','r')+ifl(594,72,'G0/0 .1','l')+
  sub(330,108,'10.0.12.0/30')+sub(490,108,'10.0.23.0/30')+T(150,140,'LAN 172.16.1.0/24','xs')+T(670,140,'LAN 172.16.3.0/24','xs')+
  sub(400,166,'Router ↔ router links: Copper Cross-Over. Everything else: Copper Straight-Through.')+key(20,192),
  'Each router knows only its directly connected networks until you add static routes. The /30 links between routers have exactly two usable addresses, .1 and .2.'),
/* 3 */
'pt-ospf':fig(660,290,'Lab 3 topology: three routers in a triangle running OSPF area 0',
  L(232,190,302,92)+L(338,92,408,190)+L(232,206,408,206,'ac thick')+L(69,206,115,206)+L(185,206,188,206)+L(452,206,495,206)+L(565,206,593,206)+
  pc(40,206,'PC-A',58)+sw(150,206,'SW-A',70)+rt(210,206,'R1')+rt(320,70,'R2')+rt(430,206,'R3')+sw(530,206,'SW-C',70)+pc(622,206,'PC-C',58)+
  T(320,30,'R2 · router ID 2.2.2.2 · Loopback0 2.2.2.2/32','xs')+
  ifl(246,148,'G0/1','r')+ifl(292,108,'G0/1','r')+ifl(348,108,'G0/2','l')+ifl(394,148,'G0/1','l')+ifl(236,194,'G0/2','l')+ifl(404,194,'G0/2','r')+
  sub(232,124,'10.0.12.0/30','r')+sub(408,124,'10.0.23.0/30','l')+T(320,222,'10.0.13.0/30 (new link)','xs ta')+
  sub(210,240,'RID 1.1.1.1')+sub(430,240,'RID 3.3.3.3')+sub(130,240,'172.16.1.0/24')+sub(560,240,'172.16.3.0/24')+T(20,20,'OSPF area 0','xs hd ta','l')+key(20,272),
  'Starting from lab 2, you add the direct R1–R3 link. OSPF picks it as the lowest-cost path between the two LANs, and fails over through R2 when it goes down.'),
/* 4 */
'pt-nat':fig(830,270,'Lab 4 topology: a private LAN behind R1 doing NAT, and an ISP router with outside hosts',
  L(415,20,415,228,'dash')+T(200,16,'Inside (private)','xs hd tm')+T(630,16,'Outside (the Internet)','xs hd tm')+
  L(88,60,130,120)+L(88,130,130,130)+L(96,200,130,140)+L(212,130,268,130)+L(312,130,508,130,'thick')+L(552,130,608,130)+L(692,124,724,90)+L(692,136,724,170)+
  pc(55,60,'PC1',62)+ip(55,85,'192.168.1.11')+pc(55,130,'PC2',62)+ip(55,155,'192.168.1.12')+srv(55,200,'Web-In',78)+ip(55,225,'192.168.1.100')+
  sw(170,130,'SW1',76)+sub(170,160,'192.168.1.0/24')+rt(290,130,'R1')+T(290,172,'NAT: G0/0 inside,\nG0/1 outside','xs ta')+
  rt(530,130,'ISP')+sw(650,130,'SW2',76)+sub(650,160,'198.51.100.0/24')+srv(770,90,'Web-Out',84)+ip(770,115,'198.51.100.10')+pc(770,170,'PC-Out',70)+ip(770,195,'198.51.100.20')+
  ifl(266,112,'.1 G0/0','r')+ifl(316,112,'G0/1 .2','l')+ifl(506,112,'.1 G0/1','r')+ifl(556,112,'G0/0 .1','l')+sub(410,148,'203.0.113.0/29')+key(20,252),
  'R1 translates the private 192.168.1.0/24 hosts to its public address 203.0.113.2 (PAT). The ISP router has no route to 192.168.1.0/24, just like a real ISP.'),
/* 5 */
'pt-services':fig(600,320,'Lab 5 topology: two PCs and two servers on one switch behind R1',
  [45,115,185,255].map(y=>L(188,y,272,150)).join('')+L(348,150,428,150)+
  pc(140,45,'PC1',80)+ip(140,70,'DHCP')+pc(140,115,'PC2',80)+ip(140,140,'DHCP')+
  srv(140,185,'Server-Core',96)+ip(140,210,'192.168.1.10 · DNS, NTP, Syslog')+srv(140,255,'Server-Web',96)+ip(140,280,'192.168.1.20 · HTTP')+
  sw(310,150,'SW1',76)+rt(450,150,'R1')+ifl(426,134,'G0/0','r')+ip(450,184,'192.168.1.1')+T(450,226,'DHCP server,\nNTP & syslog client,\nSNMP agent','xs ta'),
  'Everything is on 192.168.1.0/24. R1 hands out DHCP leases and points clients at Server-Core for DNS. Parts 4 and 5 (after Lesson 20) send R1\'s logs and SNMP data to the servers.'),
/* 6 */
'pt-vlans':fig(660,280,'Lab 6 topology: two switches joined by an 802.1Q trunk, two VLANs on each',
  L(214,90,436,90,'ac thick')+T(325,72,'802.1Q trunk · native 99 · allowed 10, 20, 99','xs ta')+ifl(220,104,'Gi0/1','l')+ifl(430,104,'Gi0/1','r')+
  [[170,95,'PC1','10','192.168.10.11','Fa0/1'],[170,245,'PC2','20','192.168.20.11','Fa0/11'],[480,415,'PC3','10','192.168.10.12','Fa0/1'],[480,565,'PC4','20','192.168.20.12','Fa0/11']].map(([s,x,n,v,a,port])=>
    L(s,105,x,186)+ifl((s*0.7+x*0.3),132,port,x<s?'r':'l')+pc(x,200,n,62,28,v==='10'?'fa ac':'fg ok')+T(x,228,'VLAN '+v,'xs hd '+(v==='10'?'ta':'tg'))+ip(x,244,a)).join('')+
  sw(170,90,'SW1',84)+sw(480,90,'SW2',84)+ip(150,50,'SVI VLAN 99: 192.168.99.2')+ip(500,50,'SVI VLAN 99: 192.168.99.3')+key(20,266),
  'PCs in the same VLAN reach each other across the trunk; PCs in different VLANs can\'t, because there is no router yet. Blue = VLAN 10 (SALES), green = VLAN 20 (HR).'),
/* 7 */
'pt-intervlan-dhcp':fig(680,320,'Lab 7 topology: router on a stick added to the lab 6 switches',
  L(340,70,232,137,'ac thick')+L(262,150,458,150,'ac thick')+ifl(352,98,'G0/0','l')+ifl(226,120,'Gi0/2','r')+ifl(268,164,'Gi0/1','l')+ifl(452,164,'Gi0/1','r')+
  T(372,30,'G0/0.10  192.168.10.1  (VLAN 10)\nG0/0.20  192.168.20.1  (VLAN 20)\nG0/0.99  192.168.99.1  (VLAN 99, native)','xs mo','l')+
  [[220,90,'PC1','10'],[220,200,'PC2','20'],[500,440,'PC3','10'],[500,560,'PC4','20']].map(([s,x,n,v])=>L(s,165,x,250)+pc(x,264,n,62,28,v==='10'?'fa ac':'fg ok')+T(x,292,'VLAN '+v,'xs hd '+(v==='10'?'ta':'tg'))).join('')+
  L(220,165,320,250,'dash')+add(320,264,'Server-DHCP',92)+T(320,292,'Part 4 · Fa0/24\nVLAN 99 · .10','xs tm')+
  rt(340,52,'R1')+sw(220,150,'SW1',84)+sw(500,150,'SW2',84),
  'One physical link from R1 G0/0 to SW1 Gi0/2 carries all three VLANs as a trunk. Each subinterface is the default gateway for its VLAN. Server-DHCP (dashed) arrives in Part 4.'),
/* 8 */
'pt-ipv6':fig(720,230,'Lab 8 topology: dual-stack router between two LANs',
  L(82,100,128,100)+L(212,100,338,100)+L(382,100,508,100)+L(592,100,638,100)+
  pc(50,100,'PC1',62)+sub(50,126,'SLAAC')+sw(170,100,'SW1',76)+rt(360,100,'R1')+sw(550,100,'SW2',76)+pc(670,100,'PC2',62)+sub(670,126,'SLAAC')+
  ifl(336,84,'G0/0','r')+ifl(384,84,'G0/1','l')+T(360,52,'ipv6 unicast-routing: R1 sends Router Advertisements\nlink-local fe80::1 on both interfaces','xs ta')+
  T(250,150,'2001:db8:acad:10::/64\n192.168.10.0/24','xs mo')+T(470,150,'2001:db8:acad:20::/64\n192.168.20.0/24','xs mo')+
  sub(360,206,'Both IPv4 and IPv6 run on every link (dual stack).'),
  'R1 advertises each /64 prefix in Router Advertisements, so the PCs build their own global addresses with SLAAC. IPv4 runs alongside on the same links.'),
/* 9 */
'pt-wireless':fig(660,320,'Lab 9 topology: WRT300N wireless router with wired and wireless clients',
  B(260,50,140,44,'WRT300N\n192.168.0.1','fa ac','xs hd')+[0,1,2].map(i=>P(`M${406+i*10} ${60-i*5} Q${416+i*12} 72 ${406+i*10} ${84+i*5}`,'ac')).join('')+
  T(450,62,'SSID LabNet · channel 6\nWPA2-Personal (AES)','xs ta','l')+
  L(280,94,140,186)+ifl(196,130,'Ethernet 1','r')+pc(130,200,'PC-Wired',84)+ip(130,226,'DHCP 192.168.0.100+')+
  L(310,94,290,256,'dash')+ifl(306,190,'Ethernet 2','l')+add(290,270,'Server-AAA',92)+sub(290,296,'stretch goal · 192.168.0.10')+
  L(370,94,430,186,'ac dash')+L(380,94,560,186,'ac dash')+pc(430,200,'Laptop',74)+sub(430,226,'WPC300N card')+pc(560,200,'Tablet',74)+sub(560,226,'Wi-Fi only')+
  sub(495,252,'dashed blue = wireless association'),
  'The WRT300N is router, switch, DHCP server and access point in one, like a home router. Clients associate over WPA2 and lease addresses from 192.168.0.100 upward.'),
/* 10 */
'pt-acl':fig(700,300,'Lab 10 topology: R1 with inside, guest and screened-subnet networks',
  `<rect x="276" y="200" width="408" height="84" rx="6" class="fn no" style="stroke-dasharray:5 4"/>`+T(290,214,'Screened subnet','xs tb','l')+
  L(152,140,290,60)+L(152,150,290,150)+L(152,160,290,240)+
  rt(130,150,'R1')+sub(130,186,'2911')+
  ifl(196,92,'G0/0 .1','r')+ifl(212,140,'G0/1 .1','l')+ifl(196,212,'G0/2 .1','r')+
  T(212,166,'GUEST-IN (in)','xs tb','l')+T(206,230,'SCREENED-IN (in)','xs tb','r')+
  sw(330,60,'SW-IN',80)+sub(330,30,'Inside 192.168.10.0/24')+L(370,52,450,36)+L(370,68,450,84)+pc(500,36,'PC-Staff',90)+ip(560,36,'.10','l')+srv(500,84,'Server-HR',90)+ip(560,84,'.100','l')+
  sw(330,150,'SW-GUEST',96)+sub(330,122,'Guest 192.168.50.0/24')+L(378,150,450,150)+pc(500,150,'PC-Guest',90)+ip(560,150,'.10','l')+
  sw(330,240,'SW-SCR',80)+L(370,240,450,240)+srv(500,240,'Server-Web',90)+ip(560,240,'172.16.100.10','l'),
  'R1 routes between three networks. The ACLs go inbound on the interfaces where guest and screened-subnet traffic enters (red labels), as close to the source as possible.'),
/* 11 */
'pt-switch-security':fig(680,345,'Lab 11 topology: SW1 with PCs, a rogue DHCP server, a rogue switch and an attacker laptop',
  L(300,62,300,124,'ok thick')+ifl(310,108,'Gi0/1 (trusted)','l')+rt(300,40,'R1')+T(330,34,'G0/0 192.168.10.1 · legitimate DHCP','xs','l')+
  sw(300,140,'SW1',100,32)+T(360,140,'all user ports in VLAN 10','xs tm','l')+
  L(270,156,100,236)+ifl(160,190,'Fa0/1','r')+pc(100,250,'PC1',62)+sub(136,250,'DHCP','l')+
  L(286,156,220,236)+ifl(236,208,'Fa0/2','r')+pc(220,250,'PC2',62)+sub(256,250,'DHCP','l')+
  L(314,156,390,236,'no dash')+ifl(366,200,'Fa0/3','l')+add(390,250,'SW-Rogue',86)+T(390,276,'Part 4 · BPDU Guard','xs tb')+
  L(330,156,540,236,'no dash')+ifl(470,196,'Fa0/5','l')+add(540,250,'Rogue-DHCP',94)+T(540,276,'Part 2 · 192.168.10.250','xs tb')+
  add(100,320,'Attacker',80)+A(100,304,100,268,'no dash')+T(150,320,'Part 3: replaces PC1 on Fa0/1 (port security)','xs tb','l'),
  'The only trusted port is the uplink to R1, so DHCP snooping drops offers from Rogue-DHCP. Red dashed devices are the attacks you add in Parts 2–4.'),
/* 12 */
'pt-break-fix':fig(680,300,'Lab 12 topology: the lab 7 network you troubleshoot',
  L(340,70,232,137,'ac thick')+L(262,150,458,150,'ac thick')+ifl(352,98,'G0/0','l')+ifl(226,120,'Gi0/2','r')+
  T(372,40,'G0/0.10 · .20 · .99 = VLAN gateways\nDHCP from R1 (or relay to Server-DHCP)','xs mo','l')+
  [[220,100,'PC1','10'],[220,200,'PC2','20'],[500,440,'PC3','10'],[500,560,'PC4','20']].map(([s,x,n,v])=>L(s,165,x,250)+pc(x,264,n,62,28,v==='10'?'fa ac':'fg ok')+T(x,292,'VLAN '+v,'xs hd '+(v==='10'?'ta':'tg'))).join('')+
  rt(340,52,'R1')+sw(220,150,'SW1',84)+sw(500,150,'SW2',84),
  'Same network as lab 7. Each ticket breaks one thing on it; work out where from the symptom before you open the answer.'),
/* 13 */
'pt-capstone':fig(780,320,'Lab 13 suggested topology: R1 with two floor switches and an ISP link',
  L(392,60,538,60)+L(582,60,648,60)+L(352,74,262,136,'ac thick')+L(292,150,508,150,'ac thick')+
  rt(370,60,'R1')+rt(560,60,'ISP')+srv(700,60,'Web server',92)+ip(700,86,'198.51.100.10')+
  ifl(394,46,'G0/1 .2','l')+ifl(536,46,'.1','r')+sub(465,78,'203.0.113.0/30')+ifl(318,106,'G0/0','r')+T(352,108,'trunk: VLANs 10, 20, 30, 99','xs ta','l')+
  sw(250,150,'SW-F1',84)+sub(202,150,'Floor 1','r')+sw(550,150,'SW-F2',84)+sub(598,150,'Floor 2','l')+T(400,168,'trunk','xs ta')+
  [[250,150,'Staff','10'],[250,250,'Guest','20'],[250,350,'DNS + web','30']].map(([s,x,n,v])=>L(s,165,x,250)+(v==='30'?srv(x,264,n,88):pc(x,264,n,70,28))+sub(x,290,'VLAN '+v)).join('')+
  [[550,450,'Staff','10'],[550,550,'Guest','20'],[550,650,'Admin PC','99']].map(([s,x,n,v])=>L(s,165,x,250)+pc(x,264,n,70,28)+sub(x,290,'VLAN '+v)).join('')+
  sub(390,310,'A suggested layout. You plan the addressing; a few hosts per VLAN are enough to test every requirement.')+T(20,20,'10.20.0.0/22 inside','xs hd','l'),
  'One router does router-on-a-stick for all four VLANs and PAT to the ISP. Both floor switches carry Staff and Guest; the servers sit in VLAN 30 and management in VLAN 99.'),
};
