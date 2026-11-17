import {store,esc,head,nav,state,PT_META,shuffle,registry} from './core.js';
import {LESSON_META} from './lesson-meta.js';
const main=document.getElementById('main');
const VIEWS={};

/* ---------- plan data ----------
   Task: [text, go?, auto?]
   go:   a page hash ('lab-osi', 'pt-vlans', 'corrections') or 'quiz:<key>' (o1.1 objective, d5 domain, c8 book chapter)
   auto: {q:'o1.1'} quiz key best ≥ 85% · {lab:'osi',best:85} · {lab:'cli',done:1} · {cli:['t2','t4']} · {pt:'pt-vlans'}
         {domains:85} every domain quiz ≥ 85% · {mocks:3} three mock exams ≥ 85% on different days */
const RECALL=['Recall the "Memorize" points without notes'];
const ptn=slug=>PT_META.findIndex(p=>p.slug===slug)+1;
const LQ=n=>[`Quiz: Lesson ${n}`,'quiz:l'+n,{q:'l'+n}];
const PT=(slug,extra='')=>[`Packet Tracer lab ${ptn(slug)}: ${PT_META[ptn(slug)-1].title}${extra}`,slug,{pt:slug}];
const N=(n,id)=>[`Read Lesson ${n}`,'notes-'+n,{notes:n}].concat(id?[id]:[]);
const FIX=what=>[`Check the ${what} correction on the Corrections page`,'corrections'];
const C=(n,title,meta,tasks)=>({n,title,meta,tasks,mem:MEM[n]});
const MEM={1:['The 7 layers and their PDUs: bits, frame, packet, segment/datagram, data. Bottom up: Please Do Not Throw Sausage Pizza Away.','At every router hop the frame and its MAC addresses are rebuilt; the IP addresses stay the same.','The TCP/IP model\'s 4 layers and which OSI layers each covers.','TCP is connection-oriented (handshake SYN → SYN/ACK → ACK; FIN closes gracefully, RST abruptly). UDP is connectionless.'],2:['T568A vs T568B pin order. Straight-through = unlike devices, crossover = like devices, rollover = console.','Full mesh needs n(n−1)/2 links. A star\'s central device is a single point of failure.','Fiber connectors: LC (small, on SFPs), SC (square), ST (bayonet), MPO (multi-fiber). Never mate APC (green) with UPC (blue).','Plenum cable goes in air-handling spaces; riser cable goes between floors.'],3:['Ethernet frame fields. Default MTU 1500 bytes; frame size 64–1518 bytes (1522 with a VLAN tag).','Hub = one collision domain. Switch = one collision domain per port. Router = splits broadcast domains.','A MAC address is 48 bits: a 24-bit OUI (vendor) plus 24 bits assigned by the vendor.'],4:['1000BASE-T uses all four pairs of Cat 5e, up to 100 m. 10GBASE-T needs Cat 6a for 100 m (Cat 6 manages about 55 m). Cat 8 runs 25/40G up to 30 m.','Optics: SR = multimode short reach, LR = single-mode 10 km, ER = 40 km.','Transceiver speeds: SFP 1G, SFP+ 10G, SFP28 25G, QSFP+ 40G, QSFP28 100G. DAC is cheap copper for short rack links.'],5:['MDF vs IDF. 1U = 1.75 in. Equipment fronts face the cold aisle.','UPS types: standby, line-interactive, online (double conversion). A generator needs a UPS to cover its start-up gap.','Tools: TDR (copper fault distance), OTDR (fiber fault distance), toner probe (trace a cable), certifier (proves the category spec), visual fault locator (shows fiber breaks), punchdown tool (110 blocks).'],6:['Private ranges: 10.0.0.0/8, 172.16.0.0–172.31.255.255, 192.168.0.0/16. APIPA = 169.254.0.0/16. Loopback = 127.0.0.1.','Block size = 256 − the mask value in the interesting octet. The broadcast is one less than the next subnet.','Usable hosts for /24 to /30: 254, 126, 62, 30, 14, 6, 2.','/31 is for point-to-point links; /32 is a single host. A destination is local if the network parts match after ANDing with the mask; otherwise the frame goes to the default gateway.'],7:['Route choice: longest prefix match first, then lowest administrative distance, then lowest metric.','Default ADs: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120.','RIP = distance vector (max 15 hops), OSPF = link state, EIGRP = hybrid, BGP = path vector between autonomous systems.','PAT = many inside hosts share one public IP by port. Inside local = the private address; inside global = the public one.','VRRP and HSRP give hosts a redundant default gateway.'],8:['Every port in the N10-009 table on the Ports lab page, with its TCP/UDP transport.','Port ranges: well-known 0–1023, registered 1024–49151, dynamic 49152–65535.','Secure replacements: Telnet → SSH, HTTP → HTTPS, LDAP → LDAPS, SNMPv1/v2c → SNMPv3, FTP → SFTP.','IPsec: AH = integrity only, ESP = encryption, IKE = key exchange (UDP 500). Transport mode protects the payload; tunnel mode wraps the whole packet. GRE tunnels without encrypting.'],9:['DHCP: Discover, Offer, Request, Acknowledge on UDP 67/68. A reservation fixes one IP to a MAC; an exclusion keeps addresses out of the pool. A relay (ip helper-address) forwards DHCP across routers.','DNS records: A, AAAA, CNAME, MX, NS, SOA, PTR, TXT, SRV.','"Works by IP, fails by name" = DNS. DNSSEC protects integrity; DoH (443) and DoT (853) protect privacy.'],10:['The CIA triad. Symmetric encryption is fast for bulk data (AES); asymmetric uses key pairs (RSA, ECC). Hashing proves integrity.','RADIUS: UDP 1812/1813, encrypts only the password. TACACS+: TCP 49, encrypts everything, separates AAA.','Kerberos is an open MIT standard on port 88, and it fails if clocks drift more than about 5 minutes.','RBAC = permissions by role (job function); least privilege; MFA needs two different factor types (something you know, have, are).'],11:['Access port = one untagged VLAN. Trunk = many VLANs with 802.1Q tags. The native VLAN is untagged and must match on both ends.','STP elects the root bridge with the lowest bridge ID. Port states: blocking, listening, learning, forwarding. BPDU Guard shuts down an edge port that receives a BPDU.','PoE: 802.3af = 15.4 W, 802.3at (PoE+) = 30 W, 802.3bt = 60/90 W.','A duplex mismatch causes late collisions, CRC errors and slow transfers.'],12:['Shortening: drop leading zeros in each group, and replace one run of zero groups with ::.','Prefixes: 2000::/3 global, fe80::/10 link-local, fc00::/7 unique local (fd00::/8 in practice), ff00::/8 multicast, ::1 loopback. No broadcast.','EUI-64: split the MAC, insert FFFE, flip the 7th bit.','NDP (RS, RA, NS, NA) replaces ARP. SLAAC vs stateless DHCPv6 vs stateful DHCPv6. Transition: dual stack, 6to4, Teredo, ISATAP, NAT64.'],13:['VPN types: site-to-site, client-to-site, clientless (browser). Split tunnel vs full tunnel. IPsec tunnel mode vs transport mode.','WAN options: MPLS, Metro Ethernet, DSL (ADSL/SDSL/VDSL), cable, fiber, satellite (high latency), cellular. The demarc is where the provider\'s responsibility ends.','In-band vs out-of-band management. A jump box is the controlled entry point for admins. RDP = 3389, VNC = 5900.'],14:['802.11 a/b/g/n/ac/ax: band and top speed of each. Wi-Fi 4/5/6/6E names. OFDMA arrived with 802.11ax.','2.4 GHz non-overlapping channels are 1, 6, 11. 6 GHz (Wi-Fi 6E) requires WPA3.','WPA3 uses SAE. Personal = shared passphrase; Enterprise = 802.1X + RADIUS.','Omnidirectional vs directional antennas. Wi-Fi uses CSMA/CA. A site survey produces a heat map.'],15:['IaaS vs PaaS vs SaaS (who manages what). Public, private and hybrid clouds. Scalability vs elasticity.','Security groups are stateful and apply per instance; security lists (NACLs) are usually stateless and apply per subnet. An Internet gateway allows two-way traffic; a NAT gateway allows outbound only.','Type 1 (bare-metal) vs Type 2 (hosted) hypervisors. NFV = network appliances as VMs.','SDN separates the control plane from the data plane. VXLAN uses UDP 4789 and a 24-bit VNI. SASE = SD-WAN + cloud security. Zero trust = verify every request.'],16:['Spine-and-leaf: every leaf connects to every spine. North-south traffic goes in and out of the data center; east-west traffic stays between servers.','NAS = file-level storage; SAN = block-level (Fibre Channel, FCoE, iSCSI).','RPO = acceptable data loss; RTO = acceptable downtime. MTTR and MTBF.','Hot, warm and cold sites. Full, incremental and differential backups. Active-active vs active-passive.'],17:['Put IoT devices on their own VLAN or SSID and change their default credentials.','ICS/SCADA puts availability first and is often legacy, so isolate it hard (air gaps).','VoIP: SIP 5060/5061 for signaling, RTP for media, a voice VLAN, and QoS because voice is sensitive to jitter.'],18:['SLA availability: 99.9% ≈ 8.76 h/year down, 99.99% ≈ 52.6 min, 99.999% ≈ 5.26 min.','Documents: SLA, MOU, NDA, SOW, MSA. Physical vs logical diagrams. IPAM. EOL vs EOS.','Change management: request → impact → approval → maintenance window → backout plan → implement → verify → document.','Incident response: preparation → detection → containment → eradication → recovery → lessons learned.'],19:['Attack → defense: ARP poisoning → Dynamic ARP Inspection. Rogue DHCP → DHCP snooping. MAC flooding → port security. Rogue switch → BPDU Guard. Rogue IPv6 RA → RA Guard. VLAN hopping → static access ports, no DTP, unused native VLAN.','ACLs are read top-down, the first match wins, and an implicit deny sits at the end. Public servers go in a screened subnet.','802.1X: supplicant, authenticator, authentication server (RADIUS). EAP-TLS is the strongest EAP method.','Social engineering: phishing, spear phishing, whaling, vishing, smishing. Tailgating is without consent; piggybacking is with consent.'],20:['SNMP: the manager polls agents on UDP 161; agents send traps to UDP 162. The MIB describes objects, each identified by an OID. Only v3 encrypts.','Syslog uses UDP 514. Severity 0–7: Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debug.','NetFlow = conversation metadata; a packet capture = full payload. A tap copies everything; a SPAN port can drop errored frames. A SIEM correlates logs.','Interface counters: CRC errors, runts (under 64 bytes), giants (over 1518 bytes). A baseline tells you what normal looks like.'],21:['The 7 steps in order: identify, theory, test, plan, implement or escalate, verify, document.','Four-step ping test: 127.0.0.1 → your own IP → default gateway → a remote host, then a name to test DNS.','Symptom → cause: 169.254.x.x → DHCP. Local works, remote doesn\'t → gateway. IP works, name doesn\'t → DNS. Wrong subnet after a desk move → wrong VLAN. Broadcast storm → switching loop. err-disabled → port security or BPDU Guard.','Commands: ipconfig, ping, tracert/traceroute, nslookup/dig, netstat, arp -a, route print, ip, plus the Cisco show commands.'],'F':['Read for qualifiers: FIRST, BEST, MOST likely.','If a performance-based question is eating time, flag it and come back.','After you pass: the CCNA is next, and Packet Tracer labs 2–7 and 10–12 are already CCNA practice.']};

