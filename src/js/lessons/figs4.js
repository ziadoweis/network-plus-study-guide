import {T,R,B,C,E,L,A,AA,P,SW,PC,RT,NET,SVG,FIG} from './svg.js';

/* ---------- Lesson 17 ---------- */
const seg=(x,y,t,sub,c,tc)=>B(x,y,170,46,'',c)+T(x+85,y+16,t,'sm hd '+tc)+T(x+85,y+33,sub,'xs tm');
export const segment=FIG(SVG(660,300,'Segmenting an office into VLANs behind a firewall',
  [[105,48],[555,48],[105,250],[555,250],[330,262]].map(([x,y])=>L(330,150,x,y)).join('')+L(330,58,330,126)+
  NET(330,36,70,24,'Internet')+B(260,124,140,52,'Firewall /\nL3 switch','fa ac','sm hd')+
  seg(20,26,'Staff PCs','VLAN 10 · servers, Internet','','')+seg(470,26,'Voice phones','VLAN 40 · call server, QoS','','')+
  seg(20,228,'Servers','VLAN 30 · answer staff','','')+seg(470,228,'IoT / cameras','VLAN 50 · video recorder only','fb no','tb')+
  seg(245,240,'Guest Wi-Fi','VLAN 60 · Internet only','fg ok','tg')),
 'Each kind of device gets its own VLAN and subnet, and the firewall (or Layer 3 switch ACLs) decides what each segment may reach. A compromised camera can then talk only to the video recorder, not to staff PCs or servers.');

/* ---------- Lesson 18 ---------- */
const IR=['Preparation','Detection and\nidentification','Containment','Eradication','Recovery','Lessons\nlearned'];
const pt=(a,r)=>[270+r*Math.cos(a*Math.PI/180),160+r*Math.sin(a*Math.PI/180)];
export const ir=FIG(SVG(540,326,'The incident response cycle',
  IR.map((_,i)=>{const a1=-90+i*60+17,a2=-90+(i+1)*60-17;const [x1,y1]=pt(a1,122),[x2,y2]=pt(a2,122);return P(`M${x1.toFixed(1)} ${y1.toFixed(1)} A122 122 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`,'ac',true)}).join('')+
  IR.map((s,i)=>{const [x,y]=pt(-90+i*60,122);return B(x-66,y-22,132,44,`${i+1}  ${s.replace('\n',' ').length>16?s:s}`,i===2?'fa ac':'dev','xs hd')}).join('')+
  T(270,160,'Incident\nresponse','sm tm')),
 'Incident response is a cycle. Lessons learned feed back into preparation. Containment (stopping the spread, for example isolating an infected PC) always comes before eradication (removing the cause).');

/* ---------- Lesson 19 ---------- */
export const dbltag=FIG(SVG(640,214,'VLAN hopping by double tagging',
  L(110,70,250,70)+L(330,70,470,70,'thick')+
  PC(70,70,'Attacker',72,30,'fb no')+T(70,98,'access port in VLAN 1','xs tm')+SW(290,70,'SW1',80)+SW(510,70,'SW2',80)+L(548,78,584,100)+PC(610,108,'Victim',60)+
  T(400,54,'trunk, native VLAN 1','xs tm')+
  B(110,130,60,24,'Tag 1','fb no','xs')+B(172,130,60,24,'Tag 20','fa ac','xs')+B(234,130,50,24,'Data','','xs')+T(197,170,'sent by attacker','xs tm')+
  A(292,142,350,142)+B(360,130,60,24,'Tag 20','fa ac','xs')+B(422,130,50,24,'Data','','xs')+T(416,170,'SW1 strips the native tag','xs tm')+
  T(320,200,'SW2 reads tag 20 and delivers the frame into VLAN 20. Fix: native VLAN = unused VLAN, no hosts in it.','xs ta')),
 'Double tagging. SW1 removes the outer tag because it matches the trunk\'s native VLAN and forwards the frame untagged on the trunk, exposing the inner tag. SW2 then puts it in VLAN 20. It only works one way, and only when the attacker sits in the native VLAN.');

