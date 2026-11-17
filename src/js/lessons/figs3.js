import {T,R,B,C,E,L,A,AA,P,SW,PC,RT,NET,SVG,FIG} from './svg.js';

/* ---------- Lesson 11 ---------- */
export const trunk=FIG(SVG(620,270,'Access ports and an 802.1Q trunk between two switches',
  L(212,110,408,110,'ac thick')+T(310,92,'Trunk (802.1Q): VLANs 10 and 20','sm ta')+
  B(244,122,44,22,'Eth','','xs')+B(290,122,46,22,'VLAN 20','fg ok','xs tg')+B(338,122,40,22,'Data','','xs')+T(310,156,'a tagged frame on the trunk','xs tm')+
  [[170,100],[170,240],[450,380],[450,520]].map(([s,x])=>L(s,124,x,198)).join('')+
  SW(170,110,'SW1',84)+SW(450,110,'SW2',84)+
  [[100,'10'],[240,'20'],[380,'10'],[520,'20']].map(([x,v])=>PC(x,212,'PC',50,28,v==='10'?'fa ac':'fg ok')+T(x,242,'VLAN '+v,'xs '+(v==='10'?'ta':'tg'))).join('')+
  T(310,262,'Access ports carry one VLAN, untagged. The PCs never see a tag.','xs tm')),
 'Hosts in VLAN 10 and VLAN 20 share the same two switches but are separate networks. On the trunk each frame carries an 802.1Q tag with its VLAN ID; the native VLAN is the one exception and is sent untagged.');

const lbl=(x,y,s,c='xs ta')=>T(x,y,s,c);
export const stp=FIG(SVG(520,280,'Spanning Tree: root bridge, root ports, designated ports and a blocked port',
  L(235,70,135,180)+L(285,70,385,180)+L(165,200,355,200,'dash')+
  B(200,28,120,44,'SW1  (root)\npriority 4096','fa ac','sm hd')+B(50,180,120,40,'SW2\npriority 32768','dev','sm')+B(350,180,120,40,'SW3\npriority 32768','dev','sm')+
  lbl(206,92,'DP')+lbl(314,92,'DP')+lbl(140,152,'RP','xs tg')+lbl(380,152,'RP','xs tg')+lbl(188,188,'DP')+
  L(326,192,342,208,'no thick')+L(342,192,326,208,'no thick')+T(334,228,'Blocked (alternate)','xs tb')+
  T(260,262,'RP = root port (best path to the root)  ·  DP = designated port  ·  the blocked port breaks the loop','xs tm')),
 'Three switches form a loop. SW1 has the lowest bridge ID, so it is the root and all its ports are designated. Each other switch picks a root port. On the SW2–SW3 link, SW2 has the lower bridge ID (same priority, lower MAC), so its end is designated and SW3\'s end blocks. If a link fails, STP unblocks it.');

/* ---------- Lesson 12 ---------- */
const HX=['2001','0db8','acad','0001','021a','2bff','fe3c','4d5e'],hx=i=>24+i*72;
export const v6=FIG(SVG(624,160,'Structure of an IPv6 global unicast address',
  L(hx(0),18,hx(3)+66,18,'ac')+T((hx(0)+hx(3)+66)/2,10,'/64 network prefix','xs ta')+
  HX.map((h,i)=>B(hx(i),30,66,36,h,i<3?'fa':i===3?'':'fg','mo')+(i<7?T(hx(i)+69,48,':','mo tm'):'')).join('')+
  L(hx(0),80,hx(2)+66,80,'ac thick')+T((hx(0)+hx(2)+66)/2,100,'Global routing prefix: /48\n(assigned by your ISP)','xs ta')+
  L(hx(3),80,hx(3)+66,80,'thick')+T(hx(3)+33,100,'Subnet ID\n16 bits','xs')+
  L(hx(4),80,hx(7)+66,80,'ok thick')+T((hx(4)+hx(7)+66)/2,100,'Interface ID: 64 bits\n(SLAAC, EUI-64 or random)','xs tg')+
  T(312,144,'Written short: 2001:db8:acad:1:21a:2bff:fe3c:4d5e','mo tm')),
 'An IPv6 address is 128 bits written as eight 16-bit hextets. A site usually gets a /48 from its provider, uses the next 16 bits to number up to 65,536 subnets, and every subnet is a /64 so the last 64 bits identify the interface.');