export const PLAN=[
{phase:'Phase 1: Foundations',span:'Lessons 1–5',intro:'The vocabulary every later topic uses: layers, cables, frames and physical installs. About two weeks.',chapters:[
 C(1,'Network Models','Objective 1.1 · Book Ch. 1, 2',[N(1),LQ(1),['Lab: OSI layer sorter at 85%+','lab-osi',{lab:'osi',best:85}],RECALL]),
 C(2,'Cabling and Topology','Objectives 1.5, 1.6 · Book Ch. 1, 3',[N(2),LQ(2),['Lab: Cables and connectors (Lesson 2 set) at 80%+','lab-cables',{lab:'cables',set:2,best:80}],FIX('RG-32'),RECALL]),
 C(3,'Ethernet Basics','Objectives 1.1, 1.2 · Book Ch. 4, 5',[N(3),LQ(3),RECALL]),
 C(4,'Ethernet Standards','Objective 1.5 · Book Ch. 4',[N(4,'c4-notes'),LQ(4),['Lab: Ethernet standards and optics (Lesson 4 set) at 80%+','lab-cables',{lab:'cables',set:4,best:80}],FIX('SFP and 1000BASE-TX'),RECALL]),
 C(5,'Installing a Physical Network','Objectives 2.4, 5.2 · Book Ch. 3, 16',[N(5),LQ(5),['Lab: Installation and test tools (Lesson 5 set) at 80%+','lab-cables',{lab:'cables',set:5,best:80}],RECALL])]},
{phase:'Phase 2: TCP/IP, routing and services',span:'Lessons 6–10',intro:'The heaviest phase: subnetting, routing and ports carry much of Domains 1 and 2, and your first five Packet Tracer builds. About three weeks. Don\'t move on until you can subnet a /27 in under a minute.',chapters:[
 C(6,'TCP/IP Basics','Objectives 1.7, 1.4 · Book Ch. 6, 7, 8',[N(6),LQ(6),['Lab: Subnetting, a streak of 10 on Find the subnet, Size a subnet and Binary','lab-subnet'],PT('pt-first-lan',' (Parts 1–3; Parts 4 and 5 come after Lesson 13)'),FIX('Class A (1–126)'),RECALL]),
 C(7,'Routing','Objective 2.1 · Book Ch. 8, 9, 10',[N(7),LQ(7),PT('pt-static-routing'),PT('pt-ospf',` (builds on lab ${ptn('pt-static-routing')}'s file)`),PT('pt-nat'),RECALL]),
 C(8,'TCP/IP Applications','Objective 1.4 · Book Ch. 6',[N(8,'c8-notes'),LQ(8),['Lab: Ports and protocols at 90%+ (then once more with the extra book ports)','lab-ports',{lab:'ports',best:90}],FIX('SMTPS (587)'),RECALL]),
 C(9,'Network Naming','Objective 3.4 · Book Ch. 5, 7',[N(9),LQ(9),['Lab: CLI troubleshooting tickets 2 and 4 (DHCP failure, wrong DNS server)','lab-cli',{cli:['t2','t4']}],PT('pt-services',' (Parts 1–3 and 6; syslog and SNMP wait for Lesson 20)'),RECALL]),
 C(10,'Securing TCP/IP','Objectives 4.1, 1.4 · Book Ch. 20',[N(10),LQ(10),FIX('Kerberos, ESP/EAP and RBAC'),RECALL])]},
{phase:'Phase 3: Switching, IPv6, WAN and wireless',span:'Lessons 11–14',intro:'The most hands-on phase: four Packet Tracer builds plus the switch simulator. Two to three weeks, and your first look at CCNA material.',chapters:[
 C(11,'Switch Features','Objective 2.2 · Book Ch. 11',[N(11),LQ(11),['Lab: Switch configuration (IOS), all 8 objectives','lab-switch',{lab:'switch',done:1}],PT('pt-vlans'),PT('pt-intervlan-dhcp',` (builds on lab ${ptn('pt-vlans')}'s file)`),FIX('PoE+'),RECALL]),
 C(12,'IPv6','Objective 1.8 · Book Ch. 7',[N(12),LQ(12),['Lab: Subnetting, a streak of 10 on IPv6 shorthand and on EUI-64','lab-subnet'],PT('pt-ipv6'),RECALL]),
 C(13,'WAN Connectivity','Objectives 3.5, 1.6 · Book Ch. 13, 1',[N(13),LQ(13),[`Packet Tracer lab ${ptn('pt-first-lan')}, Parts 4 and 5: console security, passwords and SSH-only remote access`,'pt-first-lan'],[`Revisit Packet Tracer lab ${ptn('pt-nat')} and point out where the demarc would sit on a real ISP link`,'pt-nat'],FIX('L2TP'),RECALL]),
 C(14,'Wireless','Objectives 2.3, 5.4 · Book Ch. 12',[N(14),LQ(14),PT('pt-wireless',' (try the RADIUS stretch goal)'),FIX('MU-MIMO'),RECALL])]},
{phase:'Phase 4: Cloud, data centers, devices and operations',span:'Lessons 15–18',intro:'Mostly concepts and definitions, so quiz-heavy and lighter on labs. About two weeks.',chapters:[
 C(15,'Virtualization and Cloud','Objectives 1.3, 1.8 · Book Ch. 17',[N(15),LQ(15),RECALL]),
 C(16,'Data Centers','Objectives 1.6, 1.2, 3.3 · Book Ch. 16, 17',[N(16),LQ(16),FIX('hot-site'),RECALL]),
 C(17,'Integrating Network Devices','Objectives 4.1, 2.2, 1.4 · Book Ch. 5, 21',[N(17),LQ(17),[`Open your Packet Tracer lab ${ptn('pt-vlans')} file and sketch where you'd add an IoT VLAN and a voice VLAN`,'pt-vlans'],RECALL]),
 C(18,'Network Operations','Objectives 3.1, 3.3 · Book Ch. 15, 16',[N(18),LQ(18),RECALL])]},
{phase:'Phase 5: Security, monitoring and troubleshooting',span:'Lessons 19–21',intro:'38% of the exam (Domains 4 and 5) and most of the performance-based questions. About three weeks.',chapters:[
 C(19,'Protecting Networks','Objectives 4.2, 4.3 · Book Ch. 21',[N(19),LQ(19),['Lab: Firewall rule evaluation, both scenarios at 100%','lab-acl',{lab:'acl',done:1}],PT('pt-acl'),PT('pt-switch-security'),['Check the CompTIA terminology table on the Corrections page (on-path attack, screened subnet, access control vestibule)','corrections'],RECALL]),
 C(20,'Network Monitoring','Objective 3.2 · Book Ch. 14',[N(20),LQ(20),[`Packet Tracer lab ${ptn('pt-services')}, Parts 4 and 5: syslog and SNMP. Name the severity of each log message`,'pt-services'],RECALL]),
 C(21,'Network Troubleshooting','Objectives 5.1–5.5 · Book Ch. 18, 19',[N(21),LQ(21),['Lab: Troubleshooting methodology, both parts at 100%','lab-method',{lab:'method',done:1}],['Lab: CLI troubleshooting tickets, all six solved','lab-cli',{lab:'cli',done:1}],PT('pt-break-fix',` (uses lab ${ptn('pt-intervlan-dhcp')}'s file)`),RECALL])]},
{phase:'Final review and exam readiness',span:'last week',intro:'Book the exam once every task here is done. Spend the final week here rather than on new material.',chapters:[
 C('F','Exam readiness','Up to 90 questions · 90 minutes · pass mark 720 (100–900)',[PT('pt-capstone',', built from the brief without looking back'),['Every domain quiz at 85%+','quiz',{domains:85}],['Mock exam at 85%+ on three different days','exam',{mocks:3}],['Subnet any /26–/29 problem in under a minute, and score 90%+ on the Ports sprint','lab-subnet'],['Timed performance-based practice: Switch configuration, Firewall rules, and Cables, each in one sitting','lab-switch'],['Download the N10-009 objectives PDF from comptia.org and tick every line you can explain out loud'],['Reread the Corrections page','corrections'],['Book the exam with Pearson VUE, 1–2 weeks out']])]}];

