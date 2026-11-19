import {T,R,B,C,E,L,A,AA,P,Z,SW,PC,RT,SRV,NET,SVG,FIG} from './svg.js';
/* one colour per layer group, shared by the OSI, TCP/IP and encapsulation figures */
const LC={7:'fa ac',6:'fa ac',5:'fa ac',4:'fy am',3:'fp pu',2:'ft te',1:'fs'};

/* ---------- Lesson 1 ---------- */
const OSI=[[7,'Application','Data','HTTP, DNS, SMTP, SNMP'],[6,'Presentation','Data','TLS, encoding, compression'],[5,'Session','Data','Opens and closes sessions'],[4,'Transport','Segment / datagram','TCP, UDP · port numbers'],[3,'Network','Packet','IP, ICMP · routers'],[2,'Data Link','Frame','Ethernet, MAC · switches'],[1,'Physical','Bits','Cables, signals · hubs']];
export const osi=FIG(SVG(620,345,'The seven OSI layers with their PDUs and examples',
  T(40,12,'#','sm tm')+T(147,12,'Layer','sm tm')+T(300,12,'PDU','sm tm')+T(382,12,'Examples','sm tm','l')+
  OSI.map((r,i)=>{const y=26+i*40,c=LC[r[0]];return B(20,y,40,34,r[0],c,'hd')+B(64,y,166,34,r[1],c,'hd')+B(234,y,132,34,r[2],c,'sm')+T(382,y+17,r[3],'sm','l')}).join('')+
  T(310,326,'Bottom up (1 → 7): Please Do Not Throw Sausage Pizza Away','sm ta')),
 'The OSI model, colour-coded by layer group. Layers 5–7 (blue) prepare data for applications; layer 4 adds port numbers; layer 3 adds IP addresses for routing; layer 2 adds MAC addresses for the local link; layer 1 turns everything into signals on the medium.');

export const tcpip=FIG(SVG(540,300,'OSI layers mapped to the four TCP/IP layers',
  T(130,14,'OSI model','sm hd')+T(390,14,'TCP/IP (DoD) model','sm hd')+
  OSI.map((r,i)=>B(40,30+i*36,180,32,`${r[0]}  ${r[1]}`,LC[r[0]],'sm')).join('')+
  B(300,30,180,104,'Application\n(Process)','fa ac','sm hd')+B(300,138,180,32,'Transport (Host-to-Host)','fy am','sm hd')+B(300,174,180,32,'Internet','fp pu','sm hd')+B(300,210,180,68,'Network Access\n(Link)','ft te','sm hd')+
  [82,154,190,244].map(y=>A(226,y,294,y,'dash')).join('')),
 'The TCP/IP model squeezes the seven OSI layers into four. Application covers OSI 5–7, Transport matches OSI 4, Internet matches OSI 3, and Network Access (Link) covers OSI 1–2.');

export const encap=FIG(SVG(620,262,'Encapsulation: headers added at each layer',
  [['Layers 5–7',[],'Data'],['Layer 4',[['TCP hdr',258]],'Segment'],['Layer 3',[['IP hdr',186],['TCP hdr',258]],'Packet'],['Layer 2',[['Eth hdr',114],['IP hdr',186],['TCP hdr',258]],'Frame']].map(([lab,h,pdu],i)=>{const y=14+i*46;
    const HC={'TCP hdr':'fy am','IP hdr':'fp pu','Eth hdr':'ft te'},PT_=['ta','ty','tp','tt'];return T(8,y+17,lab,'sm tm','l')+h.map(([s,x])=>B(x,y,68,34,s,HC[s],'sm')).join('')+B(330,y,140,34,'Data','fa ac','sm')+(i===3?B(474,y,48,34,'FCS','ft te','sm'):'')+T(540,y+17,pdu,'hd '+PT_[i],'l')}).join('')+
  T(8,215,'Layer 1','sm tm','l')+B(114,198,408,34,'10110010 01101110 00101011 11001010 …','fs','mo')+T(540,215,'Bits','hd tm','l')+
  T(310,250,'Sending: headers are added going down.  Receiving: they are removed going up.','sm tm')),
 'Encapsulation. Each layer wraps what it receives from the layer above in its own header. Layer 2 also adds a trailer, the FCS, that lets the receiver detect corrupted frames.');