const by=(x,y,s,c='')=>B(x,y,44,30,s,c,'mo');
const slot=i=>230+i*50;
export const eui=FIG(SVG(650,250,'Building an EUI-64 interface ID from a MAC address',
  T(10,35,'MAC address','sm','l')+['00','1A','2B'].map((b,i)=>by(slot(i),20,b)).join('')+['3C','4D','5E'].map((b,i)=>by(slot(i+5),20,b)).join('')+T(slot(3)+47,35,'split here','xs tm')+
  T(10,95,'1  Insert FFFE','sm','l')+['00','1A','2B'].map((b,i)=>by(slot(i),80,b)).join('')+by(slot(3),80,'FF','fa ac')+by(slot(4),80,'FE','fa ac')+['3C','4D','5E'].map((b,i)=>by(slot(i+5),80,b)).join('')+
  T(10,155,'2  Flip the 7th bit','sm','l')+by(slot(0),140,'02','fg ok')+['1A','2B','FF','FE','3C','4D','5E'].map((b,i)=>by(slot(i+1),140,b)).join('')+
  T(slot(0),186,'00 = 0000 0000  →  0000 0010 = 02','xs tg','l')+
  T(10,224,'Interface ID','sm hd','l')+T(slot(0),224,'021A:2BFF:FE3C:4D5E','mo hd ta','l')),
 'Modified EUI-64 stretches the 48-bit MAC to 64 bits by inserting FFFE in the middle, then flips the seventh bit of the first byte. Most operating systems now use random interface IDs instead, for privacy.');

/* ---------- Lesson 13 ---------- */
export const vpn=FIG(SVG(680,272,'Site-to-site and client-to-site VPNs',
  T(10,14,'Site-to-site','sm hd','l')+L(100,70,140,70)+L(520,70,560,70)+
  B(10,52,90,36,'Branch LAN','','xs')+RT(160,70,'GW',20)+NET(340,70,110,30,'Internet')+RT(500,70,'GW',20)+B(560,52,100,36,'HQ LAN','','xs')+
  P('M182 70 L478 70','tun')+T(340,28,'IPsec tunnel between the two gateways','xs ta')+
  T(10,138,'Client-to-site (remote access)','sm hd','l')+L(562,206,586,206)+
  B(10,186,100,40,'Laptop with\nVPN client','fa','xs')+NET(310,206,110,30,'Internet')+B(452,186,110,40,'VPN\nconcentrator','dev','xs')+B(586,188,80,36,'HQ LAN','','xs')+
  P('M112 206 L450 206','tun')+T(280,164,'TLS or IPsec tunnel from one user','xs ta')+
  T(340,254,'A clientless VPN does the same through a browser portal (TLS), with no client installed.','xs tm')),
 'A site-to-site VPN links whole networks through gateways that keep a permanent tunnel up, so users notice nothing. A client-to-site VPN connects one user\'s device to a concentrator at headquarters.');

const tun=(ox,full)=>`<g transform="translate(${ox} 0)">${T(160,14,full?'Full tunnel':'Split tunnel','sm hd')}`+
  B(16,166,90,36,'Remote\nlaptop','fa','xs')+B(200,40,110,36,'HQ network','dev','xs')+NET(250,190,60,24,'Internet')+
  P('M100 166 L210 78','tun')+A(100,166,206,80,'ac')+T(120,108,full?'everything':'corporate only','xs ta','r')+
  (full?A(255,78,255,164,'ac')+T(262,122,'out via\nHQ','xs tm','l'):A(108,188,186,190,'ok')+T(148,210,'web: direct','xs tg'))+
  T(160,240,full?'All traffic inspected by HQ security':'Saves HQ bandwidth; web isn\'t inspected','xs tm')+'</g>';
export const split=FIG(SVG(660,252,'Full tunnel versus split tunnel',tun(0,true)+L(330,24,330,236,'dash')+tun(340,false)),
 'With a full tunnel, all of the remote user\'s traffic goes through the VPN, including web browsing. With a split tunnel, only traffic for the corporate network uses the VPN and everything else goes straight to the Internet.');