/* Task ids come from what a task is (not its position), so reordering never moves your ticks.
   OLD_IDS maps the earlier position-based ids of hand-ticked tasks to the new ones (one-time migration). */
const sid=s=>s.replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,28);
const taskId=(c,t)=>t[3]||`c${c.n}-`+(t[2]&&t[2].notes?'notes':t[2]&&t[2].q&&t[2].q[0]==='l'?'quiz':t===RECALL?'recall':t[1]?sid(t[1]):sid(t[0]));
const OLD_IDS={"c1-0":"c1-notes","c1-1":"c1-quiz","c1-2":"c1-lab-osi","c1-3":"c6-pt-first-lan","c1-4":"c1-recall","c2-0":"c2-notes","c2-1":"c2-quiz","c2-2":"c2-quiz","c2-3":"c2-lab-cables","c2-4":"c2-corrections","c2-5":"c2-recall","c3-0":"c3-notes","c3-1":"c3-quiz","c3-2":"c6-pt-first-lan","c3-3":"c3-recall","c4-0":"c4-quiz","c4-1":"c4-lab-cables","c4-2":"c4-corrections","c4-3":"c4-recall","c5-0":"c5-notes","c5-1":"c5-quiz","c5-2":"c5-quiz","c5-3":"c5-lab-cables","c5-4":"c5-recall","c6-0":"c6-notes","c6-1":"c6-quiz","c6-2":"c6-quiz","c6-3":"c6-lab-subnet","c6-4":"c6-corrections","c6-5":"c6-recall","c7-0":"c7-notes","c7-1":"c7-quiz","c7-2":"c7-pt-static-routing","c7-3":"c7-pt-ospf","c7-4":"c7-pt-nat","c7-5":"c7-recall","c8-0":"c8-quiz","c8-1":"c8-lab-ports","c8-2":"c8-corrections","c8-3":"c8-recall","c9-0":"c9-notes","c9-1":"c9-quiz","c9-2":"c9-lab-cli","c9-3":"c9-pt-services","c9-4":"c9-recall","c10-0":"c10-notes","c10-1":"c10-quiz","c10-2":"c13-pt-first-lan","c10-3":"c10-corrections","c10-4":"c10-recall","c11-0":"c11-notes","c11-1":"c11-quiz","c11-2":"c11-lab-switch","c11-3":"c11-pt-vlans","c11-4":"c11-pt-intervlan-dhcp","c11-5":"c11-corrections","c11-6":"c11-recall","c12-0":"c12-notes","c12-1":"c12-quiz","c12-2":"c12-lab-subnet","c12-3":"c12-pt-ipv6","c12-4":"c12-recall","c13-0":"c13-notes","c13-1":"c13-quiz","c13-2":"c13-pt-nat","c13-3":"c13-corrections","c13-4":"c13-recall","c14-0":"c14-notes","c14-1":"c14-quiz","c14-2":"c14-quiz","c14-3":"c14-pt-wireless","c14-4":"c14-corrections","c14-5":"c14-recall","c15-0":"c15-notes","c15-1":"c15-quiz","c15-2":"c15-quiz","c15-3":"c15-recall","c16-0":"c16-notes","c16-1":"c16-quiz","c16-2":"c16-quiz","c16-3":"c16-corrections","c16-4":"c16-recall","c17-0":"c17-notes","c17-1":"c17-quiz","c17-2":"c17-pt-vlans","c17-3":"c17-recall","c18-0":"c18-notes","c18-1":"c18-quiz","c18-2":"c18-quiz","c18-3":"c18-recall","c19-0":"c19-notes","c19-1":"c19-quiz","c19-2":"c19-quiz","c19-3":"c19-lab-acl","c19-4":"c19-pt-acl","c19-5":"c19-pt-switch-security","c19-6":"c19-corrections","c19-7":"c19-recall","c20-0":"c20-notes","c20-1":"c20-quiz","c20-2":"c20-pt-services","c20-3":"c20-recall","c21-0":"c21-notes","c21-1":"c21-quiz","c21-2":"c21-lab-method","c21-3":"c21-lab-cli","c21-4":"c21-pt-break-fix","c21-5":"c21-recall","cF-0":"cF-pt-capstone","cF-1":"cF-quiz","cF-2":"cF-exam","cF-3":"cF-lab-subnet","cF-4":"cF-lab-switch","cF-5":"cF-Download-the-N10-009-objecti","cF-6":"cF-corrections","cF-7":"cF-Book-the-exam-with-Pearson-V"};
const OLD_TICKS={"c1-4":"c1-recall","c2-4":"c2-corrections","c2-5":"c2-recall","c3-3":"c3-recall","c4-2":"c4-corrections","c4-3":"c4-recall","c5-4":"c5-recall","c6-3":"c6-lab-subnet","c6-4":"c6-corrections","c6-5":"c6-recall","c7-5":"c7-recall","c8-2":"c8-corrections","c8-3":"c8-recall","c9-4":"c9-recall","c10-2":"c13-pt-first-lan","c10-3":"c10-corrections","c10-4":"c10-recall","c11-5":"c11-corrections","c11-6":"c11-recall","c12-2":"c12-lab-subnet","c12-4":"c12-recall","c13-2":"c13-pt-nat","c13-3":"c13-corrections","c13-4":"c13-recall","c14-4":"c14-corrections","c14-5":"c14-recall","c15-3":"c15-recall","c16-3":"c16-corrections","c16-4":"c16-recall","c17-2":"c17-pt-vlans","c17-3":"c17-recall","c18-3":"c18-recall","c19-6":"c19-corrections","c19-7":"c19-recall","c20-2":"c20-pt-services","c20-3":"c20-recall","c21-5":"c21-recall","cF-3":"cF-lab-subnet","cF-4":"cF-lab-switch","cF-5":"cF-Download-the-N10-009-objecti","cF-6":"cF-corrections","cF-7":"cF-Book-the-exam-with-Pearson-V"};
(function migrateTicks(){if(store.get('planV',0)>=2)return;const m=store.get('plan',{}),n={};for(const k in m)if(!/^c(\d+|F)-\d+$/.test(k)||OLD_TICKS[k])n[OLD_TICKS[k]||k]=m[k];store.set('plan',n);store.set('planV',2)})();
(function moveTicksV3(){if(store.get('planV',0)>=3)return;const m=store.get('plan',{});if(m['c10-pt-first-lan']){m['c13-pt-first-lan']=true;delete m['c10-pt-first-lan']}store.set('plan',m);store.set('planV',3)})();
/* ---------- progress ---------- */
function autoDone(a){
  if(!a)return false;
  if(a.q){const kb=store.get('quizKeyBest',{});let v=kb[a.q];if(a.q[0]==='d'&&v==null)v=store.get('quizBest',{})[+a.q.slice(1)];return (v??0)>=85}
  if(a.pt)return !!store.get('pt',{})[a.pt];
  if(a.notes)return !!store.get('notesRead',{})[a.notes];
  if(a.lab){const L=store.get('labs',{})[a.lab]||{};if(a.done)return !!L.done;if(a.set)return ((L.sets||{})[a.set]??(a.set===2?L.best:0)??0)>=a.best;if(a.best)return (L.best??0)>=a.best}
  if(a.cli){const s=(store.get('labs',{}).cli||{}).solved||[];return a.cli.every(x=>s.includes(x))}
  if(a.domains){const b=store.get('quizBest',{});return [1,2,3,4,5].every(d=>(b[d]??0)>=a.domains)}
  if(a.mocks){const ex=store.get('exams',[]);return new Set(ex.filter(e=>e.pct>=85).map(e=>e.date)).size>=a.mocks}
  return false;
}
export function progress(){
  const man=store.get('plan',{});let total=0,done=0,next=null;const items=[];
  const rows=PLAN.map((ph,pi)=>({...ph,pi,chapters:ph.chapters.map(c=>{
    const tasks=c.tasks.map(t=>{const id=taskId(c,t),spec=t[2]||null,auto=autoDone(spec),d=auto||(!spec&&!!man[id]);total++;if(d)done++;
      const r={id,text:t[0],go:t[1],spec,hasAuto:!!spec,auto,done:d,chapter:c,pi};r.kind=kindOf(r);r.manual=!spec||!!spec.notes||!!spec.pt;
      if(!d&&!next)next={chapter:c,phase:ph,task:r};items.push(r);return r});
    return {...c,tasks,doneN:tasks.filter(t=>t.done).length}})}));
  return {rows,total,done,next,items};
}
function kindOf(t){const g=t.go||'',s=t.spec||{};
  if(s.notes||g.startsWith('notes-')||g==='corrections')return 'reading';
  if(g.startsWith('quiz')||g==='exam')return 'quiz';
  if(g.startsWith('pt-'))return 'pt';
  if(g.startsWith('lab-'))return 'lab';
  if(/^Recall/.test(t.text))return 'recall';
  return 'task';}
