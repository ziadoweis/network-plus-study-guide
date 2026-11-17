import {H,H3,P,UL,OL,TB,EX,PRE,KEY,TRAPS} from './h.js';
import * as F from './figs4.js';

export const LESSONS=[
/* ------------------------------------------------------------------ 17 */
{n:17,title:'Integrating Network Devices',obj:'4.1, 2.2, 1.4',book:'5, 21',
intro:'The non-computer devices that now live on networks (IoT gadgets, industrial controllers, IP phones, building systems) and how to connect them without putting the rest of the network at risk.',
html:
H('Why special devices need special handling')+
P('Modern networks carry far more than PCs and servers. Cameras, thermostats, door controllers, phones, factory machines and building systems all talk IP. Many of them are hard to patch, ship with default passwords, or run software nobody has updated in years. One compromised camera on the same network as the finance server is a doorway for an attacker. The answer is to <b>identify</b> these devices, <b>isolate</b> them, and <b>control</b> what they can reach.')+
H('Internet of Things (IoT)')+
P('<b>IoT</b> devices include smart speakers, IP cameras, thermostats, smart TVs, sensors and smart lighting. Typical weaknesses are default credentials, rare firmware updates and chatty cloud connections.')+
UL('Change the <b>default username and password</b> before connecting the device.','Put IoT devices on their <b>own VLAN or SSID</b>, with ACLs or firewall rules that allow only the traffic they need, such as the camera talking to the video recorder.','Keep firmware updated and disable features you don\'t use, such as UPnP and remote cloud access.')+
H('Industrial control systems: ICS, SCADA and OT')+
P('<b>Operational technology (OT)</b> runs physical processes: factories, power grids, water treatment, pipelines. <b>ICS</b> (industrial control systems) and <b>SCADA</b> (supervisory control and data acquisition) use controllers such as <b>PLCs</b> (programmable logic controllers) and operator screens called <b>HMIs</b>.',
 'In OT, <b>availability comes first</b>: a stopped production line or power outage is the worst outcome, so systems often run for decades without patches or reboots. That makes them fragile and vulnerable. Protect them with <b>strong segmentation</b>, tightly controlled access through a jump box, monitoring, and, for the most critical systems, an <b>air gap</b> (no network connection to the business network or Internet at all).')+
H('Voice over IP')+
P('<b>VoIP</b> carries phone calls over the IP network. Two protocols do the work: <b>SIP</b> (Session Initiation Protocol, ports 5060 and 5061 for TLS) sets up, manages and ends calls, while <b>RTP</b> (Real-time Transport Protocol, on dynamic UDP ports) carries the actual voice. Older systems use H.323 (port 1720) or MGCP. A <b>VoIP gateway</b> connects the IP phone system to the traditional phone network.',
 'Voice is unusually sensitive to network quality:')+
TB(['Problem','What the caller hears','Fix'],[['Latency (delay)','Talking over each other, awkward pauses','Keep the path short; prioritise voice'],['Jitter (variable delay)','Choppy, robotic audio','QoS and jitter buffers'],['Packet loss','Gaps and dropouts','QoS, fix congestion and errors']])+
P('So voice networks use a <b>voice VLAN</b> (Lesson 11), which keeps phones separate and lets one wall port serve a phone and a PC, plus <b>QoS</b>: voice packets are marked (<b>DSCP</b> at Layer 3, <b>802.1p CoS</b> at Layer 2) and switches and routers send marked packets first. PoE powers the phones.')+
H('Building and physical systems')+
P('HVAC controls, lighting, physical access control (badge readers, door locks), cameras and environmental sensors are all network devices now. They belong on their own segments, managed by facilities staff with limited access to the rest of the network. Video conferencing and streaming media systems also need QoS and enough bandwidth.')+
H('Putting it together: segmentation')+F.segment+
EX('Worked example: segmenting a small office',TB(['Segment','VLAN','Can reach'],[['Staff PCs','10','Servers, Internet'],['Servers','30','Answer staff; updates from the Internet'],['Voice','40','Call server only, with QoS priority'],['IoT / cameras','50','Video recorder only'],['Guest Wi-Fi','60','Internet only, with client isolation']]),P('Rules between the VLANs are enforced by ACLs on the router or by a firewall. Any public-facing server goes in a <b>screened subnet</b>.'))+
P('The same ideas apply in a <b>SOHO</b> (small office/home office) design: put guests and IoT on separate networks, never leave default passwords, and expose services only through a screened subnet or carefully chosen port forwarding.')+
KEY('Change default credentials and isolate IoT on its own VLAN or SSID.','ICS/SCADA/OT puts availability first, is often legacy and unpatched, and needs strong segmentation or an air gap.','VoIP: SIP 5060/5061 for signaling, RTP for media.','Voice suffers from latency, jitter and loss: use a voice VLAN and QoS (DSCP, 802.1p).','Enforce segmentation with VLANs plus ACLs or firewalls.')+
TRAPS('In ICS/SCADA, availability outranks confidentiality.','The best first step for a new IoT device: change its default credentials and isolate it.')},

/* ------------------------------------------------------------------ 18 */
{n:18,title:'Network Operations',obj:'3.1, 3.3',book:'15, 16',
intro:'How networks are run day to day: documentation, the agreements you sign, managing equipment through its life, controlling changes, the policies users follow, and how to respond when something goes wrong.',
html:
H('Documentation')+
P('Good documentation is what lets someone fix the network at 3 a.m. without guessing. The main types:')+
TB(['Document','What it shows'],[
 ['Physical network diagram','Where devices and cables actually are: rooms, racks, ports, cable runs'],
 ['Logical network diagram','How the network works: subnets, VLANs, routing, traffic flows. Diagrams can also be split by layer (L1, L2, L3).'],
 ['Rack diagram','What is mounted in each U of each rack'],
 ['Cable map / wiring diagram','Which patch panel port connects to which wall jack and switch port'],
 ['Floor plans, site survey reports','Building layout, Wi-Fi coverage heat maps'],
 ['Asset inventory','Every device, with serial numbers, software, licences, warranty and asset tags'],
 ['IPAM','IP address management: which subnets and addresses are allocated, often linked to DHCP and DNS'],
 ['Baselines','Approved standard configurations, and normal performance levels for comparison']])+
H('Agreements')+
TB(['Agreement','Purpose'],[
 ['SLA (service-level agreement)','Measurable commitments from a provider: uptime, response and repair times, with penalties if missed'],
 ['MOU (memorandum of understanding)','An informal statement of shared intent; usually not legally binding'],
 ['NDA (non-disclosure agreement)','Keeps shared information confidential'],
 ['SOW (statement of work)','Defines a specific project: tasks, deliverables, timeline'],
 ['MSA (master service agreement)','The overall terms for an ongoing relationship; individual SOWs sit under it']])+
P('SLA uptime figures are easier to judge as downtime per year:')+
TB(['Availability','Downtime per year'],[['99.9% ("three nines")','≈ 8.76 hours'],['99.99%','≈ 52.6 minutes'],['99.999% ("five nines")','≈ 5.26 minutes']])+
H('Life-cycle management')+
UL('<b>EOL (end of life)</b>: the vendor no longer sells the product. <b>EOS (end of support)</b>: no more patches, fixes or support. EOS is the security concern, because new vulnerabilities will never be fixed.',
 '<b>Software management</b>: keep firmware, operating systems and drivers patched, and <b>test updates before deploying</b> them widely.',
 '<b>Decommissioning</b>: wipe or destroy storage (wiping, degaussing or shredding), update the inventory, and follow the disposal policy.')+
H('Change management')+
P('Unplanned changes cause many outages. <b>Change management</b> makes every change deliberate and reversible:')+
OL('Submit a <b>change request</b> describing what, why and when.','Assess the <b>impact and risk</b>.','Get <b>approval</b>, often from a change advisory board (CAB).','Schedule it in a <b>maintenance window</b> when few users are affected.','Prepare a <b>backout (rollback) plan</b> in case it goes wrong.','Implement, then <b>verify</b> it worked.','<b>Document</b> the result.')+
P('Even urgent emergency changes are documented and reviewed afterwards. <b>Configuration management</b> goes alongside: every device has a <b>running</b> configuration (in use now) and a saved <b>startup</b> or backup configuration. An approved <b>golden (baseline) configuration</b> lets tools detect <b>configuration drift</b>, where a device no longer matches the standard.')+
H('Policies')+
UL('<b>AUP (acceptable use policy)</b>: what users may and may not do with company systems.',
 '<b>Password policy</b>: length, complexity, reuse and MFA requirements.',
 '<b>BYOD (bring your own device)</b>: rules for personal phones and laptops. The challenge is separating personal and company data, usually with <b>MDM</b> (mobile device management). Alternatives: CYOD (choose from approved devices), COPE (corporate-owned, personally enabled), COBO (corporate-owned, business only).',
 '<b>Remote access policy</b>: who may connect from outside, and how (VPN, MFA).',
 '<b>Onboarding and offboarding</b>: give new staff the access they need, and <b>remove all access promptly</b> when someone leaves.',
 'Security, privacy and <b>DLP (data loss prevention)</b> policies.')+
H('Incident response')+F.ir+
P('When a security incident happens, a rehearsed plan prevents panic. The phases:')+
OL('<b>Preparation</b>: plans, tools, training, contacts.','<b>Detection and identification</b>: spotting and confirming the incident.','<b>Containment</b>: stopping it from spreading, e.g. disconnecting infected machines.','<b>Eradication</b>: removing the cause (malware, compromised accounts).','<b>Recovery</b>: restoring systems and monitoring them.','<b>Lessons learned</b>: reviewing what happened and improving.')+
P('The first responder <b>secures the scene</b> and preserves evidence, keeping a <b>chain of custody</b> record of who handled each item and when, so it can be used later. Disaster recovery (Lesson 16) covers restoring systems after major outages.')+
KEY('Physical diagrams show where things are; logical diagrams show how the network works.','SLA = measurable commitments. 99.999% ≈ 5.26 minutes down per year.','EOL = no longer sold; EOS = no more patches.','Change management: request → impact → approval → maintenance window → backout plan → implement → verify → document.','Golden configs detect drift.','AUP, BYOD (MDM), onboarding/offboarding.','Incident response: preparation → detection → containment → eradication → recovery → lessons learned.')+
TRAPS('Urgency never skips change management.','Containment comes before eradication.','EOS, not EOL, is when security patches stop.')},

/* ------------------------------------------------------------------ 19 */
{n:19,title:'Protecting Networks',obj:'4.2, 4.3',book:'21',
intro:'The attacks the exam expects you to recognise, how each works, and the specific defense that stops it, from switch features and ACLs to network access control and user training.',
html:
H('Denial of service')+
P('A <b>denial-of-service (DoS)</b> attack attacks <b>availability</b> by overwhelming a service until it can\'t respond. A <b>DDoS</b> (distributed DoS) uses a <b>botnet</b> of thousands of compromised devices directed from a command-and-control (<b>C2</b>) server. Common forms are floods (ICMP, UDP, SYN floods, which leave many half-open TCP connections) and <b>amplification/reflection</b>: the attacker sends small queries to open DNS or NTP servers with the victim\'s address forged as the source, and the servers send much larger replies to the victim. Defenses include upstream scrubbing services from the ISP or a CDN, and rate limiting.')+
H('Attacks on switches and local networks')+
H3('VLAN hopping')+F.dbltag+
P('VLAN hopping reaches a VLAN the attacker isn\'t assigned to. In <b>switch spoofing</b>, the attacker\'s device pretends to be a switch and negotiates a trunk using DTP, gaining access to every VLAN. In <b>double tagging</b>, the attacker sends a frame with two 802.1Q tags: the outer tag matches the trunk\'s native VLAN and is stripped by the first switch, and the inner tag then carries the frame into the target VLAN. It only works one way.',
 'Defenses: set access ports to <code>switchport mode access</code> and disable DTP (<code>switchport nonegotiate</code>), change the native VLAN to an <b>unused</b> VLAN, and never put devices in the native VLAN.')+
H3('MAC flooding')+
P('The attacker sends thousands of frames with fake source MACs, filling the switch\'s MAC (CAM) table. With no room left, the switch <b>floods</b> frames out of every port like a hub, so the attacker can capture other people\'s traffic. Defense: <b>port security</b>, which limits how many MAC addresses a port may learn.')+
H3('ARP poisoning')+F.arp+
P('ARP has no authentication, so an attacker can send fake ARP replies saying "the gateway\'s IP is at my MAC". Victims then send their traffic to the attacker, who reads it and passes it on: an <b>on-path attack</b>. Defense: <b>Dynamic ARP Inspection (DAI)</b>, which checks ARP messages against the DHCP snooping table of known IP-to-MAC bindings and drops forgeries.')+
H3('Rogue DHCP and rogue devices')+
UL('A <b>rogue DHCP server</b> hands out a gateway or DNS server controlled by the attacker, putting them on-path. Defense: <b>DHCP snooping</b>, which marks only the uplink ports facing real DHCP servers as trusted and drops DHCP server messages (Offer, Ack) arriving on any other port.',
 'A <b>rogue switch</b> plugged into a wall port can cause loops or try to become the STP root. Defense: <b>BPDU Guard</b> on access ports.',
 'A <b>rogue IPv6 router</b> sends fake Router Advertisements. Defense: <b>RA Guard</b>.',
 'A <b>rogue access point</b> is an unauthorized AP that bypasses security. An <b>evil twin</b> copies your real SSID to lure users and capture their credentials, often combined with a <b>deauthentication attack</b> that kicks clients off the real AP so they reconnect to the twin. Defenses: wireless IDS/IPS that detect rogue APs, and 802.1X so credentials can\'t simply be replayed.')+
H3('DNS poisoning and other on-path attacks')+
P('<b>DNS poisoning</b> corrupts a resolver\'s cache or forges answers to send users to fake sites; <b>DNSSEC</b> defends against it. The general term <b>on-path attack</b> (formerly man-in-the-middle) covers anything that intercepts traffic between two parties: ARP poisoning, rogue APs, session hijacking, <b>replay</b> attacks that resend captured traffic, and SSL stripping or downgrade attacks that force weaker encryption. Other spoofing attacks forge IP or MAC addresses.')+
H('Social engineering, malware and passwords')+
TB(['Attack','What it is'],[
 ['Phishing','Fake emails that trick users into clicking or revealing credentials'],['Spear phishing','Phishing aimed at a specific person or group'],['Whaling','Spear phishing aimed at executives'],['Vishing / smishing','Phishing by voice call / by SMS'],
 ['Tailgating','Following someone through a secure door <b>without</b> their knowledge or consent'],['Piggybacking','Following someone through <b>with</b> their consent, e.g. they hold the door'],['Shoulder surfing','Watching someone type a password or PIN'],['Dumpster diving','Searching rubbish for useful information'],['Pretexting / impersonation','Inventing a story or pretending to be someone (IT support, a courier)']])+
TB(['Malware','Behaviour'],[['Virus','Attaches to files; spreads when a user runs them'],['Worm','Spreads by itself across the network'],['Trojan','Looks legitimate but hides malicious code; a RAT gives remote control'],['Ransomware','Encrypts data and demands payment'],['Rootkit / backdoor','Hidden privileged access'],['Logic bomb','Triggers on a date or condition'],['Spyware / adware','Watches users / shows unwanted ads']])+
P('Password attacks include <b>brute force</b> (trying every combination), <b>dictionary</b> attacks (trying likely words), credential stuffing (reusing leaked passwords) and trying vendors\' default credentials.')+
H('Defenses')+
H3('Hardening devices')+
UL('Change default usernames and passwords.','Disable unused switch ports and put them in an unused "parking" VLAN; disable unneeded services.','Keep firmware and operating systems patched.','Use secure management protocols: SSH not Telnet, HTTPS not HTTP, SNMPv3 not v1/v2c.','Add login banners and session timeouts.')+
H3('Network access control and 802.1X')+F.dot1x+
P('<b>NAC</b> decides whether a device may join the network. <b>Posture assessment</b> checks it first: patch level, antivirus, compliance. Failing devices go to a remediation VLAN until fixed.',
 '<b>802.1X</b> is port-based authentication with three roles: the <b>supplicant</b> (the client device), the <b>authenticator</b> (the switch or AP, which relays credentials and opens the port only on success), and the <b>authentication server</b> (usually RADIUS). It uses <b>EAP</b> methods: <b>EAP-TLS</b> uses certificates on both the client and the server and is the strongest; <b>PEAP</b> and <b>EAP-TTLS</b> use only a server certificate plus an encrypted tunnel for a password.')+
H3('Port security')+
P('<b>Port security</b> limits which and how many MAC addresses a switch port accepts. With <b>sticky</b> learning, the switch remembers the first MAC it sees. If another device appears, the <b>violation action</b> applies: <b>shutdown</b> (the port goes err-disabled, the default), <b>restrict</b> (drop and log) or <b>protect</b> (drop silently). Plain <b>MAC filtering</b> is weak because MAC addresses are easy to spoof.')+
H3('ACLs and firewall rules')+
P('An access control list is processed <b>top-down</b>, and <b>the first rule that matches wins</b>; later rules are never checked. Every ACL ends with an invisible <b>implicit deny</b>, so anything not explicitly permitted is dropped. Put specific rules before general ones. Rules can filter on source and destination IP, port and protocol (Layers 3 and 4), or MAC addresses (Layer 2).',
 'On Cisco routers there are two kinds of IP ACL. A <b>standard ACL</b> (numbered 1–99) matches only the <b>source</b> address, so place it close to the destination. An <b>extended ACL</b> (100–199, or named) matches source, destination, protocol and port, so place it close to the source to drop unwanted traffic early. An ACL does nothing until it is applied to an interface in a direction: <code>ip access-group NAME in</code> or <code>out</code>.')+
EX('Worked example: a shadowed rule',PRE(`1 permit ip 10.10.0.0/16 any
2 deny   tcp 10.10.50.0/24 host 10.10.5.10 eq 1433
(implicit deny any)`),P('The admin wanted to block the guest subnet (10.10.50.0/24) from the SQL server, but guest traffic already matches rule 1, so rule 2 is never reached: it is <b>shadowed</b>. Fix: move the specific deny above the broad permit.'))+
H3('Zones and other controls')+F.screened+
UL('Network zones: <b>trusted</b> (inside) and <b>untrusted</b> (Internet). Public-facing servers such as web, mail and DNS go in a <b>screened subnet</b> (formerly DMZ) between the outer and inner firewalls, so a compromised public server can\'t reach the internal LAN.',
 '<b>URL filtering</b> and <b>content filtering</b> block categories of websites.',
 'Other switch and router protections: storm control, control plane policing (protecting the router\'s CPU), private VLANs and client isolation.',
 'Wireless: WPA3 or WPA2-Enterprise, strong passphrases, WPS disabled, guest isolation, wireless IDS for rogue APs.',
 '<b>User education</b> is the main defense against social engineering.',
 '<b>Defense in depth</b>: layer controls so that if one fails, another still protects, combined with zero trust and least privilege.')+
TB(['Attack','Defense'],[['ARP poisoning','Dynamic ARP Inspection'],['Rogue DHCP server','DHCP snooping'],['MAC flooding','Port security'],['Rogue switch / STP manipulation','BPDU Guard (and Root Guard)'],['Rogue IPv6 router advertisements','RA Guard'],['VLAN hopping','Static access ports, DTP off, unused native VLAN'],['DNS poisoning','DNSSEC'],['Evil twin / rogue AP','Wireless IDS/IPS, 802.1X'],['Tailgating','Access control vestibule, training'],['Phishing','User training, email filtering']])+
KEY('DoS/DDoS attack availability; amplification uses open DNS/NTP servers.','Switch spoofing (DTP) and double tagging (native VLAN) are the two forms of VLAN hopping.','Learn the attack → defense table above.','802.1X: supplicant, authenticator, authentication server (RADIUS). EAP-TLS is strongest.','Port security violations err-disable the port by default.','ACLs: top-down, first match wins, implicit deny at the end.','Public servers go in a screened subnet.','Tailgating = without consent; piggybacking = with consent.')+
TRAPS('Use CompTIA\'s terms: on-path attack, screened subnet, access control vestibule.','A broad permit above a specific deny makes the deny unreachable.','Double tagging only works one way, and only through the native VLAN.')},

/* ------------------------------------------------------------------ 20 */
{n:20,title:'Network Monitoring',obj:'3.2',book:'14',
intro:'How you watch a network\'s health: SNMP for device data, flow records and packet captures for traffic, logs and SIEMs for events, and the metrics and counters that tell you something is wrong.',
html:
H('Why monitor')+
P('You can\'t fix what you can\'t see. Monitoring tells you a link is filling up before users complain, a switch port is throwing errors before it fails, or someone is scanning your network. It starts with a <b>baseline</b>: a record of what normal looks like, such as typical bandwidth at 10 a.m. or normal CPU load. Without a baseline you can\'t tell whether 60% utilization is a problem or just Monday morning. Alerts fire when metrics move away from the baseline.')+
H('SNMP')+F.snmp+
P('<b>SNMP</b> (Simple Network Management Protocol) is how monitoring systems collect data from routers, switches, servers and printers.')+
UL('A central <b>manager</b>, the NMS (network management system), <b>polls</b> <b>agents</b> running on each device, asking them for values over <b>UDP 161</b>.',
 'Agents can also send unsolicited alerts called <b>traps</b> to the manager on <b>UDP 162</b>, such as "interface down". An <b>inform</b> is a trap the manager acknowledges.',
 'The data a device can report is described in its <b>MIB</b> (management information base). Each value has an <b>OID</b> (object identifier), a dotted number such as 1.3.6.1.2.1.1.5 for the device name.',
 'Operations: Get, GetNext, GetBulk (read values) and Set (change a value).')+
TB(['Version','Security'],[['SNMPv1 / v2c','A <b>community string</b> works like a shared password and is sent in <b>clear text</b>; read-only or read-write'],['SNMPv3','Adds user accounts, <b>authentication, integrity and encryption</b>: the secure choice']])+
H('Watching traffic')+F.tap+
TB(['Method','What you get','Use it for'],[
 ['Flow data (NetFlow, IPFIX, sFlow)','A summary of each conversation: who talked to whom, on which ports, how much data, when. <b>No payload.</b>','Traffic analysis, finding top talkers, spotting unusual flows'],
 ['Packet capture (Wireshark, tcpdump)','<b>Full packets</b>, including the contents','Deep protocol troubleshooting'],
 ['Port mirroring (SPAN)','A copy of a port\'s traffic, made by the switch','Feeding a capture tool or IDS; may drop frames under load or skip errored frames'],
 ['Network tap','A hardware device inline on the cable that copies <b>everything</b>, including errors','Complete, reliable captures']])+
H('Logs')+
P('Devices record events in logs. <b>Syslog</b> sends them to a central collector on <b>UDP 514</b>, so you can search them all in one place. Each message has a <b>severity level</b>; a lower number is more severe:')+
TB(['Level','Severity','Example'],[['0','Emergency','System unusable'],['1','Alert','Act immediately'],['2','Critical','Hardware failure'],['3','Error','Interface error'],['4','Warning','Threshold nearly reached'],['5','Notice','Interface changed state (normal but notable)'],['6','Informational','Routine messages'],['7','Debug','Detailed troubleshooting output']])+
P('Mnemonic: <i>Every Awesome Cisco Engineer Will Need Ice cream Daily</i>. On Cisco devices a message like <code>%LINK-5-CHANGED</code> means facility LINK, severity 5 (Notice).',
 'A <b>SIEM</b> (security information and event management) system collects logs from many sources, <b>correlates</b> them to find related events (a failed VPN login followed by a firewall alert from the same address), raises alerts, and keeps logs for investigations. Correlation only works if every device\'s clock is synchronized with <b>NTP</b>. Logs worth reviewing include traffic logs, audit logs (who did what) and system logs. Monitoring platforms also integrate with other tools through APIs.')+
H('Metrics and interface counters')+
UL('<b>Device metrics</b>: CPU, memory, temperature, uptime, interface status.',
 '<b>Network metrics</b>: bandwidth utilization, throughput, <b>latency</b> (delay), <b>jitter</b> (variation in delay), <b>packet loss</b>, error rates.',
 '<b>Environmental sensors</b>: temperature, humidity, power, water leaks, door access.')+
TB(['Interface counter','What it means','Usual cause'],[
 ['CRC errors','Frames arrived corrupted (bad checksum)','Bad cable, EMI, duplex mismatch'],
 ['Runts','Frames smaller than 64 bytes','Collisions, duplex mismatch'],
 ['Giants','Frames larger than 1518 bytes','Jumbo frames arriving on a port not configured for them'],
 ['Discards / drops','Frames thrown away','Congestion, full buffers'],
 ['Late collisions','Collisions after the first 64 bytes','Duplex mismatch, or cable that\'s too long']])+
H('Monitoring solutions')+
P('Monitoring platforms combine several functions: <b>network discovery</b> (finding devices, ad hoc or on a schedule), <b>availability monitoring</b> (is it up? using ping and SNMP polling), <b>performance monitoring</b> (trends and thresholds), <b>traffic analysis</b> (flows), and <b>configuration monitoring</b> (alerting when a config changes).')+
KEY('A baseline defines normal; alerts fire on deviations.','SNMP: manager polls agents on UDP 161; traps go to UDP 162. MIB describes values; each has an OID. Only v3 encrypts.','Flow data = metadata; packet capture = full contents. A tap copies everything; SPAN can drop frames.','Syslog UDP 514; severities 0 (Emergency) to 7 (Debug).','A SIEM correlates logs and needs NTP.','CRC = corruption; runts < 64 bytes; giants > 1518 bytes.')+
TRAPS('Traps go to 162; polling uses 161.','Severity 0 is the most severe, not 7.','NetFlow doesn\'t capture packet contents.')},

/* ------------------------------------------------------------------ 21 */
{n:21,title:'Network Troubleshooting',obj:'5.1–5.5',book:'18, 19',
intro:'A step-by-step method for solving network problems, how to read the symptoms of common faults, and the command-line and hardware tools you\'ll use. This is the heaviest-weighted domain on the exam.',
html:
H('The troubleshooting methodology')+F.method+
P('CompTIA expects you to follow a fixed seven-step method. Questions often describe an action and ask which step it is, or ask what you should do <b>first</b> or <b>next</b>.')+
TB(['Step','What you do'],[
 ['1. Identify the problem','Gather information; question users; identify the symptoms; <b>determine if anything has changed</b>; duplicate the problem if you can; approach multiple problems one at a time'],
 ['2. Establish a theory of probable cause','Question the obvious; work through the OSI model <b>top-down or bottom-up</b>, or <b>divide and conquer</b> (start in the middle)'],
 ['3. Test the theory','If confirmed, plan the next steps. If not, <b>establish a new theory or escalate</b>'],
 ['4. Establish a plan of action','Decide how to fix it and identify the potential effects (who will be affected, when)'],
 ['5. Implement the solution or escalate','Make the fix, or pass it to the right team'],
 ['6. Verify full system functionality','Confirm everything works, not just the symptom; <b>implement preventive measures</b> if applicable'],
 ['7. Document findings, actions, outcomes and lessons learned','Record it in the ticket so the next person benefits']])+
EX('Worked example',OL('A user says "the Internet is down". You ask: since when? Anyone else affected? Anything changed? Their desk was moved yesterday. (Step 1)','Theory: a physical problem at the new desk. (Step 2)','You check the link light: it\'s off. Swapping the patch cable brings the link up. Theory confirmed. (Step 3)','Plan: replace the faulty cable and label it. (Step 4)','Replace it. (Step 5)','The user can browse, print and reach the file share. (Step 6)','Write it up in the ticket. (Step 7)'))+
P('Practical habits: check the <b>link light</b> first; work out the scope (one user or many? one application or all?); swap to a known-good cable or port. If the problem moves with the cable, it\'s the cable. And check the internal network before blaming the ISP.')+
H3('The four-step ping test')+F.ping+
OL('<code>ping 127.0.0.1</code>: tests your own TCP/IP software stack.','Ping <b>your own IP address</b>: tests your NIC and its configuration.','Ping your <b>default gateway</b>: tests the local network.','Ping a <b>remote host</b>: tests routing beyond your network.')+
P('Then ping by <b>name</b> (e.g. <code>ping www.example.com</code>) to test DNS. Wherever the chain breaks is where to look.')+
H('Reading the symptoms')+
TB(['Symptom','Likely cause','How to confirm'],[
 ['Address starts 169.254','DHCP unreachable or scope exhausted','ipconfig /all; check the DHCP server, scope, relay'],
 ['Local hosts work, remote ones don\'t','Wrong or missing default gateway','ipconfig; route print'],
 ['Works by IP, fails by name','DNS server wrong or down','nslookup'],
 ['Some local hosts unreachable','Wrong subnet mask','Compare the mask with a working PC'],
 ['"Address conflict" message, intermittent drops','Duplicate IP','arp -a; check DHCP for static IPs in the scope'],
 ['Wrong subnet after a desk move','Switch port in the wrong VLAN','show vlan brief'],
 ['Unexpected gateway or DNS, traffic intercepted','Rogue DHCP server','ipconfig /all shows an unknown DHCP server'],
 ['Whole network slow, high switch CPU, broadcast storm','Switching loop (STP problem)','Look for a new cable between switches'],
 ['Slow, late collisions, CRC errors','Duplex mismatch','show interface on both ends'],
 ['New fiber link, no light at either end','Transmit and receive swapped','Swap the strands'],
 ['PoE device won\'t power or keeps rebooting','Wrong PoE standard or budget exceeded','show power inline'],
 ['Traceroute shows "TTL expired" and repeating hops','Routing loop','show ip route on each router'],
 ['Choppy VoIP','Jitter','QoS settings, link utilization']])+
H3('Switch port status')+
TB(['Status','Meaning','Fix'],[['Up / up','Working','—'],['Administratively down','Shut down in the configuration','no shutdown'],['Err-disabled','The switch shut it down automatically: port-security violation, BPDU Guard, or a flapping link','Remove the cause, then shutdown / no shutdown'],['Suspended','An LACP bundle member that doesn\'t match its partner','Match the port-channel settings']])+
H('Performance problems')+
UL('<b>Bandwidth</b> is a link\'s capacity; <b>throughput</b> is what you actually achieve. The slowest link in the path is the <b>bottleneck</b>: ten 10 Gbps servers behind one 1 Gbps uplink can never get more than 1 Gbps between them.',
 '<b>Latency</b> is delay, <b>jitter</b> is variation in delay, and <b>packet loss</b> is data that never arrives. Congestion causes all three; QoS protects time-sensitive traffic.',
 'Wireless: interference and channel overlap, signal absorption and reflection, insufficient coverage, deauthentication, roaming misconfiguration. Check RSSI and SNR with a Wi-Fi analyzer (Lesson 14).',
 'A wrong MTU causes fragmentation or silently dropped large packets.')+
H('Command-line tools')+
TB(['Command','What it tells you'],[
 ['ping','Whether a host replies (ICMP echo). Windows: -t continuous, -n count, -l size. Linux: -c count.'],
 ['tracert (Windows) / traceroute (Linux)','Every router hop on the path and where traffic stops. Windows uses ICMP, Linux UDP. pathping adds loss statistics per hop.'],
 ['ipconfig (Windows)','IP settings. /all adds the MAC, DHCP server, DNS servers and lease; /release and /renew get a new lease; /flushdns clears the DNS cache.'],
 ['ip (Linux; replaces ifconfig)','ip addr (addresses), ip route (routing table), ip link (interfaces)'],
 ['arp -a','The ARP cache of IP-to-MAC mappings; spot duplicates or spoofing'],
 ['netstat','Connections and listening ports: -a all, -n numeric, -b owning program (Windows), -r routing table'],
 ['route print / ip route','The routing table'],
 ['nslookup / dig','DNS queries; dig gives more detail'],
 ['nmap','Scans for live hosts, open ports, service versions and operating systems. Use it only with permission.'],
 ['tcpdump / Wireshark','Capture packets'],
 ['iperf / speed test','Measure throughput'],
 ['LLDP / CDP neighbors','Shows which switch and port a device is connected to (CDP is Cisco-only; LLDP is the open standard)']])+
P('Useful Cisco commands: <code>show interface</code> (status, errors, duplex), <code>show ip route</code>, <code>show vlan brief</code>, <code>show mac address-table</code> (which MAC is on which port), <code>show arp</code>, <code>show running-config</code>, <code>show power inline</code>, <code>show spanning-tree</code>, <code>show cdp neighbors</code> / <code>show lldp neighbors</code>.')+
H('Hardware tools')+
P('For cabling faults use a cable tester or certifier, a TDR (copper) or OTDR (fiber) for fault distance, a toner and probe to trace cables, an optical light meter and visual fault locator for fiber, a multimeter for power, a loopback plug to test ports, and a Wi-Fi or spectrum analyzer for wireless. Lesson 5 covers each.')+
KEY('The 7 steps: identify → theory → test → plan → implement/escalate → verify → document.','"What changed?" belongs to step 1. A failed theory goes back to step 2, or you escalate.','Verify full functionality before documenting.','Four-step ping: loopback → own IP → gateway → remote, then a name.','169.254 = DHCP; local only = gateway; IP but not name = DNS; storm = loop; err-disabled = security feature.','tracert shows where traffic stops; netstat shows ports; arp -a shows IP-to-MAC; nslookup tests DNS.')+
TRAPS('For "FIRST" questions, follow the method: identify the problem before acting.','Don\'t document before verifying.','Bandwidth is capacity; throughput is what you actually get.')}
];
