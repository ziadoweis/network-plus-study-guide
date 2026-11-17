import {T,R,B,C,E,L,A,AA,P,SW,PC,RT,NET,SVG,FIG} from './svg.js';

/* ---------- Lesson 6 ---------- */
const oct=[192,168,10,70],bx=(o,b)=>96+o*134+b*15;
const bits=n=>n.toString(2).padStart(8,'0');
export const ipbits=FIG(SVG(650,192,'An IPv4 address and a /26 mask in binary',
  T(10,24,'Address','sm tm','l')+T(10,58,'Binary','sm tm','l')+T(10,90,'Mask /26','sm tm','l')+
  oct.map((v,o)=>T(bx(o,0)+52,24,v,'hd')+(o<3?T(bx(o,7)+16,24,'.','hd'):'')).join('')+
  oct.map((v,o)=>[...bits(v)].map((d,b)=>T(bx(o,b)+0,58,d,'mo '+(o*8+b<26?'ta':'tg'))).join('')).join('')+
  [255,255,255,192].map((v,o)=>[...bits(v)].map((d,b)=>T(bx(o,b),90,d,'mo '+(o*8+b<26?'ta':'tg'))).join('')).join('')+
  L(bx(0,0)-6,110,bx(3,1)+6,110,'ac thick')+T((bx(0,0)+bx(3,1))/2,126,'Network part: 26 bits','sm ta')+
  L(bx(3,2)-6,110,bx(3,7)+6,110,'ok thick')+T((bx(3,2)+bx(3,7))/2,126,'Host: 6 bits','sm tg')+
  T(325,164,'Network 192.168.10.64  ·  hosts .65 – .126  ·  broadcast .127  ·  2⁶ − 2 = 62 usable','sm')),
 'The mask\'s 1 bits mark the network part and its 0 bits mark the host part. Here /26 borrows two bits from the last octet, so 70 (01000110) belongs to the subnet that starts at 64 (01000000). Setting all host bits to 1 gives the broadcast, .127.');

export const local=FIG(SVG(680,292,'How a host decides between local delivery and the default gateway',
  L(108,120,262,120)+L(300,134,300,190)+L(338,120,458,120)+L(502,120,540,120)+
  PC(80,120,'Host A',58)+T(14,176,'192.168.1.10/24','xs tm','l')+SW(300,120,'Switch',76)+PC(300,205,'Host B',58)+T(300,234,'192.168.1.20','xs tm')+
  RT(480,120,'GW',22)+T(480,160,'Gateway\n192.168.1.1','xs tm')+NET(606,120,62,36,'Remote network\n10.0.0.0/24')+
  P('M92 140 Q150 214 268 206','ok thick',true)+P('M96 102 Q290 18 462 104','ac thick',true)+A(504,108,546,108,'ac')+
  T(14,262,'●  To 192.168.1.20 (same subnet): ARP for Host B\'s MAC and deliver the frame directly.','sm tg','l')+
  T(14,282,'●  To 10.0.0.5 (another subnet): ARP for the gateway\'s MAC and hand the frame to the router.','sm ta','l')),
 'A host ANDs the destination with its own mask. If the network parts match, the destination is local and it ARPs for that host. If not, it sends the frame to the default gateway\'s MAC address, and the router takes it from there.');

/* ---------- Lesson 7 ---------- */
export const nat=FIG(SVG(680,300,'Port address translation on a NAT router',
  T(100,14,'Private (inside)','sm tm')+T(500,14,'Public (outside)','sm tm')+L(300,24,300,170,'dash')+
  L(90,56,226,104)+L(90,152,226,116)+L(264,110,370,110)+L(490,110,560,110)+
  PC(70,56,'PC 1',52)+T(70,84,'192.168.1.10','xs tm')+PC(70,152,'PC 2',52)+T(70,180,'192.168.1.11','xs tm')+
  RT(245,110,'NAT',24)+T(320,92,'203.0.113.5','xs ta','l')+NET(430,110,60,30,'Internet')+PC(610,110,'Web server',90)+T(610,138,'198.51.100.20:443','xs tm')+
  B(100,200,480,28,'','fa')+T(220,214,'Inside local (private)','sm hd')+T(460,214,'Inside global (public)','sm hd')+
  B(100,232,480,26,'','')+T(220,245,'192.168.1.10 : 50001','mo')+T(340,245,'↔','sm')+T(460,245,'203.0.113.5 : 40001','mo ta')+
  B(100,262,480,26,'','')+T(220,275,'192.168.1.11 : 50001','mo')+T(340,275,'↔','sm')+T(460,275,'203.0.113.5 : 40002','mo ta')),
 'PAT (NAT overload). Many private hosts share one public address; the router tells their conversations apart by giving each one its own source port and remembering the mapping in its translation table, so replies find their way back.');

export const ros=FIG(SVG(600,290,'Router on a stick: one trunk, one subinterface per VLAN',
  L(280,72,280,140,'ac thick')+T(292,104,'802.1Q trunk: VLANs 10 and 20','sm ta','l')+
  [[110,'ac'],[220,'ac'],[340,'ok'],[450,'ok']].map(([x])=>L(280,154,x,212)).join('')+
  RT(280,50,'R1',22)+T(312,36,'G0/0.10  192.168.10.1  (VLAN 10)','mo','l')+T(312,58,'G0/0.20  192.168.20.1  (VLAN 20)','mo','l')+
  SW(280,154,'Switch',80)+
  [[110,'VLAN 10','fa ac','ta'],[220,'VLAN 10','fa ac','ta'],[340,'VLAN 20','fg ok','tg'],[450,'VLAN 20','fg ok','tg']].map(([x,v,c,t])=>PC(x,226,'PC',50,28,c)+T(x,256,v,'xs '+t)).join('')+
  T(300,282,'VLAN 10 → VLAN 20: up the trunk to the router, then back down tagged for VLAN 20','xs tm')),
 'Router on a stick. One router interface is split into subinterfaces, one per VLAN, each with an encapsulation dot1Q setting and an IP address that the VLAN\'s hosts use as their default gateway. A Layer 3 switch does the same job with SVIs.');