const KIND={reading:'Reading',quiz:'Quiz',lab:'Lab',pt:'Packet Tracer',recall:'Self-check',task:'Task'};
const lmin=t=>((LESSON_META.find(l=>l.n===t.spec.notes)||{}).min||15)+' min';
const dur=t=>t.kind==='reading'?(t.spec&&t.spec.notes?lmin(t):t.go==='corrections'?'5 min':'15 min'):t.kind==='quiz'?(t.go==='exam'?'30 min':'10 min'):t.kind==='lab'?'15 min':t.kind==='pt'?((PT_META.find(p=>p.slug===t.go)||{}).time||'45 min'):'5 min';
const moduleName=(ph,i)=>ph.phase.startsWith('Phase')?ph.phase.replace(/^Phase (\d+): /,'Module $1: '):`Module ${i+1}: Final review`;
const itemTitle=t=>t.spec&&t.spec.notes?`Lesson ${t.spec.notes}: ${(LESSON_META.find(l=>l.n===t.spec.notes)||t.chapter).title}`:t.text;
const shortTitle=t=>t.spec&&t.spec.notes?'Lesson':t.text.replace(/^Packet Tracer lab (\d+): /,'Packet Tracer $1: ');
const ICON={
 reading:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3h4.5A1.5 1.5 0 0 1 8 4.5V13a1 1 0 0 0-1-1H2zM14 3H9.5A1.5 1.5 0 0 0 8 4.5V13a1 1 0 0 1 1-1h5z"/></svg>',
 quiz:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2.5" width="10" height="11" rx="1.5"/><path d="M5.5 8l1.8 1.8L10.5 6.5"/></svg>',
 lab:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2h4M7 2v4L3.5 12.5a1 1 0 0 0 .9 1.5h7.2a1 1 0 0 0 .9-1.5L9 6V2M5 10h6"/></svg>',
 pt:'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="3.5" r="1.6"/><circle cx="3.5" cy="12" r="1.6"/><circle cx="12.5" cy="12" r="1.6"/><path d="M7.2 4.9 4.3 10.6M8.8 4.9l2.9 5.7M5.1 12h5.8"/></svg>',
 recall:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12.5h4M6.5 14.5h3M8 1.8a4.2 4.2 0 0 0-2.6 7.5c.5.4.9 1 .9 1.6v.3h3.4v-.3c0-.6.4-1.2.9-1.6A4.2 4.2 0 0 0 8 1.8z"/></svg>',
 task:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 14.5V2M3.5 2.5h8.5l-1.6 3 1.6 3H3.5"/></svg>',
 check:'<svg class="ck" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.2" style="fill:var(--good);stroke:none"/><path d="M4.7 8.3l2.2 2.2 4.4-4.6" style="fill:none;stroke:#0f1a14;stroke-width:1.9"/></svg>'};
