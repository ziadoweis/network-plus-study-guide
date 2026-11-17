import {H,H3,P,UL,OL,TB,EX,PRE,KEY,TRAPS} from './h.js';
import * as F from './figs1.js';

export const LESSONS=[
/* ------------------------------------------------------------------ 1 */
{n:1,title:'Network Models',obj:'1.1',book:'2, 6',
intro:'How networking is split into layers, what each layer does, how data is wrapped and unwrapped on its way across a network, and why TCP and UDP behave so differently.',
html:
H('Why networks are described in layers')+
P('Sending a web page from a server to your laptop involves dozens of separate jobs: turning text into bits, deciding which cable or radio to use, finding the right device on the local network, finding a path across the Internet, making sure nothing is lost, and handing the data to the right program. No single protocol does all of that. Instead, networking is split into <b>layers</b>, and each layer solves one part of the problem and hands its result to the next.',
 'Layers give you two practical benefits. First, vendors can build one layer without caring about the others: an Ethernet switch works the same whether it carries web traffic or VoIP. Second, layers give you a <b>troubleshooting language</b>. "It\'s a Layer 1 problem" instantly tells a colleague you suspect the cable or port, not DNS. The exam uses this language constantly.')+
H('The OSI model, layer by layer')+F.osi+
P('The <b>Open Systems Interconnection (OSI)</b> model has seven layers. Layer 1 is closest to the wire; Layer 7 is closest to the user. A handy way to remember them from the bottom up is <b>P</b>lease <b>D</b>o <b>N</b>ot <b>T</b>hrow <b>S</b>ausage <b>P</b>izza <b>A</b>way: Physical, Data Link, Network, Transport, Session, Presentation, Application.')+
H3('Layer 1: Physical')+
P('The Physical layer moves raw <b>bits</b>: electrical voltages on copper, pulses of light on fiber, or radio waves for Wi-Fi. It defines cables, connectors (such as the <b>RJ-45</b> plug on an Ethernet cable), pin-outs, signal timing and how a 1 is told apart from a 0. Devices that work only here do no thinking at all: a <b>hub</b> or <b>repeater</b> simply regenerates the signal and sends it out, and a <b>media converter</b> changes it from one medium to another (for example copper to fiber). If a cable is cut or a port is dead, you have a Layer 1 problem.')+
H3('Layer 2: Data Link')+
P('The Data Link layer delivers data between devices on the <b>same local network</b>. It packages bits into <b>frames</b>, addresses them with <b>MAC addresses</b> (the 48-bit hardware address burned into every network card), and adds a <b>Frame Check Sequence (FCS)</b> trailer so the receiver can detect corruption. Ethernet and Wi-Fi (802.11) are Layer 2 technologies. <b>Switches</b>, <b>bridges</b>, <b>NICs</b> and <b>wireless access points</b> work here. When a frame needs to say which VLAN it belongs to, a 4-byte <b>802.1Q tag</b> is inserted into its Layer 2 header (Lesson 11).',
 'Layer 2 has two sublayers. The upper <b>LLC (Logical Link Control)</b> sublayer identifies which Layer 3 protocol is inside the frame and can handle flow control. The lower <b>MAC (Media Access Control)</b> sublayer handles physical addressing and decides when the device may transmit on the medium.')+
H3('Layer 3: Network')+
P('The Network layer moves data <b>between different networks</b>. It uses <b>logical addresses</b> (IP addresses) that are assigned by configuration rather than burned into hardware, and it chooses a path, which is called <b>routing</b>. The Layer 3 unit is the <b>packet</b>. <b>Routers</b> and <b>Layer 3 switches</b> work here. IP, ICMP (used by ping), IPsec and routing protocols such as OSPF belong to this layer.')+
H3('Layer 4: Transport')+
P('The Transport layer gets data from one <b>program</b> to another program on the far end. It identifies programs with <b>port numbers</b> (HTTPS is 443, SSH is 22), splits large data into pieces, and, if the protocol is TCP, guarantees delivery. The unit is called a <b>segment</b> for TCP and a <b>datagram</b> for UDP. Firewalls that filter by port and load balancers that distribute connections are often described as Layer 4 devices.')+
H3('Layers 5, 6 and 7')+
P('The <b>Session</b> layer (5) opens, manages and closes conversations between applications, such as a remote procedure call (RPC) session. The <b>Presentation</b> layer (6) handles data format: character encoding like ASCII, image formats like JPEG, compression, and encryption. For the exam, <b>TLS encryption is placed at Layer 6</b>. The <b>Application</b> layer (7) is where network services are offered to programs: HTTP, DNS, SMTP, FTP, SNMP, DHCP. Note that Layer 7 is the <i>protocol</i>, not the program: Chrome is not at Layer 7, but HTTP is.')+
TB(['Layer','Name','Unit (PDU)','What it does','Examples'],[
 ['7','Application','Data','Network services for programs','HTTP, DNS, SMTP, SNMP, DHCP'],
 ['6','Presentation','Data','Format, encrypt, compress','TLS, JPEG, ASCII'],
 ['5','Session','Data','Open, manage, close sessions','RPC, NetBIOS sessions'],
 ['4','Transport','Segment / datagram','Ports, reliability, flow control','TCP, UDP'],
 ['3','Network','Packet','Logical addressing, routing','IP, ICMP, OSPF; routers'],
 ['2','Data Link','Frame','MAC addressing, framing, FCS','Ethernet, 802.11, ARP; switches'],
 ['1','Physical','Bits','Signals, media, connectors','Cables, hubs, repeaters']])+
P('ARP, which finds the MAC address that matches an IP address, sits on the border between Layers 2 and 3. Most exam questions treat it as Layer 2.')+
H('Encapsulation: how data travels down and up the stack')+F.encap+
P('When you send data, each layer adds its own <b>header</b> (and Layer 2 also adds a trailer) in front of what the layer above gave it. This wrapping is called <b>encapsulation</b>. The receiver reverses it, <b>decapsulation</b>, removing one header at each layer until the application gets the original data.')+
EX('Worked example: loading a web page',
 OL('Your browser creates an HTTP request (Layer 7 data). TLS encrypts it (Layer 6).',
  'TCP adds a header with source port (a random high port such as 52114) and destination port 443. Now it is a <b>segment</b>.',
  'IP adds a header with your IP address and the server\'s IP address. Now it is a <b>packet</b>.',
  'Ethernet adds a header with your MAC address and the MAC address of your <b>default gateway</b> (because the server is on another network), plus an FCS trailer. Now it is a <b>frame</b>.',
  'The NIC turns the frame into <b>bits</b> on the wire.'))+
H('What changes at each router hop')+F.hop+
P('This is one of the most tested ideas in the whole exam. MAC addresses only matter on the local link, so <b>a frame never crosses a router</b>. When the frame reaches your router, the router strips off the Ethernet header, reads the IP header, decides where to send the packet next, <b>decrements the TTL</b> by one, and builds a <b>brand-new frame</b> with its own MAC as the source and the next device\'s MAC as the destination.',
 'The IP packet inside stays the same from end to end: the source and destination IP addresses do not change (unless NAT rewrites them, which you\'ll meet in Lesson 7). So the rule is: <b>MAC addresses change at every hop; IP addresses stay the same.</b>')+
PRE(`Laptop ──frame 1──▶ Router A ──frame 2──▶ Router B ──frame 3──▶ Server
MACs:  laptop→A        A→B                   B→server       (new every hop)
IPs:   laptop→server   laptop→server         laptop→server  (unchanged)`)+
H('The TCP/IP model')+F.tcpip+
P('The OSI model is a teaching and troubleshooting reference. The protocols the Internet actually runs on follow the simpler <b>TCP/IP model</b> (also called the DoD model), which has four layers. You only need to know how they line up:')+
TB(['TCP/IP layer','Matches OSI layers'],[['Application (Process)','5, 6 and 7'],['Host-to-Host (Transport)','4'],['Internet','3'],['Network Access (Link)','1 and 2']])+
H('TCP and UDP')+F.handshake+
P('The two Transport-layer protocols trade reliability against speed.')+
H3('TCP: connection-oriented and reliable')+
P('Before sending data, TCP sets up a connection with the <b>three-way handshake</b>: the client sends <b>SYN</b> ("I want to talk, here is my starting sequence number"), the server replies <b>SYN/ACK</b> ("OK, and here is mine"), and the client sends <b>ACK</b>. Only then does data flow.',
 'During the conversation TCP numbers every byte (<b>sequence numbers</b>), the receiver confirms what it got (<b>acknowledgments</b>), anything lost is <b>retransmitted</b>, and the <b>window size</b> tells the sender how much it may send before waiting for an ACK (flow control). A conversation ends gracefully with <b>FIN</b> and ACK from each side, or abruptly with <b>RST</b> (reset).')+
TB(['Flag','Meaning'],[['SYN','Start a connection, synchronize sequence numbers'],['ACK','Acknowledges received data'],['FIN','Finished: graceful close'],['RST','Reset: abort the connection immediately'],['PSH','Push this data to the application now'],['URG','Urgent data']])+
H3('UDP: connectionless and lightweight')+
P('UDP just sends datagrams with no handshake, no acknowledgments and no retransmission. That sounds worse, but it\'s ideal when speed matters more than perfection or when the application handles its own retries. A late VoIP packet is useless, so retransmitting it would only make things worse. DNS queries are tiny, so a retry is cheaper than a handshake.')+
TB(['','TCP','UDP'],[['Setup','Three-way handshake','None'],['Delivery','Guaranteed, in order','Best effort'],['Overhead','Higher (bigger header, ACKs)','Lower'],['Used by','HTTP/HTTPS, SSH, SMTP, FTP, RDP','DNS queries, DHCP, TFTP, SNMP, syslog, VoIP, streaming']])+
H('Using the model to troubleshoot')+
P('When something is broken, you can work <b>bottom-up</b> (check the link light and cable, then the IP settings, then the application) or <b>top-down</b> (start from the error the application shows). Bottom-up is usually best when nothing works at all; top-down when one application fails but others are fine. Lesson 21 covers the full troubleshooting method.')+
KEY('Layers bottom up: Physical, Data Link, Network, Transport, Session, Presentation, Application.','PDUs: bits, frame, packet, segment (TCP) or datagram (UDP), data.','Hubs and repeaters = L1. Switches, bridges, NICs, APs = L2. Routers = L3.','The FCS trailer is added at Layer 2.','At every hop the frame (and its MACs) is rebuilt and the TTL drops by 1; the IPs stay the same.','TCP handshake: SYN → SYN/ACK → ACK. FIN closes gracefully, RST aborts.')+
TRAPS('TLS goes at Layer 6 for this exam.','"Which address changes at each hop?" The MAC addresses.','A segment is Layer 4 and a packet is Layer 3. Don\'t swap them.')},

/* ------------------------------------------------------------------ 2 */
{n:2,title:'Cabling and Topology',obj:'1.5, 1.6',book:'1, 3',
intro:'How networks are laid out, the kinds of networks you\'ll hear about, and the copper, coax and fiber cables and connectors that carry the signal, including how to wire and choose them.',
html:
H('Topologies: how devices are arranged')+F.topo+
P('A <b>topology</b> describes how devices are connected. The <b>physical</b> topology is how the cables actually run; the <b>logical</b> topology is how data flows. They can differ. A hub, for example, is wired as a star, but because it repeats every signal out of every port, data flows as if everyone shared one cable: a logical bus.')+
TB(['Topology','How it\'s connected','Strengths','Weaknesses'],[
 ['Star (hub-and-spoke)','Every device connects to a central switch or hub','Easy to add devices; one bad cable affects only one device','The central device is a <b>single point of failure</b>'],
 ['Full mesh','Every device connects to every other device','Maximum redundancy: many alternate paths','Very expensive: needs <b>n(n−1)/2</b> links'],
 ['Partial mesh','Only some devices have redundant links','Balances cost and redundancy','Some paths still have no backup'],
 ['Bus','All devices tap into one shared cable (old coax networks)','Cheap, simple','One break takes down the whole segment'],
 ['Ring','Each device connects to two neighbors in a loop (Token Ring, FDDI)','Predictable; a dual ring adds redundancy','One break can stop a single ring'],
 ['Hybrid','A combination, such as stars linked together','Flexible','More complex'],
 ['Point-to-point / point-to-multipoint','One link between two sites, or one site to many','Common for WAN and wireless links','—']])+
EX('Worked example: mesh links',P('A company wants a full mesh between 6 branch offices. Links needed = 6 × (6 − 1) ÷ 2 = 6 × 5 ÷ 2 = <b>15</b>. With 10 sites it would be 45 links, which is why full meshes are rare beyond a handful of sites.'))+
H('Kinds of networks')+
TB(['Type','Scope'],[['PAN','Personal area, such as Bluetooth between your phone and earbuds'],['LAN','One building or site'],['WLAN','A wireless LAN'],['CAN','A campus: several buildings close together'],['MAN','A city or metro area'],['WAN','Connects LANs across large distances'],['SAN','A dedicated network for storage']])+
P('In a <b>client-server</b> network, central servers hold resources and control access (most businesses). In a <b>peer-to-peer</b> network, every computer shares its own resources and there is no central control (a small home network sharing a printer).')+
H('Twisted-pair copper')+
P('Most office cabling is <b>twisted pair</b>: four pairs of copper wires twisted together. The twisting is not decoration. Each pair carries a signal and its mirror image, and twisting cancels out electrical noise (<b>EMI</b>) and stops the signal on one pair leaking into the next (<b>crosstalk</b>).',
 '<b>UTP</b> (unshielded) is the norm. <b>STP</b> (shielded) adds foil or braid around the pairs for environments full of electrical noise, such as factories, and the shield must be grounded to work.',
 'Twisted-pair Ethernet runs up to <b>100 metres</b>: by convention 90 m of permanent horizontal cable in the wall plus 10 m of patch cables at each end. Beyond that the signal weakens too much (attenuation).')+
TB(['Category','Bandwidth','Typical use'],[
 ['Cat 5','100 MHz','100 Mbps (obsolete)'],
 ['Cat 5e','100 MHz','1 Gbps (1000BASE-T); the minimum for new installs'],
 ['Cat 6','250 MHz','1 Gbps; 10 Gbps only up to about 55 m'],
 ['Cat 6a','500 MHz','10 Gbps (10GBASE-T) at the full 100 m'],
 ['Cat 7','600 MHz','10 Gbps; shielded; not a TIA standard'],
 ['Cat 8','2000 MHz','25/40 Gbps up to only 30 m, for data center racks']])+
H3('Cable jackets and conductors')+
UL('<b>Plenum-rated</b> cable has a fire-resistant, low-smoke jacket. It is required in <b>plenum spaces</b>: the air-handling space above drop ceilings or below raised floors, where burning PVC would spread toxic smoke through the ventilation.',
 '<b>Riser-rated</b> cable is for vertical runs between floors. Ordinary <b>PVC</b> cable is fine everywhere else.',
 '<b>Solid-core</b> cable (one thick copper strand per wire) is for permanent runs in walls. <b>Stranded</b> cable (many thin strands) is flexible and used for patch cables.')+
H('Coax and twinax')+
UL('<b>Coaxial</b> cable has one central conductor inside insulation and a shield. <b>RG-6</b> (75 Ω) is the standard for cable TV and cable modems and uses a screw-on <b>F-type</b> connector. <b>RG-59</b> is older and thinner, for short runs. <b>BNC</b> twist-lock connectors appear on legacy 10BASE2 networks and video equipment.',
 '<b>Twinaxial</b> (twinax) has two inner conductors. In data centers it is sold as <b>DAC (direct-attach copper)</b> cables: short, cheap cables with SFP+ or QSFP modules already attached, used to connect a server to the switch at the top of its rack.')+
H('Fiber optic cable')+F.fiber+
P('Fiber carries light through a thin glass core. Because it uses light, it is <b>immune to EMI</b>, can run much further than copper, and is very hard to tap without detection. There are two kinds:')+
TB(['','Single-mode (SMF)','Multimode (MMF)'],[['Core size','About 9 µm (tiny)','50 or 62.5 µm'],['Light source','Laser','LED or VCSEL'],['Distance','Kilometres (10, 40 km and beyond)','Up to a few hundred metres'],['Cost','Optics cost more','Cheaper optics'],['Jacket colour','Usually yellow','Orange or aqua']])+
P('Single-mode\'s tiny core lets light travel in essentially one straight path, so the signal stays clean over long distances. Multimode\'s wider core lets light bounce along many paths, which smears the signal over distance (modal dispersion), limiting its reach.')+
TB(['Connector','Description'],[['LC','Small form factor with a latch; the standard connector on SFP transceivers'],['SC','Square, push-pull'],['ST','Round, bayonet twist-lock (older)'],['MT-RJ','Two fibers in one small RJ-style housing'],['MPO/MTP','Many fibers in one connector, for 40/100G parallel optics']])+
P('Fiber end faces are polished in two styles. <b>UPC</b> (usually blue) is flat. <b>APC</b> (green) is angled at 8°, which reduces light reflecting back down the fiber. <b>Never connect APC to UPC</b>: the angles don\'t meet, causing high loss and possible damage.')+
H('Wiring standards and cable types')+F.pinout+
P('Inside an RJ-45 plug the eight wires must be in a set order. Two standards exist: <b>T568A</b> and <b>T568B</b>. Pick one and use it consistently; T568B is the most common in businesses.')+
TB(['Pin','1','2','3','4','5','6','7','8'],[['T568A','W/G','G','W/O','B','W/B','O','W/Br','Br'],['T568B','W/O','O','W/G','B','W/B','G','W/Br','Br']])+
P('A <b>straight-through</b> cable has the same standard on both ends and connects <b>unlike</b> devices: a PC to a switch, or a router to a switch. A <b>crossover</b> cable has T568A on one end and T568B on the other, swapping the transmit and receive pairs (pins 1↔3 and 2↔6), and connects <b>like</b> devices: switch to switch, PC to PC, router to router. Modern ports support <b>Auto-MDI-X</b>, which detects the cable and swaps pairs automatically, so either cable usually works.',
 'A <b>rollover</b> (console) cable reverses every pin and connects a computer\'s serial or USB port to a router or switch <b>console port</b>, for configuring a device that has no IP address yet.')+
KEY('Star is the most common topology; its central device is a single point of failure.','Full mesh links = n(n−1)/2.','Twisted pair: 100 m maximum. Cat 5e for 1 Gbps, Cat 6a for 10 Gbps at 100 m, Cat 8 for 25/40 Gbps up to 30 m.','Plenum cable in air-handling spaces; riser between floors.','RG-6 with F-type for cable modems; DAC (twinax) for short rack links.','SMF = laser, long distance; MMF = LED/VCSEL, short. LC is the SFP connector.','Straight-through = unlike devices; crossover = like devices; rollover = console.')+
TRAPS('Cable modems use RG-6. The quiz workbook\'s "RG-32" is not a real common grade.','Cat 6 cannot do 10 Gbps at 100 m; that needs Cat 6a.','Never mate APC (green) with UPC (blue).')},

/* ------------------------------------------------------------------ 3 */
{n:3,title:'Ethernet Basics',obj:'1.1, 1.2',book:'4, 5',
intro:'How Ethernet frames are built, how MAC addresses and switches work, what collision and broadcast domains are, and the main network appliances you\'ll meet: firewalls, IDS/IPS, load balancers, proxies and storage.',
html:
H('The Ethernet frame')+F.frame+
P('Everything on a wired LAN travels inside Ethernet frames. Knowing the fields helps you read packet captures and answer questions about MTU and VLAN tags.')+
TB(['Field','Size','Purpose'],[
 ['Preamble + SFD','8 bytes','Lets the receiver synchronize; marks the start of the frame'],
 ['Destination MAC','6 bytes','Who the frame is for'],
 ['Source MAC','6 bytes','Who sent it'],
 ['802.1Q tag (optional)','4 bytes','VLAN ID, added on trunk links (Lesson 11)'],
 ['EtherType / length','2 bytes','What is inside, e.g. IPv4 or IPv6'],
 ['Payload','46–1500 bytes','The packet being carried'],
 ['FCS','4 bytes','CRC-32 checksum used to detect corrupted frames']])+
P('The largest payload a standard frame can carry is <b>1500 bytes</b>. That figure is the <b>MTU (maximum transmission unit)</b>. Counting the headers and FCS, a standard frame is <b>64 to 1518 bytes</b>, or 1522 with a VLAN tag. <b>Jumbo frames</b> raise the MTU to about 9000 bytes so storage and server traffic carries more data per frame, but every device on the path must be configured for the same MTU or frames get dropped.',
 'If a frame arrives with a bad FCS, the receiver silently discards it and increments its <b>CRC error</b> counter. Frames smaller than 64 bytes are called <b>runts</b>; frames larger than 1518 bytes (without jumbo support) are <b>giants</b>.')+
H('MAC addresses')+
P('A MAC address is <b>48 bits</b>, written as 12 hex digits such as <code>0A:24:D3:00:00:FF</code> or <code>0a24.d300.00ff</code> (Cisco style). The first 24 bits are the <b>OUI (Organizationally Unique Identifier)</b>, which identifies the manufacturer; the last 24 bits are assigned by the manufacturer to make each card unique. The special address <code>FF:FF:FF:FF:FF:FF</code> is the <b>broadcast</b> MAC: every device on the LAN accepts it.')+
H('How a switch works')+F.learn+
P('A switch has three jobs: <b>learn</b> where devices are, <b>forward or filter</b> each frame, and <b>avoid loops</b> (using Spanning Tree, Lesson 11).')+
EX('Worked example: a switch learning',
 OL('PC-A on port 1 sends a frame to PC-C. The switch records "PC-A\'s MAC is on port 1" in its <b>MAC address table</b> (also called the CAM table).',
  'The switch doesn\'t know where PC-C is yet, so it <b>floods</b> the frame out of every port except port 1.',
  'PC-C replies. The switch records "PC-C is on port 3" and forwards the reply only to port 1.',
  'From now on, frames between A and C go only to the right ports. Other devices never see them.'))+
P('Broadcasts (and frames for unknown destinations) are always flooded to every port in the VLAN. That is why a switch does not stop broadcasts.')+
H('Managing a switch from the command line')+
P('An <b>unmanaged</b> switch just works out of the box with nothing to configure. A <b>managed</b> switch, like the Cisco switches in your labs, has its own operating system (Cisco IOS) and a command line. The first time, you reach it through its <b>console port</b> with a rollover (console) cable (Lesson 2); later, over the network with SSH (Lesson 8).',
 'The command line has <b>modes</b>, and the prompt tells you which one you are in. Each mode allows more than the last:')+
TB(['Prompt','Mode','How you get there','What you can do'],[['<code>Switch&gt;</code>','User EXEC','Log in','Look only: a few show commands, ping'],['<code>Switch#</code>','Privileged EXEC','<code>enable</code>','Every show command, save and reload'],['<code>Switch(config)#</code>','Global configuration','<code>configure terminal</code>','Change settings for the whole device'],['<code>Switch(config-if)#</code>','Interface configuration','<code>interface fa0/1</code>','Change one port'],['<code>Switch(config-line)#</code>','Line configuration','<code>line console 0</code> or <code>line vty 0 15</code>','Set how people log in on the console, or remotely (VTY = virtual terminal lines)']])+
P('The settings you type go into the <b>running configuration</b>, which lives in RAM and is lost on a reboot. Copy it to the <b>startup configuration</b> in NVRAM to keep it: <code>copy running-config startup-config</code>. Securing a new switch starts with a hostname, a password for privileged mode (<code>enable secret</code>, which is stored hashed) and passwords on the console and VTY lines.')+
EX('Worked example: first steps on a new switch',PRE(`Switch> enable\nSwitch# configure terminal\nSwitch(config)# hostname SW1\nSW1(config)# enable secret Cl@ss2024\nSW1(config)# line console 0\nSW1(config-line)# password C0nsole!\nSW1(config-line)# login\nSW1(config-line)# end\nSW1# show mac address-table\nSW1# copy running-config startup-config`),P('<code>show mac address-table</code> shows the switch\'s learned MAC addresses and their ports, the table you saw being built earlier in this lesson. You\'ll type commands like these in Packet Tracer lab 1, after Lesson 6.'))+
H('Collision domains and broadcast domains')+F.domains+
P('Early Ethernet shared one cable among many devices. If two transmitted at once, their signals collided. Devices used <b>CSMA/CD</b> (Carrier Sense Multiple Access with Collision Detection): listen before sending, and if a collision is detected, stop and wait a random time. All devices that can collide with each other form one <b>collision domain</b>.',
 'A <b>broadcast domain</b> is the set of devices that receive each other\'s broadcasts. Only a router (or a VLAN boundary) separates broadcast domains.')+
TB(['Device','OSI layer','Collision domains','Broadcast domains'],[['Hub / repeater','1','One shared by all ports','One'],['Switch / bridge','2','One per port','One (unless VLANs are used)'],['Router','3','One per port','One per interface']])+
P('Modern switches run each port in <b>full duplex</b> (send and receive at the same time), so collisions no longer happen. <b>Half duplex</b> (one direction at a time) only survives on hubs or misconfigured links. If one end is set to full and the other to half, you get a <b>duplex mismatch</b>: the link works but is slow and logs late collisions and CRC errors. Wi-Fi can\'t detect collisions in the air, so it uses <b>CSMA/CA</b> (collision avoidance) instead.')+
H('Network appliances (Objective 1.2)')+
P('Beyond switches and routers, networks use specialist devices. The exam expects you to know what each does and when to choose it.')+
H3('Firewalls')+
P('A firewall allows or blocks traffic according to rules. A <b>stateless</b> firewall (or a basic router ACL) checks every packet on its own, so you need separate rules for return traffic. A <b>stateful</b> firewall remembers connections that were started from inside and <b>automatically allows the replies</b>. A <b>next-generation firewall (NGFW)</b> also understands applications (Layer 7), inspects packet contents (deep packet inspection) and often includes intrusion prevention and URL filtering. A <b>UTM</b> appliance bundles many security functions in one box. Firewalls can be network appliances or host-based software.')+
H3('IDS and IPS')+
P('An <b>Intrusion Detection System (IDS)</b> watches a <i>copy</i> of the traffic, fed from a switch\'s mirror (SPAN) port or a network tap. It sits <b>out of band</b>, so it can only <b>detect and alert</b>. An <b>Intrusion Prevention System (IPS)</b> sits <b>inline</b>, in the actual traffic path, so it can <b>block</b> attacks. Both detect threats using <b>signatures</b> (known attack patterns) or <b>anomalies</b> (deviations from a normal baseline). Too sensitive and you get false positives; too lax and you miss attacks (false negatives).')+
H3('Load balancers and proxies')+
P('A <b>load balancer</b> presents one <b>virtual IP</b> to users and spreads their connections across a pool of servers, using <b>health checks</b> to skip any server that fails. It improves both capacity and availability.',
 'A <b>proxy</b> makes requests on someone else\'s behalf. A <b>forward proxy</b> acts for <i>clients</i> going out to the Internet, caching pages and filtering content. A <b>reverse proxy</b> sits in front of <i>servers</i>, receiving requests from the Internet, offloading TLS encryption and protecting the servers behind it. A <b>transparent proxy</b> intercepts traffic without any client configuration.')+
H3('Storage: NAS and SAN')+
P('A <b>NAS (Network Attached Storage)</b> device shares <b>files</b> over the normal LAN using protocols like SMB (Windows) or NFS (Linux): you see folders. A <b>SAN (Storage Area Network)</b> provides <b>block-level</b> storage, so the server sees what looks like a local disk. SANs use <b>Fibre Channel</b>, <b>FCoE</b> (Fibre Channel over Ethernet) or <b>iSCSI</b>, which carries SCSI disk commands over ordinary IP networks between an <b>initiator</b> (the server) and a <b>target</b> (the storage). Servers connect to Fibre Channel SANs through a <b>host bus adapter (HBA)</b>.')+
H3('Other devices and functions')+
UL('<b>Wireless access point (AP)</b>: bridges Wi-Fi clients onto the wired LAN. A <b>wireless LAN controller (WLC)</b> centrally manages many lightweight APs.',
 '<b>CDN (content delivery network)</b>: caches websites and video at locations near users, so content loads faster.',
 '<b>VPN concentrator / headend</b>: terminates many encrypted VPN tunnels from remote users or sites.',
 '<b>QoS</b>: prioritizes time-sensitive traffic such as voice by marking it (DSCP at Layer 3, 802.1p CoS at Layer 2) and shaping or policing other traffic.',
 '<b>TTL</b>: the IP hop limit that stops packets looping forever. DNS records also have a TTL that sets how long they may be cached.')+
KEY('MTU = 1500-byte payload; frames are 64–1518 bytes (1522 tagged). Jumbo ≈ 9000 and must match end to end.','MAC = 48 bits: 24-bit OUI (vendor) + 24 bits. Broadcast = FF:FF:FF:FF:FF:FF.','Switches learn MACs, forward known unicasts, and flood broadcasts and unknown destinations.','Hub = one collision domain. Switch = one per port. Router = splits broadcast domains.','Stateful firewalls allow return traffic automatically; stateless ones need explicit rules.','IDS = out of band, alerts only. IPS = inline, blocks.','NAS = files over the LAN. SAN = block storage (Fibre Channel, FCoE, iSCSI).','Forward proxy acts for clients; reverse proxy acts for servers.')+
TRAPS('The MTU (1500) is the payload, not the 1518-byte frame.','An IDS cannot block anything.','A switch does not split broadcast domains; routers and VLANs do.')},

/* ------------------------------------------------------------------ 4 */
{n:4,title:'Ethernet Standards',obj:'1.5',book:'4',
intro:'How to read Ethernet standard names, which cable or fiber each standard needs and how far it reaches, and the transceivers and multiplexing tricks that connect it all.',
html:
H('Reading a standard\'s name')+F.stdname+
P('Ethernet standards follow a pattern: <b>speed + BASE + medium or reach</b>. "1000BASE-T" means 1000 Mbps, baseband signaling (one signal on the medium), over <b>T</b>wisted pair. For fiber, the last letters describe reach: <b>S</b> = short reach (multimode, 850 nm), <b>L</b> = long reach (single-mode, 1310 nm), <b>E</b> = extended reach (single-mode, 1550 nm).')+
H('Copper standards')+
TB(['Standard','Speed','Cable','Max distance'],[
 ['10BASE-T','10 Mbps','Cat 3 or better','100 m'],
 ['100BASE-TX','100 Mbps','Cat 5 or better','100 m'],
 ['1000BASE-T','1 Gbps','Cat 5e or better, using <b>all four pairs</b>','100 m'],
 ['10GBASE-T','10 Gbps','Cat 6a (Cat 6 only to ~55 m)','100 m'],
 ['25G/40GBASE-T','25/40 Gbps','Cat 8','30 m']])+
P('Older 10 and 100 Mbps Ethernet used only two of the four pairs: one to send, one to receive. Gigabit and faster use all four pairs in both directions at once, which is why cable quality matters so much at higher speeds.')+
H('Fiber standards')+
TB(['Standard','Fiber','Wavelength','Typical reach'],[
 ['100BASE-FX','Multimode','1300 nm','About 2 km'],
 ['1000BASE-SX','Multimode','850 nm','About 550 m'],
 ['1000BASE-LX','Single-mode (or short MMF)','1310 nm','About 5 km on SMF'],
 ['10GBASE-SR','Multimode','850 nm','About 300–400 m (OM3/OM4 fiber)'],
 ['10GBASE-LR','Single-mode','1310 nm','10 km'],
 ['10GBASE-ER','Single-mode','1550 nm','40 km']])+
EX('Worked example: picking a standard',
 UL('Two switches in the same rack, 2 m apart, 10 Gbps: a <b>DAC</b> twinax cable (cheapest).',
  'Two floors of a building, 200 m apart, 10 Gbps: multimode fiber with <b>10GBASE-SR</b> optics.',
  'Two buildings 8 km apart: single-mode fiber with <b>10GBASE-LR</b> optics.',
  'Desk outlets 90 m from the closet at 10 Gbps: <b>Cat 6a</b> with 10GBASE-T.'))+
H('Transceivers')+
P('Most switches don\'t have fiber ports built in. Instead they have empty slots for hot-swappable <b>transceivers</b>, small modules that convert electrical signals to light (or to copper). They follow a <b>Multi-Source Agreement (MSA)</b>, so different vendors make compatible modules, although some switch vendors only accept their own.')+
TB(['Module','Speed','Notes'],[['GBIC','1 Gbps','Older and large'],['SFP','1 Gbps','Small form-factor pluggable'],['SFP+','10 Gbps','Same size as SFP'],['SFP28','25 Gbps',''],['QSFP+','40 Gbps','Quad: four 10G lanes'],['QSFP28','100 Gbps','Four 25G lanes']])+
P('Both ends of a link must use matching optics: the same wavelength, the same fiber type (single-mode vs multimode) and a compatible speed. An SR module at one end and an LR module at the other will not form a link. Transceivers can carry Ethernet or Fibre Channel.')+
H('Getting more out of a fiber')+
UL('<b>WDM (wavelength-division multiplexing)</b> sends several signals on one fiber by giving each its own colour (wavelength) of light. <b>CWDM</b> (coarse) uses a few widely spaced wavelengths and is cheaper; <b>DWDM</b> (dense) packs many closely spaced wavelengths and is used for long-haul and metro links.',
 '<b>BiDi</b> (bidirectional) transceivers send and receive on a <b>single strand</b> by transmitting on one wavelength and receiving on another, halving the fiber needed.',
 '<b>Media converters</b> join different media: single-mode fiber to copper Ethernet, multimode to copper, fiber to coax, or single-mode to multimode.')+
KEY('Name = speed + BASE + medium. S = short (MMF), L = long (SMF 1310 nm), E = extended (SMF 1550 nm).','1000BASE-T: Cat 5e, all four pairs, 100 m. 10GBASE-T: Cat 6a for 100 m.','10GBASE-SR ≈ 300–400 m on MMF; LR = 10 km and ER = 40 km on SMF.','SFP 1G, SFP+ 10G, SFP28 25G, QSFP+ 40G, QSFP28 100G.','Optics must match at both ends.','CWDM = few wavelengths, cheaper; DWDM = many, long-haul. BiDi = one strand.')+
TRAPS('Gigabit copper is 1000BASE-T (four pairs). The book\'s "1000BaseTX (two pair)" is wrong.','"SPF" in the handouts is a typo for SFP.','QSFP28 is 100 Gbps, not 28 Gbps.')},

/* ------------------------------------------------------------------ 5 */
{n:5,title:'Installing a Physical Network',obj:'2.4, 5.2',book:'3, 16, 18',
intro:'How a building\'s cabling is organized, how equipment rooms are laid out, powered and protected, and the tools you\'ll use to test and troubleshoot cables.',
html:
H('Structured cabling')+F.cabling+
P('Professional installs follow a <b>structured cabling</b> design so that every cable is predictable, labelled and replaceable. A signal travels: <b>work area</b> (the wall outlet at a desk) → <b>horizontal cabling</b> in the walls or ceiling, up to 90 m → a <b>telecommunications room</b> (closet) where it lands on a patch panel → <b>backbone</b> (vertical) cabling linking the closets to the main equipment room.')+
UL('The <b>MDF (main distribution frame)</b> is the building\'s main equipment room. It usually holds the core switches, routers, servers and the <b>demarc</b>.',
 'An <b>IDF (intermediate distribution frame)</b> is a smaller closet serving one floor or area. Each IDF connects back to the MDF, often over fiber.',
 'The <b>demarc (demarcation point)</b> is where the service provider\'s responsibility ends and yours begins. A <b>demarc extension</b> carries the provider\'s circuit from where it enters the building to your equipment room.')+
P('Horizontal cables end on the back of a <b>patch panel</b>, and short patch cables connect the panel\'s front ports to the switch. That way you never touch the permanent cable when moving a desk. Telephone-era wiring used <b>66 blocks</b>; data and voice today use <b>110 blocks</b>. Wires are pressed into both with a <b>punchdown tool</b>. Fiber lands on <b>fiber distribution panels</b>. Label both ends of every cable and keep a <b>cable map</b>.')+
H('Racks')+
P('Equipment mounts in racks measured in <b>rack units (U)</b>: <b>1U = 1.75 inches (4.45 cm)</b>, and a full-height rack is typically <b>42U</b>. Two-post racks suit light patch panels and switches; four-post racks and enclosed, lockable cabinets support heavy servers.',
 'Data centers arrange racks in <b>hot and cold aisles</b>. Equipment fronts face the <b>cold aisle</b>, where cool air is supplied; the backs face the <b>hot aisle</b>, where exhaust is collected. Mixing directions recirculates hot air. Switches come with <b>port-side intake</b> or <b>port-side exhaust</b> fans so you can match their airflow to how they\'re mounted.')+
H('Power')+
TB(['Device','What it does'],[
 ['UPS: standby','Passes mains power through and switches to battery when power fails (a tiny gap)'],
 ['UPS: line-interactive','Also corrects voltage sags and surges; still switches to battery on failure'],
 ['UPS: online (double conversion)','Always runs the load from its battery-backed inverter: no switchover gap, the cleanest power'],
 ['PDU','A rack power strip; metered PDUs show load, switched PDUs can power-cycle outlets remotely'],
 ['Generator','Covers long outages; takes seconds to start, so a UPS bridges the gap']])+
P('Plan the <b>power load</b> so circuits aren\'t overloaded, match equipment to the supplied <b>voltage</b> (120 V in North America; 208/230 V is common in data centers and Egypt), and connect devices with <b>dual power supplies</b> to two separate circuits so one failure doesn\'t take them down.')+
H('Environment and fire')+
UL('<b>Temperature</b>: data centers commonly keep intake air around 18–27 °C. Overheating shortens equipment life and causes shutdowns.',
 '<b>Humidity</b>: too low and static electricity (ESD) builds up; too high and condensation corrodes equipment. Keep it moderate.',
 '<b>Fire suppression</b>: <b>clean-agent or inert gas</b> systems put out fires without damaging electronics and are preferred in equipment rooms. Where sprinklers are required, <b>pre-action</b> or <b>dry-pipe</b> systems keep water out of the pipes until a fire is confirmed.',
 'Environmental sensors monitor temperature, humidity, water leaks, power and door access.')+
H('Testing and troubleshooting cables (Objective 5.2)')+
TB(['Tool','Use it to…'],[
 ['Cable tester','Check continuity and the wire map: is each wire connected to the right pin?'],
 ['Certifier','Prove a run meets its category\'s performance spec (e.g. Cat 6) for a customer handoff'],
 ['TDR (time-domain reflectometer)','Find the <b>distance to a break</b> or fault in <b>copper</b>, by timing a reflected pulse'],
 ['OTDR (optical TDR)','Do the same for <b>fiber</b>, and measure loss along the run'],
 ['Toner and probe ("fox and hound")','Trace a cable: put a tone on the wall jack and find it at the patch panel'],
 ['Multimeter','Measure voltage, resistance and continuity'],
 ['Optical light meter','Measure received light power (dBm) on fiber'],
 ['Visual fault locator','Shine a red laser down fiber so breaks and tight bends glow'],
 ['Loopback plug','Feed a port\'s transmit back into its receive to test the port or NIC'],
 ['Punchdown tool, crimper, stripper','Terminate cables on blocks or attach RJ-45 plugs']])+
H3('Common cable faults')+
UL('<b>Wire map faults</b> (found with a cable tester): <b>opens</b> (a broken wire), <b>shorts</b> (two wires touching), <b>reversed pairs</b> (two wires of a pair swapped), <b>crossed pairs</b> (pairs swapped between pins), and <b>split pairs</b> (wires from two different pairs used as one pair, which causes crosstalk even though continuity tests pass).',
 '<b>Attenuation</b>: the signal weakens with distance, which is why copper stops at 100 m.',
 '<b>Crosstalk</b>: signal bleeding between pairs, usually from untwisting too much wire at the termination. Near-end (NEXT) and far-end (FEXT) crosstalk are measured separately.',
 '<b>EMI</b>: interference from motors, fluorescent lights or power cables running alongside data cable.',
 '<b>Fiber faults</b>: dirty connectors, bends tighter than the cable\'s bend radius, breaks, mismatched wavelengths, too much loss for the link\'s dB budget, and <b>transmit and receive strands swapped</b>, which means no light arrives at either end.')+
KEY('Horizontal runs ≤ 90 m + patch cables = 100 m total.','MDF = main room (demarc, core). IDF = per-floor closet linked to the MDF.','1U = 1.75 in; full rack = 42U. Equipment fronts face the cold aisle.','Online (double-conversion) UPS gives the cleanest power; generators need a UPS to bridge start-up.','Clean-agent suppression for equipment rooms.','TDR = copper fault distance. OTDR = fiber. Toner = trace a cable. Certifier = prove the spec.')+
TRAPS('A toner doesn\'t measure distance; a TDR does.','OTDR is for fiber only.','Split pairs pass a basic continuity test but cause crosstalk.')}
];