/* ---------- Lesson 8 ---------- */
export const socket=FIG(SVG(600,136,'A connection is identified by two sockets',
  B(20,26,160,52,'Client\n192.168.1.10','fa','sm hd')+B(420,26,160,52,'Web server\n203.0.113.80','fg','sm hd')+
  A(184,52,416,52,'ac')+T(300,38,'TCP segment','xs tm')+T(300,68,'src port 51514  →  dst port 443','mo ta')+
  T(100,100,'Source socket 192.168.1.10:51514','xs')+T(100,118,'ephemeral port (49152–65535)','xs tm')+
  T(500,100,'Destination socket 203.0.113.80:443','xs')+T(500,118,'well-known port (0–1023): HTTPS','xs tm')),
 'IP addresses get data to the right device; port numbers get it to the right application. The server answers back to the client\'s ephemeral port, which is how one PC can hold many connections at once.');

/* ---------- Lesson 9 ---------- */
export const dns=FIG(SVG(660,300,'Recursive DNS resolution',
  AA(92,140,196,140,'ac')+T(144,170,'1  www.example.com?\n8  93.184.216.34','xs ta')+
  PC(60,140,'Client',60)+B(200,112,110,56,'Recursive\nresolver','dev','sm hd')+T(255,186,'caches the answer\nfor its TTL','xs tm')+
  [[46,'Root (.)','2–3  “ask the .com servers”'],[142,'.com TLD','4–5  “ask ns1.example.com”'],[238,'example.com\nauthoritative','6–7  “93.184.216.34”']].map(([y,s,t],i)=>
    A(312,140-8+i*8,470,y-6,'ac')+A(470,y+8,312,148-8+i*8,'dash')+B(474,y-22,170,44,s,'dev','sm hd')+T(559,y+36,t,'xs tm')).join('')),
 'The client asks its resolver once (a recursive query). The resolver then does the legwork with iterative queries: the root points it to the .com servers, those point it to example.com\'s authoritative servers, and they give the answer. The resolver caches it and replies.');

export const dora=FIG(SVG(520,262,'DHCP: Discover, Offer, Request, Acknowledge',
  T(100,18,'Client','hd')+T(420,18,'DHCP server','hd')+L(100,32,100,222)+L(420,32,420,222)+
  A(100,54,418,78,'ac')+T(260,52,'1  Discover (broadcast)','sm ta')+
  A(420,96,102,120,'ok')+T(260,94,'2  Offer: 192.168.1.50','sm tg')+
  A(100,138,418,162,'ac')+T(260,136,'3  Request (broadcast)','sm ta')+
  A(420,180,102,204,'ok')+T(260,178,'4  Ack: lease + mask, gateway, DNS','sm tg')+
  T(260,244,'Client UDP 68 ↔ server UDP 67. Across routers, a DHCP relay (ip helper-address) forwards them.','xs tm')),
 'DORA. The client has no address yet, so it broadcasts. The server offers an address, the client requests it (also by broadcast, so other servers know), and the server acknowledges with the lease and options. If no server answers, Windows falls back to an APIPA address, 169.254.x.x.');

/* ---------- Lesson 10 ---------- */
export const cia=FIG(SVG(420,268,'The CIA triad',
  `<polygon points="210,52 360,214 60,214" class="fa ac"/>`+T(210,152,'CIA','hd ta')+
  T(210,16,'Confidentiality','hd')+T(210,34,'only authorized people can read it','xs tm')+
  T(62,236,'Integrity','hd')+T(62,254,'data isn\'t altered','xs tm')+
  T(358,236,'Availability','hd')+T(358,254,'it\'s there when needed','xs tm')),
 'Every security control protects at least one side of the triad. Encryption protects confidentiality, hashing and digital signatures protect integrity, and redundancy, backups and DoS protection protect availability.');

const flow=(y,k1,k2)=>B(10,y,80,44,'Plaintext','','sm')+A(92,y+22,118,y+22)+B(120,y,110,44,'Encrypt with\n'+k1,'fa','xs')+A(232,y+22,258,y+22)+B(260,y,100,44,'Ciphertext','','mo')+A(362,y+22,388,y+22)+B(390,y,110,44,'Decrypt with\n'+k2,'fg','xs')+A(502,y+22,528,y+22)+B(530,y,80,44,'Plaintext','','sm');
export const crypto=FIG(SVG(620,228,'Symmetric versus asymmetric encryption',
  T(10,14,'Symmetric (AES): one shared secret key','sm hd ta','l')+flow(28,'key K','the same key K')+
  T(10,102,'Asymmetric (RSA, ECC): a public/private key pair','sm hd ta','l')+flow(116,'Bob\'s public key','Bob\'s private key')+
  T(310,196,'TLS uses asymmetric keys to agree a shared key, then fast symmetric encryption for the data.','xs tm')+
  T(310,214,'Signing is the reverse: sign with your private key, anyone verifies with your public key.','xs tm')),
 'Symmetric encryption is fast but both sides need the same secret. Asymmetric encryption solves key sharing: anyone can encrypt with Bob\'s public key, but only Bob\'s private key decrypts.');