function reqText(t){const s=t.spec||{};
  if(s.q){const kb=store.get('quizKeyBest',{});let b=kb[s.q];if(s.q[0]==='d'&&b==null)b=store.get('quizBest',{})[+s.q.slice(1)];return `Completes automatically when you score 85% or more. ${b==null?'Not attempted yet.':'Best so far: '+b+'%.'}`}
  if(s.lab){const L=store.get('labs',{})[s.lab]||{};
    if(s.set){const b=(L.sets||{})[s.set]??(s.set===2?L.best:undefined);return `Completes automatically at ${s.best}% or more on the Lesson ${s.set} set. ${b==null?'Not attempted yet.':'Best so far: '+b+'%.'}`}
    if(s.best)return `Completes automatically at ${s.best}% or more. ${L.best==null?'Not attempted yet.':'Best so far: '+L.best+'%.'}`;
    const need={switch:'all 8 switch objectives',acl:'both firewall scenarios at 100%',method:'both parts at 100%',cli:'all six tickets solved'}[s.lab]||'the lab';
    return `Completes automatically with ${need}.${s.lab==='cli'?` Solved so far: ${(L.solved||[]).length} of 6.`:''}`}
  if(s.cli){const sv=(store.get('labs',{}).cli||{}).solved||[];return `Completes automatically when tickets ${s.cli.map(x=>x.slice(1)).join(' and ')} are solved. Solved so far: ${s.cli.filter(x=>sv.includes(x)).length} of ${s.cli.length}.`}
  if(s.domains){const b=store.get('quizBest',{});return `Completes automatically when every domain quiz is at 85%+. Now: ${[1,2,3,4,5].map(d=>`${d}.0 ${b[d]==null?'—':b[d]+'%'}`).join(' · ')}.`}
  if(s.mocks){const ex=store.get('exams',[]);return `Completes automatically after ${s.mocks} mock exams at 85%+ on different days. So far: ${new Set(ex.filter(e=>e.pct>=85).map(e=>e.date)).size}.`}
  return 'Mark this item as completed when you\'re done.';}