export const arp=FIG(SVG(600,262,'ARP poisoning puts the attacker on-path',
  A(140,104,460,104,'dash')+T(300,90,'normal path','xs tm')+
  B(30,86,110,46,'Victim\n10.0.0.20','dev','sm')+RT(490,108,'GW',26)+T(490,148,'10.0.0.1','xs tm')+
  B(245,178,110,46,'Attacker\nMAC EE:EE','fb no','sm')+
  A(120,134,243,190,'no thick')+A(357,190,470,128,'no thick')+
  T(20,244,'To victim: “10.0.0.1 is at EE:EE”','xs tb','l')+T(580,244,'To gateway: “10.0.0.20 is at EE:EE”','xs tb','r')),
 'The attacker sends unsolicited (gratuitous) ARP replies to both sides. Each one updates its ARP cache, so traffic between the victim and the gateway flows through the attacker, who can read or alter it. Dynamic ARP Inspection stops this by checking ARP replies against the DHCP snooping table.');

export const dot1x=FIG(SVG(660,170,'802.1X roles: supplicant, authenticator, authentication server',
  B(20,40,140,52,'Supplicant\n(laptop)','fa','sm hd')+B(260,40,140,52,'Authenticator\n(switch or AP)','dev','sm hd')+B(500,40,140,52,'Authentication\nserver (RADIUS)','fg','sm hd')+
  AA(162,66,258,66,'ac')+T(210,52,'EAPoL','xs ta')+AA(402,66,498,66,'ok')+T(450,52,'RADIUS','xs tg')+
  T(90,114,'presents a password\nor certificate','xs tm')+T(330,114,'relays credentials; port stays\nblocked until Access-Accept','xs tb')+T(570,114,'checks them\n(EAP-TLS: certs both sides)','xs tm')+
  T(330,156,'Until it succeeds, only EAP traffic passes the port.','xs')),
 'Port-based network access control. The switch never checks credentials itself; it relays EAP between the device and the RADIUS server and opens the port only when the server says Access-Accept.');

export const screened=FIG(SVG(680,224,'A screened subnet between two firewalls',
  L(98,100,120,100)+L(190,100,215,100)+L(415,100,440,100)+L(510,100,540,100)+
  NET(55,100,44,26,'Internet')+B(120,74,70,52,'Outer\nfirewall','fb no','xs hd')+
  `<rect x="215" y="24" width="200" height="156" rx="6" class="fn ac" style="stroke-dasharray:5 4"/>`+T(225,40,'Screened subnet','xs ta','l')+
  B(240,56,150,30,'Web server','dev','xs')+B(240,94,150,30,'Mail server','dev','xs')+B(240,132,150,30,'Public DNS','dev','xs')+
  B(440,74,70,52,'Inner\nfirewall','fg ok','xs hd')+B(540,70,126,60,'Internal LAN\n(trusted)','fg','sm hd')+
  T(340,208,'The Internet reaches only the screened subnet. A compromised public server still has to get past the inner firewall.','xs tm')),
 'Public-facing servers sit in a screened subnet (formerly called a DMZ). The outer firewall lets Internet users reach those servers only; the inner firewall protects the internal LAN, even from the screened subnet.');

/* ---------- Lesson 20 ---------- */
export const snmp=FIG(SVG(620,250,'SNMP polling and traps',
  B(230,20,160,46,'NMS (manager)','fa ac','sm hd')+
  B(30,166,120,42,'Router\n(agent)','dev','xs')+B(250,166,120,42,'Switch\n(agent)','dev','xs')+B(470,166,120,42,'Server\n(agent)','dev','xs')+
  A(280,68,110,164,'ac')+A(310,68,310,164,'ac')+A(340,68,510,164,'ac')+T(430,104,'Get (polling)\nto UDP 161','xs ta','l')+
  A(60,164,232,52,'no dash')+T(20,92,'Trap to UDP 162\n“interface down!”','xs tb','l')+
  T(310,232,'Each value is defined in the device\'s MIB and has an OID, e.g. 1.3.6.1.2.1.1.5 = device name','xs tm')),
 'The manager polls agents for values on UDP 161; agents push traps to the manager on UDP 162 when something happens. SNMPv1 and v2c send their community string in clear text; only SNMPv3 adds authentication and encryption.');