/* ---------- Lesson 14 ---------- */
const cx=i=>120+(i-1)*42;
export const chan=FIG(SVG(660,228,'2.4 GHz channel overlap: channels 1, 6 and 11 do not overlap',
  L(20,170,650,170)+
  Array.from({length:11},(_,k)=>{const i=k+1,hi=[1,6,11].includes(i);return P(`M${cx(i)-92} 170 A92 ${hi?120:104} 0 0 1 ${cx(i)+92} 170`,hi?'ac thick':'dim')}).join('')+
  Array.from({length:11},(_,k)=>{const i=k+1,hi=[1,6,11].includes(i);return T(cx(i),186,i,hi?'sm hd ta':'xs tm')}).join('')+
  T(335,24,'Channels 1, 6 and 11 don\'t overlap','sm ta')+
  T(335,212,'Channels are 5 MHz apart but each signal is about 22 MHz wide, so neighbours overlap.','xs tm')),
 'In 2.4 GHz only channels 1, 6 and 11 avoid each other. Two nearby APs on the same channel cause co-channel interference (they take turns); APs on overlapping channels such as 1 and 3 cause adjacent-channel interference, which is worse.');

export const ess=FIG(SVG(620,286,'Basic service sets combined into an extended service set',
  `<circle cx="200" cy="138" r="112" class="fn ac" style="stroke-dasharray:5 4"/><circle cx="420" cy="138" r="112" class="fn ok" style="stroke-dasharray:5 4"/>`+
  L(310,34,200,104)+L(310,34,420,104)+SW(310,24,'Switch / WLC',110,26)+
  B(176,104,48,24,'AP1','dev','xs hd')+B(396,104,48,24,'AP2','dev','xs hd')+
  T(150,170,'BSS 1\nBSSID …:01','xs ta')+T(470,170,'BSS 2\nBSSID …:02','xs tg')+
  PC(270,212,'Laptop',56,24)+A(300,212,354,212,'')+T(330,232,'roams','xs tm')+
  T(310,274,'Same SSID “CORP” on both APs = one ESS','xs hd')),
 'Each AP and its clients form a BSS, identified by the AP radio\'s MAC address (the BSSID). Several APs advertising the same SSID with the same security settings form an ESS, so clients can roam between them. Overlap of about 15–20% helps roaming.');

/* ---------- Lesson 15 ---------- */
const LAY=['Applications','Data','Runtime','Operating system','Virtualization','Servers','Storage','Networking'];
const MODELS=[['On-premises',[0,1,2,3,4,5,6,7]],['IaaS',[0,1,2,3]],['PaaS',[0,1]],['SaaS',[1]]];
export const resp=FIG(SVG(540,332,'Who manages what in IaaS, PaaS and SaaS',
  MODELS.map(([m,n],k)=>{const x=20+k*126;return T(x+58,14,m,'sm hd')+LAY.map((l,r)=>{const you=n.includes(r);return B(x,30+r*32,116,28,l,you?'fa ac':'','xs '+(you?'':'tm'))}).join('')}).join('')+
  R(120,300,18,14,'fa ac')+T(144,307,'You manage','xs','l')+R(270,300,18,14)+T(294,307,'The provider manages','xs','l')),
 'The further right you go, the more the provider runs for you. With IaaS you still patch the operating system; with PaaS you only bring code and data; with SaaS you just use the application, though you\'re still responsible for your data and who can access it.');

export const sdn=FIG(SVG(650,282,'SDN: application, control and data planes',
  T(10,38,'Application\nplane','xs tm','l')+T(10,140,'Control\nplane','xs tm','l')+T(10,245,'Data\nplane','xs tm','l')+
  [['Security app',150],['Load balancing',310],['Monitoring',470]].map(([s,x])=>B(x,20,140,36,s,'','xs')).join('')+
  [220,380,540].map((x,i)=>AA(330+i*60,118,x,60,'ac')).join('')+T(110,88,'northbound APIs','xs ta','l')+
  B(270,120,240,40,'SDN controller','fa ac','sm hd')+
  [[190],[320],[450],[580]].map(([x],i)=>A(330+i*40,162,x,226,'ok')).join('')+T(110,196,'southbound APIs\n(e.g. OpenFlow)','xs tg','l')+
  L(235,244,275,244)+L(365,244,405,244)+L(495,244,535,244)+[190,320,450,580].map(x=>SW(x,244,'Switch',90,30)).join('')),
 'Software-defined networking moves the decisions (control plane) out of each device and into a central controller. Applications tell the controller what they need through northbound APIs; the controller programs the switches\' forwarding (data plane) through southbound APIs.');