function setManual(t,val){
  if(t.spec&&t.spec.notes){const r=store.get('notesRead',{});if(val)r[t.spec.notes]=true;else delete r[t.spec.notes];store.set('notesRead',r)}
  else if(t.spec&&t.spec.pt){const d=store.get('pt',{});d[t.spec.pt]=val;store.set('pt',d)}
  else{const m=store.get('plan',{});if(val)m[t.id]=true;else delete m[t.id];store.set('plan',m)}}

/* ---------- course outline (sidebar) ---------- */
const openMods=new Set();let lastAuto=null;
export function renderOutline(box,curId){
  const p=progress(),pct=Math.round(p.done/p.total*100);
  const cur=p.items.find(t=>t.id===curId),focus=cur||(p.next&&p.next.task);
  const fm=focus?String(focus.pi):null;if(fm!==null&&fm!==lastAuto){openMods.add(fm);lastAuto=fm}
  box.innerHTML=`<div class="cprog"><div class="row"><span>Course progress</span><span class="sp"></span><b class="mono">${pct}%</b></div><div class="pbar"><span style="width:${pct}%"></span></div><p class="hint">${p.done} of ${p.total} items complete${p.next?` · <a href="#do-${p.next.task.id}">Resume</a>`:''}</p></div>
  ${p.rows.map((ph,i)=>{const all=ph.chapters.flatMap(c=>c.tasks),d=all.filter(t=>t.done).length;
    return `<details class="mod" data-m="${i}" ${openMods.has(String(i))?'open':''}><summary><span class="mt">${moduleName(ph,i)}</span><span class="mc mono ${d===all.length?'ok':''}">${d}/${all.length}</span></summary>
    ${ph.chapters.map(c=>`<div class="lesson"><p class="lt">${label(c.n)}: ${esc(c.title)}</p>${c.tasks.map(t=>`<a class="oi ${t.done?'done':''} ${t.id===curId?'cur':''}" href="#do-${t.id}" ${t.id===curId?'aria-current="page"':''}>${t.done?ICON.check:ICON[t.kind]}<span class="ot"><span class="on">${esc(shortTitle(t))}</span><span class="om">${t.done?'Completed':KIND[t.kind]+' · '+dur(t)}</span></span></a>`).join('')}</div>`).join('')}</details>`}).join('')}`;
  box.querySelectorAll('details.mod').forEach(d=>d.addEventListener('toggle',()=>{d.open?openMods.add(d.dataset.m):openMods.delete(d.dataset.m)}));
  const c=box.querySelector('.oi.cur');if(c){const r=c.getBoundingClientRect(),rr=box.closest('nav').getBoundingClientRect();if(r.top<rr.top||r.bottom>rr.bottom)c.scrollIntoView({block:'center'})}
}