export const tap=FIG(SVG(660,214,'Port mirroring compared with a network tap',
  T(160,14,'Port mirroring (SPAN)','sm hd')+L(160,52,160,82)+L(110,96,60,96)+
  PC(160,40,'Server',64,24)+SW(160,96,'Switch',100)+PC(40,96,'PC',36,24)+B(110,150,100,30,'Analyzer','fa','xs')+A(160,110,160,148,'ac dash')+T(170,130,'copy of port 1','xs ta','l')+
  T(160,198,'The switch makes the copy. It may drop frames\nwhen busy and usually skips errored frames.','xs tm')+L(330,24,330,206,'dash')+
  T(500,14,'Network tap','sm hd')+L(400,70,460,70)+L(520,70,590,70)+SW(380,70,'Switch',64)+RT(610,70,'R',20)+B(460,56,60,28,'Tap','fa ac','xs hd')+B(440,140,100,30,'Analyzer','fa','xs')+A(482,86,482,138,'ac dash')+A(498,86,498,138,'ac dash')+T(510,112,'both directions','xs ta','l')+
  T(500,198,'Hardware inline on the cable copies everything,\nincluding errors. Best for complete captures.','xs tm')),
 'Both feed a copy of traffic to an analyzer or IDS. SPAN is free and configurable on a managed switch; a tap is extra hardware but sees every frame exactly as it crossed the wire.');

/* ---------- Lesson 21 ---------- */
const st=(x,y,n,t,d,c='dev')=>B(x,y,284,52,'',c)+T(x+12,y+18,n+'  '+t,'sm hd','l')+T(x+12,y+37,d,'xs tm','l');
export const method=FIG(SVG(700,312,'The CompTIA troubleshooting methodology',
  st(96,20,1,'Identify the problem','question users · what changed? · duplicate it','fa ac')+
  st(96,95,2,'Theory of probable cause','question the obvious · OSI top-down / bottom-up')+
  st(96,170,3,'Test the theory','confirmed → plan it · not → new theory or escalate')+
  st(96,245,4,'Plan of action','identify the potential effects')+
  st(404,245,5,'Implement or escalate','make the change, or hand it on')+
  st(404,170,6,'Verify full functionality','and add preventive measures','fg ok')+
  st(404,95,7,'Document everything','findings, actions, outcomes, lessons learned')+
  A(238,72,238,93)+A(238,147,238,168)+A(238,222,238,243)+A(380,271,402,271)+A(546,245,546,224)+A(546,170,546,149)+
  P('M96 196 C58 196 58 121 94 121','no',true)+T(60,158,'not\nconfirmed','xs tb','r')),
 'CompTIA\'s seven steps. Exam questions often ask what to do first or next: gather information and ask what changed before forming a theory, test before acting, and verify full functionality before you document.');

export const ping=FIG(SVG(700,240,'The four-step ping test',
  L(270,56,340,56)+L(410,56,456,56)+L(504,56,560,56)+
  PC(240,56,'Your PC',60)+SW(375,56,'Switch',70)+RT(480,56,'GW',22)+B(560,36,120,40,'Remote host','dev','xs')+
  [['1  ping 127.0.0.1','software stack',262,''],['2  ping your own IP','NIC and its settings',272,''],['3  ping the default gateway','the local network',476,''],['4  ping a remote host','beyond your LAN',556,''],['5  ping by name','DNS works too',556,'dash']].map(([l,r,x2,c],i)=>{const y=110+i*24;return T(10,y,l,'sm','l')+A(214,y,x2,y,'ac '+c)+T(x2+8,y,r,'xs tm','l')}).join('')),
 'Work outward from your own machine. The first ping that fails tells you where the problem is: the TCP/IP stack, your NIC, the local network or gateway, routing beyond it, or (if pings by IP work but by name fail) DNS.');
