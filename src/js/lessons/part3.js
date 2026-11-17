import {H,H3,P,UL,OL,TB,EX,PRE,KEY,TRAPS} from './h.js';
import * as F from './figs3.js';

export const LESSONS=[
/* ------------------------------------------------------------------ 11 */
{n:11,title:'Switch Features',obj:'2.2',book:'11',
intro:'How VLANs split one switch into many networks, how trunks carry them, how Spanning Tree stops loops, and the other switch features you\'ll configure: link aggregation, mirroring, PoE and interface settings.',
html:
H('VLANs: many networks on one switch')+
P('By default every port on a switch is in one big broadcast domain: every broadcast reaches every device. As networks grow, that wastes bandwidth and lets anyone see everyone. A <b>VLAN (virtual LAN)</b> splits a switch into separate logical networks. Devices in VLAN 10 (Sales) and VLAN 20 (HR) can share the same switch but can\'t reach each other without a router, exactly as if they were on separate switches.',
 'Each VLAN is its own <b>broadcast domain</b> and normally its own IP subnet. VLAN IDs run from 1 to 4094; <b>VLAN 1</b> is the default that every port starts in.')+
H3('Access ports and trunk ports')+F.trunk+
P('An <b>access port</b> belongs to one VLAN and connects an end device. Frames on it are ordinary, <b>untagged</b> Ethernet frames; the PC doesn\'t even know VLANs exist.',
 'A <b>trunk port</b> carries many VLANs over one link, usually between switches or from a switch to a router. To keep them apart, each frame gets an <b>802.1Q tag</b>: 4 bytes inserted into the Ethernet header, holding a 12-bit VLAN ID (hence 4094 usable VLANs) and a 3-bit priority value used for QoS.',
 'One VLAN on each trunk, the <b>native VLAN</b>, is sent <b>untagged</b>. It\'s VLAN 1 by default. Both ends must agree on it, otherwise untagged traffic lands in the wrong VLAN. Best practice is to change it to an unused VLAN with no devices in it (this defeats the double-tagging attack in Lesson 19).')+
EX('Worked example: configuring VLANs on a Cisco switch',PRE(`vlan 10
 name SALES
interface range fa0/1 - 12
 switchport mode access          ! fixed access port, no trunk negotiation
 switchport access vlan 10
interface gi0/1
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99`),P('Check with <code>show vlan brief</code> (trunk ports don\'t appear there) and <code>show interfaces trunk</code>. You practise this in the Switch configuration lab and Packet Tracer lab 6.'))+
H3('Other VLAN features')+
UL('A <b>voice VLAN</b> lets an IP phone and a PC share one wall port: the phone tags its voice traffic into the voice VLAN while the PC\'s traffic stays in the data VLAN.',
 'An <b>SVI (switch virtual interface)</b> is a VLAN\'s Layer 3 interface on a switch, such as <code>interface vlan 99</code>. It gives the switch a management IP, and on a Layer 3 switch it acts as the VLAN\'s gateway for inter-VLAN routing.',
 '<b>VTP</b> (Cisco) copies the VLAN list between switches. <b>DTP</b> (Cisco) automatically negotiates trunks. Turn DTP off on access ports (<code>switchport mode access</code>, or <code>switchport nonegotiate</code> on trunks), because an attacker could use it to form a trunk.',
 '<b>Private VLANs</b> (port isolation) stop devices in the same VLAN from talking to each other, as on hotel or guest networks.')+
P('Whenever a newly connected device gets an address from the wrong subnet or can\'t reach its usual resources, <b>check which VLAN the port is in</b>.')+
P('Two habits keep a switch tidy and safer. <b>Shut down unused ports</b> (<code>shutdown</code>) so nobody can plug in and get access, and move them into an unused <b>"parking" VLAN</b> so that if one is ever enabled by mistake it lands nowhere. And to see what is plugged into each port, <b>CDP</b> (Cisco) or <b>LLDP</b> (the open standard) lets neighbouring devices announce their name, model and port: <code>show cdp neighbors</code>.')+
H('Spanning Tree Protocol: preventing loops')+F.stp+
P('Redundant links between switches are good for resilience, but Ethernet has no TTL. If two switches are connected twice, a broadcast goes around the loop forever, multiplying each time. Within seconds you get a <b>broadcast storm</b>: links saturate, switch CPUs spike, MAC tables flap as the same address appears on different ports, and the network collapses.',
 '<b>Spanning Tree Protocol (STP, IEEE 802.1D)</b> prevents this by logically <b>blocking</b> redundant links until they\'re needed.')+
OL('Switches exchange <b>BPDUs</b> (bridge protocol data units) and elect a <b>root bridge</b>: the switch with the <b>lowest bridge ID</b>. The bridge ID is the priority (default 32768) followed by the MAC address, so the lowest priority wins and the lowest MAC breaks ties. Lower the priority on your core switch so the root isn\'t chosen by accident.',
 'Every other switch picks a <b>root port</b>: its best path to the root.',
 'Each link segment gets one <b>designated port</b> that forwards traffic toward that segment.',
 'All remaining ports become <b>blocked (alternate)</b>, which breaks the loops. If an active link fails, STP unblocks a backup.')+
TB(['Port state','What happens'],[['Blocking','Receives BPDUs only; no data forwarded'],['Listening','Takes part in electing port roles; no MAC learning'],['Learning','Learns MAC addresses into the table, but doesn\'t forward yet'],['Forwarding','Fully working'],['Disabled','Administratively shut down']])+
P('Classic STP takes 30–50 seconds to move a port to forwarding, which is why switch port lights stay amber for a while after you plug something in. <b>RSTP (Rapid STP, 802.1w)</b> converges in a second or two and simplifies the states to discarding, learning and forwarding.')+
H3('STP protection features')+
UL('<b>PortFast</b> lets a port that connects an end device skip straight to forwarding.',
 '<b>BPDU Guard</b> err-disables (shuts down) a PortFast or access port the moment it receives a BPDU. That means someone has plugged in a switch, which could create a loop or hijack the root. Always pair PortFast with BPDU Guard.',
 '<b>Root Guard</b> stops a port from ever becoming the path to a new root bridge.',
 '<b>Storm control</b> (flood guard) limits how much broadcast or multicast traffic a port may carry.')+
H('Link aggregation and port mirroring')+
P('<b>Link aggregation</b> bundles several physical links into one logical link for more bandwidth and redundancy. The standard negotiation protocol is <b>LACP (IEEE 802.3ad)</b>; Cisco calls the bundle an <b>EtherChannel</b> or port channel, and on servers it\'s called <b>NIC teaming</b> or bonding. STP treats the bundle as one link, so it doesn\'t block the extra cables.',
 '<b>Port mirroring</b>, called <b>SPAN</b> on Cisco, copies traffic from one or more ports to a monitoring port, so a packet analyzer or IDS can see it.')+
H('Interface settings')+
UL('<b>Speed and duplex</b>: leave both ends on auto-negotiate, or hard-set both ends to the same values. If one end is full duplex and the other half, you get a <b>duplex mismatch</b>: the link works but is slow, with late collisions and CRC errors.',
 '<b>Jumbo frames</b> (MTU around 9000) improve efficiency for storage (iSCSI) and VM migration traffic, but every device in the path must use the same MTU.',
 '<b>Managed</b> switches offer VLANs, STP tuning, port security, SNMP, mirroring and QoS. <b>Unmanaged</b> switches are plug-and-play with no configuration at all.')+
H('Power over Ethernet')+
P('<b>PoE</b> sends power along the Ethernet cable, so access points in ceilings, IP phones and cameras need no power outlet. The switch is the <b>PSE</b> (power sourcing equipment); the device is the <b>PD</b> (powered device). Some power is lost in the cable, so the device receives less than the switch supplies.')+
TB(['Standard','Name','Power at the switch','Power at the device'],[['802.3af','PoE','15.4 W','≈ 12.95 W'],['802.3at','PoE+','30 W','≈ 25.5 W'],['802.3bt Type 3','PoE++','60 W','≈ 51 W'],['802.3bt Type 4','PoE++','90–100 W','≈ 71 W']])+
P('A switch has a total <b>PoE power budget</b> shared by all its ports. If a camera needs PoE+ but the port only supplies 802.3af, or the switch\'s budget is used up, the device won\'t power on or keeps rebooting. Check with <code>show power inline</code>. A <b>PoE injector</b> adds power to a single cable where the switch can\'t supply it.')+
KEY('Each VLAN = its own broadcast domain and subnet. VLAN 1 is the default.','Access port = one untagged VLAN. Trunk = many VLANs, 802.1Q tagged (12-bit VLAN ID).','The native VLAN is untagged and must match on both ends; move it off VLAN 1.','STP root bridge = lowest bridge ID (priority, then MAC). States: blocking → listening → learning → forwarding.','BPDU Guard err-disables access ports that receive BPDUs. RSTP = 802.1w, fast.','LACP = 802.3ad link aggregation. SPAN = port mirroring.','PoE 15.4 W (af), PoE+ 30 W (at), PoE++ 60/90 W (bt).')+
TRAPS('PoE+ is 802.3at (30 W). The handouts\' "PoE+ 802.3af" is wrong.','Trunk ports don\'t appear in show vlan brief.','The learning state learns MACs but doesn\'t forward; listening does neither.')},

/* ------------------------------------------------------------------ 12 */
{n:12,title:'IPv6',obj:'1.8',book:'7, 10',
intro:'Why IPv6 exists, how to read and shorten its addresses, the address types you\'ll see, how hosts configure themselves without DHCP, and how IPv6 and IPv4 live side by side.',
html:
H('Why IPv6')+
P('IPv4\'s 32 bits give about 4.3 billion addresses, and they ran out years ago; NAT has been stretching them since. <b>IPv6</b> uses <b>128-bit</b> addresses, enough for every device many times over, so NAT is no longer needed. It also has a simpler header that routers process faster, routers never fragment packets (the sender handles it), and IPsec support is built in.')+
H('Reading an IPv6 address')+
P('An IPv6 address is written as <b>eight groups of four hex digits</b> (each group is 16 bits, sometimes called a hextet), separated by colons:')+
PRE('2001:0db8:0000:0000:0000:8a2e:0370:7334')+
P('Two rules shorten it:')+
OL('<b>Drop leading zeros</b> in any group: <code>0db8</code> → <code>db8</code>, <code>0370</code> → <code>370</code>, <code>0000</code> → <code>0</code>.','<b>Replace one run of consecutive all-zero groups with ::</b>. You may use :: only <b>once</b> per address, otherwise nobody could tell how many zeros each one stands for. If there are two equal runs, compress the leftmost.')+
EX('Worked example',P('2001:0db8:0000:0000:0000:8a2e:0370:7334 → 2001:db8:0:0:0:8a2e:370:7334 → <b>2001:db8::8a2e:370:7334</b>'),P('To expand, put the zeros back: :: stands for as many 0000 groups as needed to make eight groups in total.'))+
P('A typical address is split into a <b>/48</b> site prefix from the provider, a 16-bit subnet ID making a <b>/64</b> subnet, and a 64-bit <b>interface ID</b> identifying the device. Nearly every IPv6 LAN is a /64.')+
F.v6+H('Address types')+
TB(['Type','Prefix','IPv4 equivalent','Notes'],[
 ['Global unicast','2000::/3','Public address','Routable on the Internet'],
 ['Link-local','<b>fe80::/10</b>','APIPA (169.254)','Every interface always has one; never routed beyond the local link'],
 ['Unique local','fc00::/7 (in practice fd00::/8)','Private (RFC 1918)','Routable inside an organization but not on the Internet'],
 ['Multicast','ff00::/8','Multicast','One to a group; replaces broadcast'],
 ['Loopback','::1','127.0.0.1','This device'],
 ['Unspecified','::','0.0.0.0','No address yet'],
 ['Anycast','From the unicast space','—','Delivered to the nearest device sharing the address']])+
P('<b>IPv6 has no broadcast.</b> Jobs that used broadcast in IPv4, such as finding a neighbour\'s MAC address, use multicast instead.')+
H('Interface IDs and EUI-64')+F.eui+
P('A host can build its own 64-bit interface ID from its 48-bit MAC address using <b>modified EUI-64</b>:')+
OL('Split the MAC in half.','Insert <b>FFFE</b> in the middle, making 64 bits.','<b>Flip the 7th bit</b> of the first byte (the universal/local bit).')+
EX('Worked example: MAC 00:1A:2B:3C:4D:5E',UL('Split: 001A2B | 3C4D5E','Insert FFFE: 001A2B<b>FFFE</b>3C4D5E','Flip the 7th bit: 00 (0000 0000) becomes 02 (0000 0010)','Interface ID: <b>021A:2BFF:FE3C:4D5E</b>'))+
P('Because a MAC-based ID would let websites track a device everywhere, operating systems such as Windows use random <b>privacy extension</b> IDs instead.')+
H('Neighbor Discovery Protocol')+
P('IPv6 replaces ARP and router discovery with <b>NDP</b>, which uses ICMPv6 messages:')+
TB(['Message','Purpose'],[['Router Solicitation (RS)','A host asks "are there any routers here?"'],['Router Advertisement (RA)','A router announces itself, the subnet prefix and the default gateway'],['Neighbor Solicitation (NS)','"Who has this IPv6 address?" (like an ARP request)'],['Neighbor Advertisement (NA)','"I do, here\'s my MAC" (like an ARP reply)'],['Redirect','Tells a host about a better next hop']])+
H('How hosts get addresses')+
UL('<b>SLAAC (stateless address autoconfiguration)</b>: the host hears an RA, takes the /64 prefix, and builds its own address by adding its interface ID. No server is needed, and the router\'s link-local address becomes the default gateway.',
 '<b>Stateless DHCPv6</b>: the host builds its address with SLAAC but gets extra settings such as DNS servers from a DHCPv6 server. The router\'s RA tells hosts to do this by setting the <b>O (other configuration) flag</b>; on Cisco that\'s <code>ipv6 nd other-config-flag</code>.',
 '<b>Stateful DHCPv6</b>: a DHCPv6 server assigns the address itself, much like DHCP in IPv4.')+
H('Running IPv4 and IPv6 together')+
P('The Internet will run both for years, so several transition methods exist:')+
UL('<b>Dual stack</b>: devices run IPv4 and IPv6 at the same time. This is the preferred approach.',
 '<b>Tunneling</b>: IPv6 packets travel inside IPv4 packets across IPv4-only networks. <b>6to4</b> does this automatically; <b>Teredo</b> tunnels through NAT using UDP; <b>ISATAP</b> works within a single site.',
 '<b>NAT64</b> (with <b>DNS64</b>) translates between the two, letting IPv6-only devices reach IPv4-only services.')+
KEY('128-bit addresses: 8 groups of 4 hex digits.','Drop leading zeros; use :: once for the longest run of zero groups.','Global 2000::/3, link-local fe80::/10, unique local fc00::/7 (fd00::/8), multicast ff00::/8, loopback ::1. No broadcast.','EUI-64: split the MAC, insert FFFE, flip the 7th bit.','NDP (RS, RA, NS, NA) replaces ARP.','SLAAC = self-configured from the RA; stateless DHCPv6 adds options; stateful DHCPv6 assigns addresses.','Dual stack is preferred; Teredo tunnels through NAT; NAT64 translates.')+
TRAPS(':: can appear only once in an address.','Link-local is fe80::/10, not fc00::/7.','In EUI-64 the first byte 00 becomes 02.')},

/* ------------------------------------------------------------------ 13 */
{n:13,title:'WAN Connectivity',obj:'3.5, 1.6',book:'13, 1',
intro:'How sites connect across distance, the WAN technologies you\'ll hear about, how VPNs securely link users and offices over the Internet, and the ways administrators reach devices remotely.',
html:
H('WAN technologies')+
P('A WAN links networks in different places: branches to headquarters, offices to data centers, everyone to the Internet. Organizations rent WAN connections from providers, and the <b>demarcation point (demarc)</b> marks where the provider\'s responsibility ends and yours begins. Sites themselves may be an on-premises data center, a branch office, or rented space in a provider\'s <b>colocation</b> facility.')+
TB(['Technology','How it works','Notes'],[
 ['MPLS','The provider forwards traffic by short labels instead of full IP lookups','Private, reliable, predictable performance; often expensive'],
 ['Metro Ethernet','An Ethernet handoff that spans a city','Simple to connect to'],
 ['DSL','Data over telephone lines','ADSL = asymmetric (faster down), SDSL = symmetric, VDSL = very high bit rate over short distances'],
 ['Cable','Data over the cable-TV coax network (DOCSIS)','Shared bandwidth in a neighbourhood'],
 ['Fiber','Optical links, including SONET with OC-n speed levels','Highest speeds'],
 ['Satellite','Signals relayed by satellite','Geostationary has <b>high latency</b> (about 600 ms or more round trip) and weather sensitivity; low-earth-orbit systems are much faster'],
 ['Cellular','4G LTE and 5G','5G low bands reach far; high (mmWave) bands are very fast but short-range']])+
P('<b>SD-WAN (software-defined WAN)</b> combines several of these, such as MPLS, broadband and LTE, and steers each application over the best link according to a <b>central policy</b>. New branch devices can be shipped and set themselves up automatically (<b>zero-touch provisioning</b>).')+
H('VPNs: private connections over public networks')+F.vpn+
P('A <b>VPN</b> builds an encrypted tunnel across an untrusted network, usually the Internet, so traffic inside it can\'t be read or altered.')+
TB(['VPN type','Connects','How'],[
 ['Site-to-site','Whole networks, such as a branch to headquarters','Two gateways (routers or firewalls) keep a permanent tunnel up, usually with IPsec; users notice nothing'],
 ['Client-to-site (remote access)','One user to the corporate network','VPN client software connects to a <b>VPN concentrator</b> (headend)'],
 ['Clientless','One user, through a web browser','An SSL/TLS VPN portal; no client software needed']])+
H3('Split tunnel vs full tunnel')+F.split+
P('With a <b>full tunnel</b>, all of a remote user\'s traffic, including Internet browsing, goes through the VPN to the company, where it can be inspected and filtered. It\'s more secure but uses more company bandwidth. With a <b>split tunnel</b>, only traffic for corporate networks goes through the VPN and everything else goes straight to the Internet. That saves bandwidth but the company can\'t see or protect that traffic.')+
H3('VPN protocols')+
UL('<b>IPsec</b> (with IKEv2) is the standard for site-to-site VPNs. Tunnel mode wraps the whole packet; transport mode protects only the payload (Lesson 8).',
 '<b>SSL/TLS VPNs</b> run over HTTPS and pass easily through firewalls. SSL is obsolete; modern ones use TLS.',
 '<b>L2TP/IPsec</b>: L2TP is an IETF open standard that builds the tunnel while IPsec encrypts it. <b>PPTP</b> is old and insecure. Others: SSTP, OpenVPN, SSH tunnels. <b>GRE</b> tunnels but does not encrypt.')+
H('Managing devices remotely')+
TB(['Method','What it is'],[
 ['SSH','Encrypted command line (port 22): the standard way to manage network devices'],
 ['GUI','A web interface over HTTPS'],
 ['API','Programmatic access, used by automation tools'],
 ['Console','A cable straight to the device\'s console port; works even with no network configuration'],
 ['RDP / VNC','Remote desktop: RDP (3389) for Windows, VNC (5900) for many systems. A Remote Desktop Gateway or VDI can broker these.']])+
UL('A <b>jump box</b> (jump host or bastion host) is a hardened server that administrators connect to first, and only from there reach the management interfaces of sensitive systems. It centralizes control and logging.',
 '<b>In-band management</b> uses the production network itself. <b>Out-of-band (OOB) management</b> uses a separate path, such as a console server reached over a dedicated management network or a cellular modem, so you can still reach devices when the production network is down.')+
H3('Securing management access on a Cisco device')+
P('Whatever the path, the device itself must protect its management access. A new switch or router has no passwords at all, so the first job on the <b>console</b> (the in-person, out-of-band port) is to lock it down:')+
UL('<b>enable secret</b> sets the password for privileged (#) mode and stores it as a hash. The older <i>enable password</i> is stored in clear text, so don\'t use it.',
 '<b>line console 0</b> with <b>password</b> and <b>login</b> makes the console ask for a password; <b>exec-timeout 10 0</b> logs out an idle session after 10 minutes.',
 '<b>service password-encryption</b> scrambles any remaining clear-text passwords in the configuration. It\'s weak (type 7, easily reversed) but stops someone reading them over your shoulder.',
 'A <b>login banner</b> (<b>banner motd</b>) warns that access is for authorized users only, which matters if an intrusion ends up in court.',
 'A <b>management IP address</b>: a switch gets one on an SVI such as <code>interface vlan 1</code> or a dedicated management VLAN (Lesson 11), plus <code>ip default-gateway</code> so it can be managed from other subnets.')+
P('Remote command-line access goes over the <b>VTY lines</b> (virtual terminal lines, <code>line vty 0 15</code>). Allow only SSH there: Telnet sends everything, passwords included, in clear text. SSH needs a hostname, a domain name and an RSA key pair to encrypt the session, plus a local user account to log in with.')+
EX('Worked example: console security, then SSH-only remote access',PRE(`enable secret Class123
line console 0
 password Cisco123
 login
 exec-timeout 10 0
service password-encryption
banner motd # Authorized access only #
ip domain-name lab.local
username admin secret Admin123
crypto key generate rsa        ! 1024 bits or more
ip ssh version 2
line vty 0 15
 login local                    ! use the local user account
 transport input ssh            ! refuse Telnet
copy running-config startup-config`),P('You build exactly this in Packet Tracer lab 1, Parts 4 and 5. Check it with <code>show ip ssh</code>, and confirm that a Telnet attempt is refused.'))+
KEY('Lock down the console with enable secret, a console password and exec-timeout; allow only SSH on the VTY lines (transport input ssh, login local).','The demarc is where the provider\'s responsibility ends.','MPLS = label switching; DSL: ADSL asymmetric, SDSL symmetric; satellite = high latency.','SD-WAN = several links, central policy, zero-touch provisioning.','Site-to-site (gateways), client-to-site (concentrator), clientless (browser, TLS).','Split tunnel = only corporate traffic in the VPN; full tunnel = everything.','Out-of-band management works when the network is down. Jump box = hardened entry point.','RDP 3389, VNC 5900, SSH 22.')+
TRAPS('L2TP is an IETF open standard, not "used by Cisco" as one quiz says.','A clientless VPN still encrypts, using TLS.','When the production network is down, the answer is out-of-band management.')},

/* ------------------------------------------------------------------ 14 */
{n:14,title:'Wireless',obj:'2.3, 5.4',book:'12',
intro:'The 802.11 standards and frequency bands, how to plan channels, the parts of a wireless network, how Wi-Fi is secured, and the problems that make wireless slow or unreliable.',
html:
H('The 802.11 standards')+
P('Wi-Fi is defined by the IEEE <b>802.11</b> family. Each generation added speed and features, and the Wi-Fi Alliance gave the newest ones simple names.')+
TB(['Standard','Name','Band(s)','Max rate','What it added'],[
 ['802.11a','—','5 GHz','54 Mbps','OFDM in 5 GHz'],
 ['802.11b','—','2.4 GHz','11 Mbps','DSSS'],
 ['802.11g','—','2.4 GHz','54 Mbps','OFDM in 2.4 GHz; works with b'],
 ['802.11n','Wi-Fi 4','2.4 and 5 GHz','600 Mbps','<b>MIMO</b> (several antennas and streams), 40 MHz channels'],
 ['802.11ac','Wi-Fi 5','5 GHz','≈ 6.9 Gbps','80/160 MHz channels; Wave 2 added <b>downlink MU-MIMO</b>'],
 ['802.11ax','Wi-Fi 6 / 6E','2.4, 5 GHz (6E adds <b>6 GHz</b>)','≈ 9.6 Gbps','<b>OFDMA</b>, uplink MU-MIMO, BSS colouring; built for crowded spaces']])+
P('<b>MIMO</b> uses multiple antennas to send several data streams at once. <b>MU-MIMO</b> (multi-user) sends to several clients at the same time. <b>OFDMA</b> splits one channel into small pieces so many clients can share it in the same moment, which is why Wi-Fi 6 copes so much better in busy offices and stadiums.')+
H('Bands and channels')+F.chan+
UL('<b>2.4 GHz</b> travels further and through walls better, but has only three <b>non-overlapping 20 MHz channels: 1, 6 and 11</b> (in North America), and it\'s crowded with interference from microwaves, Bluetooth and cordless phones.',
 '<b>5 GHz</b> has many more channels and less interference but shorter range. Some 5 GHz channels require <b>DFS (dynamic frequency selection)</b>, which moves the AP off a channel if radar is detected, and <b>TPC</b> (transmit power control); both came with 802.11h.',
 '<b>6 GHz</b> (Wi-Fi 6E) offers the most clean spectrum, and <b>WPA3 is required</b> there.',
 '<b>Channel width</b>: bonding channels into 40, 80 or 160 MHz increases throughput but leaves fewer non-overlapping channels for neighbouring APs.',
 'Regulators (the FCC in the US, NTRA in Egypt) decide which channels and power levels are legal, so they differ by country.')+
EX('Worked example: channel planning',P('Three APs cover an office in 2.4 GHz. Put them on channels <b>1, 6 and 11</b>. If two neighbouring APs both use channel 6, they cause <b>co-channel interference</b>: they have to take turns using the air, halving throughput. Using channel 3 would overlap 1 and 6 (<b>adjacent-channel interference</b>), which is even worse.'))+
H('Parts of a wireless network')+F.ess+
TB(['Term','Meaning'],[['SSID','The network name users see'],['BSSID','The MAC address of one AP\'s radio'],['BSS','One AP and its clients'],['ESS','Several APs sharing one SSID so clients can <b>roam</b> between them'],['IBSS','An ad hoc network with no AP']])+
UL('<b>Infrastructure mode</b>: clients connect through APs (normal). <b>Ad hoc</b>: devices connect directly with no AP. <b>Point-to-point</b>: a wireless bridge linking two buildings. <b>Mesh</b>: APs relay traffic for each other, healing around failures.',
 '<b>Autonomous</b> APs are configured one by one. <b>Lightweight</b> APs are managed centrally by a <b>wireless LAN controller (WLC)</b>, which pushes settings, channels and power levels.')+
H('Antennas')+
P('<b>Omnidirectional</b> antennas (such as dipoles) radiate in all directions; use them to cover rooms and floors. <b>Directional</b> antennas (<b>Yagi</b>, <b>parabolic</b>, patch) focus energy in one direction for long point-to-point links between buildings or down long corridors. Gain is measured in <b>dBi</b>. Place APs centrally and high, away from metal.')+
H('Securing Wi-Fi')+
TB(['Protocol','Encryption','Status'],[['WEP','RC4','Broken; never use'],['WPA','TKIP','Deprecated'],['WPA2','AES-CCMP','The current baseline'],['WPA3','<b>SAE</b> for Personal; 192-bit mode for Enterprise; OWE for open networks','The strongest option']])+
P('<b>SAE (Simultaneous Authentication of Equals)</b> replaces WPA2\'s pre-shared-key handshake. With WPA2, an attacker who captures the handshake can guess passwords offline; SAE stops that.')+
UL('<b>Personal</b> mode (PSK) uses one shared passphrase for everyone: simple, but if someone leaves you must change it for all. <b>Enterprise</b> mode uses <b>802.1X</b> with a <b>RADIUS</b> server, so each user logs in with their own credentials and can be removed individually.',
 '<b>Guest networks</b> use a separate VLAN, a <b>captive portal</b> (a terms-of-use or login page shown before access), and <b>client isolation</b> so guests can\'t reach each other.',
 '<b>MAC filtering</b> and <b>hiding the SSID</b> are weak: MAC addresses can be spoofed, and the SSID still appears in client probes.')+
H('Wireless problems and how to measure them')+
P('Wi-Fi uses <b>CSMA/CA</b>: a device listens and waits for a clear channel before sending, because radios can\'t detect collisions mid-transmission. Older modulations include DSSS (802.11b) and FHSS (Bluetooth); modern Wi-Fi uses OFDM and OFDMA.')+
TB(['Problem','Cause and fix'],[
 ['Weak signal / dead zones','Distance and obstacles. Concrete and water <b>absorb</b> signal; metal <b>reflects</b> it (also refraction, scattering, diffraction). Move or add APs.'],
 ['Interference','Co-channel or adjacent-channel APs, or non-Wi-Fi devices such as microwaves. Re-plan channels with a Wi-Fi or spectrum analyzer.'],
 ['Slow in busy areas','Too many clients per AP: add APs, use 5/6 GHz, use Wi-Fi 6.'],
 ['Roaming drops','Inconsistent SSID or security settings across APs, or wrong power levels; "sticky" clients cling to a distant AP.'],
 ['Sudden disconnections','Possibly a deauthentication attack (Lesson 19).']])+
P('Measure signal with <b>RSSI</b> (received signal strength, in dBm: −50 is excellent, −70 is the usual minimum, −80 is poor) and <b>SNR</b> (signal-to-noise ratio: the higher the better). <b>EIRP</b> is the total power radiated, including antenna gain. A <b>site survey</b>, before and after installation, measures coverage and interference and produces a <b>heat map</b> of signal strength.',
 'Other wireless technologies: <b>Bluetooth</b> (PAN), <b>NFC</b> (a few centimetres, for payments), <b>RFID</b> (tags), <b>Zigbee</b> and <b>Z-Wave</b> (low-power IoT), infrared.')+
KEY('Wi-Fi 4 = n, 5 = ac, 6 = ax, 6E = ax in 6 GHz. OFDMA came with ax; downlink MU-MIMO with ac Wave 2.','2.4 GHz non-overlapping channels: 1, 6, 11. DFS avoids radar in 5 GHz. 6 GHz requires WPA3.','SSID = name; BSSID = AP MAC; ESS = one SSID across many APs.','Omni for coverage; directional (Yagi, parabolic) for long links.','WPA3 uses SAE. Personal = shared passphrase; Enterprise = 802.1X + RADIUS.','Captive portal for guests; MAC filtering and hidden SSIDs are weak.','Same channel on neighbouring APs = co-channel interference. Site survey → heat map.')+
TRAPS('MU-MIMO first appeared in 802.11ac Wave 2. The book says 802.11ax; that is wrong.','Wi-Fi uses CSMA/CA, not CSMA/CD.','6E is Wi-Fi 6 in the 6 GHz band, not a new standard number.')},

/* ------------------------------------------------------------------ 15 */
{n:15,title:'Virtualization and Cloud',obj:'1.3, 1.8',book:'17',
intro:'How virtualization works, the cloud service and deployment models, how cloud networks are built and secured, and the newer technologies the exam calls evolving use cases: SDN, SD-WAN, VXLAN, zero trust, SASE and infrastructure as code.',
html:
H('Virtualization')+
P('A <b>hypervisor</b> lets one physical server run many <b>virtual machines (VMs)</b>, each with its own operating system. This consolidates hardware, saves power and makes servers quick to create, copy and snapshot.')+
UL('A <b>Type 1</b> (bare-metal) hypervisor runs directly on the hardware: VMware ESXi, Microsoft Hyper-V, KVM. It\'s what data centers use.',
 'A <b>Type 2</b> (hosted) hypervisor runs as an application on a normal operating system: VirtualBox, VMware Workstation. It\'s used on desktops and laptops.',
 'VMs connect to a <b>virtual switch (vSwitch)</b> inside the host through <b>virtual NICs</b>, and the vSwitch connects to the physical network.',
 '<b>NFV (network functions virtualization)</b> runs network appliances, such as routers, firewalls and load balancers, as VMs instead of dedicated hardware.')+
H('Cloud service models')+F.resp+
P('The service model decides how much the provider manages and how much you manage.')+
TB(['Model','Provider manages','You manage','Example'],[
 ['IaaS (infrastructure)','Hardware, network, storage, virtualization','Operating system, runtime, applications, data','Renting VMs'],
 ['PaaS (platform)','Everything up to the OS and runtime','Your code and data','Deploying code to a managed app platform'],
 ['SaaS (software)','The whole application','Just using it (and your data)','Webmail, online office suites'],
 ['DaaS / VDI','Hosted virtual desktops','The user session','Virtual desktops for remote staff']])+
H('Deployment models and cloud characteristics')+
UL('<b>Public cloud</b>: shared infrastructure owned by a provider. <b>Private cloud</b>: used by one organization only. <b>Hybrid</b>: a mix of both. <b>Community</b>: shared by organizations with common needs.',
 '<b>Scalability</b> is the ability to add capacity: scale <i>up</i> (a bigger instance) or scale <i>out</i> (more instances). <b>Elasticity</b> is scaling up and down <b>automatically</b> as demand changes, so you only pay for what you use.',
 '<b>Multitenancy</b>: many customers share the same physical hardware, kept logically isolated.')+
H('Cloud networking')+F.vpc+
P('In the cloud, your network is a <b>VPC (virtual private cloud)</b>: an isolated private network inside the provider\'s cloud, divided into subnets.')+
TB(['Component','What it does'],[
 ['Internet gateway','Gives a public subnet two-way Internet access'],
 ['NAT gateway','Lets instances in a private subnet start outbound connections (e.g. for updates) while staying unreachable from the Internet'],
 ['Security group','A <b>stateful</b> firewall applied to individual instances or network interfaces'],
 ['Network security list / NACL','A firewall applied to a whole <b>subnet</b>; usually <b>stateless</b>, so return traffic needs its own rule'],
 ['VPN / direct connection','Links your office to the VPC: a site-to-site VPN over the Internet, or a dedicated private circuit for consistent performance']])+
H('Evolving use cases (Objective 1.8)')+
H3('SDN: software-defined networking')+F.sdn+
P('Traditionally every router and switch makes its own forwarding decisions. <b>SDN</b> separates the <b>control plane</b> (deciding where traffic should go) from the <b>data plane</b> (actually moving the packets). The decisions move to a central <b>controller</b>, which programs every device through <b>southbound APIs</b>, while applications ask the controller for what they need through <b>northbound APIs</b>. The <b>management plane</b> handles configuration and monitoring, and the <b>application plane</b> holds the apps that use the network. Instead of configuring 200 switches one by one, you change policy in one place.')+
H3('SD-WAN, VXLAN and SASE')+
UL('<b>SD-WAN</b> applies the same idea to WAN links: it sends each application over the best available link (MPLS, broadband, LTE) according to central policy, with zero-touch provisioning for new sites (Lesson 13).',
 '<b>VXLAN</b> carries Layer 2 Ethernet frames inside UDP packets (port 4789) across a Layer 3 network, so a VLAN can stretch across data centers. Its 24-bit <b>VNI</b> allows about 16 million segments, compared with 4094 VLANs.',
 '<b>SASE (secure access service edge)</b> combines SD-WAN with cloud-delivered security. The security half, <b>SSE</b>, includes a secure web gateway (SWG), cloud access security broker (CASB), zero trust network access (ZTNA) and firewall as a service, delivered from cloud points of presence close to users.')+
H3('Zero trust')+
P('Traditional security trusted anything inside the office network. <b>Zero trust architecture</b> assumes <b>no user or device is trusted by default</b>, even on the internal network. Every request is authenticated and authorized based on identity, device health (posture) and context, with <b>least privilege</b> and <b>microsegmentation</b>: "never trust, always verify".')+
H3('Infrastructure as code')+
P('With <b>infrastructure as code (IaC)</b>, network and server configurations are written as files, such as templates and playbooks, and applied by automation tools. This removes manual typing errors, makes changes repeatable, and prevents <b>configuration drift</b>, where devices slowly stop matching the approved standard. The files live in <b>source control</b> (version control), which records who changed what, supports branching and reviewing changes, and lets you roll back. <b>Orchestration</b> chains many automated tasks into one workflow.')+
KEY('Type 1 = bare metal (ESXi, Hyper-V); Type 2 = hosted (VirtualBox). NFV = appliances as VMs.','IaaS: you manage the OS up. PaaS: just your code. SaaS: just use it.','Elasticity = automatic scaling up and down.','Security group = stateful, per instance. NACL = stateless, per subnet.','Internet gateway = two-way; NAT gateway = outbound only.','SDN separates the control plane from the data plane.','VXLAN = L2 over UDP 4789, 24-bit VNI. SASE = SD-WAN + SSE.','Zero trust = never trust, always verify. IaC prevents configuration drift.')+
TRAPS('Scalability alone isn\'t automatic; elasticity is.','SDN separates control from data; NFV virtualizes appliances.','NACLs are usually stateless; security groups are stateful.')},

/* ------------------------------------------------------------------ 16 */
{n:16,title:'Data Centers',obj:'1.6, 1.2, 3.3',book:'16, 17',
intro:'How data center networks are designed, how storage connects, how to keep services running through failures, and how to plan and test recovery from disasters.',
html:
H('Network architectures')+
H3('Three-tier hierarchy')+
P('The classic enterprise design has three layers, each with a clear job:')+
TB(['Layer','Job'],[['Core','A fast, highly redundant backbone that just moves traffic between distribution blocks; no filtering'],['Distribution','Applies policy: routing between VLANs, ACLs, QoS; aggregates access switches'],['Access','Connects end devices; port security, PoE, VLAN assignment']])+
P('Smaller sites often use a <b>collapsed core</b>, merging the core and distribution layers into one to save cost.')+
H3('Spine and leaf')+
P('Modern data centers use <b>spine-and-leaf</b>. Every <b>leaf</b> switch connects to every <b>spine</b> switch, and leaves never connect to each other. Servers plug into leaves, often a <b>top-of-rack (ToR)</b> switch in each rack. Any server can reach any other in exactly the same number of hops (leaf → spine → leaf), which gives predictable, low latency and lots of parallel paths.')+
F.dcarch+
P('Traffic direction matters for design. <b>North-south</b> traffic goes in and out of the data center, between users or the Internet and servers. <b>East-west</b> traffic flows between servers inside the data center, such as a web server querying a database. Modern applications generate mostly east-west traffic, which is why spine-and-leaf replaced three-tier in data centers.')+
H('Storage networking')+
P('Servers reach shared storage in two ways. A <b>NAS</b> shares <b>files</b> over the normal network (SMB, NFS). A <b>SAN</b> provides <b>block-level</b> storage that the server treats like a local disk, over a dedicated network: <b>Fibre Channel</b> (its own high-speed fabric, reached through a <b>host bus adapter</b>), <b>FCoE</b> (Fibre Channel carried over Ethernet), or <b>iSCSI</b> (SCSI commands over IP). SANs often use jumbo frames.')+
H('High availability')+
P('High availability means removing <b>single points of failure</b> so one broken part doesn\'t stop the service.')+
UL('<b>Active-active</b>: all nodes carry traffic and share the load; if one fails, the survivors absorb its share.',
 '<b>Active-passive</b>: one node carries traffic while a standby waits, ready to take over.',
 'Redundancy techniques: firewall and switch clusters, VRRP/HSRP for gateways, load-balanced server farms, <b>NIC teaming</b> on servers, <b>multipathing</b> to storage, two ISPs with diverse physical paths, and UPS plus generator with dual power supplies.')+
H('Disaster recovery')+
P('Disaster recovery (DR) plans how to restore IT after a major failure, such as a fire, flood or ransomware. Four metrics define the goals:')+
TB(['Metric','Meaning','Example'],[
 ['RPO (recovery point objective)','The maximum <b>data loss</b> you can accept, measured in time','RPO 4 hours → back up at least every 4 hours'],
 ['RTO (recovery time objective)','The maximum <b>downtime</b> before service must be back','RTO 1 hour → you need a hot site or fast failover'],
 ['MTTR (mean time to repair)','The average time to fix a failure','Shorter is better'],
 ['MTBF (mean time between failures)','The average time a repairable device runs between failures (MTTF for non-repairable parts)','Longer is better']])+
H3('Recovery sites')+
TB(['Site','What\'s there','Recovery time','Cost'],[
 ['Cold site','Space, power and connectivity only: no equipment, no data','Days to weeks','Lowest'],
 ['Warm site','Some equipment and connectivity; data must be restored from backup','Hours to days','Medium'],
 ['Hot site','Fully equipped with near-real-time copies of the data','Minutes to hours: <b>the fastest</b>','Highest'],
 ['Cloud site','Recovery infrastructure in a cloud provider','Depends on how it\'s set up: a cloud site kept running ("hot") is fast','Varies']])+
H3('Backups')+F.backup+
TB(['Type','What it copies','To restore you need'],[
 ['Full','Everything','Just that backup'],
 ['Incremental','Changes since the <b>last backup of any type</b>','The last full plus <b>every</b> incremental since; fastest to back up, slowest to restore'],
 ['Differential','Changes since the <b>last full</b> backup (grows each day)','The last full plus the <b>latest</b> differential'],
 ['Snapshot','A point-in-time image of a system or volume','The snapshot']])+
P('Keep copies both on-site (fast restores) and off-site or in the cloud (survives a site disaster), and back up device <b>configurations</b> as well as data.')+
H3('Testing the plan')+
P('A plan that\'s never tested will fail when needed. A <b>tabletop exercise</b> is a discussion: the team walks through a scenario on paper. A <b>validation test</b> actually fails systems over or restores backups. Hold exercises at least yearly and write an after-action report. Disaster recovery is part of the broader <b>business continuity plan</b>, which also covers people, facilities and processes.')+
KEY('Three-tier: core, distribution, access. Collapsed core merges core and distribution.','Spine-and-leaf: every leaf to every spine; ToR leaves; great for east-west traffic.','North-south = in/out of the data center; east-west = server to server.','NAS = file level; SAN = block level (Fibre Channel + HBA, FCoE, iSCSI).','Active-active shares load; active-passive keeps a standby.','RPO = data loss; RTO = downtime; MTTR = repair time; MTBF = time between failures.','Hot site = fastest and most expensive; cold = slowest and cheapest.','Incremental: since the last backup; differential: since the last full.','Tabletop = discussion; validation = real test.')+
TRAPS('The fastest recovery site is a hot site. One quiz in your materials marks "cloud", which only counts if it\'s kept hot.','RPO is about data loss; RTO is about downtime.','Incremental is the fastest backup but the slowest restore.')}
];