/* ---------- course player (item page) ---------- */
let activeBar=null;
if(typeof window!=='undefined')window.addEventListener('np:progress',()=>{if(activeBar&&activeBar.isConnected)activeBar._render()});
export function itemView(id){return function(el){
  const p=progress(),idx=p.items.findIndex(t=>t.id===id);
  if(idx<0&&OLD_IDS[id]){location.replace('#do-'+OLD_IDS[id]);return}
  if(idx<0){el.innerHTML=`${head('Course','Item not found','')}<p><a href="#study">Open the study path</a></p>`;return}
  const t=p.items[idx],ph=p.rows[t.pi],prev=p.items[idx-1],nxt=p.items[idx+1];
  el.innerHTML=`<div class="player"><header class="vh"><p class="eyebrow">${moduleName(ph,t.pi)} · ${label(t.chapter.n)}: ${esc(t.chapter.title)}</p><h1>${esc(itemTitle(t))}</h1><p class="hint small">${KIND[t.kind]} · ${dur(t)}</p></header>
  <div class="itembody" id="itembody"><p class="hint">Loading…</p></div><div class="itembar" id="itembar"></div></div>`;
  const body=el.querySelector('#itembody'),bar=el.querySelector('#itembar');
  bar._render=()=>{const f=progress().items[idx];
    bar.innerHTML=`<div class="ibstatus">${f.done?`${ICON.check}<b class="ok">Completed</b>`:`<span class="hint">${reqText(f)}</span>`}</div>
    <div class="row ibbtns">${f.manual&&!f.done?'<button class="btn" id="mk">Mark as completed</button>':''}${f.manual&&f.done?'<button class="link" id="unmk">Mark as not completed</button>':''}<span class="sp"></span>
    ${prev?`<a class="btn ghost" href="#do-${prev.id}">← Previous</a>`:''}${nxt?`<a class="btn ${f.done?'':'ghost'}" href="#do-${nxt.id}">Next item →</a>`:'<a class="btn ghost" href="#study">Back to study path</a>'}</div>`;
    const mk=bar.querySelector('#mk'),un=bar.querySelector('#unmk');
    if(mk)mk.addEventListener('click',()=>setManual(f,true));if(un)un.addEventListener('click',()=>setManual(f,false))};
  activeBar=bar;bar._render();
  fillBody(t,body).catch(()=>{body.innerHTML='<p>This item couldn\'t load. Check your connection and reload.</p>'});
}}
async function fillBody(t,body){
  const g=t.go||'';
  if(t.kind==='recall'){const mem=t.chapter.mem;
    body.innerHTML=`<p>Close the lesson and try to recall each point below, out loud or on paper. Then reveal them and check yourself.</p>
    <ol class="recall">${mem.map((m,i)=>`<li><span class="rc">Point ${i+1}</span><span class="rv">${esc(m)}</span></li>`).join('')}</ol>
    <div class="row"><button class="btn ghost" id="reveal">Reveal all</button><span class="hint">Missed some? Reread the <a href="#do-${t.chapter.tasks[0].id}">lesson</a>.</span></div>`;
    body.querySelector('#reveal').addEventListener('click',e=>{body.querySelector('.recall').classList.toggle('shown');e.target.textContent=body.querySelector('.recall.shown')?'Hide':'Reveal all'});return}
  if(g.startsWith('notes-')){const m=await import('./notes.js');(await m.notesView(+g.slice(6)))(body);return}
  if(g.startsWith('quiz:')){const m=await import('./quiz.js');const s=m.quizSet(g.slice(5));
    body.innerHTML=`<div class="startcard"><p><b>${esc(s.title)}</b></p><p class="hint">${s.qs.length} questions · instant feedback with explanations · pass mark 85%</p><button class="btn" id="startq">Start quiz</button></div>`;
    body.querySelector('#startq').addEventListener('click',()=>m.runQuiz(body,shuffle(s.qs),s));return}
  if(g==='quiz'||g==='exam'){const m=await import('./quiz.js');m.VIEWS[g](body);return}
  if(g.startsWith('lab-')){const m=await import('./labs.js');m.VIEWS[g](body,t.spec||{});return}
  if(g.startsWith('pt-')){const m=await import('./pt.js');m.ptView(g)(body);return}
  if(g==='corrections'&&registry.VIEWS.corrections){registry.VIEWS.corrections(body);return}
  body.innerHTML=`<p>${esc(t.text)}.</p>${/objectives PDF/.test(t.text)?'<p><a href="https://www.comptia.org/certifications/network">CompTIA Network+ page</a>: download the N10-009 exam objectives.</p>':''}${/Pearson VUE/.test(t.text)?'<p>Book through CompTIA\'s page or directly with Pearson VUE. Choose a test centre or online proctoring.</p>':''}<p class="hint">Mark it as completed below when it's done.</p>`;
}