export const hop=FIG(SVG(660,222,'MAC addresses change at every hop; IP addresses stay the same',
  L(70,50,240,50)+L(240,50,430,50)+L(430,50,600,50)+
  PC(50,50,'Host A',64)+RT(240,50,'R1')+RT(430,50,'R2')+SRV(610,50,'Server B',78)+
  [[155,'A → R1','64',1],[335,'R1 → R2','63',2],[515,'R2 → B','62',3]].map(([x,m,t,k])=>Z(x-84,90,168,92,'Link '+k,'grey')+T(x,120,'MAC '+m,'sm hd tt')+T(x,142,'IP  A → B','sm hd tp')+T(x,162,'TTL '+t,'sm tm')).join('')+
  T(330,206,'The frame is rebuilt at each router; the packet inside travels end to end.','sm tm')),
 'One packet crossing two routers. The Layer 2 frame is rebuilt on every link with new source and destination MAC addresses, while the source and destination IP addresses stay the same. Each router lowers the TTL by one.');

export const handshake=FIG(SVG(480,250,'TCP three-way handshake',
  L(90,40,90,236,'dash')+L(390,40,390,236,'dash')+PC(90,22,'Client',76,28)+SRV(390,22,'Server',76,28)+
  A(90,60,388,88,'am')+T(240,62,'1  SYN','sm hd ty')+
  A(390,104,92,132,'am')+T(240,106,'2  SYN / ACK','sm hd ty')+
  A(90,148,388,176,'am')+T(240,150,'3  ACK','sm hd ty')+
  AA(92,208,388,208,'ok dash')+T(240,194,'Connection open: data flows, each segment acknowledged','sm tg')),
 'TCP opens every connection with a three-way handshake: SYN, SYN/ACK, ACK. Only then does data flow. A graceful close uses FIN and ACK; RST tears a connection down at once. UDP has no handshake at all.');

/* ---------- Lesson 2 ---------- */
const node=(x,y)=>C(x,y,9,'','dev');
const ring=(cx,cy,r,n,off=-90)=>Array.from({length:n},(_,i)=>{const a=(off+i*360/n)*Math.PI/180;return [Math.round(cx+r*Math.cos(a)),Math.round(cy+r*Math.sin(a))]});
const panel=(ox,oy,title,body,sub)=>`<g transform="translate(${ox} ${oy})">${Z(0,0,196,196,title,'grey')}${body}${T(98,174,sub,'xs tm')}</g>`;
const star=(()=>{const p=ring(98,92,52,6);return p.map(([x,y])=>L(98,92,x,y)).join('')+p.map(([x,y])=>node(x,y)).join('')+B(78,82,40,20,'SW','d-sw','xs hd')})();
const bus=L(14,92,182,92,'thick')+R(10,84,5,16,'dev')+R(181,84,5,16,'dev')+[[40,56],[80,128],[120,56],[160,128]].map(([x,y])=>L(x,92,x,y)+node(x,y)).join('');
const ringT=(()=>{const p=ring(98,92,52,6);return p.map(([x,y],i)=>L(x,y,...p[(i+1)%6])).join('')+p.map(([x,y])=>node(x,y)).join('')})();
const full=(()=>{const p=ring(98,94,54,5);let s='';for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)s+=L(...p[i],...p[j]);return s+p.map(([x,y])=>node(x,y)).join('')})();
const partial=(()=>{const p=ring(98,94,54,5);return [[0,1],[1,2],[2,3],[3,4],[4,0],[1,3]].map(([i,j])=>L(...p[i],...p[j])).join('')+p.map(([x,y])=>node(x,y)).join('')})();
const hubspoke=(()=>{const p=ring(98,94,56,4,-45);return p.map(([x,y])=>L(98,94,x,y)).join('')+p.map(([x,y])=>B(x-18,y-11,36,22,'Site','dev','xs')).join('')+C(98,94,17,'HQ','dev','xs hd')})();
export const topo=FIG(SVG(612,410,'Network topologies: star, bus, ring, full mesh, partial mesh, hub and spoke',
  panel(4,4,'Star',star,'Every device connects\nto a central switch')+panel(208,4,'Bus',bus,'One shared cable,\nterminated at both ends')+panel(412,4,'Ring',ringT,'Each device links\nto two neighbours')+
  panel(4,208,'Full mesh',full,'Every node to every node:\nn(n−1)/2 links')+panel(208,208,'Partial mesh',partial,'Extra links only\nwhere they are needed')+panel(412,208,'Hub and spoke',hubspoke,'Branches connect\nthrough headquarters')),
 'Physical topologies. Today\'s LANs are physical stars around switches. Full mesh gives the most redundancy but needs n(n−1)/2 links (5 nodes = 10 links). Hub and spoke is common for WANs, with branches connecting through headquarters.');

