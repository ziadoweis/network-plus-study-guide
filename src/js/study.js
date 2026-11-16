import {store,esc,head,nav,state,PT_META} from './core.js';
const main=document.getElementById('main');
const VIEWS={};

/* ---------- plan data ----------
   Task: [text, go?, auto?]
   go:   a page hash ('lab-osi', 'pt-vlans', 'corrections') or 'quiz:<key>' (o1.1 objective, d5 domain, c8 book chapter)
   auto: {q:'o1.1'} quiz key best ≥ 85% · {lab:'osi',best:85} · {lab:'cli',done:1} · {cli:['t2','t4']} · {pt:'pt-vlans'}
         {domains:85} every domain quiz ≥ 85% · {mocks:3} three mock exams ≥ 85% on different days */
const R=t=>[t],RECALL=['Recall the "Memorize" points without notes'];
const Q=o=>[`Quiz: Objective ${o}`,'quiz:o'+o,{q:'o'+o}];
const PT=(slug,extra='')=>{const i=PT_META.findIndex(p=>p.slug===slug);return [`Packet Tracer lab ${i+1}: ${PT_META[i].title}${extra}`,slug,{pt:slug}]};
const FIX=what=>[`Check the ${what} correction on the Corrections page`,'corrections'];

export const PLAN=[
{phase:'Phase 1: Foundations',span:'video chapters 1–5',intro:'The vocabulary every later topic uses: layers, cables, frames and physical installs. About two weeks.',chapters:[
 {n:1,title:'Network Models',meta:'Objective 1.1 · Book Ch. 1, 2',tasks:[R('Read Book Ch. 1 (Intro to Networks) and Ch. 2 (OSI Model)'),Q('1.1'),['Lab: OSI layer sorter at 85%+','lab-osi',{lab:'osi',best:85}],['Packet Tracer lab 1, Part 3 only: watch ARP and ICMP in Simulation mode (the full lab comes after Ch 3)','pt-first-lan'],RECALL],
  mem:['The 7 layers and their PDUs: bits, frame, packet, segment/datagram, data. Bottom up: Please Do Not Throw Sausage Pizza Away.','At every router hop the frame and its MAC addresses are rebuilt; the IP addresses stay the same.','The TCP/IP model\'s 4 layers and which OSI layers each covers.']},
 {n:2,title:'Cabling and Topology',meta:'Objectives 1.5, 1.6 · Book Ch. 1, 3',tasks:[R('Read the topology part of Book Ch. 1 and all of Ch. 3 (Connectors & Wiring Standards)'),Q('1.6'),Q('1.5'),['Lab: Cables, connectors and tools at 80%+','lab-cables',{lab:'cables',best:80}],FIX('RG-32'),RECALL],
  mem:['T568A vs T568B pin order. Straight-through = unlike devices, crossover = like devices, rollover = console.','Full mesh needs n(n−1)/2 links. A star\'s central device is a single point of failure.','Fiber connectors: LC (small, on SFPs), SC (square), ST (bayonet), MPO (multi-fiber). Never mate APC (green) with UPC (blue).','Plenum cable goes in air-handling spaces; riser cable goes between floors.']},
 {n:3,title:'Ethernet Basics',meta:'Objectives 1.1, 1.2 · Book Ch. 4, 5',tasks:[R('Read Book Ch. 4 (Ethernet Specifications) and Ch. 5 (Networking Devices)'),Q('1.2'),PT('pt-first-lan',' (the whole lab)'),RECALL],
  mem:['Ethernet frame fields. Default MTU 1500 bytes; frame size 64–1518 bytes (1522 with a VLAN tag).','Hub = one collision domain. Switch = one collision domain per port. Router = splits broadcast domains.','A MAC address is 48 bits: a 24-bit OUI (vendor) plus 24 bits assigned by the vendor.']},
 {n:4,title:'Ethernet Standards',meta:'Objective 1.5 · Book Ch. 4',tasks:[['Quiz: Objective 1.5 (retake until 85%+)','quiz:o1.5',{q:'o1.5'}],['Lab: Cables, connectors and tools, a fresh round','lab-cables'],FIX('SFP and 1000BASE-TX'),RECALL],
  mem:['1000BASE-T uses all four pairs of Cat 5e, up to 100 m. 10GBASE-T needs Cat 6a for 100 m (Cat 6 manages about 55 m). Cat 8 runs 25/40G up to 30 m.','Optics: SR = multimode short reach, LR = single-mode 10 km, ER = 40 km.','Transceiver speeds: SFP 1G, SFP+ 10G, SFP28 25G, QSFP+ 40G, QSFP28 100G. DAC is cheap copper for short rack links.']},
 {n:5,title:'Installing a Physical Network',meta:'Objectives 2.4, 5.2 · Book Ch. 3, 16',tasks:[R('Read the testing-tools part of Book Ch. 3 and the racks, power and environment parts of Ch. 16'),Q('2.4'),Q('5.2'),['Lab: Cables, connectors and tools, focusing on the tool questions','lab-cables'],RECALL],
  mem:['MDF vs IDF. 1U = 1.75 in. Equipment fronts face the cold aisle.','UPS types: standby, line-interactive, online (double conversion). A generator needs a UPS to cover its start-up gap.','Tools: TDR (copper fault distance), OTDR (fiber fault distance), toner probe (trace a cable), certifier (proves the category spec), visual fault locator (shows fiber breaks), punchdown tool (110 blocks).']}]},
{phase:'Phase 2: TCP/IP, routing and services',span:'video chapters 6–10',intro:'The heaviest phase: subnetting, routing and ports carry much of Domains 1 and 2. About three weeks. Don\'t move on until you can subnet a /27 in under a minute.',chapters:[
 {n:6,title:'TCP/IP Basics',meta:'Objectives 1.7, 1.4 · Book Ch. 6, 7, 8',tasks:[R('Read Book Ch. 6 (Intro to IP), Ch. 7 (IP Addressing) and the subnetting part of Ch. 8'),Q('1.7'),['Quiz: Book Ch. 8 (Subnetting, Troubleshooting IP, NAT)','quiz:c8',{q:'c8'}],['Lab: Subnetting, a streak of 10 on Find the subnet, Size a subnet and Binary','lab-subnet'],FIX('Class A (1–126)'),RECALL],
  mem:['Private ranges: 10.0.0.0/8, 172.16.0.0–172.31.255.255, 192.168.0.0/16. APIPA = 169.254.0.0/16. Loopback = 127.0.0.1.','Block size = 256 − the mask value in the interesting octet. The broadcast is one less than the next subnet.','Usable hosts for /24 to /30: 254, 126, 62, 30, 14, 6, 2.','TCP is connection-oriented (handshake SYN → SYN/ACK → ACK). UDP is connectionless.']},
 {n:7,title:'Routing',meta:'Objective 2.1 · Book Ch. 8, 9, 10',tasks:[R('Read Book Ch. 9 (IP Routing), Ch. 10 (Routing Protocols) and the NAT part of Ch. 8'),Q('2.1'),PT('pt-static-routing'),PT('pt-ospf',' (builds on lab 4\'s file)'),PT('pt-nat'),RECALL],
  mem:['Route choice: longest prefix match first, then lowest administrative distance, then lowest metric.','Default ADs: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120.','RIP = distance vector (max 15 hops), OSPF = link state, EIGRP = hybrid, BGP = path vector between autonomous systems.','PAT = many inside hosts share one public IP by port. Inside local = the private address; inside global = the public one.','VRRP and HSRP give hosts a redundant default gateway.']},
 {n:8,title:'TCP/IP Applications',meta:'Objective 1.4 · Book Ch. 6',tasks:[Q('1.4'),['Lab: Ports and protocols at 90%+ (then once more with the extra book ports)','lab-ports',{lab:'ports',best:90}],FIX('SMTPS (587)'),RECALL],
  mem:['Every port in the N10-009 table on the Ports lab page, with its TCP/UDP transport.','Port ranges: well-known 0–1023, registered 1024–49151, dynamic 49152–65535.','Secure replacements: Telnet → SSH, HTTP → HTTPS, LDAP → LDAPS, SNMPv1/v2c → SNMPv3, FTP → SFTP.']},
 {n:9,title:'Network Naming',meta:'Objective 3.4 · Book Ch. 5, 7',tasks:[R('Read the DNS and DHCP parts of Book Ch. 5 and Ch. 7'),Q('3.4'),['Lab: CLI troubleshooting tickets 2 and 4 (DHCP failure, wrong DNS server)','lab-cli',{cli:['t2','t4']}],PT('pt-services'),RECALL],
  mem:['DHCP: Discover, Offer, Request, Acknowledge on UDP 67/68. A reservation fixes one IP to a MAC; an exclusion keeps addresses out of the pool. A relay (ip helper-address) forwards DHCP across routers.','DNS records: A, AAAA, CNAME, MX, NS, SOA, PTR, TXT, SRV.','"Works by IP, fails by name" = DNS. DNSSEC protects integrity; DoH (443) and DoT (853) protect privacy.']},
 {n:10,title:'Securing TCP/IP',meta:'Objectives 4.1, 1.4 · Book Ch. 20',tasks:[R('Read Book Ch. 20 (Security Concepts)'),Q('4.1'),['Revisit Packet Tracer lab 1, Part 5 (SSH) and explain each command out loud','pt-first-lan'],FIX('Kerberos and ESP/EAP'),RECALL],
  mem:['The CIA triad. Symmetric encryption is fast for bulk data (AES); asymmetric uses key pairs (RSA, ECC). Hashing proves integrity.','RADIUS: UDP 1812/1813, encrypts only the password. TACACS+: TCP 49, encrypts everything, separates AAA.','Kerberos is an open MIT standard on port 88, and it fails if clocks drift more than about 5 minutes.','IPsec: AH = integrity only, ESP = encryption, IKE = key exchange (UDP 500).']}]},
{phase:'Phase 3: Switching, IPv6, WAN and wireless',span:'video chapters 11–14',intro:'The most hands-on phase: three Packet Tracer builds plus the switch simulator. Two to three weeks, and your first look at CCNA material.',chapters:[
 {n:11,title:'Switch Features',meta:'Objective 2.2 · Book Ch. 11',tasks:[R('Read Book Ch. 11 (Switching & VLANs)'),Q('2.2'),['Lab: Switch configuration (IOS), all 8 objectives','lab-switch',{lab:'switch',done:1}],PT('pt-vlans'),PT('pt-intervlan-dhcp',' (builds on lab 2\'s file)'),FIX('PoE+'),RECALL],
  mem:['Access port = one untagged VLAN. Trunk = many VLANs with 802.1Q tags. The native VLAN is untagged and must match on both ends.','STP elects the root bridge with the lowest bridge ID. Port states: blocking, listening, learning, forwarding. BPDU Guard shuts down an edge port that receives a BPDU.','PoE: 802.3af = 15.4 W, 802.3at (PoE+) = 30 W, 802.3bt = 60/90 W.','A duplex mismatch causes late collisions, CRC errors and slow transfers.']},
 {n:12,title:'IPv6',meta:'Objective 1.8 · Book Ch. 7',tasks:[R('Read the IPv6 part of Book Ch. 7'),Q('1.8'),['Lab: Subnetting, a streak of 10 on IPv6 shorthand and on EUI-64','lab-subnet'],PT('pt-ipv6'),RECALL],
  mem:['Shortening: drop leading zeros in each group, and replace one run of zero groups with ::.','Prefixes: 2000::/3 global, fe80::/10 link-local, fc00::/7 unique local (fd00::/8 in practice), ff00::/8 multicast, ::1 loopback. No broadcast.','EUI-64: split the MAC, insert FFFE, flip the 7th bit.','NDP (RS, RA, NS, NA) replaces ARP. SLAAC vs stateless DHCPv6 vs stateful DHCPv6. Transition: dual stack, 6to4, Teredo, ISATAP, NAT64.']},
 {n:13,title:'WAN Connectivity',meta:'Objectives 3.5, 1.6 · Book Ch. 13, 1',tasks:[R('Read Book Ch. 13 (Remote Access) and the WAN part of Ch. 1'),Q('3.5'),['Revisit Packet Tracer lab 6 and point out where the demarc would sit on a real ISP link','pt-nat'],FIX('L2TP'),RECALL],
  mem:['VPN types: site-to-site, client-to-site, clientless (browser). Split tunnel vs full tunnel. IPsec tunnel mode vs transport mode.','WAN options: MPLS, Metro Ethernet, DSL (ADSL/SDSL/VDSL), cable, fiber, satellite (high latency), cellular. The demarc is where the provider\'s responsibility ends.','In-band vs out-of-band management. A jump box is the controlled entry point for admins. RDP = 3389, VNC = 5900.']},
 {n:14,title:'Wireless',meta:'Objectives 2.3, 5.4 · Book Ch. 12',tasks:[R('Read Book Ch. 12 (Wireless)'),Q('2.3'),Q('5.4'),PT('pt-wireless',' (try the RADIUS stretch goal)'),FIX('MU-MIMO'),RECALL],
  mem:['802.11 a/b/g/n/ac/ax: band and top speed of each. Wi-Fi 4/5/6/6E names. OFDMA arrived with 802.11ax.','2.4 GHz non-overlapping channels are 1, 6, 11. 6 GHz (Wi-Fi 6E) requires WPA3.','WPA3 uses SAE. Personal = shared passphrase; Enterprise = 802.1X + RADIUS.','Omnidirectional vs directional antennas. Wi-Fi uses CSMA/CA. A site survey produces a heat map.']}]},
{phase:'Phase 4: Cloud, data centers, devices and operations',span:'video chapters 15–18',intro:'Mostly concepts and definitions, so quiz-heavy and lighter on labs. About two weeks.',chapters:[
 {n:15,title:'Virtualization and Cloud',meta:'Objectives 1.3, 1.8 · Book Ch. 17',tasks:[R('Read Book Ch. 17 (Data Center & Cloud)'),Q('1.3'),['Retake the Objective 1.8 quiz','quiz:o1.8'],RECALL],
  mem:['IaaS vs PaaS vs SaaS (who manages what). Public, private and hybrid clouds. Scalability vs elasticity.','Security groups are stateful and apply per instance; security lists (NACLs) are usually stateless and apply per subnet. An Internet gateway allows two-way traffic; a NAT gateway allows outbound only.','Type 1 (bare-metal) vs Type 2 (hosted) hypervisors. NFV = network appliances as VMs.','SDN separates the control plane from the data plane. VXLAN uses UDP 4789 and a 24-bit VNI. SASE = SD-WAN + cloud security. Zero trust = verify every request.']},
 {n:16,title:'Data Centers',meta:'Objectives 1.6, 1.2, 3.3 · Book Ch. 16, 17',tasks:[R('Read Book Ch. 16 (High Availability & DR) and the data-center part of Ch. 17'),Q('3.3'),['Retake the Objective 1.2 quiz','quiz:o1.2'],FIX('hot-site'),RECALL],
  mem:['Spine-and-leaf: every leaf connects to every spine. North-south traffic goes in and out of the data center; east-west traffic stays between servers.','NAS = file-level storage; SAN = block-level (Fibre Channel, FCoE, iSCSI).','RPO = acceptable data loss; RTO = acceptable downtime. MTTR and MTBF.','Hot, warm and cold sites. Full, incremental and differential backups. Active-active vs active-passive.']},
 {n:17,title:'Integrating Network Devices',meta:'Objectives 4.1, 2.2, 1.4 · Book Ch. 5, 21',tasks:[R('Reread the segmentation part of Objective 4.1 (Book Ch. 20–21)'),['Retake the Objective 4.1 quiz','quiz:o4.1'],['Open your Packet Tracer lab 2 file and sketch where you\'d add an IoT VLAN and a voice VLAN','pt-vlans'],RECALL],
  mem:['Put IoT devices on their own VLAN or SSID and change their default credentials.','ICS/SCADA puts availability first and is often legacy, so isolate it hard (air gaps).','VoIP: SIP 5060/5061 for signaling, RTP for media, a voice VLAN, and QoS because voice is sensitive to jitter.']},
 {n:18,title:'Network Operations',meta:'Objectives 3.1, 3.3 · Book Ch. 15, 16',tasks:[R('Read Book Ch. 15 (Organizational Documents & Policies)'),Q('3.1'),['Retake the Objective 3.3 quiz','quiz:o3.3'],RECALL],
  mem:['SLA availability: 99.9% ≈ 8.76 h/year down, 99.99% ≈ 52.6 min, 99.999% ≈ 5.26 min.','Documents: SLA, MOU, NDA, SOW, MSA. Physical vs logical diagrams. IPAM. EOL vs EOS.','Change management: request → impact → approval → maintenance window → backout plan → implement → verify → document.','Incident response: preparation → detection → containment → eradication → recovery → lessons learned.']}]},
{phase:'Phase 5: Security, monitoring and troubleshooting',span:'video chapters 19–21',intro:'38% of the exam (Domains 4 and 5) and most of the performance-based questions. About three weeks.',chapters:[
 {n:19,title:'Protecting Networks',meta:'Objectives 4.2, 4.3 · Book Ch. 21',tasks:[R('Read Book Ch. 21 (Attacks)'),Q('4.2'),Q('4.3'),['Lab: Firewall rule evaluation, both scenarios at 100%','lab-acl',{lab:'acl',done:1}],PT('pt-acl'),PT('pt-switch-security'),FIX('RBAC and terminology'),RECALL],
  mem:['Attack → defense: ARP poisoning → Dynamic ARP Inspection. Rogue DHCP → DHCP snooping. MAC flooding → port security. Rogue switch → BPDU Guard. Rogue IPv6 RA → RA Guard. VLAN hopping → static access ports, no DTP, unused native VLAN.','ACLs are read top-down, the first match wins, and an implicit deny sits at the end. Public servers go in a screened subnet.','802.1X: supplicant, authenticator, authentication server (RADIUS). EAP-TLS is the strongest EAP method.','Social engineering: phishing, spear phishing, whaling, vishing, smishing. Tailgating is without consent; piggybacking is with consent.']},
 {n:20,title:'Network Monitoring',meta:'Objective 3.2 · Book Ch. 14',tasks:[R('Read Book Ch. 14 (Statistics & Sensors)'),Q('3.2'),['Revisit Packet Tracer lab 8, Parts 4 and 5 (syslog and SNMP), and name the severity of each log message','pt-services'],RECALL],
  mem:['SNMP: the manager polls agents on UDP 161; agents send traps to UDP 162. The MIB describes objects, each identified by an OID. Only v3 encrypts.','Syslog uses UDP 514. Severity 0–7: Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debug.','NetFlow = conversation metadata; a packet capture = full payload. A tap copies everything; a SPAN port can drop errored frames. A SIEM correlates logs.','Interface counters: CRC errors, runts (under 64 bytes), giants (over 1518 bytes). A baseline tells you what normal looks like.']},
 {n:21,title:'Network Troubleshooting',meta:'Objectives 5.1–5.5 · Book Ch. 18, 19',tasks:[R('Read Book Ch. 18 (Troubleshooting Methodology) and Ch. 19 (Software Tools & Commands)'),['Quiz: the whole 5.0 domain at 85%+','quiz:d5',{q:'d5'}],['Lab: Troubleshooting methodology, both parts at 100%','lab-method',{lab:'method',done:1}],['Lab: CLI troubleshooting tickets, all six solved','lab-cli',{lab:'cli',done:1}],PT('pt-break-fix',' (uses lab 3\'s file)'),RECALL],
  mem:['The 7 steps in order: identify, theory, test, plan, implement or escalate, verify, document.','Four-step ping test: 127.0.0.1 → your own IP → default gateway → a remote host, then a name to test DNS.','Symptom → cause: 169.254.x.x → DHCP. Local works, remote doesn\'t → gateway. IP works, name doesn\'t → DNS. Wrong subnet after a desk move → wrong VLAN. Broadcast storm → switching loop. err-disabled → port security or BPDU Guard.','Commands: ipconfig, ping, tracert/traceroute, nslookup/dig, netstat, arp -a, route print, ip, plus the Cisco show commands.']}]},
{phase:'Final review and exam readiness',span:'last week',intro:'Book the exam once every task here is done. Spend the final week here rather than on new material.',chapters:[
 {n:'F',title:'Exam readiness',meta:'Up to 90 questions · 90 minutes · pass mark 720 (100–900)',tasks:[PT('pt-capstone',', built from the brief without looking back'),['Every domain quiz at 85%+','quiz',{domains:85}],['Mock exam at 85%+ on three different days','exam',{mocks:3}],['Subnet any /26–/29 problem in under a minute, and score 90%+ on the Ports sprint','lab-subnet'],['Timed performance-based practice: Switch configuration, Firewall rules, and Cables, each in one sitting','lab-switch'],['Download the N10-009 objectives PDF from comptia.org and tick every line you can explain out loud'],['Reread the Corrections page','corrections'],['Book the exam with Pearson VUE, 1–2 weeks out']],
  mem:['Read for qualifiers: FIRST, BEST, MOST likely.','If a performance-based question is eating time, flag it and come back.','After you pass: the CCNA is next, and Packet Tracer labs 2–9 and 12 are already CCNA practice.']}]}];