export function goTo(go){
  if(!go)return;
  if(go.startsWith('quiz:')){state.startQuiz=go.slice(5);if(location.hash==='#quiz')nav.route();else location.hash='quiz';return}
  location.hash=go;
}
const label=n=>n==='F'?'Final review':`Lesson ${n}`;
export function nextBox(p,{showLink}={}){
  if(!p.next)return `<div class="nextbox"><p class="eyebrow">Study path</p><p><b>Every item is complete.</b> Book the exam.</p></div>`;
  const {chapter:c,task:t}=p.next;
  return `<div class="nextbox"><p class="eyebrow">Next up · ${label(c.n)}: ${esc(c.title)}</p><p class="nexttask">${esc(itemTitle(t))}</p>
  <div class="row"><a class="btn" href="#do-${t.id}">${p.done?'Resume':'Start'}</a>${showLink?'<a href="#study">Open the study path</a>':''}<span class="sp"></span><span class="hint mono">${p.done} / ${p.total} items</span></div>
  <div class="pbar" aria-hidden="true"><span style="width:${Math.round(p.done/p.total*100)}%"></span></div></div>`;
}

/* ---------- view ---------- */
VIEWS.study=function(el){
  const open=new Set();let lastCur=null;
  function render(){
    const p=progress();const cur=p.next&&p.next.chapter;
    if(cur&&String(cur.n)!==lastCur){open.add(String(cur.n));lastCur=String(cur.n)}
    el.innerHTML=`${head('Study path','Your course, lesson by lesson','Work through each lesson\'s tasks in order: read the lesson, take its quiz, then do its labs and Packet Tracer builds, and finish with recall. Every quiz covers only what you have read so far, and every lab comes after the lesson that teaches it. Quizzes and labs tick themselves (85% on quizzes); tick lessons and the rest yourself as you finish them.')}
    ${nextBox(p)}
    ${p.rows.map(ph=>`<h2 class="phase">${ph.phase} <span class="muted small">${ph.span}</span></h2><p class="small muted" style="max-width:68ch">${ph.intro}</p>
      ${ph.chapters.map(c=>{const isCur=cur&&c.n===cur.n,complete=c.doneN===c.tasks.length;
        return `<details class="chap ${isCur?'cur':''}" data-ch="${c.n}" ${open.has(String(c.n))?'open':''}><summary><span class="ct">${label(c.n)}: ${esc(c.title)}</span>${isCur?'<span class="tag">Next</span>':''}<span class="cnt mono ${complete?'ok':''}">${complete?'done':c.doneN+' / '+c.tasks.length}</span></summary>
        <p class="hint mono small">${c.meta}</p>
        <ul class="tasks">${c.tasks.map(t=>{const isNext=p.next&&p.next.task.id===t.id;
          return `<li class="task ${t.done?'done':''} ${isNext?'next':''}"><input type="checkbox" id="${t.id}" data-tick="${t.id}" ${t.done?'checked':''} ${t.auto?'disabled title="Completed automatically"':''}><label for="${t.id}">${esc(t.text)}${t.hasAuto?`<span class="autonote">${t.auto?'completed automatically':'ticks itself when you hit the target'}</span>`:''}</label><a class="go" href="#do-${t.id}">${isNext?'Start':'Open'}</a></li>`}).join('')}</ul>
        <details class="mem"><summary>Memorize (${c.mem.length})</summary><ul>${c.mem.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></details>
        </details>`}).join('')}`).join('')}`;
    el.querySelectorAll('details.chap').forEach(d=>d.addEventListener('toggle',()=>{d.open?open.add(d.dataset.ch):open.delete(d.dataset.ch)}));
  }
  main.onclick=e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();return goTo(g.dataset.go)}
    const b=e.target.closest('button[data-tick]');if(b){const m=store.get('plan',{});m[b.dataset.tick]=true;store.set('plan',m);render()}};
  main.onchange=e=>{const t=e.target.closest('input[data-tick]');if(!t)return;const m=store.get('plan',{});if(t.checked)m[t.dataset.tick]=true;else delete m[t.dataset.tick];store.set('plan',m);render()};
  render();
};
export {VIEWS};
