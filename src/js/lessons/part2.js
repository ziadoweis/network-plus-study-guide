import {H,H3,P,UL,OL,TB,EX,PRE,KEY,TRAPS} from './h.js';
import * as F from './figs2.js';

export const LESSONS=[
/* ------------------------------------------------------------------ 6 */
{n:6,title:'TCP/IP Basics',obj:'1.7, 1.4',book:'6, 7, 8',
intro:'IPv4 addresses from the bits up: binary, address classes, private and special ranges, subnet masks, how a host decides where to send a packet, and how to subnet quickly and accurately.',
html:
H('What an IPv4 address is')+
P('An IPv4 address is <b>32 bits</b>, written as four decimal numbers called <b>octets</b>, each 0–255: <code>192.168.10.77</code>. Every address has two parts: a <b>network</b> portion (which network you\'re on) and a <b>host</b> portion (which device on that network). The <b>subnet mask</b> says where one ends and the other begins.')+
H('Binary in two minutes')+
P('Each octet is 8 bits, and each bit position has a value: <b>128 64 32 16 8 4 2 1</b>. Add the values of the bits that are 1.')+
EX('Worked examples',UL('<code>11000000</code> = 128 + 64 = <b>192</b>','<code>11101111</code> = 128 + 64 + 32 + 8 + 4 + 2 + 1 = <b>239</b>','<b>224</b> = 128 + 64 + 32 = <code>11100000</code>','<b>10</b> = 8 + 2 = <code>00001010</code>'))+
P('Subnet mask octets are always a run of 1s followed by 0s, so only nine values are possible: 0, 128, 192, 224, 240, 248, 252, 254, 255. Memorise them.')+
H('The subnet mask and CIDR')+F.ipbits+
P('In a subnet mask, <b>1 bits mark the network portion</b> and 0 bits mark the host portion. <code>255.255.255.0</code> is 24 ones followed by 8 zeros, so the first three octets are network and the last is host. <b>CIDR notation</b> writes the count of 1 bits after a slash: <code>192.168.10.0/24</code>.',
 'In any subnet, two addresses are reserved. The <b>network address</b> (all host bits 0) identifies the subnet itself, and the <b>broadcast address</b> (all host bits 1) reaches every host on it. Neither can be given to a device. So a subnet with <i>h</i> host bits has <b>2<sup>h</sup> − 2 usable hosts</b>.')+
H('Address classes and special ranges')+
P('Before CIDR, the first octet decided the default mask. Classes still appear on the exam:')+
TB(['Class','First octet','Default mask','Use'],[['A','1–126','/8 (255.0.0.0)','Very large networks'],['B','128–191','/16 (255.255.0.0)','Medium networks'],['C','192–223','/24 (255.255.255.0)','Small networks'],['D','224–239','—','Multicast'],['E','240–255','—','Experimental']])+
P('127 is missing from Class A because <b>127.0.0.0/8 is loopback</b>: <code>127.0.0.1</code> always means "this computer", and pinging it tests your own TCP/IP stack.')+
TB(['Range','Meaning'],[
 ['10.0.0.0/8','Private (RFC 1918)'],['172.16.0.0/12 = 172.16.0.0 – 172.31.255.255','Private'],['192.168.0.0/16','Private'],
 ['169.254.0.0/16','<b>APIPA</b> (link-local): a device gives itself one of these when it can\'t reach a DHCP server'],['127.0.0.0/8','Loopback']])+
P('<b>Private</b> addresses can be used freely inside any organization but are <b>never routed on the Internet</b>, so a router must translate them with NAT (Lesson 7) to reach the Internet. Every other address is <b>public</b> and globally unique. When you see a <b>169.254.x.x</b> address on a PC, think "DHCP failed" straight away.')+
H('How a host decides where to send a packet')+F.local+
P('Before sending, a host compares the destination IP with its own IP using its subnet mask.')+
OL('If the destination is <b>on the same subnet</b>, the host uses <b>ARP</b> (Address Resolution Protocol) to broadcast "who has 192.168.10.20?", gets the MAC address back, and sends the frame directly.',
 'If the destination is <b>on a different subnet</b>, the host sends the frame to its <b>default gateway</b> (the local router), ARPing for the gateway\'s MAC. The router forwards it on.')+
P('This is why a wrong default gateway breaks only remote traffic: local hosts still work. It\'s also why a wrong subnet mask causes strange failures: the host may think a remote host is local and ARP for it, getting no answer.')+
H('Subnetting with the block-size method')+
P('Subnetting splits a network into smaller ones. Given an address and prefix, you\'ll need to find the subnet, the broadcast, and the usable host range. The fastest method:')+
OL('Find the <b>interesting octet</b>: the octet where the mask is neither 255 nor 0.',
 'Work out the <b>block size</b> = 256 − the mask value in that octet.',
 'Subnets start at multiples of the block size in that octet: 0, block, 2×block…',
 'The subnet containing your address starts at the multiple at or below its value. The <b>broadcast</b> is one less than the next subnet. Usable hosts are everything in between.')+
EX('Worked example 1: 192.168.10.77/27',
 P('/27 = 255.255.255.<b>224</b>. The interesting octet is the 4th. Block = 256 − 224 = <b>32</b>. Subnets: .0, .32, .64, .96… 77 falls between 64 and 95.'),
 UL('Subnet (network) address: <b>192.168.10.64</b>','First usable host: 192.168.10.65','Last usable host: 192.168.10.94','Broadcast: <b>192.168.10.95</b>','Usable hosts: 2<sup>5</sup> − 2 = <b>30</b>'))+
EX('Worked example 2: 172.20.77.9/20',
 P('/20 = 255.255.<b>240</b>.0. The interesting octet is the 3rd. Block = 256 − 240 = <b>16</b>. Subnets in the 3rd octet: 0, 16, 32, 48, 64, 80… 77 falls between 64 and 79.'),
 UL('Subnet: <b>172.20.64.0</b>','Broadcast: <b>172.20.79.255</b> (79 in the 3rd octet, 255 in the 4th)','Hosts: 172.20.64.1 – 172.20.79.254','Usable hosts: 2<sup>12</sup> − 2 = 4094'))+
TB(['Prefix','Mask','Block size','Usable hosts'],[['/24','255.255.255.0','256','254'],['/25','255.255.255.128','128','126'],['/26','255.255.255.192','64','62'],['/27','255.255.255.224','32','30'],['/28','255.255.255.240','16','14'],['/29','255.255.255.248','8','6'],['/30','255.255.255.252','4','2'],['/31','255.255.255.254','2','2 (point-to-point links only)'],['/32','255.255.255.255','1','A single host route']])+
P('The same pattern repeats one octet to the left: /17 = 255.255.128.0, /18 = .192.0, /19 = .224.0, /20 = .240.0, /21 = .248.0, /22 = .252.0, /23 = .254.0.')+
H('Sizing a subnet for a number of hosts')+
P('To find the smallest subnet that fits <i>N</i> hosts, add 2 (network and broadcast), then round up to the next power of two. That gives the host bits; the prefix is 32 minus the host bits.')+
EX('Worked example: 50 hosts',P('50 + 2 = 52 → next power of two is 64 = 2<sup>6</sup> → 6 host bits → <b>/26</b> (255.255.255.192), which gives 62 usable addresses. For 200 hosts: 202 → 256 = 2<sup>8</sup> → <b>/24</b>.'))+
H('VLSM: different sizes in one block')+
P('<b>VLSM (variable-length subnet masking)</b> carves one block into subnets of different sizes so you don\'t waste addresses. Allocate the <b>largest subnet first</b>, then place each next subnet straight after the previous one.')+
EX('Worked example: 10.10.0.0/22 for four departments and two links',
 TB(['Need','Prefix','Subnet'],[['200 hosts','/24','10.10.0.0/24'],['100 hosts','/25','10.10.1.0/25'],['50 hosts','/26','10.10.1.128/26'],['25 hosts','/27','10.10.1.192/27'],['WAN link (2)','/30','10.10.1.224/30'],['WAN link (2)','/30','10.10.1.228/30']]),
 P('Point-to-point links can use <b>/30</b> (2 usable) or <b>/31</b> (RFC 3021: two addresses, both usable, no network or broadcast).'))+
H('Traffic types')+
UL('<b>Unicast</b>: one sender to one receiver. Most traffic.','<b>Broadcast</b>: one to all devices on the local subnet (ARP requests, DHCP Discover). IPv4 only: <b>IPv6 has no broadcast</b> and uses multicast instead.','<b>Multicast</b>: one to a group that has joined (224.0.0.0–239.255.255.255), such as routing protocol updates or video streams.','<b>Anycast</b>: one to the <i>nearest</i> of several devices sharing an address, used by DNS root servers and CDNs.')+
P('Network engineers also read <b>hexadecimal</b>: each hex digit (0–9, A–F) is 4 bits, so a MAC address is 12 hex digits and an IPv6 address is 32. Hex A = 10, F = 15, FF = 255.')+
KEY('Private: 10/8, 172.16–31, 192.168/16. APIPA 169.254/16 = DHCP failed. Loopback 127.0.0.1.','Usable hosts = 2<sup>host bits</sup> − 2.','Block size = 256 − mask value; broadcast = next subnet − 1.','Same subnet → ARP for the host; different subnet → send to the default gateway.','Size a subnet: hosts + 2, round up to a power of two.','VLSM: biggest subnet first. /30 or /31 for point-to-point links.')+
TRAPS('Class A is 1–126, not 0–126.','172.32.x.x is public; the private block stops at 172.31.255.255.','A /27 has 32 addresses but 30 usable hosts.')},

/* ------------------------------------------------------------------ 7 */
{n:7,title:'Routing',obj:'2.1',book:'8, 9, 10',
intro:'How routers decide where packets go, the difference between static and dynamic routing, how the main routing protocols work, how a router chooses between competing routes, and how NAT and gateway redundancy work.',
html:
H('The routing table')+
P('A router forwards packets by looking up the destination IP address in its <b>routing table</b>, a list of known networks and where to send traffic for each. Routes get into the table three ways:')+
UL('<b>Connected</b> routes appear automatically for every interface that is up and has an IP address.',
 '<b>Static</b> routes are typed in by an administrator: "to reach 172.16.3.0/24, send to 10.0.12.2". They\'re predictable and use no bandwidth, but they don\'t adapt when a link fails and become unmanageable in large networks.',
 '<b>Dynamic</b> routes are learned from neighbouring routers through a routing protocol, which adapts automatically to changes.')+
P('A <b>default route</b>, <code>0.0.0.0/0</code>, matches every destination. It\'s used when nothing more specific matches, so it\'s also called the <b>gateway of last resort</b>. A small branch router typically needs only its connected routes plus a default route pointing at headquarters or the ISP.')+
H('How a router chooses a route')+
P('Often several routes could match a destination. The router decides in a strict order:')+
OL('<b>Longest prefix match</b> first: the most specific route wins. For a packet to 10.1.1.50, a route to 10.1.1.0/24 beats 10.1.0.0/16, which beats 10.0.0.0/8, which beats the default route.',
 'If two sources offer the <b>same prefix</b>, the one with the lowest <b>administrative distance (AD)</b> wins. AD is how much the router trusts the source.',
 'If the same protocol offers several paths, the lowest <b>metric</b> wins (hop count for RIP, cost for OSPF).')+
TB(['Route source','Default AD'],[['Connected','0'],['Static','1'],['eBGP','20'],['EIGRP (internal)','90'],['OSPF','110'],['IS-IS','115'],['RIP','120'],['EIGRP (external)','170'],['iBGP','200'],['Unknown / untrusted','255 (never used)']])+
EX('Worked example',P('A router learns 172.16.3.0/24 from OSPF and also has a static route for 172.16.3.0/24. Same prefix, so AD decides: static (1) beats OSPF (110), and the static route is used even if OSPF\'s path is shorter. But if the static route were for 172.16.0.0/16 and OSPF had the /24, OSPF would win for 172.16.3.x, because <b>longest prefix match always comes first</b>.'))+
H('Dynamic routing protocols')+
P('Routing protocols are grouped by where they run and how they think. An <b>IGP (interior gateway protocol)</b> runs inside one organization\'s network, an <b>autonomous system (AS)</b>. An <b>EGP (exterior gateway protocol)</b> runs between autonomous systems, such as between ISPs.',
 '<b>Distance-vector</b> protocols tell neighbours "here are the networks I know and how far away they are"; each router trusts its neighbours\' view, sometimes called routing by rumour. <b>Link-state</b> protocols flood details of every link to every router, so each builds a complete map of the network and calculates the best paths itself. <b>Convergence</b> is the moment all routers agree on the topology after a change; faster is better.')+
TB(['Protocol','Type','Metric','What to know'],[
 ['RIP (v1, v2)','Distance vector, IGP','Hop count; max <b>15</b> (16 = unreachable)','Sends its full table every 30 s; slow to converge. v1 is classful and broadcasts. v2 is classless (supports VLSM), multicasts to 224.0.0.9 and supports authentication. AD 120.'],
 ['OSPF','<b>Link state</b>, IGP, open standard','Cost (based on bandwidth)','Uses Dijkstra\'s SPF algorithm and hello packets; fast convergence; organises routers into <b>areas</b>, with <b>area 0</b> as the backbone. AD 110.'],
 ['EIGRP','Advanced distance vector ("hybrid"), IGP','Bandwidth and delay','Originally Cisco-only; keeps backup routes (feasible successors) for very fast failover. AD 90.'],
 ['BGP','<b>Path vector</b>, EGP','Path attributes, such as the AS path','The routing protocol of the Internet; runs between autonomous systems over TCP 179.']])+
H('NAT: sharing public addresses')+F.nat+
P('Private addresses can\'t travel on the Internet, so the edge router uses <b>Network Address Translation</b> to swap them for public ones.')+
TB(['Type','How it works','Typical use'],[
 ['Static NAT','One private address permanently mapped to one public address','Publishing an internal server to the Internet'],
 ['Dynamic NAT','Private addresses take public addresses from a pool as needed','Rare today'],
 ['PAT (NAT overload)','Many private hosts share <b>one</b> public IP; the router tracks each conversation by a unique <b>source port</b>','Every home and office router']])+
EX('Worked example: PAT',P('PC1 (192.168.1.11) and PC2 (192.168.1.12) both browse the same website. The router sends both from its public IP 203.0.113.2, but PC1\'s traffic leaves from port 1025 and PC2\'s from 1026. When replies come back to port 1025, the router knows they belong to PC1.'),
 P('NAT terms: the <b>inside local</b> address is the host\'s real private address (192.168.1.11). The <b>inside global</b> address is the public address that represents it on the Internet (203.0.113.2). Outside local and outside global describe the remote server.'))+
P('<b>Port forwarding</b> is the reverse direction: the router sends incoming traffic on a chosen public port (say 443) to an inside server.')+
H('Gateway redundancy (FHRP)')+
P('Hosts have one default gateway configured. If that router fails, they\'re cut off. A <b>First Hop Redundancy Protocol</b> lets two or more routers share a <b>virtual IP address</b> (and virtual MAC); hosts use the virtual IP as their gateway, and if the active router fails a standby takes over within seconds, without changing anything on the hosts. <b>HSRP</b> (Cisco) uses active/standby; <b>VRRP</b> (an open standard) uses master/backup; <b>GLBP</b> (Cisco) also load-balances.')+
H('Inter-VLAN routing with router-on-a-stick')+F.ros+
P('Hosts in different VLANs are on different subnets, so traffic between them must be routed. A cheap way to do it is <b>router-on-a-stick</b>: one router interface connects to a switch trunk, and is split into <b>subinterfaces</b>, one per VLAN, each with 802.1Q tagging and the VLAN\'s gateway address. Layer 3 switches do the same job faster with SVIs (Lesson 11).')+
H('A packet\'s journey, and reading error messages')+
OL('PC-A sees the destination is remote and sends the frame to its default gateway.','Each router strips the frame, looks up the destination in its table, decrements the TTL, and builds a new frame for the next hop.','If the TTL reaches 0, the packet is dropped and a "time exceeded" message is sent back. That prevents endless loops and is how traceroute works.')+
P('Error messages tell you where routing broke. <b>"Destination host unreachable" from a router\'s address</b> means that router has no route to the destination. <b>"Request timed out"</b> means no reply came back at all: often the request got there but the <b>return route</b> is missing, because routing must work in both directions.')+
KEY('Order of choice: longest prefix match → lowest AD → lowest metric.','AD: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120, iBGP 200.','RIP = distance vector, 15 hops max. OSPF = link state, area 0 backbone. EIGRP = hybrid. BGP = path vector between autonomous systems.','Default route 0.0.0.0/0 = gateway of last resort.','PAT = many hosts share one public IP by port. Inside local = private; inside global = public.','HSRP/VRRP give hosts a virtual gateway that survives a router failure.')+
TRAPS('A more specific route wins even if its AD is worse.','RIP\'s maximum is 15 hops; 16 means unreachable.','OSPF is link state and BGP is path vector. Don\'t mix them up.')},

/* ------------------------------------------------------------------ 8 */
{n:8,title:'TCP/IP Applications',obj:'1.4',book:'6',
intro:'The application protocols you need to know, what each one does, the ports and transport they use, their secure replacements, and the tunneling and VPN protocols that carry other traffic.',
html:
H('Ports and why they matter')+F.socket+
P('An IP address gets data to the right computer; a <b>port number</b> gets it to the right program. A web server listens on port 443, so a request to 203.0.113.10:443 reaches the web service. The client sends from a random temporary port, so replies come back to the right browser tab.')+
TB(['Range','Name','Used for'],[['0–1023','Well-known','Standard server services'],['1024–49151','Registered','Vendor applications such as SQL Server and RDP'],['49152–65535','Dynamic / ephemeral','Temporary client source ports']])+
H('The protocols and ports on the N10-009 list')+
P('Know each port, its transport, and what the protocol is for. The exam often describes a protocol\'s job and asks for the port, or the reverse.')+
TB(['Port','Protocol','Transport','What it does'],[
 ['20, 21','FTP','TCP','File transfer. 21 carries commands, 20 carries data. Sends passwords in clear text.'],
 ['22','SSH and SFTP','TCP','Encrypted remote command line; SFTP is file transfer running over SSH.'],
 ['23','Telnet','TCP','Unencrypted remote command line. Replace it with SSH.'],
 ['25','SMTP','TCP','Sends email between mail servers.'],
 ['53','DNS','UDP and TCP','Name resolution. Queries use UDP; zone transfers and large answers use TCP.'],
 ['67, 68','DHCP','UDP','Automatic IP configuration: 67 is the server, 68 the client.'],
 ['69','TFTP','UDP','Very simple file transfer with no authentication, used to load configs and firmware onto network devices.'],
 ['80','HTTP','TCP','Unencrypted web traffic.'],
 ['123','NTP','UDP','Clock synchronization.'],
 ['161, 162','SNMP','UDP','Device monitoring: managers poll agents on 161; agents send traps to managers on 162.'],
 ['389','LDAP','TCP (and UDP)','Directory queries, e.g. looking up users in Active Directory.'],
 ['443','HTTPS','TCP','Web traffic encrypted with TLS. Also DNS over HTTPS.'],
 ['445','SMB','TCP','Windows file and printer sharing.'],
 ['514','Syslog','UDP','Sends log messages to a central log server.'],
 ['587','SMTPS (submission)','TCP','Mail clients submitting email securely with STARTTLS. (465 is SMTP over implicit TLS.)'],
 ['636','LDAPS','TCP','LDAP encrypted with TLS.'],
 ['1433','SQL Server','TCP','Microsoft SQL Server database connections.'],
 ['3389','RDP','TCP','Remote Desktop to Windows machines.'],
 ['5060, 5061','SIP','TCP/UDP','Sets up VoIP calls; 5061 is SIP over TLS.']])+
H3('Other ports from your book and handouts')+
TB(['Port','Protocol'],[['110 / 995','POP3 / POP3S: download email'],['143 / 993','IMAP / IMAPS: access email kept on the server'],['88','Kerberos'],['137–139','NetBIOS'],['49 (TCP)','TACACS+'],['1812 / 1813 (UDP)','RADIUS authentication / accounting (older systems: 1645 / 1646)'],['179 (TCP)','BGP'],['3306','MySQL'],['5900','VNC'],['500 / 4500 (UDP)','IKE / IPsec NAT traversal'],['1701 (UDP)','L2TP'],['1723 (TCP)','PPTP'],['853','DNS over TLS']])+
H('Secure replacements')+
P('Many older protocols send everything, including passwords, in clear text. The exam expects you to pick the secure version:')+
TB(['Insecure','Secure replacement'],[['Telnet (23)','SSH (22)'],['FTP (20/21)','SFTP (22) or FTPS'],['HTTP (80)','HTTPS (443)'],['LDAP (389)','LDAPS (636)'],['SNMPv1/v2c','SNMPv3'],['POP3 / IMAP','POP3S (995) / IMAPS (993)'],['SMTP (25)','SMTPS (587)'],['TFTP (69)','SCP or SFTP']])+
H('Network-layer protocols and tunnels')+
UL('<b>ICMP</b> carries diagnostic and error messages: echo request and reply (ping), destination unreachable, and time exceeded (traceroute). ICMPv6 also does neighbour discovery for IPv6.',
 '<b>GRE</b> (Generic Routing Encapsulation) wraps one packet inside another to build a simple tunnel. It can carry multicast and routing protocols but has <b>no encryption</b>, so it\'s often run inside IPsec.',
 '<b>IPsec</b> secures IP traffic. <b>AH (Authentication Header)</b> proves the packet is authentic and unchanged but <b>does not encrypt</b>. <b>ESP (Encapsulating Security Payload)</b> <b>encrypts</b> and also authenticates. <b>IKE</b> negotiates the keys and security settings, on UDP 500. In <b>transport mode</b> only the payload is protected (host to host); in <b>tunnel mode</b> the whole original packet is wrapped and protected (site to site VPNs).')+
P('Every IP packet names the protocol it carries with a <b>protocol number</b>: ICMP = 1, TCP = 6, UDP = 17, GRE = 47, ESP = 50, AH = 51, OSPF = 89. A firewall rule allowing "ESP" is really allowing IP protocol 50.')+
KEY('Port ranges: well-known 0–1023, registered 1024–49151, dynamic 49152–65535.','DNS uses UDP 53 for queries and TCP 53 for zone transfers.','SNMP: 161 polling, 162 traps. Syslog: UDP 514. NTP: UDP 123. TFTP: UDP 69.','Secure versions: SSH 22, HTTPS 443, LDAPS 636, SMTPS 587, SNMPv3.','IPsec: AH = integrity only; ESP = encryption; IKE = UDP 500.','GRE tunnels but doesn\'t encrypt.')+
TRAPS('Zone transfers use TCP, not UDP.','SFTP (SSH, 22) and FTPS (FTP over TLS) are different protocols.','The exam\'s SMTPS port is 587.')},

/* ------------------------------------------------------------------ 9 */
{n:9,title:'Network Naming',obj:'3.4',book:'5, 7',
intro:'The services that make IP networks usable: DNS turns names into addresses, DHCP hands out addresses automatically, and NTP keeps every clock in step. Plus how each one fails and how to spot it.',
html:
H('DNS: from names to addresses')+F.dns+
P('People type names like <code>www.example.com</code>; computers need IP addresses. The <b>Domain Name System</b> translates between them. When you look up a name, your computer checks three places in order:')+
OL('Its local <b>DNS cache</b> (answers it got recently).','The <b>hosts file</b>, a local text file of manual name-to-IP entries.','Its configured <b>DNS server</b>, usually handed out by DHCP.')+
P('Your DNS server performs a <b>recursive</b> lookup on your behalf: if it doesn\'t know the answer, it asks a <b>root server</b>, which points it to the <b>top-level domain</b> servers for .com, which point it to the <b>authoritative</b> server for example.com, which gives the final answer. The DNS server caches the answer for the record\'s <b>TTL</b> so the next lookup is instant.')+
H3('DNS record types')+
TB(['Record','Purpose','Example'],[
 ['A','Name → IPv4 address','www → 93.184.215.14'],
 ['AAAA','Name → IPv6 address','www → 2001:db8::10'],
 ['CNAME','Alias pointing to another name','intranet → www.lab.local'],
 ['MX','Which server receives email for the domain (with a priority number)','mail.example.com, priority 10'],
 ['NS','The authoritative name servers for the zone','ns1.example.com'],
 ['SOA','Start of authority: the zone\'s primary server, admin and serial number','—'],
 ['PTR','Reverse lookup: IP address → name','10 → server1.example.com'],
 ['TXT','Free text; used for SPF, DKIM and DMARC email policies and domain verification','v=spf1 …'],
 ['SRV','Locates a service: host and port (used by Active Directory and SIP)','_ldap._tcp → dc01:389']])+
H3('Zones and servers')+
P('A <b>forward lookup zone</b> maps names to IPs; a <b>reverse lookup zone</b> maps IPs back to names (stored under in-addr.arpa for IPv4 and ip6.arpa for IPv6). The <b>primary</b> server holds the editable copy of a zone, and <b>secondary</b> servers keep read-only copies that they refresh through <b>zone transfers</b> over TCP 53.',
 'An <b>authoritative</b> answer comes from a server that owns the zone. A <b>non-authoritative</b> answer comes from a server\'s cache. <b>Dynamic DNS (DDNS)</b> updates records automatically when a device\'s IP changes.')+
H3('Securing DNS')+
UL('<b>DNSSEC</b> digitally signs DNS records so resolvers can verify that answers are genuine and unaltered. It protects against cache poisoning. It provides <b>integrity and authenticity, not privacy</b>: queries are still readable.',
 '<b>DNS over HTTPS (DoH, port 443)</b> and <b>DNS over TLS (DoT, port 853)</b> encrypt queries so others on the network can\'t see which sites you look up.')+
P('Older Windows networks also used <b>LLMNR</b> and <b>NetBIOS</b> to resolve names on the local subnet without DNS.')+
EX('Troubleshooting DNS',P('A user can <code>ping 8.8.8.8</code> but <code>ping www.example.com</code> fails with "could not find host". Reaching an Internet IP proves the cable, IP settings and gateway all work, so the problem is <b>DNS</b>. Check the DNS server address with <code>ipconfig /all</code>, test with <code>nslookup www.example.com</code>, and clear stale entries with <code>ipconfig /flushdns</code>.'))+
H('DHCP: automatic addressing')+F.dora+
P('Configuring every device by hand doesn\'t scale. <b>DHCP</b> leases addresses automatically using four messages, remembered as <b>DORA</b>:')+
OL('<b>Discover</b>: the client, which has no address yet, broadcasts from 0.0.0.0 to 255.255.255.255: "Is there a DHCP server?"','<b>Offer</b>: a server offers an address.','<b>Request</b>: the client asks for the offered address.','<b>Acknowledge</b>: the server confirms, and the lease begins.')+
P('DHCP uses UDP <b>67</b> on the server and <b>68</b> on the client.')+
TB(['Term','Meaning'],[
 ['Scope (pool)','The range of addresses the server can hand out for a subnet'],
 ['Exclusion','Addresses inside the scope that are never handed out, e.g. the gateway or static servers'],
 ['Reservation','A specific address always given to one device, matched by its MAC address (good for printers)'],
 ['Lease time','How long the client may keep the address. It tries to <b>renew at 50%</b> of the lease (T1). Short leases suit guest Wi-Fi.'],
 ['Options','Extra settings sent with the address: default gateway (option 3), DNS servers, domain name, NTP server']])+
H3('DHCP across routers: relay')+
P('A DHCP Discover is a broadcast, and <b>routers don\'t forward broadcasts</b>. If the DHCP server sits on a different subnet, the router interface facing the clients needs a <b>DHCP relay</b> (on Cisco, <code>ip helper-address</code>), which forwards the request to the server as unicast and tells it which subnet the client is on. Without a relay, every subnet would need its own DHCP server.')+
H3('When DHCP goes wrong')+
UL('<b>No server reachable</b> (server down, relay missing, wrong VLAN): clients give themselves <b>169.254.x.x APIPA</b> addresses.',
 '<b>Scope exhaustion</b>: all addresses are leased, so new devices get APIPA while existing ones keep working.',
 '<b>Duplicate IP</b>: someone set a static IP inside the scope, so DHCP later hands it to another device.',
 '<b>Rogue DHCP server</b>: an unauthorized server hands out a wrong gateway or DNS, sending users to the wrong network or through an attacker. The defense is DHCP snooping (Lesson 19).')+
P('IPv6 hosts usually configure themselves with SLAAC or DHCPv6 instead (Lesson 12).')+
H('Keeping time: NTP, PTP and NTS')+
P('Accurate clocks matter more than they seem. Logs from different devices can only be lined up if their timestamps agree; certificates check validity dates; and Kerberos logins fail if clocks drift by more than about five minutes. <b>NTP</b> (UDP 123) synchronizes clocks in a hierarchy of <b>strata</b>: <b>stratum 0</b> is the reference clock itself (GPS or atomic), <b>stratum 1</b> servers are attached directly to it, stratum 2 servers sync from stratum 1, and so on.',
 '<b>PTP (Precision Time Protocol, IEEE 1588)</b> uses hardware timestamps for sub-microsecond accuracy in finance, industrial and telecom networks. <b>NTS (Network Time Security)</b> adds cryptographic authentication to NTP so attackers can\'t feed you a false time.')+
KEY('Lookup order: cache → hosts file → DNS server (recursive: root → TLD → authoritative).','A, AAAA, CNAME, MX, NS, SOA, PTR, TXT, SRV.','Zone transfers use TCP 53. DNSSEC = integrity, not privacy; DoH 443 and DoT 853 = privacy.','"Works by IP, fails by name" = DNS.','DORA on UDP 67/68. Reservation = fixed IP per MAC; exclusion = kept out of the pool. Renew at 50%.','Routers don\'t forward DHCP broadcasts: use a relay (ip helper-address).','169.254.x.x = DHCP failed. NTP stratum 1 is attached to the reference clock.')+
TRAPS('DNSSEC does not encrypt.','A reservation and an exclusion are different things.','A server attached to a GPS clock is stratum 1; the GPS clock itself is stratum 0.')},

/* ------------------------------------------------------------------ 10 */
{n:10,title:'Securing TCP/IP',obj:'4.1, 1.4',book:'20',
intro:'The security concepts the rest of the course builds on: the CIA triad, encryption and hashing, certificates, authentication and authorization services, plus physical security, deception and compliance.',
html:
H('The CIA triad and core terms')+F.cia+
P('Security aims at three goals. <b>Confidentiality</b>: only authorized people can read the data, achieved with encryption and access control. <b>Integrity</b>: data isn\'t changed without authorization, checked with hashing and digital signatures. <b>Availability</b>: systems are usable when needed, protected with redundancy, backups and DoS protection.')+
TB(['Term','Meaning'],[['Threat','Anything that could cause harm, internal or external'],['Vulnerability','A weakness that could be exploited; public ones are catalogued as <b>CVEs</b>'],['Exploit','Code or a technique that takes advantage of a vulnerability'],['Risk','The likelihood of a threat exploiting a vulnerability × the impact'],['Zero-day','A vulnerability the vendor doesn\'t know about or hasn\'t patched yet']])+
H('Encryption and hashing')+F.crypto+
P('Data needs protecting both <b>in transit</b> (moving across a network, protected by TLS, IPsec or SSH) and <b>at rest</b> (stored on disks or in databases, protected by disk or database encryption).')+
TB(['Method','How it works','Strengths and weaknesses'],[
 ['Symmetric encryption (AES)','The same secret key encrypts and decrypts','Fast, so used for bulk data. The challenge is sharing the key safely.'],
 ['Asymmetric encryption (RSA, ECC)','A key pair: a <b>public key</b> anyone may have and a <b>private key</b> only the owner keeps','Slower, so used to exchange symmetric keys and to sign data'],
 ['Hashing (SHA-256)','Turns data into a fixed-length digest; any change to the data changes the hash','Proves <b>integrity</b>. MD5 and SHA-1 are now considered weak.']])+
P('The two directions of asymmetric keys do different jobs. Encrypt with the <b>recipient\'s public key</b> and only their private key can decrypt it: that gives <b>confidentiality</b>. <b>Sign</b> with <b>your private key</b> and anyone can verify the signature with your public key: that proves the data came from you and wasn\'t changed, which gives <b>integrity and non-repudiation</b> (you can\'t deny sending it).')+
H3('Certificates and PKI')+
P('How do you know a public key really belongs to your bank? A <b>certificate authority (CA)</b> issues a <b>digital certificate</b> that binds a public key to an identity and signs it. Your browser trusts a set of CAs, so it trusts certificates they sign. This system is <b>PKI (public key infrastructure)</b>. <b>Self-signed</b> certificates aren\'t trusted by default, and <b>expired</b> or mismatched certificates trigger "your connection is not private" warnings. Keys must be generated, stored, rotated and revoked carefully: key management.')+
H('Authentication, authorization and accounting')+
P('Access control happens in stages: <b>identification</b> (who you claim to be, e.g. a username), <b>authentication</b> (proving it), <b>authorization</b> (what you may do), and <b>accounting</b> (logging what you did). The last three together are <b>AAA</b>.')+
H3('Multifactor authentication')+
P('Factors come from different categories: something you <b>know</b> (password, PIN), something you <b>have</b> (phone, token, smart card), something you <b>are</b> (fingerprint, face), <b>somewhere you are</b> (location), and something you <b>do</b> (typing pattern). <b>MFA</b> requires factors from <b>different</b> categories: a password plus an authenticator-app code is MFA, but two passwords are still single-factor.')+
H3('AAA servers: RADIUS and TACACS+')+
TB(['','RADIUS','TACACS+'],[['Transport','UDP 1812 (auth) and 1813 (accounting)','TCP 49'],['Encryption','Only the password','The entire payload'],['AAA functions','Combines authentication and authorization','Separates all three; can authorize each command'],['Typical use','Network access: Wi-Fi, VPN, 802.1X','Administrators logging in to routers and switches (common with Cisco)']])+
H3('Directories and single sign-on')+
UL('<b>LDAP</b> (389) queries directories such as Active Directory; <b>LDAPS</b> (636) encrypts it.',
 '<b>SSO (single sign-on)</b> lets you log in once and reach many systems. <b>SAML</b> is an XML-based standard for web SSO between an identity provider and a service provider.',
 '<b>Kerberos</b> is ticket-based SSO used by Active Directory, on port 88. You log in once to the Key Distribution Center and get a Ticket Granting Ticket, which you use to request tickets for each service. Kerberos is an <b>open standard from MIT</b> and is <b>time-sensitive</b>: if clocks differ by more than about 5 minutes, logins fail, so NTP is essential.')+
H3('Authorization models')+
UL('<b>Least privilege</b>: give users only the access their job needs. A compromised account can then do less damage.',
 '<b>RBAC (role-based access control)</b>: permissions are assigned to roles (job functions), and users are given roles. Changing jobs means changing roles.',
 '<b>DAC (discretionary)</b>: the owner of a resource decides who gets access. <b>MAC (mandatory)</b>: access is based on labels and clearances, as in the military. Also <b>separation of duties</b>: no one person can complete a sensitive task alone.',
 '<b>Geofencing</b> allows or blocks access based on location, and time-based rules limit access to set hours.')+
H('Physical security')+
P('Network security fails if anyone can walk in and plug in. Controls include cameras, door and cabinet locks, badge readers, biometrics, guards, fences and lighting, alarms, motion detection, tamper detection and asset tags. An <b>access control vestibule</b> (formerly called a mantrap) is a small space between two interlocking doors that admits one person at a time, stopping <b>tailgating</b>.')+
H('Deception, compliance and segmentation')+
UL('A <b>honeypot</b> is a decoy system that looks valuable, set up to attract attackers so you can detect and study them. Several decoys together form a <b>honeynet</b>.',
 '<b>PCI DSS</b> is the standard for protecting payment card data. <b>GDPR</b> is the EU regulation protecting personal data. <b>Data locality</b> (sovereignty) means data is subject to the laws of the country where it\'s stored.',
 '<b>Segmentation</b> keeps risky or sensitive devices apart: IoT, industrial control systems (SCADA/ICS/OT), guest and BYOD devices go on their own VLANs, behind ACLs and firewalls (Lesson 17).')+
KEY('CIA: confidentiality (encryption), integrity (hashes, signatures), availability (redundancy).','Symmetric = one shared key, fast (AES). Asymmetric = key pair (RSA). Hash = integrity.','Encrypt with the recipient\'s public key; sign with your private key (non-repudiation).','MFA = factors from different categories.','RADIUS: UDP 1812/1813, encrypts only the password, network access. TACACS+: TCP 49, encrypts everything, device admin.','Kerberos: port 88, open MIT standard, breaks with more than ~5 minutes of clock skew.','RBAC = permissions by role; least privilege = only what\'s needed.','Access control vestibule stops tailgating. Honeypot = decoy. PCI DSS = card data.')+
TRAPS('Kerberos is not Microsoft proprietary, whatever the handouts say.','ESP is IPsec; EAP is 802.1X authentication.','Two passwords are single-factor, not MFA.')}
];