/* ---------- progress ---------- */
const tid=(c,k)=>`c${c.n}-${k}`;
function autoDone(a){
  if(!a)return false;
  if(a.q){const kb=store.get('quizKeyBest',{});let v=kb[a.q];if(a.q[0]==='d'&&v==null)v=store.get('quizBest',{})[+a.q.slice(1)];return (v??0)>=85}
  if(a.pt)return !!store.get('pt',{})[a.pt];
  if(a.lab){const L=store.get('labs',{})[a.lab]||{};if(a.done)return !!L.done;if(a.best)return (L.best??0)>=a.best}
  if(a.cli){const s=(store.get('labs',{}).cli||{}).solved||[];return a.cli.every(x=>s.includes(x))}
  if(a.domains){const b=store.get('quizBest',{});return [1,2,3,4,5].every(d=>(b[d]??0)>=a.domains)}
  if(a.mocks){const ex=store.get('exams',[]);return new Set(ex.filter(e=>e.pct>=85).map(e=>e.date)).size>=a.mocks}
  return false;
}
export function progress(){
  const man=store.get('plan',{});let total=0,done=0,next=null;
  const rows=PLAN.map(ph=>({...ph,chapters:ph.chapters.map(c=>{
    const tasks=c.tasks.map((t,k)=>{const id=tid(c,k),auto=autoDone(t[2]),d=auto||!!man[id];total++;if(d)done++;const r={id,text:t[0],go:t[1],hasAuto:!!t[2],auto,done:d};if(!d&&!next)next={chapter:c,phase:ph,task:r};return r});
    return {...c,tasks,doneN:tasks.filter(t=>t.done).length}})}));
  return {rows,total,done,next};
}
export function goTo(go){
  if(!go)return;
  if(go.startsWith('quiz:')){state.startQuiz=go.slice(5);if(location.hash==='#quiz')nav.route();else location.hash='quiz';return}
  location.hash=go;
}
const label=n=>n==='F'?'Final review':`Video Ch ${n}`;
export function nextBox(p,{showLink}={}){
  if(!p.next)return `<div class="nextbox"><p class="eyebrow">Study path</p><p><b>Every task is done.</b> Book the exam.</p></div>`;
  const {chapter:c,task:t}=p.next;
  return `<div class="nextbox"><p class="eyebrow">Next up · ${label(c.n)}: ${esc(c.title)}</p><p class="nexttask">${esc(t.text)}</p>
  <div class="row">${t.go?`<button class="btn" data-go="${esc(t.go)}">Start</button>`:''}${t.go?'':`<button class="btn" data-tick="${t.id}">Mark done</button>`}${showLink?'<a href="#study">Open the study path</a>':''}<span class="sp"></span><span class="hint mono">${p.done} / ${p.total} tasks</span></div>
  <div class="pbar" aria-hidden="true"><span style="width:${Math.round(p.done/p.total*100)}%"></span></div></div>`;
}