export const vpc=FIG(SVG(660,280,'A VPC with public and private subnets, an Internet gateway and a NAT gateway',
  `<rect x="150" y="16" width="496" height="250" rx="8" class="fn ac" style="stroke-dasharray:6 4"/>`+T(162,32,'VPC 10.0.0.0/16','xs ta','l')+
  R(220,46,190,206,'fn')+T(230,62,'Public subnet 10.0.1.0/24','xs','l')+R(426,46,206,206,'fn')+T(436,62,'Private subnet 10.0.2.0/24','xs','l')+
  NET(50,140,42,24,'Internet')+AA(92,140,110,140)+B(110,116,80,48,'Internet\ngateway','fa ac','xs hd')+
  AA(190,130,236,104,'ac')+B(236,84,120,40,'Web server','dev','xs')+
  B(236,180,120,40,'NAT gateway','dev','xs')+A(236,190,190,154,'ok')+
  B(460,84,120,40,'App server','dev','xs')+B(460,180,120,40,'Database','dev','xs')+`<rect x="452" y="172" width="136" height="56" rx="6" class="fn no" style="stroke-dasharray:4 3"/>`+T(520,240,'security group','xs tb')+
  A(460,200,358,200,'ok')+T(410,184,'outbound\nonly','xs tg')),
 'The web server in the public subnet is reached through the Internet gateway. Servers in the private subnet can\'t be reached from the Internet, but they can start outbound connections (for updates) through the NAT gateway. Security groups filter each instance; network ACLs filter each subnet.');

/* ---------- Lesson 16 ---------- */
const box=(x,y,s,w=64)=>B(x-w/2,y-13,w,26,s,'dev','xs');
const lines=(a,b)=>a.flatMap(([x1,y1])=>b.map(([x2,y2])=>L(x1,y1,x2,y2))).join('');
const core=[[105,48],[225,48]],dist=[[105,112],[225,112]],acc=[[44,178],[124,178],[206,178],[286,178]];
const spine=[[440,60],[580,60]],leaf=[[392,170],[472,170],[552,170],[632,170]];
export const dcarch=FIG(SVG(680,240,'Three-tier hierarchy compared with spine and leaf',
  T(10,14,'Three-tier','sm hd','l')+lines(core,dist)+L(137,48,193,48)+L(147,112,183,112)+lines(dist,acc)+
  core.map(([x,y])=>box(x,y,'Core')).join('')+dist.map(([x,y])=>box(x,y,'Distribution',84)).join('')+acc.map(([x,y])=>box(x,y,'Access',60)).join('')+
  T(165,222,'Core · distribution · access (campus)','xs tm')+L(340,10,340,230,'dash')+
  T(360,14,'Spine and leaf','sm hd','l')+lines(spine,leaf)+spine.map(([x,y])=>box(x,y,'Spine')).join('')+leaf.map(([x,y])=>box(x,y,'Leaf (ToR)',70)).join('')+
  leaf.map(([x])=>T(x,196,'servers','xs tm')).join('')+T(505,222,'Every leaf ↔ every spine (data center)','xs tm')),
 'The three-tier design suits campus networks. Data centers use spine and leaf: every leaf (top-of-rack) switch connects to every spine and leaves never connect to each other, so east-west traffic between servers always takes the same short, predictable path.');

const days=['Sun','Mon','Tue','Wed','Thu'],dx=i=>170+i*100;
export const backup=FIG(SVG(640,250,'Incremental versus differential backups',
  days.map((d,i)=>T(dx(i),16,d,'sm hd')).join('')+
  T(10,58,'Incremental','sm hd','l')+B(dx(0)-45,40,90,36,'Full','fa ac','xs hd')+[1,2,3,4].map(i=>B(dx(i)-30,44,60,28,'Δ '+days[i],'fa ac','xs')).join('')+
  T(10,98,'Restore Thu: Full + Mon + Tue + Wed + Thu (all five)','xs ta','l')+
  T(10,148,'Differential','sm hd','l')+B(dx(0)-45,130,90,36,'Full','fa ac','xs hd')+[1,2,3,4].map(i=>B(dx(i)-12-i*8,134,24+i*16,28,i===1?'Δ Mon':'Δ Mon–'+days[i],i===4?'fa ac':'dim','xs')).join('')+
  T(10,188,'Restore Thu: Full + Thu\'s differential (just two)','xs ta','l')+
  T(320,222,'Incremental: changes since the last backup of any kind. Fast to back up, slow to restore.','xs tm')+
  T(320,240,'Differential: changes since the last full. Grows each day, quick to restore.','xs tm')),
 'Highlighted blocks are the ones you need to restore Thursday\'s data. Incrementals keep each night small but make restores longer; differentials grow until the next full backup but need only two sets to restore.');