export const fiber=FIG(SVG(620,200,'Single-mode versus multimode fiber',
  T(10,46,'Single-mode\n~9 µm core\nlaser · kilometres','sm','l')+R(150,22,450,48,'fa')+R(150,42,450,8,'dev')+A(156,46,592,46,'ok thick')+
  T(10,148,'Multimode\n50 / 62.5 µm core\nLED or VCSEL · shorter','sm','l')+R(150,110,450,70,'fa')+R(150,124,450,42,'dev')+
  P('M156 145 L190 126 L240 164 L290 126 L340 164 L390 126 L440 164 L490 126 L540 164 L590 132','ok',true)+
  T(375,96,'Cladding reflects the light back into the core','xs tm')),
 'Fiber carries light. Single-mode has a core so thin the light takes essentially one path, so it travels kilometres. Multimode\'s wider core lets light bounce along many paths that arrive at slightly different times, which limits distance to hundreds of metres.');

const COL={w:'#e8e8e8',g:'#4caf50',o:'#ef8a2b',b:'#4a80d8',n:'#8a5a3b'};
const pin=(x,y,c,striped)=>striped?`<rect x="${x}" y="${y}" width="30" height="62" rx="3" style="fill:${COL.w};stroke:#0b0d0f"/><rect x="${x+10}" y="${y}" width="10" height="62" style="fill:${COL[c]};stroke:none"/>`:`<rect x="${x}" y="${y}" width="30" height="62" rx="3" style="fill:${COL[c]};stroke:#0b0d0f"/>`;
const wires=(y,seq)=>seq.map((s,i)=>pin(110+i*38,y,s[0],s[1]==='s')).join('');
const A568=['gs','g','os','b','bs','o','ns','n'],B568=['os','o','gs','b','bs','g','ns','n'];
export const pinout=FIG(SVG(640,236,'T568A and T568B pinouts',
  Array.from({length:8},(_,i)=>T(125+i*38,14,i+1,'sm tm')).join('')+
  T(10,61,'T568A','hd','l')+wires(30,A568)+T(424,61,'1–2 green, 3 & 6 orange','sm','l')+
  T(10,149,'T568B','hd','l')+wires(118,B568)+T(424,149,'1–2 orange, 3 & 6 green','sm','l')+
  T(10,206,'Striped = white with that colour.  Straight-through: same standard on both ends.  Crossover: A on one end, B on the other.','xs tm','l')),
 'The two wiring standards differ only by swapping the green and orange pairs (pins 1, 2, 3 and 6). Pick one standard and use it everywhere; T568B is the most common in practice.');

/* ---------- Lesson 3 ---------- */
export const frame=FIG(SVG(620,150,'Ethernet frame fields',
  L(100,30,580,30,'ac')+L(100,24,100,36,'ac')+L(580,24,580,36,'ac')+T(340,13,'Frame: 64–1518 bytes (1522 with a VLAN tag)','sm ta')+
  [['Preamble\n+ SFD',20,80,'8','fs'],['Dest\nMAC',100,80,'6','ft te'],['Source\nMAC',180,80,'6','ft te'],['802.1Q tag\n(optional)',260,70,'4','dash'],['Type',330,50,'2','ft te'],['Payload\n(the IP packet)',380,150,'46–1500','fp pu'],['FCS',530,50,'4','ft te']].map(([s,x,w,b,c])=>B(x,44,w,48,s,c==='dash'?'fn':c,'sm')+(c==='dash'?`<rect x="${x}" y="44" width="${w}" height="48" class="fn ac" style="stroke-dasharray:4 3"/>`:'')+T(x+w/2,108,b,'mo tm')).join('')+
  T(20,134,'Field sizes in bytes. The FCS is a CRC-32 checksum: a frame that fails it is dropped as a CRC error.','xs tm','l')),
 'An Ethernet II frame. The destination MAC comes first so a switch can start deciding where to send the frame immediately. The optional 802.1Q tag carries the VLAN ID on trunk links. The payload\'s 1500-byte maximum is the standard MTU.');

export const learn=FIG(SVG(640,256,'How a switch learns MAC addresses and floods unknown destinations',
  B(120,112,320,36,'Switch','dev','sm')+
  [['A',160,1],['B',240,2],['C',320,3],['D',400,4]].map(([h,x,p])=>PC(x,44,'Host '+h,62)+T(x+10,98,p,'xs tm','l')).join('')+
  A(160,60,160,110,'ac thick')+A(240,112,240,62,'ac dash')+A(320,112,320,62,'ac dash')+A(400,112,400,62,'ac dash')+
  B(470,40,150,108,'','fn')+T(545,56,'MAC address table','sm hd')+L(480,70,610,70)+T(490,90,'Port 1 → A','mo','l')+T(490,116,'Port 4 → D','mo ta','l')+T(490,136,'(learned later)','xs tm','l')+
  T(14,176,'1  A sends to D on port 1, so the switch learns “A is on port 1”.','sm','l')+
  T(14,200,'2  D is not in the table yet, so the frame is flooded out every other port (dashed).','sm','l')+
  T(14,224,'3  D replies on port 4: the switch learns D. From now on A ↔ D frames use only ports 1 and 4.','sm','l')),
 'A switch learns from source MAC addresses and forwards by destination MAC. Unknown unicast, broadcast and multicast frames are flooded; known destinations go out one port only.');