/* ---------- view ---------- */
VIEWS.study=function(el){
  const open=new Set();let lastCur=null;
  function render(){
    const p=progress();const cur=p.next&&p.next.chapter;
    if(cur&&String(cur.n)!==lastCur){open.add(String(cur.n));lastCur=String(cur.n)}
    el.innerHTML=`${head('Study path','What to do after each video','After each video chapter, work through its tasks in order: read, quiz, lab, Packet Tracer, recall. Quizzes, labs and Packet Tracer labs tick themselves when you hit the target (85% on quizzes); tick the rest yourself.')}
    ${nextBox(p)}
    <p class="hint small" style="margin:14px 0 6px">Chapter numbers follow the video-course handouts. Watching the Coursera course instead? Match chapters by topic name.</p>
    ${p.rows.map(ph=>`<h2 class="phase">${ph.phase} <span class="muted small">${ph.span}</span></h2><p class="small muted" style="max-width:68ch">${ph.intro}</p>
      ${ph.chapters.map(c=>{const isCur=cur&&c.n===cur.n,complete=c.doneN===c.tasks.length;
        return `<details class="chap ${isCur?'cur':''}" data-ch="${c.n}" ${open.has(String(c.n))?'open':''}><summary><span class="ct">${label(c.n)}: ${esc(c.title)}</span>${isCur?'<span class="tag">Next</span>':''}<span class="cnt mono ${complete?'ok':''}">${complete?'done':c.doneN+' / '+c.tasks.length}</span></summary>
        <p class="hint mono small">${c.meta}</p>
        <ul class="tasks">${c.tasks.map(t=>{const isNext=p.next&&p.next.task.id===t.id;
          return `<li class="task ${t.done?'done':''} ${isNext?'next':''}"><input type="checkbox" id="${t.id}" data-tick="${t.id}" ${t.done?'checked':''} ${t.auto?'disabled title="Completed automatically"':''}><label for="${t.id}">${esc(t.text)}${t.hasAuto?`<span class="autonote">${t.auto?'completed automatically':'ticks itself when you hit the target'}</span>`:''}</label>${t.go?`<button class="link go" data-go="${esc(t.go)}">${isNext?'Start':'Open'}</button>`:''}</li>`}).join('')}</ul>
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
