/* Condensed chapter notes, one per video chapter (handout numbering). Exam-focused: facts, tables, traps. */
const H=t=>`<h2>${t}</h2>`;
const UL=(...li)=>`<ul class="nl">${li.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const TB=(head,rows)=>`<div class="tw"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const TRAPS=(...t)=>`<div class="traps"><b>Exam traps</b><ul>${t.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
const P=t=>`<p>${t}</p>`;

export const NOTES=[
{n:1,title:'Network Models',obj:'1.1',book:'2, 6',html:
H('OSI model')+
TB(['#','Layer','Job','PDU','Devices / protocols'],[
 ['7','Application','Network services to apps','Data','HTTP, DNS, SMTP, FTP, SNMP'],
 ['6','Presentation','Format, encrypt, compress','Data','TLS (for the exam), JPEG, ASCII'],
 ['5','Session','Open, manage, close sessions','Data','RPC, NetBIOS'],
 ['4','Transport','Ports, segmentation, reliability, flow control','Segment (TCP) / datagram (UDP)','TCP, UDP; load balancers, port-aware firewalls'],
 ['3','Network','Logical addressing, routing','Packet','IP, ICMP, IPsec, OSPF; routers, L3 switches'],
 ['2','Data Link','Framing, MAC addresses, error detection (FCS)','Frame','Ethernet, 802.11, ARP; switches, bridges, NICs, APs'],
 ['1','Physical','Bits, signaling, media, connectors','Bits','Cables, hubs, repeaters, media converters, transceivers']])+
P('Mnemonic, layer 1 up: <b>P</b>lease <b>D</b>o <b>N</b>ot <b>T</b>hrow <b>S</b>ausage <b>P</b>izza <b>A</b>way.')+
UL('Layer 2 has two sublayers: <b>LLC</b> (identifies the Layer 3 protocol, flow control) and <b>MAC</b> (physical addressing, when to transmit).',
 '<b>TCP/IP (DoD) model</b>: Application (OSI 5–7) · Host-to-Host/Transport (4) · Internet (3) · Network Access/Link (1–2).')+
H('Encapsulation')+
UL('Going down: data → <b>segment</b> (TCP/UDP header) → <b>packet</b> (IP header) → <b>frame</b> (Ethernet header + FCS trailer) → bits. Decapsulation reverses it.',
 'At every router hop the <b>frame is rebuilt</b> with new source/destination MACs. The <b>IP packet stays the same</b> end to end, except that the TTL decrements and the checksum updates (and NAT, if used, rewrites addresses).',
 '<b>MAC addresses never cross a router.</b>')+
H('TCP vs UDP')+
TB(['','TCP','UDP'],[['Connection','Connection-oriented (3-way handshake)','Connectionless'],['Reliability','Sequencing, ACKs, retransmission, windowing','Best effort, no ACKs'],['Overhead','Higher','Lower'],['Used by','HTTP(S), SSH, SMTP, FTP, RDP','DNS queries, DHCP, TFTP, SNMP, syslog, VoIP/RTP, streaming']])+
TRAPS('TLS goes at Layer 6 for this exam.','A switch is Layer 2, a router is Layer 3, and a hub or repeater is Layer 1.','"Which address changes at each hop?" Answer: the MAC addresses, not the IP addresses.')},

{n:2,title:'Cabling and Topology',obj:'1.5, 1.6',book:'1, 3',html:
H('Topologies')+
TB(['Topology','Key point'],[
 ['Star / hub-and-spoke','Most common; the central device is a single point of failure'],
 ['Full mesh','Most redundancy and cost: <b>n(n−1)/2</b> links (6 sites = 15)'],
 ['Partial mesh','Compromise between cost and redundancy'],
 ['Bus','Legacy coax; one break takes down the segment'],
 ['Ring','Legacy (Token Ring/FDDI); dual ring for redundancy'],
 ['Hybrid','Mix of the above'],
 ['Point-to-point / point-to-multipoint','WAN and wireless links']])+
UL('<b>Physical vs logical</b> topology: how it is cabled vs how data flows. A hub is a physical star but a logical bus.',
 'Network types: PAN (Bluetooth) · LAN · WLAN · CAN (campus) · MAN (city) · WAN · SAN (storage).',
 '<b>Client-server</b> (central resources and control) vs <b>peer-to-peer</b> (everyone shares, no central control).')+
H('Copper')+
TB(['Category','Typical use','Notes'],[
 ['Cat 5','100BASE-TX','100 MHz; obsolete'],['Cat 5e','1000BASE-T','100 MHz; minimum for new installs'],
 ['Cat 6','1 Gbps; 10GBASE-T to ~55 m','250 MHz'],['Cat 6a','10GBASE-T at 100 m','500 MHz'],
 ['Cat 7','10 Gbps at 100 m','Shielded; not a TIA standard'],['Cat 8','25/40GBASE-T up to <b>30 m</b>','2000 MHz; data centers']])+
UL('Twisted-pair maximum: <b>100 m</b> (90 m horizontal + 10 m of patch cables).',
 '<b>UTP</b> vs <b>STP</b>: shielded resists EMI and must be grounded.',
 '<b>Plenum</b> = air-handling spaces (fire-resistant, low smoke). <b>Riser</b> = vertical runs between floors. PVC = everywhere else.',
 '<b>Solid</b> core for permanent runs; <b>stranded</b> for patch cables.',
 'Coax: <b>RG-6</b> (75 Ω, cable TV and modems, <b>F-type</b>). RG-59 is older and thinner. BNC is legacy. <b>Twinax</b> = DAC cables for short SFP+/QSFP links.')+
H('Fiber')+
TB(['','Single-mode (SMF)','Multimode (MMF)'],[['Core','~9 µm','50/62.5 µm'],['Light source','Laser','LED / VCSEL'],['Distance','Kilometres','Hundreds of metres'],['Jacket','Usually yellow','Orange or aqua']])+
UL('Connectors: <b>LC</b> (small form factor, latch, on SFPs) · <b>SC</b> (square push-pull) · <b>ST</b> (round bayonet) · <b>MT-RJ</b> (two fibers, RJ-style) · <b>MPO/MTP</b> (multi-fiber, 40/100G).',
 'Polish: <b>UPC</b> (blue, flat) vs <b>APC</b> (green, 8° angle). <b>Never mate APC with UPC.</b>',
 'Fiber is immune to EMI and hard to tap.')+
H('Wiring standards')+
TB(['Standard','Pin order'],[['T568A','W/G, G, W/O, B, W/B, O, W/Br, Br'],['T568B','W/O, O, W/G, B, W/B, G, W/Br, Br']])+
TB(['Cable','Wiring','Use'],[['Straight-through','Same standard both ends','Unlike devices: host↔switch, router↔switch'],['Crossover','A on one end, B on the other (1↔3, 2↔6)','Like devices: switch↔switch, host↔host, router↔router'],['Rollover / console','Pins fully reversed','PC to device console port']])+
P('Auto-MDI-X ports accept either straight-through or crossover cable.')+
TRAPS('Cable modems use RG-6. "RG-32" in the quiz workbook is wrong.','The connector on an SFP is LC, not SC.','Cat 6 is not enough for 10G at 100 m: that needs Cat 6a.')},

{n:3,title:'Ethernet Basics',obj:'1.1, 1.2',book:'4, 5',html:
H('The Ethernet frame')+
P('Preamble + SFD | <b>destination MAC</b> | <b>source MAC</b> | optional 802.1Q tag (4 bytes) | EtherType/length | payload 46–1500 bytes | <b>FCS</b> (CRC-32)')+
UL('Frame size <b>64–1518 bytes</b> (1522 with a VLAN tag). <b>MTU = 1500</b> bytes. Jumbo frames are about 9000 bytes and must match end to end.',
 '<b>MAC address</b>: 48 bits = 24-bit <b>OUI</b> (vendor) + 24 bits from the vendor, e.g. 0A:24:D3:00:00:FF. Broadcast MAC = FF:FF:FF:FF:FF:FF.')+
H('Devices and domains')+
TB(['Device','Layer','Collision domains','Broadcast domains'],[['Hub / repeater','1','One for all ports (half duplex)','One'],['Bridge / switch','2','One per port','One (unless VLANs)'],['Router','3','One per port','One per interface']])+
UL('A switch has three functions: <b>address learning</b>, <b>forward/filter decisions</b> and <b>loop avoidance</b> (STP).',
 'Unknown destination or broadcast → the switch <b>floods</b> it out every port except the one it arrived on.',
 'A <b>multilayer (L3) switch</b> also routes, typically between VLANs.',
 'Half-duplex Ethernet used <b>CSMA/CD</b>. Full duplex has no collisions. Wi-Fi uses <b>CSMA/CA</b>.')+
H('Other appliances (Obj 1.2)')+
TB(['Appliance','What it does'],[
 ['Firewall','Filters by rules. <b>Stateless</b> checks each packet alone; <b>stateful</b> tracks connections and allows return traffic; an <b>NGFW</b> is application-aware (L7) with DPI and IPS'],
 ['IDS vs IPS','IDS is out of band (fed by SPAN or tap): <b>detects and alerts</b>. IPS is <b>inline</b>: <b>blocks</b>. Both can be signature-based or anomaly-based'],
 ['Load balancer','One virtual IP in front of a server pool, with health checks'],
 ['Proxy','<b>Forward</b> acts for clients (cache, filter). <b>Reverse</b> acts for servers (TLS offload, protection). <b>Transparent</b> needs no client configuration'],
 ['NAS vs SAN','NAS = <b>file-level</b> (SMB, NFS). SAN = <b>block-level</b> (Fibre Channel, FCoE, iSCSI; servers use an HBA)'],
 ['AP / WLC','A wireless LAN controller centrally manages lightweight APs'],
 ['CDN','Caches content at edge locations near users'],
 ['VPN concentrator','Terminates many VPN tunnels']])+
TRAPS('MTU (1500) is the payload, not the 1518-byte frame.','An IDS cannot block traffic; only an IPS can.','A switch does not break up broadcast domains; VLANs and routers do.')},

{n:4,title:'Ethernet Standards',obj:'1.5',book:'4',html:
P('Naming: speed + BASE (baseband) + medium or reach. <b>S</b> = short reach (multimode), <b>L</b> = long reach (single-mode), <b>E</b> = extended reach.')+
TB(['Standard','Media','Reach'],[
 ['10BASE-T','Cat 3+','100 m'],['100BASE-TX','Cat 5+','100 m'],['1000BASE-T','Cat 5e+, <b>all four pairs</b>','100 m'],['10GBASE-T','Cat 6a (Cat 6 ≈ 55 m)','100 m'],['40GBASE-T','Cat 8','30 m'],
 ['100BASE-FX','MMF','~2 km'],['1000BASE-SX','MMF, 850 nm','~550 m'],['1000BASE-LX','SMF, 1310 nm','~5 km'],['10GBASE-SR','MMF, 850 nm','~300–400 m (OM3/OM4)'],['10GBASE-LR','SMF, 1310 nm','10 km'],['10GBASE-ER','SMF, 1550 nm','40 km']])+
H('Transceivers')+
TB(['Module','Speed'],[['GBIC','1 Gbps (legacy, large)'],['SFP','1 Gbps'],['SFP+','10 Gbps'],['SFP28','25 Gbps'],['QSFP+','40 Gbps'],['QSFP28','100 Gbps']])+
UL('Hot-swappable and built to the Multi-Source Agreement (MSA). They can carry Ethernet or Fibre Channel. <b>Both ends must match</b> on wavelength, mode (SM/MM) and speed.',
 '<b>DAC</b> (twinax) = cheap copper with SFP+/QSFP ends, for short in-rack links.',
 '<b>WDM</b> sends several wavelengths on one fiber: <b>CWDM</b> (coarse, fewer channels, cheaper) vs <b>DWDM</b> (dense, many channels, long-haul and metro).',
 '<b>BiDi</b> transceivers send and receive on one strand using two wavelengths.',
 '<b>Media converters</b>: SMF↔copper, MMF↔copper, fiber↔coax, SMF↔MMF.')+
TRAPS('Standard gigabit copper is 1000BASE-T, which uses all 4 pairs. The book\'s "1000BaseTX (two pair)" is wrong.','"SPF" in the handouts is a typo for SFP.','A link with mismatched optics (SR at one end, LR at the other) stays down.')},

{n:5,title:'Installing a Physical Network',obj:'2.4, 5.2',book:'3, 16, 18',html:
H('Structured cabling')+
UL('Work area → horizontal run (≤ 90 m) → telecom room → backbone. Add 10 m of patch cable for the 100 m total.',
 '<b>MDF</b> = main equipment room (often holds the demarc and core equipment). <b>IDF</b> = closet per floor or area, connected back to the MDF (often over fiber).',
 '<b>Demarc</b> = where the provider\'s responsibility ends. A demarc extension carries it to your room.',
 'Copper terminates on <b>patch panels</b>, fiber on fiber distribution panels. <b>66 blocks</b> are legacy voice; <b>110 blocks</b> are data/voice. Use a <b>punchdown tool</b>.',
 'Label both ends of every cable and keep cable maps.')+
H('Racks, power and environment')+
UL('<b>1U = 1.75 in</b> (4.45 cm); a full rack is typically 42U. Two-post vs four-post; lockable cabinets.',
 '<b>Hot aisle / cold aisle</b>: equipment fronts face the cold aisle. Match port-side intake vs port-side exhaust fans to the layout.')+
TB(['Power device','Role'],[
 ['UPS: standby','Switches to battery when power fails'],['UPS: line-interactive','Also regulates voltage; still switches over'],['UPS: online (double conversion)','Always runs from the inverter: cleanest power, no gap'],
 ['PDU','Rack power strip (may be metered or switched)'],['Generator','Long outages; needs a UPS to cover its start-up gap']])+
UL('Calculate the load, match the voltage (120 V vs 208/230 V), and connect dual PSUs to <b>separate circuits</b>.',
 'Temperature about 18–27 °C at the intake. Humidity: too low causes ESD; too high causes condensation.',
 'Fire suppression: <b>clean agent / inert gas</b> preferred. Pre-action and dry-pipe sprinklers avoid accidental water.')+
H('Cable tools and faults (Obj 5.2)')+
TB(['Tool','Use'],[
 ['Cable tester','Continuity and wire map'],['Certifier','Proves performance against the category spec'],['TDR','Distance to a fault on <b>copper</b>'],['OTDR','Distance to a fault on <b>fiber</b>'],
 ['Toner probe (fox and hound)','Trace and identify a cable'],['Multimeter','Voltage and resistance'],['Optical light/power meter','Signal level in dBm'],['Visual fault locator','Red laser shows fiber breaks and bends'],
 ['Loopback plug','Tests a port or NIC'],['Punchdown tool / crimper / stripper','Termination']])+
UL('Wire map faults: opens, shorts, reversed pairs, crossed pairs, split pairs.',
 'Signal problems: <b>attenuation</b> (distance), <b>crosstalk</b> (NEXT/FEXT from untwisting), <b>EMI</b> (motors, lights, power cables).',
 'Fiber problems: dirty connectors, tight bends, breaks, wavelength mismatch, dB loss budget exceeded, <b>TX/RX swapped</b> (no light).')+
TRAPS('TDR is for copper, OTDR is for fiber.','A toner traces a cable but doesn\'t measure distance.','A UPS covers the gap; a generator covers long outages.')},

{n:6,title:'TCP/IP Basics',obj:'1.7, 1.4',book:'6, 7, 8',html:
H('IPv4 address types')+
TB(['Type','Range'],[
 ['Private (RFC 1918)','10.0.0.0/8 · 172.16.0.0–172.31.255.255 (/12) · 192.168.0.0/16'],['APIPA (link-local)','169.254.0.0/16: self-assigned when DHCP fails'],['Loopback','127.0.0.0/8 (127.0.0.1)'],
 ['Class A','1–126 (/8 default)'],['Class B','128–191 (/16)'],['Class C','192–223 (/24)'],['Class D','224–239 (multicast)'],['Class E','240–255 (experimental)']])+
UL('Network (subnet) address = all host bits 0. Broadcast = all host bits 1. Neither can be assigned to a host.',
 '<b>CIDR /n</b> = the number of network bits. <b>VLSM</b> = different prefix lengths inside one block, sized to each subnet (e.g. /30 or /31 for links, /24 for users).')+
H('Subnetting: the block-size method')+
UL('1. Find the <b>interesting octet</b>: the one where the mask isn\'t 255 or 0.',
 '2. <b>Block size = 256 − mask value</b> in that octet (/27 → 224 → 32).',
 '3. Subnets start at multiples of the block: 0, 32, 64, 96…',
 '4. <b>Broadcast</b> = one less than the next subnet. <b>Hosts</b> = everything in between.',
 'Hosts per subnet = 2<sup>h</sup> − 2. Number of subnets = 2<sup>s</sup> (s = borrowed bits).')+
TB(['CIDR','Mask','Block','Usable hosts'],[['/24','255.255.255.0','256','254'],['/25','.128','128','126'],['/26','.192','64','62'],['/27','.224','32','30'],['/28','.240','16','14'],['/29','.248','8','6'],['/30','.252','4','2'],['/31','.254','2','2 (point-to-point only)'],['/32','.255','1','Host route']])+
P('Worked example: <code>192.168.10.77/27</code> → block 32 → subnet .64, broadcast .95, hosts .65–.94. The same pattern repeats one octet left: /20 = 255.255.240.0, /22 = 255.255.252.0, /23 = 255.255.254.0.')+
UL('Binary bit weights: 128 64 32 16 8 4 2 1 (239 = 11101111, 192 = 11000000).',
 'A host compares the destination with its own IP and mask. Same subnet → ARP for the destination. Different subnet → ARP for the <b>default gateway</b> and send it there.',
 'Traffic types: unicast (one) · broadcast (all on the segment, IPv4 only) · multicast (group, 224.0.0.0/4) · anycast (nearest of a group).')+
TRAPS('The usable Class A range is 1–126. The quiz workbook\'s "0–126" is wrong.','172.32.x.x is public: the private block ends at 172.31.255.255.','A /27 has 32 addresses but only 30 usable hosts.')},

{n:7,title:'Routing',obj:'2.1',book:'8, 9, 10',html:
H('Routes')+
UL('<b>Connected</b> routes appear when an interface is up and addressed. <b>Static</b> routes are typed in: predictable, no overhead, don\'t scale. <b>Default route</b> 0.0.0.0/0 = "gateway of last resort".',
 '<b>Dynamic</b> routing protocols exchange routes automatically. <b>Convergence</b> = all routers agree on the topology.',
 '<b>IGP</b> = inside one autonomous system (AS). <b>EGP</b> = between autonomous systems.')+
TB(['Protocol','Type','Metric','Notes'],[
 ['RIPv1/v2','Distance vector (IGP)','Hop count, max <b>15</b> (16 = unreachable)','Full table every 30 s. v2 is classless, multicasts to 224.0.0.9 and supports authentication. AD 120'],
 ['OSPF','<b>Link state</b> (IGP), open standard','Cost (bandwidth)','Dijkstra SPF, areas (area 0 = backbone), hellos, fast convergence. AD 110'],
 ['EIGRP','Advanced distance vector / hybrid','Bandwidth + delay','DUAL algorithm with feasible successors. AD 90 internal / 170 external'],
 ['BGP','<b>Path vector</b> (EGP)','Path attributes (AS path)','The Internet\'s routing protocol, TCP 179. AD 20 eBGP / 200 iBGP']])+
H('How a router chooses')+
UL('1. <b>Longest prefix match</b> (the most specific route) always wins.','2. Then the lowest <b>administrative distance</b> (how trusted the source is).','3. Then the lowest <b>metric</b> within that protocol.')+
TB(['Source','AD'],[['Connected','0'],['Static','1'],['eBGP','20'],['EIGRP (internal)','90'],['OSPF','110'],['IS-IS','115'],['RIP','120'],['EIGRP (external)','170'],['iBGP','200'],['Unknown','255 (never used)']])+
H('NAT')+
TB(['Type','What it does'],[['Static NAT','1:1, one private to one public (publish a server)'],['Dynamic NAT','Private addresses to a pool of public addresses'],['PAT / NAT overload','Many hosts share <b>one</b> public IP, told apart by port (home routers)']])+
UL('<b>Inside local</b> = the private address before translation. <b>Inside global</b> = the public address representing it. Outside local/global describe the remote host.',
 'Port forwarding publishes an inside service on a public port.')+
H('Other')+
UL('<b>FHRP</b>: hosts point at a virtual gateway IP shared by routers. <b>HSRP</b> (Cisco, active/standby), <b>VRRP</b> (open standard, master/backup), GLBP (Cisco, load balancing).',
 '<b>Router-on-a-stick</b>: 802.1Q subinterfaces on one router port, one per VLAN, for inter-VLAN routing.',
 'At each hop the router strips the frame, looks up the route, <b>decrements TTL</b> and builds a new frame.')+
TRAPS('Longest prefix match beats AD: a /24 learned by RIP beats a /16 static route.','A static route (AD 1) beats OSPF (110) for the same prefix, even if OSPF\'s path is better.','"Destination host unreachable" from a router = it has no route. "Request timed out" = no reply came back (often a missing return route).')},

{n:8,title:'TCP/IP Applications',obj:'1.4',book:'6',html:
H('Ports on the N10-009 list')+
TB(['Port','Protocol','Transport','Note'],[
 ['20/21','FTP','TCP','20 data, 21 control; clear text'],['22','SSH / SFTP','TCP','Secure shell; SFTP runs over SSH'],['23','Telnet','TCP','Clear text: replace with SSH'],['25','SMTP','TCP','Server-to-server mail'],
 ['53','DNS','UDP (queries) / TCP (zone transfers)',''],['67/68','DHCP','UDP','67 server, 68 client'],['69','TFTP','UDP','No authentication'],['80','HTTP','TCP',''],['123','NTP','UDP',''],
 ['161/162','SNMP','UDP','161 polling, 162 traps'],['389','LDAP','TCP/UDP',''],['443','HTTPS','TCP','Also DoH'],['445','SMB','TCP','Windows file sharing'],['514','Syslog','UDP',''],
 ['587','SMTPS (submission)','TCP','465 = implicit TLS'],['636','LDAPS','TCP',''],['1433','SQL Server','TCP',''],['3389','RDP','TCP',''],['5060/5061','SIP','TCP/UDP','5061 = TLS']])+
P('Also in the book and handouts: POP3 110, POP3S 995, IMAP 143, IMAPS 993, Kerberos 88, NetBIOS 137–139, TACACS+ TCP 49, RADIUS UDP 1812/1813, BGP TCP 179, H.323 1720, MySQL 3306, VNC 5900, IKE UDP 500 (NAT-T 4500), L2TP UDP 1701, PPTP TCP 1723, DoT 853.')+
UL('Port ranges: <b>well-known 0–1023</b> · <b>registered 1024–49151</b> · <b>dynamic 49152–65535</b> (clients use these as source ports).',
 'Secure replacements: Telnet → SSH · FTP → SFTP/FTPS · HTTP → HTTPS · LDAP → LDAPS · SNMPv1/v2c → SNMPv3 · POP3/IMAP → POP3S/IMAPS · TFTP → SCP/SFTP.')+
H('TCP details and other protocols')+
UL('Handshake: <b>SYN → SYN/ACK → ACK</b>. Flags: SYN, ACK, FIN (graceful close), RST (abrupt close), PSH, URG.',
 'IP protocol numbers: ICMP 1, TCP 6, UDP 17, GRE 47, ESP 50, AH 51, OSPF 89.',
 '<b>ICMP</b>: echo, destination unreachable, time exceeded (ping and traceroute).',
 '<b>GRE</b>: a simple tunnel with <b>no encryption</b>; it can carry multicast and routing protocols, and is often wrapped in IPsec.',
 '<b>IPsec</b>: <b>AH</b> = integrity and authentication, no encryption. <b>ESP</b> = encryption + integrity. <b>IKE</b> = key negotiation (UDP 500). Transport mode protects the payload (host-to-host); tunnel mode protects the whole packet (site-to-site).')+
TRAPS('Zone transfers use TCP 53, not UDP.','SNMP traps go to 162, not 161.','The exam\'s SMTPS port is 587.','SFTP (SSH, port 22) and FTPS (FTP over TLS) are different protocols.')},

{n:9,title:'Network Naming',obj:'3.4',book:'5, 7',html:
H('DNS')+
UL('Client lookup order: local cache → <b>hosts file</b> → configured DNS server, which resolves <b>recursively</b> (root → TLD → authoritative).',
 'Zones: <b>forward</b> (name → IP) and <b>reverse</b> (IP → name, in-addr.arpa / ip6.arpa). The <b>primary</b> holds the writable copy; a <b>secondary</b> keeps a read-only copy via zone transfer (TCP 53).',
 '<b>Authoritative</b> answers come from the zone owner; <b>non-authoritative</b> answers come from a cache. Each record\'s <b>TTL</b> sets how long it can be cached.')+
TB(['Record','Purpose'],[['A','Name → IPv4'],['AAAA','Name → IPv6'],['CNAME','Alias → canonical name'],['MX','Mail server for the domain (with priority)'],['NS','Authoritative name servers'],['SOA','Zone authority info and serial number'],['PTR','IP → name (reverse lookup)'],['TXT','Free text: SPF, DKIM, DMARC, verification'],['SRV','Service location (host + port), e.g. AD, SIP']])+
UL('<b>DNSSEC</b> signs records: integrity and authenticity, <b>not privacy</b>. It defends against cache poisoning.',
 '<b>DoH</b> (443) and <b>DoT</b> (853) encrypt queries for privacy. <b>DDNS</b> updates records when IPs change. LLMNR and NetBIOS are legacy local name resolution.',
 'Symptom: <b>works by IP, fails by name → DNS</b>. Check the DNS server setting, use nslookup/dig, run ipconfig /flushdns.')+
H('DHCP')+
UL('<b>DORA</b>: Discover (broadcast) → Offer → Request → Acknowledge. UDP 67 server / 68 client.',
 '<b>Scope</b> = the pool. <b>Exclusions</b> keep addresses out of it. <b>Reservations</b> fix one IP to a MAC.',
 'Clients renew at <b>50%</b> of the lease. Short leases suit guest and Wi-Fi networks.',
 'Options: default gateway (option 3), DNS servers, domain name, NTP server.',
 '<b>Relay / ip helper-address</b>: forwards DHCP broadcasts across routers. Otherwise each broadcast domain needs its own server.',
 'Problems: pool exhaustion → APIPA; a static IP inside the scope → duplicate IP; a <b>rogue DHCP server</b> → wrong gateway/DNS (fix with DHCP snooping).',
 'IPv6: SLAAC, stateless DHCPv6 and stateful DHCPv6 (see Ch 12).')+
H('Time')+
UL('<b>NTP</b>, UDP 123, works in strata: stratum 0 = the reference clock (GPS/atomic), stratum 1 = attached to it, and so on down.',
 '<b>PTP</b> (IEEE 1588) gives sub-microsecond precision with hardware timestamps. <b>NTS</b> adds authentication to NTP.',
 'Accurate time matters for logs, certificates and Kerberos.')+
TRAPS('DNSSEC does not encrypt.','A reservation is not an exclusion.','A server attached to a GPS clock is stratum 1, not 0.')},

{n:10,title:'Securing TCP/IP',obj:'4.1, 1.4',book:'20',html:
H('Core concepts')+
UL('<b>CIA</b>: Confidentiality (encryption, access control) · Integrity (hashing, signatures) · Availability (redundancy, DR, DoS protection).',
 'Threat (potential danger) · vulnerability (weakness, catalogued as CVEs) · exploit (uses the weakness) · risk = likelihood × impact · zero-day (unknown or unpatched).',
 'Data <b>in transit</b> (TLS, IPsec, SSH) vs data <b>at rest</b> (disk or database encryption).')+
TB(['Method','Key point'],[
 ['Symmetric','One shared key; fast for bulk data (AES); the challenge is distributing the key'],
 ['Asymmetric','Public/private key pair (RSA, ECC); slower; used for key exchange and signatures'],
 ['Hashing','Fixed-length digest for integrity (SHA-256 good; MD5 and SHA-1 weak)']])+
UL('Encrypt with the recipient\'s <b>public</b> key → only their private key decrypts (confidentiality).',
 'Sign with your <b>private</b> key → anyone verifies with your public key (integrity + <b>non-repudiation</b>).',
 '<b>PKI</b>: a CA issues certificates binding a public key to an identity. Self-signed, expired or mismatched certificates trigger browser warnings.')+
H('AAA and identity')+
TB(['','RADIUS','TACACS+'],[['Transport','UDP 1812/1813 (legacy 1645/1646)','TCP 49'],['Encrypts','Only the password','The entire payload'],['AAA','Combines authentication and authorization','Separates all three; per-command authorization'],['Typical use','Network access (Wi-Fi, VPN, 802.1X)','Device administration (Cisco)']])+
UL('Identification → authentication → authorization → accounting.',
 '<b>MFA</b> factors: something you know · have · are · somewhere you are · something you do. Two passwords are still single-factor.',
 '<b>SSO</b> = log in once. <b>SAML</b> = XML web federation (identity provider ↔ service provider). <b>LDAP/LDAPS</b> = directory queries (389/636).',
 '<b>Kerberos</b>: ticket-based SSO with a KDC and a TGT, port 88. It is an <b>open MIT standard</b> used by AD and is <b>time-sensitive</b> (about 5 minutes of allowed skew).',
 'Authorization models: <b>least privilege</b>; <b>RBAC</b> (permissions by role); DAC (owner decides); MAC (labels and clearances).')+
TRAPS('Kerberos is not Microsoft proprietary, whatever the handouts say.','ESP is IPsec; EAP is 802.1X authentication. The handouts mix the two up.','Hashing proves integrity; it doesn\'t provide confidentiality.')},

{n:11,title:'Switch Features',obj:'2.2',book:'11',html:
H('VLANs')+
UL('A VLAN is a separate broadcast domain on shared switches. IDs 1–4094; VLAN 1 is the default.',
 '<b>Access port</b> = one VLAN, untagged. <b>Trunk</b> = many VLANs, <b>802.1Q</b>-tagged (a 4-byte tag holding a 12-bit VLAN ID and 3-bit priority).',
 '<b>Native VLAN</b> = untagged traffic on a trunk (default 1). It must match on both ends; move it to an unused VLAN.',
 '<b>Voice VLAN</b> = a separate tagged VLAN for an IP phone sharing a port with a PC. <b>SVI</b> = a VLAN\'s Layer 3 interface on a switch.',
 'VTP propagates VLANs (Cisco). <b>DTP</b> auto-negotiates trunks (Cisco); disable it on access ports. Private VLANs isolate hosts from each other.',
 'New host can\'t reach resources? <b>Check the port\'s VLAN.</b>')+
H('Spanning Tree (802.1D)')+
UL('Prevents Layer 2 <b>loops</b>, which cause broadcast storms, MAC table instability and duplicate frames.',
 '<b>Root bridge</b> = the lowest bridge ID: priority (default 32768) first, then the lowest MAC.',
 'Port roles: root port (best path to the root), designated port, blocked/alternate port.',
 'States: <b>blocking</b> (BPDUs only) → <b>listening</b> (roles) → <b>learning</b> (fills the MAC table) → <b>forwarding</b>; also disabled. <b>RSTP (802.1w)</b> is much faster (discarding, learning, forwarding).',
 '<b>BPDU Guard</b> err-disables a PortFast/access port that receives a BPDU (stops rogue switches). <b>Root Guard</b> stops a port becoming the path to a new root. <b>Storm control</b> limits floods.')+
H('Interfaces and power')+
UL('Set speed and duplex to auto, or hard-set <b>both</b> ends the same. A <b>duplex mismatch</b> causes late collisions, CRC errors and slowness.',
 '<b>LACP (802.3ad)</b> bundles links (port channel, EtherChannel, NIC teaming). <b>Jumbo frames</b> (~9000 MTU) for iSCSI and vMotion must match everywhere. <b>Port mirroring (SPAN)</b> copies traffic to a monitoring port.')+
TB(['PoE standard','At the switch','At the device'],[['802.3af (PoE)','15.4 W','~12.95 W'],['802.3at (PoE+)','30 W','~25.5 W'],['802.3bt Type 3 (PoE++)','60 W','~51 W'],['802.3bt Type 4','90–100 W','~71 W']])+
P('A switch has a total PoE <b>power budget</b> shared across ports. PoE injectors add power where the switch has none. Managed switches add VLANs, STP tuning, port security, SNMP, mirroring and QoS.')+
TRAPS('PoE+ is 802.3at (30 W). The handouts\' "PoE+ 802.3af" is wrong.','Trunk ports do not appear in show vlan brief.','A native VLAN mismatch breaks untagged traffic between switches.')},

{n:12,title:'IPv6',obj:'1.8',book:'7, 10',html:
H('Addresses')+
UL('128 bits, written as 8 groups ("hextets") of 4 hex digits. Typical split: /48 site, <b>/64 subnet</b>, 64-bit interface ID.',
 '<b>Shortening</b>: drop leading zeros in each group, and replace <b>one</b> run of all-zero groups with <code>::</code>. Use :: only once.')+
TB(['Type','Prefix','Like IPv4…'],[['Global unicast','2000::/3','Public addresses'],['Link-local','<b>fe80::/10</b>','APIPA (always present, never routed)'],['Unique local','fc00::/7 (fd00::/8 in practice)','Private RFC 1918'],['Multicast','ff00::/8','Multicast (replaces broadcast)'],['Loopback','::1','127.0.0.1'],['Unspecified','::','0.0.0.0'],['Anycast','From the unicast space','One-to-nearest']])+
P('<b>No broadcast in IPv6.</b>')+
H('EUI-64')+
P('Split the 48-bit MAC in half, insert <b>FFFE</b> in the middle, then <b>flip the 7th bit</b> of the first byte. Example: 00:1A:2B:3C:4D:5E → <code>021A:2BFF:FE3C:4D5E</code>. Privacy extensions use random IDs instead.')+
H('NDP and configuration')+
TB(['NDP message (ICMPv6)','Purpose'],[['Router Solicitation (RS)','Host asks for routers'],['Router Advertisement (RA)','Router announces the prefix and gateway'],['Neighbor Solicitation (NS)','Like an ARP request'],['Neighbor Advertisement (NA)','Like an ARP reply'],['Redirect','Points the host to a better next hop']])+
UL('<b>SLAAC</b>: the host builds its own address from the RA prefix. <b>Stateless DHCPv6</b>: SLAAC plus options such as DNS. <b>Stateful DHCPv6</b>: the server assigns the address.')+
H('Transition')+
UL('<b>Dual stack</b> (both run natively; preferred) · <b>6to4</b> · <b>Teredo</b> (tunnels through NAT over UDP) · <b>ISATAP</b> (inside a site) · <b>NAT64</b> with DNS64 (IPv6-only hosts reach IPv4).',
 'Why IPv6: IPv4 exhaustion, a simpler header, no fragmentation by routers, and built-in IPsec support.')+
TRAPS(':: can appear only once in an address.','Link-local is fe80::/10, not fc00::/7.','In EUI-64, flip the 7th bit: 00 becomes 02, not 01.')},

{n:13,title:'WAN Connectivity',obj:'3.5, 1.6',book:'13, 1',html:
H('WAN technologies')+
TB(['Technology','Key point'],[
 ['MPLS','Label switching across a provider network'],['Metro Ethernet','Ethernet handoff across a city'],['DSL','ADSL (asymmetric), SDSL (symmetric), VDSL (very high bit rate)'],
 ['Cable','DOCSIS over coax'],['Fiber / SONET','SONET uses OC-n rates'],['Satellite','Geostationary: high latency (~600 ms+ round trip), affected by weather; LEO is much lower'],
 ['Cellular','LTE (4G), 5G low/mid/high (mmWave) bands; higher bands are faster but shorter range'],['SD-WAN','Application-aware routing over several transports, central policy, zero-touch provisioning']])+
P('<b>Demarc</b> = where the provider\'s responsibility ends. Site types: on-premises data center, branch office, colocation.')+
H('VPNs')+
UL('<b>Site-to-site</b>: gateway to gateway, always on (usually IPsec). <b>Client-to-site</b>: user software to a VPN concentrator. <b>Clientless</b>: a browser portal over TLS.',
 '<b>Split tunnel</b>: only corporate traffic goes through the VPN (saves bandwidth, less control). <b>Full tunnel</b>: everything goes through it (more secure and inspectable).',
 'Protocols: IPsec (IKEv2), SSL/TLS (TLS replaced SSL), L2TP/IPsec, legacy PPTP (insecure), SSTP, OpenVPN, SSH tunnels, GRE (no encryption).',
 'IPsec <b>transport mode</b> = payload only (host-to-host). <b>Tunnel mode</b> = the whole packet (site-to-site).')+
H('Management access')+
UL('Methods: <b>SSH</b> (secure CLI) · GUI (HTTPS) · API · <b>console</b> (serial/USB; works with no network config).',
 'Remote desktop: <b>RDP 3389</b>, <b>VNC 5900</b>, RD Gateway, VDI.',
 '<b>Jump box</b>: a hardened host admins connect to first, centralizing control and logging.',
 '<b>In-band</b> = over the production network. <b>Out-of-band</b> = a separate path (console server, cellular, management network) that works when production is down.')+
TRAPS('L2TP is an IETF open standard, not "used by Cisco" as one quiz says.','A clientless VPN still encrypts, over TLS.','Out-of-band management is the answer whenever the production network is down.')},

{n:14,title:'Wireless',obj:'2.3, 5.4',book:'12',html:
H('802.11 standards')+
TB(['Standard','Name','Band','Max rate','Key feature'],[
 ['802.11a','—','5 GHz','54 Mbps','OFDM'],['802.11b','—','2.4 GHz','11 Mbps','DSSS'],['802.11g','—','2.4 GHz','54 Mbps','OFDM; works with b'],
 ['802.11n','Wi-Fi 4','2.4 / 5 GHz','600 Mbps','MIMO, 40 MHz channels'],['802.11ac','Wi-Fi 5','5 GHz','~6.9 Gbps','80/160 MHz; Wave 2 = downlink MU-MIMO'],
 ['802.11ax','Wi-Fi 6 / 6E','2.4 / 5 GHz (+6 GHz for 6E)','~9.6 Gbps','<b>OFDMA</b>, uplink + downlink MU-MIMO, BSS coloring']])+
H('Channels')+
UL('2.4 GHz: <b>non-overlapping 1, 6, 11</b>. Long range, lots of interference (microwaves, Bluetooth).',
 '5 GHz: many channels, less range. Some need <b>DFS</b> (radar avoidance) and TPC (802.11h).',
 '6 GHz (Wi-Fi 6E): the most clean spectrum and <b>requires WPA3</b>.',
 'Wider channels mean more throughput but fewer non-overlapping channels. Allowed channels and power vary by country.')+
H('Identifiers and network types')+
UL('<b>SSID</b> = network name. <b>BSSID</b> = an AP radio\'s MAC. <b>ESS</b> = one SSID across several APs for roaming. BSS = one AP. <b>IBSS</b> = ad hoc.',
 'Infrastructure (through APs) · ad hoc (no AP) · point-to-point (wireless bridge) · mesh (APs relay for each other).',
 'Autonomous APs are configured one by one. Lightweight APs are managed by a <b>WLC</b>.')+
H('Security')+
TB(['Protocol','Encryption','Status'],[['WEP','RC4','Broken; never use'],['WPA','TKIP','Deprecated'],['WPA2','AES-CCMP','Current baseline'],['WPA3','SAE (Personal), 192-bit (Enterprise), OWE (open)','Strongest; resists offline dictionary attacks']])+
UL('<b>Personal</b> = PSK/passphrase. <b>Enterprise</b> = 802.1X + RADIUS with per-user credentials.',
 'Guest networks: separate VLAN, <b>captive portal</b>, <b>client isolation</b>. MAC filtering and hidden SSIDs are weak controls.')+
H('RF basics')+
UL('Antennas: <b>omnidirectional</b> (360°, general coverage) vs <b>directional</b> (Yagi, parabolic, patch; long links, hallways). Gain in dBi.',
 'Access method: <b>CSMA/CA</b>. Modulation: DSSS (b), FHSS (legacy), OFDM (a/g/n/ac), OFDMA (ax).',
 'Signal terms: <b>RSSI</b>, <b>SNR</b>, EIRP. Losses: absorption (walls, water), reflection (metal), refraction, scattering, diffraction.',
 '<b>Site survey</b> before and after deployment produces a <b>heat map</b>. Problems: co-channel and adjacent-channel interference, dead zones, roaming misconfiguration (mismatched SSID or security, power levels), sticky clients.',
 'Other wireless: Bluetooth (PAN), NFC (centimetres), RFID, Zigbee/Z-Wave (IoT), infrared.')+
TRAPS('MU-MIMO first appeared in 802.11ac Wave 2 (downlink). The book says 802.11ax; that is wrong.','Two neighboring APs on the same channel = co-channel interference.','6 GHz needs WPA3.')},

{n:15,title:'Virtualization and Cloud',obj:'1.3, 1.8',book:'17',html:
H('Virtualization')+
UL('<b>Type 1</b> hypervisor = bare metal (ESXi, Hyper-V, KVM). <b>Type 2</b> = hosted on an OS (VirtualBox, Workstation).',
 'VMs connect through a <b>vSwitch</b> with virtual NICs. <b>NFV</b> runs routers, firewalls and load balancers as VMs.')+
H('Cloud models')+
TB(['Service model','Provider runs','You run'],[['IaaS','Hardware, network, storage','OS and everything above'],['PaaS','Hardware, OS, runtime','Your code and data'],['SaaS','The whole application','Just use it'],['DaaS / VDI','Hosted desktops','The user session']])+
UL('Deployment: <b>public</b> (shared provider infrastructure) · <b>private</b> (one organization) · <b>hybrid</b> (both) · community.',
 '<b>Scalability</b> = the ability to grow (up = bigger instance, out = more instances). <b>Elasticity</b> = scaling up <i>and</i> down <b>automatically</b>. <b>Multitenancy</b> = customers share infrastructure, isolated logically.',
 '<b>VPC</b> = an isolated private network inside a public cloud, split into subnets.',
 '<b>Security groups</b> = stateful, per instance/NIC. <b>Security lists / NACLs</b> = usually stateless, per subnet.',
 '<b>Internet gateway</b> = two-way Internet for public subnets. <b>NAT gateway</b> = outbound-only for private subnets.',
 'Connecting to the cloud: site-to-site VPN over the Internet, or a <b>direct/private connection</b> for consistent performance.')+
H('Evolving technologies')+
UL('<b>SDN</b> separates the <b>control plane</b> (decisions, on a central controller) from the <b>data plane</b> (forwarding). The management plane handles configuration; the application plane holds the apps. Northbound APIs face apps, southbound APIs face devices.',
 '<b>SD-WAN</b>: application-aware routing over MPLS, broadband and LTE; central policy; zero-touch provisioning.',
 '<b>VXLAN</b>: Layer 2 frames inside UDP 4789, with a 24-bit VNI (~16 million segments vs 4094 VLANs).',
 '<b>Zero trust</b>: never trust, always verify. Identity, device posture and context; least privilege; microsegmentation.',
 '<b>SASE</b> = SD-WAN + cloud security. <b>SSE</b> = the security half (SWG, CASB, ZTNA, FWaaS).',
 '<b>IaC</b>: playbooks and templates prevent <b>configuration drift</b>; source control gives versioning and branching; orchestration chains automated tasks.')+
TRAPS('Elasticity is automatic; scalability alone isn\'t.','Security groups are stateful; NACLs are usually stateless.','SDN separates control from data; NFV virtualizes appliances. Don\'t mix them up.')},

{n:16,title:'Data Centers',obj:'1.6, 1.2, 3.3',book:'16, 17',html:
H('Architectures')+
UL('<b>Three-tier</b>: core (fast backbone) · distribution (policy, ACLs, inter-VLAN routing) · access (end devices, port security, PoE).',
 '<b>Collapsed core</b>: core and distribution merged, for smaller sites.',
 '<b>Spine-and-leaf</b>: every leaf connects to every spine; leaves never interconnect. Paths are equal length with predictable latency for <b>east-west</b> traffic. Leaves are often <b>top-of-rack (ToR)</b> switches.',
 '<b>North-south</b> = in and out of the data center. <b>East-west</b> = server to server.',
 'Storage: <b>SAN</b> is block-level (Fibre Channel, FCoE, iSCSI with initiator and target; servers use an HBA). <b>NAS</b> is file-level (SMB, NFS).')+
H('High availability')+
UL('<b>Active-active</b>: all nodes carry load. <b>Active-passive</b>: a standby takes over on failure.',
 'Remove single points of failure: clusters, VRRP/HSRP, load balancers, <b>multipathing</b> (storage), <b>NIC teaming</b>, multiple ISPs and diverse paths, UPS + generator, dual PSUs.')+
H('Disaster recovery')+
TB(['Metric','Meaning'],[['RPO','Maximum acceptable <b>data loss</b> (drives backup frequency)'],['RTO','Maximum acceptable <b>downtime</b>'],['MTTR','Mean time to repair'],['MTBF / MTTF','Mean time between failures (repairable) / to failure (non-repairable)']])+
TB(['Site','Has','Recovery time'],[['Cold','Space, power, connectivity only','Days to weeks; cheapest'],['Warm','Some equipment; data not current','Hours to days'],['Hot','Fully equipped, near-real-time data','Minutes to hours; fastest, most expensive'],['Cloud','Recovery infrastructure in the cloud','Depends how it\'s kept (hot = fastest)']])+
TB(['Backup','Copies','Restore needs'],[['Full','Everything','That backup only'],['Incremental','Changes since the last backup of any type','Full + every incremental'],['Differential','Changes since the last full (grows)','Full + latest differential'],['Snapshot','Point-in-time image','The snapshot']])+
UL('Testing: <b>tabletop</b> (discussion only) vs <b>validation</b> (real failover or restore). Hold them yearly and write after-action reports.')+
TRAPS('The fastest site is hot. The quiz workbook marks "cloud", which only counts if the cloud site is kept hot.','RPO is data loss; RTO is downtime.','Incremental is fastest to back up but slowest to restore.')},

{n:17,title:'Integrating Network Devices',obj:'4.1, 2.2, 1.4',book:'5, 21',html:
H('Device categories')+
TB(['Category','Examples','Network treatment'],[
 ['IoT','Smart speakers, cameras, thermostats','Own VLAN or SSID; change default credentials; patch firmware'],
 ['ICS / SCADA / OT','PLCs, HMIs, utility controls','Availability first; often legacy and unpatched → strong segmentation, air gaps'],
 ['VoIP','IP phones, gateways','Voice VLAN, QoS, SIP 5060/5061 signaling, RTP media'],
 ['Building systems','HVAC, physical access control, cameras','Separate segment; monitor'],
 ['Media / conferencing','Video endpoints','QoS for latency and jitter']])+
UL('VoIP is sensitive to <b>latency, jitter and packet loss</b>. Mark it with QoS (DSCP at L3, 802.1p CoS at L2) and use jitter buffers.',
 '<b>Segmentation</b> keeps IoT, OT, guest and BYOD devices away from production, using VLANs, ACLs and firewalls.',
 'SOHO design: separate guest and IoT networks, a screened subnet for exposed services, no default passwords.')+
TRAPS('ICS/SCADA puts availability first, not confidentiality.','The best first step for a new IoT device is changing its default credentials and isolating it.')},

{n:18,title:'Network Operations',obj:'3.1, 3.3',book:'15, 16',html:
H('Documentation')+
UL('<b>Physical</b> diagram (devices, racks, cable runs) vs <b>logical</b> diagram (subnets, VLANs, routing, flows); also L1/L2/L3 diagrams.',
 'Rack diagrams · cable maps · floor plans · MDF/IDF docs · site surveys · asset inventory (hardware, software, licensing, warranty) · <b>IPAM</b> · baselines.')+
H('Agreements')+
TB(['Document','Purpose'],[['SLA','Measurable commitments (uptime, response)'],['MOU','Informal mutual understanding, usually not binding'],['NDA','Confidentiality'],['SOW','Specific work, deliverables, timelines'],['MSA','Master terms for an ongoing relationship']])+
TB(['Availability','Downtime per year'],[['99.9%','≈ 8.76 hours'],['99.99%','≈ 52.6 minutes'],['99.999%','≈ 5.26 minutes']])+
H('Life cycle and change')+
UL('<b>EOL</b> = no longer sold. <b>EOS</b> = no patches or support. Test patches and firmware before deploying. Decommission by sanitizing media (wipe, degauss, shred) and updating inventory.',
 '<b>Change management</b>: request → impact/risk assessment → approval (CAB) → <b>maintenance window</b> → <b>backout plan</b> → implement → verify → document.',
 '<b>Configuration management</b>: running vs startup/backup config; a golden baseline config detects <b>drift</b>.')+
H('Policies and incident response')+
UL('<b>AUP</b> (acceptable use) · password policy · <b>BYOD</b> (separate personal and corporate data with MDM; also CYOD, COPE, COBO) · remote access · onboarding and <b>offboarding</b> (revoke access promptly) · DLP and privacy.',
 'Incident response: <b>preparation → detection → containment → eradication → recovery → lessons learned</b>.',
 'The first responder secures the scene. Keep a <b>chain of custody</b> for evidence.')+
TRAPS('"Urgent" doesn\'t skip change management; emergency changes are still documented.','Containment comes before eradication.','EOS (no patches) is the security concern, not EOL.')},

{n:19,title:'Protecting Networks',obj:'4.2, 4.3',book:'21',html:
H('Attacks and their defenses')+
TB(['Attack','How it works','Defense'],[
 ['DoS / DDoS','Floods (ICMP, UDP, SYN) from one source or a botnet (C2)','Upstream scrubbing, rate limiting'],
 ['Amplification / reflection','Small spoofed queries to DNS/NTP → large replies to the victim','Rate limiting, closing open resolvers'],
 ['VLAN hopping: switch spoofing','Attacker negotiates a trunk via DTP','Static access ports, disable DTP'],
 ['VLAN hopping: double tagging','Outer tag = native VLAN, inner tag = target (one way only)','Unused native VLAN with no hosts'],
 ['MAC flooding','Fills the CAM table → switch floods like a hub','Port security'],
 ['ARP poisoning','Fake ARP replies → on-path','<b>Dynamic ARP Inspection</b>'],
 ['DNS poisoning','Corrupted cache or forged answers','DNSSEC, hardened resolvers'],
 ['Rogue DHCP','Wrong gateway/DNS → on-path','<b>DHCP snooping</b>'],
 ['Rogue AP / evil twin','Unauthorized AP; twin copies the SSID, often with deauth','Wireless IDS/IPS, 802.1X'],
 ['Rogue IPv6 RA','Fake router advertisements','<b>RA Guard</b>'],
 ['Rogue switch','Plugged into an access port','<b>BPDU Guard</b>']])+
UL('<b>On-path</b> (formerly man-in-the-middle): ARP poisoning, rogue APs, session hijacking, replay, SSL stripping/downgrade.',
 'Social engineering: <b>phishing</b>, <b>spear phishing</b> (targeted), <b>whaling</b> (executives), <b>vishing</b> (voice), <b>smishing</b> (SMS), dumpster diving, shoulder surfing, <b>tailgating</b> (without consent) vs <b>piggybacking</b> (with consent).',
 'Malware: virus (needs the user to run it), worm (self-spreads), trojan/RAT, ransomware, rootkit, logic bomb, spyware.',
 'Password attacks: brute force, dictionary, credential stuffing, default credentials.')+
H('Defenses')+
UL('<b>Hardening</b>: change default credentials, disable unused ports (park them in an unused VLAN) and services, patch, use SSH/HTTPS/SNMPv3, add banners and timeouts.',
 '<b>NAC</b> posture checks send failing devices to a remediation VLAN. <b>802.1X</b>: supplicant (client) → authenticator (switch/AP) → authentication server (RADIUS). EAP-TLS (certificates on both sides) is strongest; PEAP and EAP-TTLS use a server certificate.',
 '<b>Port security</b>: limit MACs per port, sticky learning; violation modes shutdown / restrict / protect.',
 '<b>ACLs</b>: top-down, <b>first match wins</b>, <b>implicit deny</b> at the end. Specific rules before general ones. Filter by IP, port, protocol or MAC.',
 'Zones: trusted (inside) vs untrusted (Internet). <b>Screened subnet</b> (formerly DMZ) for public servers.',
 'Also: URL/content filtering, control plane policing, storm control, private VLANs, user training, <b>defense in depth</b>.',
 'Physical: cameras, locks, badges, <b>access control vestibule</b>, biometrics, guards, tamper detection, asset tags. Deception: honeypot, honeynet.')+
TRAPS('Use CompTIA\'s terms: on-path, screened subnet, access control vestibule.','A permit-any line above a deny makes the deny unreachable.','Piggybacking is with consent; tailgating is without.')},

{n:20,title:'Network Monitoring',obj:'3.2',book:'14',html:
H('SNMP')+
UL('A <b>manager</b> (NMS) polls <b>agents</b> on <b>UDP 161</b>. Agents send unsolicited <b>traps</b> to the manager on <b>UDP 162</b>; informs are acknowledged traps.',
 'The <b>MIB</b> describes manageable objects, each identified by an <b>OID</b>. Operations: Get, GetNext, GetBulk, Set.',
 '<b>v1/v2c</b> use community strings (plaintext; read-only vs read-write). <b>v3</b> adds authentication, encryption and integrity.')+
H('Traffic visibility')+
TB(['Method','Captures','Use'],[['Flow data (NetFlow, IPFIX, sFlow)','Metadata: who, ports, how much, when','Traffic analysis, top talkers'],['Packet capture (Wireshark, tcpdump)','Full packets, including payload','Deep protocol troubleshooting'],['SPAN / port mirror','A copy from the switch (may drop errors)','Feeding analyzers and IDS'],['Network tap','A hardware copy of everything, including errors','Complete, reliable capture']])+
H('Logs')+
TB(['Level','Severity'],[['0','Emergency'],['1','Alert'],['2','Critical'],['3','Error'],['4','Warning'],['5','Notice'],['6','Informational'],['7','Debug']])+
UL('Mnemonic: <i>Every Awesome Cisco Engineer Will Need Ice cream Daily</i>. A lower number is more severe. Syslog collector: <b>UDP 514</b>.',
 '<b>SIEM</b>: aggregates and correlates logs, alerts, retains them for forensics. Timestamps must be synced with <b>NTP</b>.',
 'Logs to review: traffic, audit, system. Monitoring platforms also integrate through REST APIs.')+
H('Metrics')+
UL('Device: CPU, memory, temperature, uptime, interface status. Network: utilization, throughput, <b>latency</b>, <b>jitter</b>, <b>packet loss</b>, error rates.',
 'A <b>baseline</b> defines normal; anomaly alerts fire when metrics deviate from it.',
 'Solutions: network discovery, traffic analysis, performance monitoring, availability (up/down) monitoring, configuration-change monitoring. Environmental sensors: temperature, humidity, power, flood, door.')+
TB(['Counter','Usual cause'],[['CRC errors','Bad cable, EMI, duplex mismatch'],['Runts (< 64 bytes)','Collisions, duplex mismatch'],['Giants (> 1518 bytes)','Jumbo frames without jumbo support'],['Discards / drops','Congestion, full buffers'],['Late collisions','Duplex mismatch, over-length cable']])+
TRAPS('SNMP traps go to 162; polling uses 161.','Only SNMPv3 encrypts.','Severity 0 is the most severe, not 7.')},

{n:21,title:'Network Troubleshooting',obj:'5.1–5.5',book:'18, 19',html:
H('The methodology (in order)')+
TB(['Step','Includes'],[
 ['1. Identify the problem','Gather info, question users, identify symptoms, <b>determine what changed</b>, duplicate it, approach multiple problems individually'],
 ['2. Establish a theory of probable cause','Question the obvious; OSI top-down or bottom-up; divide and conquer'],
 ['3. Test the theory','Confirmed → next steps. Not confirmed → new theory or escalate'],
 ['4. Establish a plan of action','Identify potential effects'],
 ['5. Implement the solution or escalate',''],
 ['6. Verify full system functionality','Implement preventive measures if applicable'],
 ['7. Document findings','Actions, outcomes, lessons learned']])+
UL('Habits: check the <b>link light</b> first; narrow the scope (one user or many?); swap to a known-good port or cable.',
 '<b>Four-step ping</b>: 127.0.0.1 (TCP/IP stack) → your own IP (NIC) → default gateway (local network) → remote host (routing). Then ping a name to test DNS.',
 'Check the internal network before blaming the ISP.')+
H('Symptom → likely cause')+
TB(['Symptom','Likely cause'],[
 ['169.254.x.x address','DHCP unreachable or scope exhausted'],['Local works, remote fails','Wrong or missing default gateway'],['IP works, name fails','DNS'],['Some local hosts unreachable','Wrong subnet mask'],
 ['"Address conflict", intermittent','Duplicate IP'],['Wrong subnet after a desk move','Wrong VLAN on the port'],['Unexpected gateway/DNS','Rogue DHCP server'],['Broadcast storm, high CPU, MAC flapping','Switching loop (STP)'],
 ['err-disabled port','Port security, BPDU Guard or link flap → fix, then shut / no shut'],['Administratively down','Shut down in the configuration'],['Suspended port','LACP member mismatch'],
 ['Late collisions, CRC errors, slow','Duplex mismatch'],['No light on new fiber','TX/RX swapped'],['PoE device reboots or won\'t power','Wrong PoE standard or budget exceeded'],['TTL expired in traceroute','Routing loop'],['Choppy VoIP','Jitter (use QoS)']])+
H('Performance')+
UL('<b>Bandwidth</b> (capacity) vs <b>throughput</b> (achieved). The slowest link is the bottleneck.',
 'Wireless: co-channel/adjacent-channel interference, channel overlap (use 1/6/11), absorption and reflection, insufficient coverage, deauthentication, roaming misconfiguration. Check RSSI and SNR.',
 'A wrong MTU causes fragmentation or black holes.')+
H('Commands')+
TB(['Command','Purpose'],[
 ['ping','Reachability (Win: -t continuous, -n count, -l size; Linux: -c, -s)'],['tracert / traceroute','Hop-by-hop path (Win ICMP, Linux UDP); pathping adds loss statistics'],
 ['ipconfig','/all, /release, /renew, /flushdns, /displaydns'],['ip (ifconfig)','ip addr, ip route, ip link'],['arp -a','ARP cache; spot conflicts and spoofing'],
 ['netstat','-a all, -n numeric, -b program (Win), -r routes'],['route print / ip route','Routing table'],['nslookup / dig / host','DNS queries (dig gives more detail)'],
 ['nmap','Hosts, open ports, services, OS (only with permission)'],['tcpdump / Wireshark','Packet capture'],['LLDP / CDP','Which switch and port you\'re on'],['iperf','Throughput testing']])+
P('Cisco: <code>show interface</code>, <code>show ip route</code>, <code>show vlan</code>, <code>show mac address-table</code>, <code>show arp</code>, <code>show running-config</code>, <code>show power inline</code>, <code>show spanning-tree</code>, <code>show cdp/lldp neighbors</code>.')+
TRAPS('"FIRST" questions follow the methodology: identify the problem before anything else.','Verify full functionality before documenting.','A theory that fails goes back to step 2, or you escalate.')}
];