const dom=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="fn ${c}" style="stroke-dasharray:5 4"/>`;
const corner=[[40,46],[170,46],[40,150],[170,150]];
export const domains=FIG(SVG(640,270,'Collision domains and broadcast domains for a hub, a switch and a router',
  `<g transform="translate(0 0)">${T(105,14,'Hub','hd')}${corner.map(([x,y])=>L(105,98,x,y)).join('')}${SW(105,98,'Hub',56)}${corner.map(([x,y])=>PC(x,y,'',34,22)).join('')}${dom(105,98,96,78,'no')}${T(105,206,'1 collision domain','sm tb')}${T(105,226,'1 broadcast domain','sm ta')}</g>`+
  `<g transform="translate(215 0)">${T(105,14,'Switch','hd')}${corner.map(([x,y])=>L(105,98,x,y)).join('')}${SW(105,98,'Switch',62)}${corner.map(([x,y])=>PC(x,y,'',34,22)+dom(x,y,26,20,'no')).join('')}${`<rect x="2" y="22" width="206" height="152" rx="10" class="fn ac" style="stroke-dasharray:5 4"/>`}${T(105,206,'4 collision domains (one per port)','sm tb')}${T(105,226,'1 broadcast domain','sm ta')}</g>`+
  `<g transform="translate(430 0)">${T(105,14,'Router between two switches','hd')}${L(105,52,52,108)+L(105,52,158,108)}${[[26,160],[78,160],[132,160],[184,160]].map(([x,y],i)=>L(i<2?52:158,108,x,y)).join('')}${RT(105,52,'R',18)}${SW(52,108,'SW1',50,24)}${SW(158,108,'SW2',50,24)}${[[26,160],[78,160],[132,160],[184,160]].map(([x,y])=>PC(x,y,'',30,20)).join('')}${dom(52,136,50,52,'ac')}${dom(158,136,50,52,'ac')}${T(105,206,'Router ports separate','sm')}${T(105,226,'2 broadcast domains','sm ta')}</g>`),
 'Hubs share one collision domain. Each switch port is its own collision domain, but a switch still forwards broadcasts everywhere (one broadcast domain). Routers, and VLANs, split broadcast domains.');

/* ---------- Lesson 4 ---------- */
export const stdname=FIG(SVG(540,170,'How to read an Ethernet standard name',
  B(40,18,130,46,'10G','fy am','hd mo lg')+B(176,18,150,46,'BASE','fs','hd mo lg')+B(332,18,130,46,'-LR','ft te','hd mo lg')+
  T(105,92,'Speed\n10 Gbps','sm ty')+T(251,92,'Baseband\n(one signal on the wire)','sm tm')+T(397,92,'Medium / reach\nLong reach, single-mode','sm tt')+
  T(270,148,'T = twisted pair  ·  SR = short reach (multimode)  ·  LR = long (SMF, 10 km)  ·  ER = extended (SMF, 40 km)','xs tm')),
 'Every Ethernet standard name follows the same pattern: speed, then BASE, then a suffix that tells you the medium or reach. Decode the suffix and you know which cable and transceiver the standard needs.');

/* ---------- Lesson 5 ---------- */
export const cabling=FIG(SVG(640,280,'Structured cabling from the demarc to a desk',
  Z(20,20,600,116,'Floor 2','grey')+Z(20,144,600,116,'Floor 1','grey')+
  B(162,46,138,74,'IDF\naccess switch\n+ patch panel','dev','sm')+
  B(162,166,138,78,'MDF\nrouter, core switch,\npatch panels','dev','sm')+
  B(36,186,96,40,'Demarc\n(ISP handoff)','fa','sm')+L(132,206,162,206)+L(0,206,36,206,'dash')+
  L(231,120,231,166,'ac thick')+T(242,130,'Backbone (riser)','sm ta','l')+
  L(300,82,470,82)+T(378,70,'Horizontal run ≤ 90 m','sm')+B(470,72,18,20,'','dev')+T(479,104,'Wall jack','xs tm')+
  L(488,82,540,82,'ok')+T(514,70,'patch','xs tg')+PC(574,82,'PC',58)+
  T(330,190,'Permanent link: patch panel → wall jack ≤ 90 m','sm','l')+T(330,212,'Whole channel incl. patch cords ≤ 100 m','sm','l')+T(330,234,'Plenum-rated cable in air-handling spaces','sm tm','l')),
 'Structured cabling. The provider hands off at the demarc. The MDF holds the core equipment, a backbone (riser) cable feeds an IDF on each floor, and horizontal runs go from each IDF\'s patch panel to the wall jacks.');
