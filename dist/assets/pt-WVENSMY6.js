import{a as d,b,n as g,s as f}from"./chunk-BRTFXDXL.js";var e=(t,n)=>`<div class="cmd"><div class="cmdh"><span>${t}</span><button type="button" class="copy" data-copy>Copy</button></div><pre>${b(n.trim())}</pre></div>`,s=(t,n)=>`<div class="tw"><table><thead><tr>${t.map(o=>`<th>${o}</th>`).join("")}</tr></thead><tbody>${n.map(o=>`<tr>${o.map(r=>`<td>${r}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,c=t=>`<p class="note">${t}</p>`,i=t=>`<pre class="topo">${b(t)}</pre>`,w=`
<h2>Before you start</h2>
<ol class="steps">
<li>Create a free account at <a href="https://www.netacad.com">netacad.com</a> and enroll in <b>Getting Started with Cisco Packet Tracer</b>. That gives you the Packet Tracer download (version 8.x). Install it and sign in with the same account.</li>
<li>Learn the workspace: the <b>device bar</b> is bottom-left (category, then model). The <b>Connections</b> category is the lightning bolt. <b>Realtime / Simulation</b> tabs are bottom-right. <b>Fast Forward Time</b> (next to the clock) skips waits such as STP and OSPF convergence.</li>
<li>Click any device to open it. Routers and switches have <b>Physical</b>, <b>Config</b> and <b>CLI</b> tabs; use the <b>CLI</b> tab for every command in these labs. PCs and servers have a <b>Desktop</b> tab (IP Configuration, Command Prompt, Web Browser, Terminal) and a <b>Services</b> tab on servers.</li>
<li>Save often (File → Save As) and keep one .pkt file per lab. Several labs build on the previous file.</li>
</ol>
<h3>Which cable to use</h3>
${s(["Connection","Packet Tracer cable","Why"],[["PC / server / router → switch","Copper Straight-Through","Unlike devices (MDI ↔ MDI-X)"],["Switch → switch, router → router, PC → router","Copper Cross-Over","Like devices. Real gear usually auto-detects with Auto-MDI-X; Packet Tracer expects the right cable."],["PC RS-232 → device Console port","Console (light blue)","Rollover cable for out-of-band CLI access"],["Fiber ports (if you use them)","Fiber","Needs fiber modules on both ends"]])}
<h3>Habits that save time</h3>
<ul class="steps">
<li>Run <code>no ip domain-lookup</code> on every router and switch. Otherwise a typo makes IOS try to resolve it as a hostname and freezes the CLI for about 30 seconds.</li>
<li>Router interfaces are shut down by default; switch ports are not. Every router interface needs <code>no shutdown</code>.</li>
<li>Link dots: <b>green</b> = up, <b>orange</b> = switch port still going through STP listening/learning (wait about 30 s or Fast Forward), <b>red</b> = down or shut.</li>
<li>Save each device with <code>copy running-config startup-config</code> before you save the .pkt file.</li>
<li>The first ping between two devices often loses one reply while ARP resolves the MAC address. That's normal.</li>
</ul>`,h=[{slug:"pt-first-lan",title:"Your first LAN and a hardened switch",obj:["1.1","1.5","3.5","4.3"],time:"60–75 min",goal:"Cable a small LAN, watch ARP and ICMP move through a switch in Simulation mode, then secure the switch with passwords and SSH.",body:()=>`
${i(` PC1 ─Fa0─────Fa0/1─┐
 PC2 ─Fa0─────Fa0/2─┤  SW1 (2960-24TT)    management IP on VLAN 1: 192.168.1.2/24
 PC3 ─Fa0─────Fa0/3─┘
 PC1 RS-232 ── console cable ── SW1 Console`)}
${s(["Device","Interface","IPv4 address","Mask","Gateway"],[["SW1","VLAN 1","192.168.1.2","255.255.255.0","none"],["PC1","NIC","192.168.1.11","255.255.255.0","none"],["PC2","NIC","192.168.1.12","255.255.255.0","none"],["PC3","NIC","192.168.1.13","255.255.255.0","none"]])}
<h3>Part 1: Build and cable</h3>
<ol class="steps">
<li>File → New. From the device bar choose <b>Network Devices → Switches → 2960</b> and drag one into the workspace. Click it, open <b>Config</b>, and set Display Name to <b>SW1</b>.</li>
<li>Add three PCs (<b>End Devices → PC</b>) and name them PC1, PC2 and PC3.</li>
<li>Choose <b>Connections → Copper Straight-Through</b>. Click PC1, choose <b>FastEthernet0</b>, then click SW1 and choose <b>FastEthernet0/1</b>. Connect PC2 to Fa0/2 and PC3 to Fa0/3 the same way.</li>
<li>Choose the <b>Console</b> cable. Connect PC1 <b>RS 232</b> to SW1 <b>Console</b>.</li>
<li>Watch the link dots turn from orange to green. Orange means the switch port is in the STP listening/learning states (Book Ch. 11).</li>
</ol>
<h3>Part 2: Address the PCs and test</h3>
<ol class="steps">
<li>Click PC1 → <b>Desktop → IP Configuration</b> → <b>Static</b>. Enter 192.168.1.11 and click in the mask field (it fills 255.255.255.0). Leave the gateway blank: everything is on one subnet. Repeat for PC2 and PC3.</li>
<li>PC1 → <b>Desktop → Command Prompt</b>. Run <code>ipconfig</code>, then <code>ping 192.168.1.12</code> and <code>ping 192.168.1.13</code>.</li>
</ol>
<h3>Part 3: Watch ARP and ICMP in Simulation mode</h3>
<ol class="steps">
<li>On PC1 run <code>arp -d</code> to clear the ARP cache.</li>
<li>Click the <b>Simulation</b> tab (bottom-right). Click <b>Edit Filters</b>, clear everything, then tick only <b>ARP</b> and <b>ICMP</b>.</li>
<li>On PC1's Command Prompt run <code>ping 192.168.1.13</code>. Click <b>Capture/Forward</b> one step at a time.</li>
<li>Click the first ARP envelope at PC1 and open <b>Outbound PDU Details</b>. Note the destination MAC: <b>FFFF.FFFF.FFFF</b> (broadcast). Watch SW1 flood it out every other port. PC2 drops it because the IP isn't its own. PC3 sends a unicast ARP reply.</li>
<li>Follow the ICMP echo request and reply. Open the <b>OSI Model</b> tab of a PDU to see which layer each device processed.</li>
<li>Go back to <b>Realtime</b>. Run <code>arp -a</code> on PC1. On SW1's CLI run <code>show mac address-table</code> and match each MAC to its port.</li>
</ol>
<h3>Part 4: Basic switch configuration over the console</h3>
<ol class="steps"><li>PC1 → <b>Desktop → Terminal</b> → OK (9600 baud, 8N1 defaults). Press Enter until you see <code>Switch&gt;</code>. Enter:</li></ol>
${e("SW1",`
enable
configure terminal
hostname SW1
no ip domain-lookup
enable secret Class123
line console 0
 password Cisco123
 login
 exec-timeout 10 0
 exit
service password-encryption
banner motd # Authorized access only #
interface vlan 1
 ip address 192.168.1.2 255.255.255.0
 no shutdown
 exit
end
copy running-config startup-config`)}
${s(["Command","What it does"],[["enable secret","Hashed privileged-mode password (stronger than enable password)"],["line console 0 / login","Requires the console password"],["exec-timeout 10 0","Logs idle console sessions out after 10 minutes"],["service password-encryption","Obscures plain-text passwords in the config (weak type 7, but better than clear text)"],["interface vlan 1","The switch's own IP, used only for management. Switching works without it."]])}
<ol class="steps"><li>Type <code>exit</code> and log back in. You should be asked for the console password, then the enable secret. Run <code>show running-config</code> and compare how the secret and the console password are stored.</li></ol>
<h3>Part 5: Replace Telnet with SSH</h3>
${e("SW1",`
configure terminal
ip domain-name lab.local
username admin secret Admin123
crypto key generate rsa`)}
<p>When IOS asks <i>How many bits in the modulus [512]:</i>, type <code>1024</code> and press Enter. SSH version 2 needs a key of at least 768 bits. Then continue:</p>
${e("SW1",`
ip ssh version 2
line vty 0 15
 login local
 transport input ssh
 end
copy running-config startup-config`)}
<ol class="steps">
<li>On PC2's Command Prompt run <code>ssh -l admin 192.168.1.2</code> and log in. Run <code>show ip ssh</code> and <code>show users</code> on the switch.</li>
<li>From PC3 try <code>telnet 192.168.1.2</code>. It should be refused because the VTY lines only accept SSH.</li>
<li>Save the file as <b>pt1-first-lan.pkt</b>.</li>
</ol>`,qs:[["Why did the first ping sometimes lose a reply?","PC1 first had to ARP for the destination MAC address. The first ICMP echo waits or is dropped while ARP completes."],["What destination MAC does an ARP request use, and is the reply broadcast too?","FFFF.FFFF.FFFF (broadcast). The ARP reply is unicast back to the requester."],["Does SW1 need an IP address to forward frames between the PCs?","No. It forwards at Layer 2 using its MAC table. The VLAN 1 IP is only for managing the switch (SSH, SNMP)."],["Why is SSH required instead of Telnet? (Obj 4.3)","Telnet sends credentials and commands in clear text. SSH encrypts the session. Disabling Telnet is part of device hardening."]]},{slug:"pt-vlans",title:"VLANs and 802.1Q trunks across two switches",obj:["2.2","4.2","5.3"],time:"60–90 min",goal:"Split users into VLANs, carry them between switches on a trunk, harden the trunk, and see how VLAN mistakes look from the user's side.",body:()=>`
${i(`              Gi0/1  802.1Q trunk (native VLAN 99)  Gi0/1
        SW1 ──────────────────────────────────────── SW2
      Fa0/1     Fa0/11                          Fa0/1     Fa0/11
       PC1       PC2                             PC3       PC4
     VLAN 10   VLAN 20                         VLAN 10   VLAN 20`)}
${s(["Device","Port","VLAN","IPv4 / mask","Gateway"],[["PC1","SW1 Fa0/1","10 SALES","192.168.10.11 /24","192.168.10.1"],["PC2","SW1 Fa0/11","20 HR","192.168.20.11 /24","192.168.20.1"],["PC3","SW2 Fa0/1","10 SALES","192.168.10.12 /24","192.168.10.1"],["PC4","SW2 Fa0/11","20 HR","192.168.20.12 /24","192.168.20.1"],["SW1","VLAN 99 SVI","99 MGMT","192.168.99.2 /24","192.168.99.1"],["SW2","VLAN 99 SVI","99 MGMT","192.168.99.3 /24","192.168.99.1"]])}
${c("The gateways (.1) don't exist yet. The router arrives in the next lab, so cross-VLAN pings are supposed to fail here.")}
<h3>Part 1: Build</h3>
<ol class="steps">
<li>Place two 2960 switches (SW1, SW2) and four PCs. Connect the PCs with <b>straight-through</b> cables as shown.</li>
<li>Connect SW1 <b>Gi0/1</b> to SW2 <b>Gi0/1</b> with a <b>Copper Cross-Over</b> cable (switch to switch = like devices).</li>
<li>Give each PC its static address and gateway from the table.</li>
</ol>
<h3>Part 2: Configure both switches</h3>
<p>Enter this on SW1, then repeat on SW2 with <code>hostname SW2</code> and the SVI address 192.168.99.3.</p>
${e("SW1 and SW2",`
enable
configure terminal
hostname SW1
no ip domain-lookup
vlan 10
 name SALES
vlan 20
 name HR
vlan 99
 name MGMT
vlan 999
 name PARKING
 exit
interface range fa0/1 - 10
 switchport mode access
 switchport access vlan 10
interface range fa0/11 - 20
 switchport mode access
 switchport access vlan 20
interface range fa0/21 - 24
 switchport mode access
 switchport access vlan 999
 shutdown
interface gi0/2
 switchport mode access
 switchport access vlan 999
 shutdown
interface gi0/1
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport nonegotiate
interface vlan 99
 ip address 192.168.99.2 255.255.255.0
 no shutdown
 exit
ip default-gateway 192.168.99.1
end
copy running-config startup-config`)}
${s(["Line","Why"],[["switchport mode access","Hard-codes access mode, so DTP can't be used to form a trunk (switch-spoofing defense)"],["VLAN 999 PARKING + shutdown","Unused ports are disabled and parked in a dead VLAN"],["native vlan 99","Moves untagged trunk traffic off VLAN 1 (double-tagging defense)"],["allowed vlan 10,20,99","Only the VLANs you need cross the trunk"],["nonegotiate","Turns off DTP on the trunk"]])}
<h3>Part 3: Test and verify</h3>
${s(["From","To","Expected","Why"],[["PC1","PC3 192.168.10.12","Success","Same VLAN, carried over the trunk"],["PC2","PC4 192.168.20.12","Success","Same VLAN"],["PC1","PC2 192.168.20.11","Fails","Different VLAN and subnet. Needs a router (next lab)."],["SW1","ping 192.168.99.3","Success","Management VLAN 99 crosses the trunk untagged (native)"]])}
${e("SW1",`
show vlan brief
show interfaces trunk
show interfaces gi0/1 switchport`)}
<ul class="steps">
<li><code>show vlan brief</code>: Fa0/1–10 in VLAN 10, Fa0/11–20 in VLAN 20. Gi0/1 is <i>not</i> listed because trunk ports aren't shown there.</li>
<li><code>show interfaces trunk</code>: Gi0/1 mode on, encapsulation 802.1q, status trunking, native VLAN 99, allowed 10,20,99.</li>
<li><code>show interfaces gi0/1 switchport</code>: "Negotiation of Trunking: Off".</li>
</ul>
<h3>Part 4: See the tag</h3>
<ol class="steps"><li>Switch to Simulation, filter ICMP, and ping PC3 from PC1. Click the envelope while it's on the SW1–SW2 link. In the PDU details, find the <b>802.1Q</b> header with VLAN 10. Then click the envelope on SW2's link to PC3: the tag is gone, because access ports send untagged frames.</li></ol>
<h3>Part 5: Break it on purpose (Obj 5.3)</h3>
${s(["Experiment","Do this","What you should see","Undo"],[["Native VLAN mismatch","SW2: <code>interface gi0/1</code> → <code>switchport trunk native vlan 1</code>","After about a minute both consoles log <code>%CDP-4-NATIVE_VLAN_MISMATCH</code>, and SW1 can no longer ping 192.168.99.3","<code>switchport trunk native vlan 99</code>"],["VLAN pruned from trunk","SW1: <code>interface gi0/1</code> → <code>switchport trunk allowed vlan 10,99</code>","PC2 → PC4 fails, PC1 → PC3 still works. <code>show interfaces trunk</code> shows the allowed list.","<code>switchport trunk allowed vlan 10,20,99</code>"],["Port in the wrong VLAN","SW2: <code>interface fa0/1</code> → <code>switchport access vlan 20</code>",`PC3 can no longer reach PC1, though its IP settings haven't changed. This is a classic "it worked before the desk move" ticket.`,"<code>switchport access vlan 10</code>"]])}
<p>Save as <b>pt2-vlans.pkt</b>. The next lab builds on it.</p>`,qs:[["How many broadcast domains do the VLANs create?","One per VLAN: 1, 10, 20, 99 and 999 are five separate broadcast domains, although only 10, 20 and 99 carry traffic here."],["Why does PC1 → PC2 fail even though both are on the same switch?","They are in different VLANs and subnets. Traffic between VLANs must be routed at Layer 3."],["Which three settings in this lab defend against VLAN hopping? (Obj 4.2/4.3)","Static access mode (no DTP on access ports), nonegotiate on the trunk, and a native VLAN that isn't VLAN 1 and has no hosts in it."],["What does the native VLAN mismatch break, and why?","Untagged frames leave SW1 as VLAN 99 but are placed in VLAN 1 on SW2, so management traffic (and anything else untagged) lands in the wrong VLAN."]]},{slug:"pt-intervlan-dhcp",title:"Inter-VLAN routing (router-on-a-stick) and DHCP",obj:["2.1","2.2","3.4"],time:"60–90 min",goal:"Add a router that routes between the VLANs from the last lab, serve addresses with DHCP, then move DHCP to a server and use a relay.",body:()=>`
${i(`                     R1 (2911)
                     G0/0  subinterfaces .10 / .20 / .99
                      │  802.1Q trunk
          Gi0/2 ──────┘
        SW1 ─────────Gi0/1 trunk──────── SW2
      PC1   PC2                         PC3   PC4
     (V10) (V20)                       (V10) (V20)        Server-DHCP on SW1 Fa0/24 (VLAN 99) in Part 4`)}
${s(["Interface","VLAN","Address"],[["R1 G0/0.10","10","192.168.10.1 /24"],["R1 G0/0.20","20","192.168.20.1 /24"],["R1 G0/0.99","99 (native)","192.168.99.1 /24"],["Server-DHCP (Part 4)","99","192.168.99.10 /24, gateway 192.168.99.1"]])}
<h3>Part 1: Add the router</h3>
<ol class="steps">
<li>Open <b>pt2-vlans.pkt</b> and Save As <b>pt3-intervlan.pkt</b>.</li>
<li>Add a <b>2911</b> router named R1. Connect R1 <b>G0/0</b> to SW1 <b>Gi0/2</b> with a <b>straight-through</b> cable.</li>
<li>Turn SW1 Gi0/2 into a trunk (it was parked in the last lab):</li>
</ol>
${e("SW1",`
configure terminal
interface gi0/2
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport nonegotiate
 no shutdown
 end`)}
<h3>Part 2: Configure router-on-a-stick</h3>
${e("R1",`
enable
configure terminal
hostname R1
no ip domain-lookup
interface g0/0
 no shutdown
interface g0/0.10
 description SALES gateway
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface g0/0.20
 description HR gateway
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
interface g0/0.99
 description MGMT gateway (native)
 encapsulation dot1Q 99 native
 ip address 192.168.99.1 255.255.255.0
 end`)}
${c("The physical G0/0 has no IP; each subinterface is a VLAN gateway. If your Packet Tracer version rejects the <code>native</code> keyword, remove subinterface .99 and put 192.168.99.1 directly on G0/0 instead, because untagged frames arrive on the physical interface.")}
<ol class="steps"><li>Test: PC1 → <code>ping 192.168.20.11</code> (PC2) now works. Run <code>tracert 192.168.20.11</code>: the first hop is 192.168.10.1.</li></ol>
${e("R1",`
show ip interface brief
show ip route`)}
<p>In <code>show ip route</code> you should see a <b>C</b> (connected) and <b>L</b> (local /32) entry for each subinterface.</p>
<h3>Part 3: DHCP on the router</h3>
${e("R1",`
configure terminal
ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp excluded-address 192.168.20.1 192.168.20.10
ip dhcp pool SALES
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.99.10
 domain-name lab.local
ip dhcp pool HR
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 192.168.99.10
 domain-name lab.local
 end`)}
<ol class="steps">
<li>On each PC: <b>Desktop → IP Configuration → DHCP</b>. You should see "DHCP request successful" and an address from .11 upward.</li>
<li>On PC1 run <code>ipconfig /all</code> and find the DHCP server, gateway and DNS server.</li>
<li>Watch DORA: Simulation → filter <b>DHCP</b> only → on PC3 run <code>ipconfig /release</code> then <code>ipconfig /renew</code>. Step through Discover (from 0.0.0.0 to 255.255.255.255), Offer, Request and Ack.</li>
<li>On R1: <code>show ip dhcp binding</code> lists each lease with its MAC address.</li>
</ol>
<h3>Part 4: Move DHCP to a server and add a relay</h3>
<ol class="steps">
<li>Add a <b>Server</b> named Server-DHCP. Connect it to SW1 <b>Fa0/24</b>, then put that port in VLAN 99:</li>
</ol>
${e("SW1",`
configure terminal
interface fa0/24
 switchport access vlan 99
 no shutdown
 end`)}
<ol class="steps">
<li>Server-DHCP → Desktop → IP Configuration: static 192.168.99.10 / 255.255.255.0, gateway 192.168.99.1.</li>
<li>Server-DHCP → <b>Services → DHCP</b>. Turn the service <b>On</b>. Fill in Pool Name <b>SALES</b>, Default Gateway 192.168.10.1, DNS Server 192.168.99.10, Start IP Address 192.168.10.11, Subnet Mask 255.255.255.0, Maximum Number of Users 100 → <b>Add</b>. Add pool <b>HR</b> the same way with 192.168.20.x values.</li>
<li>Remove the router's pools and add the relay on each user subinterface:</li>
</ol>
${e("R1",`
configure terminal
no ip dhcp pool SALES
no ip dhcp pool HR
interface g0/0.10
 ip helper-address 192.168.99.10
interface g0/0.20
 ip helper-address 192.168.99.10
 end`)}
<ol class="steps"><li>Renew every PC (<code>ipconfig /release</code>, <code>ipconfig /renew</code>). <code>ipconfig /all</code> should now show DHCP Server 192.168.99.10. Then remove the helper from g0/0.20 and renew PC2: it falls back to a 169.254.x.x APIPA address. Put the helper back.</li></ol>`,qs:[["Why is <code>ip helper-address</code> needed once the DHCP server moved?","DHCP Discover is a broadcast and routers don't forward broadcasts. The relay turns it into a unicast to the server and tells the server which subnet the client is on (Obj 3.4)."],["What do the excluded addresses protect?","The gateway and any static devices (.1–.10), so DHCP never hands out an address that's already in use."],["What are two drawbacks of router-on-a-stick?","All inter-VLAN traffic shares one physical link (a bottleneck), and that link and router are a single point of failure. A Layer 3 switch with SVIs avoids both."],["PC2 got 169.254.x.x when the helper was missing. What does that address mean?","APIPA: the client sent Discover messages and got no Offer, so it self-assigned a link-local address."]]},{slug:"pt-static-routing",title:"Static and default routing across three routers",obj:["2.1","5.3"],time:"45–60 min",goal:'Route between two LANs through a transit router with static and default routes, and learn the difference between "destination host unreachable" and "request timed out".',body:()=>`
${i(`PC-A ─ SW-A ─ G0/0 R1 G0/1 ──10.0.12.0/30── G0/1 R2 G0/2 ──10.0.23.0/30── G0/1 R3 G0/0 ─ SW-C ─ PC-C
     172.16.1.0/24                                                                  172.16.3.0/24`)}
${s(["Device","Interface","Address"],[["R1","G0/0","172.16.1.1 /24"],["R1","G0/1","10.0.12.1 /30"],["R2","G0/1","10.0.12.2 /30"],["R2","G0/2","10.0.23.1 /30"],["R3","G0/1","10.0.23.2 /30"],["R3","G0/0","172.16.3.1 /24"],["PC-A","NIC","172.16.1.10 /24, gateway 172.16.1.1"],["PC-C","NIC","172.16.3.10 /24, gateway 172.16.3.1"]])}
<h3>Part 1: Build and address</h3>
<ol class="steps">
<li>Place three 2911 routers, two 2960 switches and two PCs. Router ↔ router links use <b>cross-over</b>; router → switch and PC → switch use <b>straight-through</b>.</li>
<li>Configure each router's interfaces. Example for R1 (R2 and R3 follow the table):</li>
</ol>
${e("R1",`
enable
configure terminal
hostname R1
no ip domain-lookup
interface g0/0
 ip address 172.16.1.1 255.255.255.0
 no shutdown
interface g0/1
 ip address 10.0.12.1 255.255.255.252
 no shutdown
 end`)}
<ol class="steps">
<li>Set the PCs' addresses. From PC-A, ping 172.16.1.1 (works) and then PC-C 172.16.3.10. You should get <b>"Reply from 172.16.1.1: Destination host unreachable."</b>: R1 has no route, so it answers with an ICMP unreachable.</li>
<li>On R1, <code>show ip route</code> lists only C and L routes.</li>
</ol>
<h3>Part 2: Add the routes</h3>
${e("R1",`
configure terminal
ip route 0.0.0.0 0.0.0.0 10.0.12.2
end`)}
${e("R2",`
configure terminal
ip route 172.16.1.0 255.255.255.0 10.0.12.1
ip route 172.16.3.0 255.255.255.0 10.0.23.2
end`)}
${e("R3",`
configure terminal
ip route 0.0.0.0 0.0.0.0 10.0.23.1
end`)}
<ol class="steps">
<li>From PC-A: <code>ping 172.16.3.10</code> succeeds. <code>tracert 172.16.3.10</code> shows 172.16.1.1 → 10.0.12.2 → 10.0.23.2 → 172.16.3.10.</li>
<li>On R1, <code>show ip route</code> now shows <code>S* 0.0.0.0/0 [1/0] via 10.0.12.2</code> and "Gateway of last resort is 10.0.12.2". The [1/0] is administrative distance 1, metric 0.</li>
</ol>
<h3>Part 3: Break the return path</h3>
<ol class="steps">
<li>On R2: <code>no ip route 172.16.1.0 255.255.255.0 10.0.12.1</code>.</li>
<li>Ping PC-C from PC-A. This time you get <b>"Request timed out."</b> The echo request reaches PC-C, but the reply dies at R2, which has no route back. Confirm it in Simulation mode with an ICMP filter.</li>
<li>Restore the route. Lesson: routing has to work in both directions, and the error message tells you which side is broken (Obj 5.3).</li>
</ol>
<h3>Part 4: Longest prefix match</h3>
<ol class="steps"><li>On R1 add <code>ip route 172.16.3.0 255.255.255.0 10.0.12.2</code>. <code>show ip route</code> now has both the default and the /24. Traffic to 172.16.3.10 uses the /24 because the most specific route always wins, before AD is considered. Remove it with <code>no ip route 172.16.3.0 255.255.255.0 10.0.12.2</code>.</li></ol>
<p>Save as <b>pt4-static.pkt</b>. The next lab builds on it.</p>`,qs:[["Why can R1 and R3 use a default route but R2 cannot?","R1 and R3 are stub routers with a single way out. R2 sits in the middle and must know which side each LAN is on, so it needs specific routes (or a default to one side plus a specific route to the other)."],['"Destination host unreachable" from 172.16.1.1 vs "Request timed out": what does each tell you?',"Unreachable from a router means that router has no route for the destination. A timeout means no answer came back at all: often a missing return route, a filter, or a host that's down."],["What does [1/0] mean in a static route entry?","Administrative distance 1 (static) and metric 0."]]},{slug:"pt-ospf",title:"OSPF: dynamic routing, failover and administrative distance",obj:["2.1"],time:"60 min",goal:"Replace static routes with single-area OSPF, watch it reroute around a failed link, and see a static route override OSPF because of AD.",body:()=>`
${i(`                 R2 (2.2.2.2)
               ╱            ╲
     10.0.12.0/30          10.0.23.0/30
             ╱                ╲
PC-A ─ R1 (1.1.1.1) ──10.0.13.0/30── R3 (3.3.3.3) ─ PC-C
   172.16.1.0/24                      172.16.3.0/24`)}
<h3>Part 1: Prepare</h3>
<ol class="steps">
<li>Open <b>pt4-static.pkt</b> and Save As <b>pt5-ospf.pkt</b>.</li>
<li>Remove the static routes: R1 <code>no ip route 0.0.0.0 0.0.0.0 10.0.12.2</code>; R2 <code>no ip route 172.16.1.0 255.255.255.0 10.0.12.1</code> and <code>no ip route 172.16.3.0 255.255.255.0 10.0.23.2</code>; R3 <code>no ip route 0.0.0.0 0.0.0.0 10.0.23.1</code>.</li>
<li>Add a <b>cross-over</b> cable from R1 <b>G0/2</b> to R3 <b>G0/2</b>. Address it: R1 G0/2 10.0.13.1/30, R3 G0/2 10.0.13.2/30 (remember <code>no shutdown</code>).</li>
<li>On R2, add a loopback to stand in for a server network: <code>interface loopback0</code> → <code>ip address 2.2.2.2 255.255.255.255</code>.</li>
</ol>
<h3>Part 2: Configure OSPF</h3>
${c("OSPF network statements use a <b>wildcard mask</b>: 255.255.255.255 minus the subnet mask. /24 → 0.0.0.255, /30 → 0.0.0.3, /32 → 0.0.0.0.")}
${e("R1",`
configure terminal
router ospf 1
 router-id 1.1.1.1
 network 172.16.1.0 0.0.0.255 area 0
 network 10.0.12.0 0.0.0.3 area 0
 network 10.0.13.0 0.0.0.3 area 0
 passive-interface g0/0
 end`)}
${e("R2",`
configure terminal
router ospf 1
 router-id 2.2.2.2
 network 10.0.12.0 0.0.0.3 area 0
 network 10.0.23.0 0.0.0.3 area 0
 network 2.2.2.2 0.0.0.0 area 0
 end`)}
${e("R3",`
configure terminal
router ospf 1
 router-id 3.3.3.3
 network 172.16.3.0 0.0.0.255 area 0
 network 10.0.23.0 0.0.0.3 area 0
 network 10.0.13.0 0.0.0.3 area 0
 passive-interface g0/0
 end`)}
<p>Each router logs <code>%OSPF-5-ADJCHG ... from LOADING to FULL</code> as neighbors form. Use Fast Forward Time if it's slow.</p>
${e("Any router",`
show ip ospf neighbor
show ip route ospf
show ip protocols`)}
<ul class="steps">
<li><code>show ip ospf neighbor</code>: two neighbors per router, state <b>FULL</b> (with DR/BDR roles on Ethernet).</li>
<li><code>show ip route</code>: entries such as <code>O 172.16.3.0/24 [110/2] via 10.0.13.2</code>. 110 is OSPF's AD; 2 is the cost.</li>
<li><code>show ip protocols</code>: router ID, networks, and the passive interface.</li>
</ul>
<h3>Part 3: Experiments</h3>
${s(["Experiment","Do this","What you should see"],[["Best path","PC-A: <code>tracert 172.16.3.10</code>","Goes R1 → R3 directly over 10.0.13.0/30 (lowest total cost)."],["Failover","R1: <code>interface g0/2</code> → <code>shutdown</code>, then tracert again","Log shows the neighbor going FULL → DOWN. The trace now goes through R2 (10.0.12.2, 10.0.23.2). Run <code>no shutdown</code> afterwards."],["AD beats metric","R1: <code>ip route 172.16.3.0 255.255.255.0 10.0.12.2</code>","<code>show ip route</code> shows <b>S</b> for 172.16.3.0/24 instead of O: AD 1 beats 110, even though the direct OSPF path is better. Remove it afterwards."],["Change the cost","R1: <code>interface g0/2</code> → <code>ip ospf cost 100</code>","The direct path now costs more than going through R2, so tracert goes via R2 with every link up. Undo with <code>no ip ospf cost</code>."],["Passive interface","R1: <code>show ip protocols</code>","G0/0 is passive: no hellos go to the user LAN, but the LAN is still advertised."]])}`,qs:[["Link state vs distance vector: which is OSPF, and what does that mean?","Link state. Each router floods link information and builds a full map of the area, then runs Dijkstra's SPF algorithm. Distance-vector protocols such as RIP only know what their neighbors tell them."],["Why did the static route replace the OSPF route?","Both were for the same /24, so administrative distance decided: static (1) is trusted over OSPF (110)."],["Why make user-facing interfaces passive?","So the router doesn't send OSPF hellos where no router should be listening. This reduces exposure to rogue routers, and the subnet is still advertised."],["What is area 0?","The backbone area. In multi-area OSPF, every other area must connect to it."]]},{slug:"pt-nat",title:"NAT and PAT to an ISP",obj:["2.1","1.7"],time:"45–60 min",goal:"Give a private LAN Internet access with PAT, publish an inside web server with static NAT, and read a NAT translation table.",body:()=>`
${i(`PC1 ─┐                                203.0.113.0/29
PC2 ─┼─ SW1 ─ G0/0 R1 G0/1 ────────────────────────── G0/1 ISP G0/0 ─ SW2 ─┬─ Web-Out 198.51.100.10
Web-In ┘  192.168.1.0/24                                                   └─ PC-Out  198.51.100.20
192.168.1.100`)}
${s(["Device","Interface","Address"],[["R1","G0/0 (inside)","192.168.1.1 /24"],["R1","G0/1 (outside)","203.0.113.2 /29"],["ISP","G0/1","203.0.113.1 /29"],["ISP","G0/0","198.51.100.1 /24"],["PC1 / PC2","NIC","192.168.1.11 and .12 /24, gateway 192.168.1.1"],["Web-In (server)","NIC","192.168.1.100 /24, gateway 192.168.1.1"],["Web-Out (server)","NIC","198.51.100.10 /24, gateway 198.51.100.1"],["PC-Out","NIC","198.51.100.20 /24, gateway 198.51.100.1"]])}
<h3>Part 1: Build</h3>
<ol class="steps">
<li>Place two 2911 routers (R1, ISP), two switches, two PCs inside, PC-Out, and two servers. R1 G0/1 ↔ ISP G0/1 is a <b>cross-over</b> cable.</li>
<li>Address the interfaces from the table and give R1 a default route: <code>ip route 0.0.0.0 0.0.0.0 203.0.113.1</code>. Give the ISP router <b>no</b> route to 192.168.1.0. ISPs never route RFC 1918 space.</li>
<li>Test from PC1: <code>ping 198.51.100.10</code> → "Request timed out". The packet gets there, but Web-Out's reply has nowhere to go. That's why NAT exists.</li>
</ol>
<h3>Part 2: PAT (NAT overload)</h3>
${e("R1",`
configure terminal
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface g0/1 overload
interface g0/0
 ip nat inside
interface g0/1
 ip nat outside
 end`)}
<ol class="steps">
<li>From PC1 and PC2: <code>ping 198.51.100.10</code>, then open <b>Desktop → Web Browser</b> and go to <code>http://198.51.100.10</code>.</li>
<li>On R1 run <code>show ip nat translations</code> straight away (entries time out).</li>
</ol>
${s(["Column","Example","Meaning"],[["Inside local","192.168.1.11:1025","The private address before translation"],["Inside global","203.0.113.2:1025","The public address (and port) that represents it"],["Outside local / global","198.51.100.10:80","The remote server as seen from inside and outside (the same here)"]])}
<p>Both PCs appear with the same inside global IP but different ports. That's PAT. Also run <code>show ip nat statistics</code>.</p>
<h3>Part 3: Static NAT to publish a server</h3>
<ol class="steps"><li>On Web-In, open <b>Services → HTTP</b> and change the index.html text so you can recognize it.</li></ol>
${e("R1",`
configure terminal
ip nat inside source static 192.168.1.100 203.0.113.5
end
show ip nat translations`)}
<ol class="steps">
<li>A permanent entry appears: inside global 203.0.113.5 ↔ inside local 192.168.1.100.</li>
<li>On PC-Out, browse to <code>http://203.0.113.5</code>. You should see Web-In's page.</li>
</ol>
${c("If the page doesn't load, add a host route on the ISP router so it knows where .5 lives: <code>ip route 203.0.113.5 255.255.255.255 203.0.113.2</code>. A /32 beats the connected /29 by longest prefix match.")}
<ol class="steps"><li>From PC-Out, try <code>ping 192.168.1.11</code>. It fails: private addresses aren't reachable from outside, and PAT only creates entries for connections started from inside.</li></ol>`,qs:[["PAT vs static NAT: when do you use each?","PAT lets many clients share one public IP for outbound traffic. Static NAT maps one public IP to one inside host permanently, so outside users can reach it, for example a published web server."],["Why does an ISP drop traffic to 192.168.x.x?","RFC 1918 addresses aren't globally unique or routable, so they can't appear on the public Internet."],['What is the "inside global" address in this lab?',"203.0.113.2 for PAT (R1's outside interface) and 203.0.113.5 for the static entry."],["What does NAT break, and how is it worked around for IPsec?","End-to-end addressing. Some protocols embed IP addresses or can't tolerate port changes. IPsec uses NAT Traversal (UDP 4500) to get through NAT."]]},{slug:"pt-acl",title:"ACLs and a screened subnet",obj:["4.3","4.1","5.3"],time:"60–75 min",goal:"Build a three-zone network (inside, guest, screened subnet) and enforce a written policy with extended ACLs. Then prove the rule order matters.",body:()=>`
${i(`                 G0/0 192.168.10.1 ── SW-IN ──── PC-Staff 192.168.10.10, Server-HR 192.168.10.100
  R1 (2911) ──── G0/1 192.168.50.1 ── SW-GUEST ─ PC-Guest 192.168.50.10
                 G0/2 172.16.100.1 ── SW-SCR ─── Server-Web 172.16.100.10   (screened subnet)`)}
<h3>Policy to enforce</h3>
<ol class="steps">
<li>Guests may reach the web server in the screened subnet on HTTP/HTTPS only. They may not reach the inside LAN at all.</li>
<li>Staff may reach everything.</li>
<li>The screened-subnet server may only <i>answer</i> connections. It may not start connections into the inside LAN, so a compromised server can't move inward.</li>
</ol>
<h3>Part 1: Build and confirm everything is open</h3>
<ol class="steps">
<li>Place one 2911, three switches, two PCs and two servers. Configure R1's three interfaces (with <code>no shutdown</code>) and give every host its gateway (.1 in its subnet).</li>
<li>HTTP is on by default on PT servers. Before adding any ACLs, confirm PC-Guest can ping and browse both servers. Write down what works.</li>
</ol>
<h3>Part 2: Write and apply the ACLs</h3>
${e("R1",`
configure terminal
ip access-list extended GUEST-IN
 remark Guests: web server only, HTTP/HTTPS
 permit tcp 192.168.50.0 0.0.0.255 host 172.16.100.10 eq 80
 permit tcp 192.168.50.0 0.0.0.255 host 172.16.100.10 eq 443
 deny ip 192.168.50.0 0.0.0.255 192.168.10.0 0.0.0.255
 deny ip any any
ip access-list extended SCREENED-IN
 remark Server may only answer, never initiate inward
 permit tcp host 172.16.100.10 eq 80 192.168.0.0 0.0.255.255 established
 permit tcp host 172.16.100.10 eq 443 192.168.0.0 0.0.255.255 established
 permit icmp 172.16.100.0 0.0.0.255 any echo-reply
 deny ip any any
interface g0/1
 ip access-group GUEST-IN in
interface g0/2
 ip access-group SCREENED-IN in
 end`)}
${c("Extended ACLs go as close to the <b>source</b> as possible, inbound on the interface the traffic enters. The final <code>deny ip any any</code> repeats the implicit deny so it shows match counters. <code>established</code> matches TCP segments with ACK or RST set, meaning replies. If your PT version rejects it, drop those two lines' <code>established</code> keyword and note why a stateful firewall is the better tool here.")}
<h3>Part 3: Test against the policy</h3>
${s(["From","Test","Expected"],[["PC-Guest","Browser → http://172.16.100.10","Allowed"],["PC-Guest","ping 172.16.100.10","Blocked (ICMP isn't in GUEST-IN)"],["PC-Guest","ping 192.168.10.100 / browse it","Blocked"],["PC-Staff","ping and browse 172.16.100.10","Allowed (replies match SCREENED-IN)"],["PC-Staff","Browse http://192.168.10.100","Allowed (same LAN, no ACL in the path)"],["Server-Web","Command Prompt: ping 192.168.10.10","Blocked (the server can't initiate)"]])}
<ol class="steps"><li>Run <code>show access-lists</code> on R1. Each line shows "(n match(es))". Make sure the counters match your tests.</li></ol>
<h3>Part 4: Prove the order matters</h3>
${e("R1",`
configure terminal
ip access-list extended GUEST-IN
 5 permit ip any any
 end
show access-lists GUEST-IN`)}
<ol class="steps"><li>Line 5 now sits above everything, so PC-Guest can reach Server-HR again. Every later rule is <b>shadowed</b>. Remove it with <code>ip access-list extended GUEST-IN</code> → <code>no 5</code> and retest.</li></ol>`,qs:[["What happens to traffic that matches no line in an ACL?","The implicit deny at the end drops it. That's why guest pings fail even though no line mentions ICMP."],["Why does SCREENED-IN need the echo-reply and established lines?","Router ACLs are stateless. Without them, replies to staff and guest requests would be dropped on the way back in. A stateful firewall would allow return traffic automatically."],["Why put public servers in a screened subnet instead of the inside LAN? (Obj 4.3)","If a public-facing server is compromised, the attacker still can't reach internal systems directly, because the firewall and ACLs sit between the zones."],["Where should extended vs standard ACLs be placed?","Extended ACLs close to the source (they can match destination and port precisely). Standard ACLs close to the destination (they only match source)."]]},{slug:"pt-services",title:"Network services: DNS, HTTP, NTP, syslog and SNMP",obj:["3.4","3.2","5.3"],time:"60 min",goal:'Run the services every network depends on, point a router at them, and recreate the classic "works by IP, fails by name" ticket.',body:()=>`
${i(`PC1, PC2 (DHCP) ─┐
Server-Core ─────┼─ SW1 ─ G0/0 R1 (192.168.1.1)
192.168.1.10     │
Server-Web ──────┘
192.168.1.20`)}
<h3>Part 1: Build and DHCP</h3>
<ol class="steps"><li>Place R1 (2911), SW1, two PCs and two servers. Set the servers' static addresses (gateway 192.168.1.1). Configure R1:</li></ol>
${e("R1",`
enable
configure terminal
hostname R1
no ip domain-lookup
interface g0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
interface loopback1
 ip address 10.255.255.1 255.255.255.255
 exit
ip dhcp excluded-address 192.168.1.1 192.168.1.30
ip dhcp pool LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 192.168.1.10
 domain-name lab.local
 end`)}
<ol class="steps"><li>Set PC1 and PC2 to DHCP. Check that the DNS server shows as 192.168.1.10.</li></ol>
<h3>Part 2: Web and DNS</h3>
<ol class="steps">
<li>Server-Web → <b>Services → HTTP</b>: make sure HTTP is On, then edit index.html and change the heading to "Lab intranet".</li>
<li>Server-Core → <b>Services → DNS</b>: set DNS Service to <b>On</b>. Add Name <code>www.lab.local</code>, Type <b>A Record</b>, Address 192.168.1.20 → <b>Add</b>. Add Name <code>intranet.lab.local</code>, Type <b>CNAME</b>, Host Name <code>www.lab.local</code> → <b>Add</b>.</li>
<li>On PC1: <code>nslookup www.lab.local</code>, <code>nslookup intranet.lab.local</code> and <code>ping www.lab.local</code>. Then open the Web Browser at <code>http://intranet.lab.local</code>.</li>
</ol>
<h3>Part 3: NTP</h3>
<ol class="steps"><li>Server-Core → <b>Services → NTP</b>: make sure it's On and set the date and time.</li></ol>
${e("R1",`
configure terminal
ntp server 192.168.1.10
end
show ntp status
show clock`)}
<p>After a short while (Fast Forward helps), <code>show ntp status</code> reports "Clock is synchronized" at a stratum one higher than the server's.</p>
<h3>Part 4: Syslog</h3>
<ol class="steps"><li>Server-Core → <b>Services → SYSLOG</b>: turn it On.</li></ol>
${e("R1",`
configure terminal
service timestamps log datetime msec
logging host 192.168.1.10
logging trap debugging
interface loopback1
 shutdown
 no shutdown
 end`)}
${c("Older Packet Tracer images use <code>logging 192.168.1.10</code> instead of <code>logging host</code>.")}
<ol class="steps"><li>Check Server-Core's SYSLOG list. You'll see messages such as <code>%LINK-5-CHANGED</code> and <code>%LINEPROTO-5-UPDOWN</code>. The number after the facility is the severity: 5 = Notice. 0 is Emergency and 7 is Debug.</li></ol>
<h3>Part 5: SNMP</h3>
${e("R1",`
configure terminal
snmp-server community LabRO ro
end`)}
<ol class="steps">
<li>PC1 → <b>Desktop → MIB Browser</b> → <b>Advanced</b>: Address 192.168.1.1, Read Community <b>LabRO</b>, SNMP Version v2 → OK.</li>
<li>Expand the MIB tree to <b>system → sysName</b>, select Operation <b>Get</b> and click <b>Go</b>. The result shows R1.</li>
<li>Change the community to <b>wrong</b> and try again: no response. Community strings travel in clear text in v1/v2c, which is why SNMPv3 is the secure choice.</li>
</ol>
<h3>Part 6: Recreate the classic DNS ticket</h3>
<ol class="steps"><li>Set PC2 to static 192.168.1.40 / 255.255.255.0, gateway 192.168.1.1, DNS <b>192.168.1.99</b> (nothing lives there). Then <code>ping 192.168.1.20</code> works, but <code>ping www.lab.local</code> fails. That's "works by IP, fails by name", so it's DNS (Obj 5.3). Fix the DNS server setting.</li></ol>`,qs:[["Which DNS record did you use for the alias, and why not a second A record?","A CNAME, which points one name at another canonical name. If the server's IP changes, only the A record needs updating."],["Why does NTP matter for syslog and security?","Logs from different devices can only be correlated if their timestamps agree. Kerberos and certificates also depend on accurate time."],["Which ports did these services use?","DNS 53, HTTP 80, NTP UDP 123, syslog UDP 514, SNMP UDP 161 (traps 162), DHCP UDP 67/68."],['What does "logging trap debugging" control?',"The lowest severity sent to the syslog server. Debugging (7) sends everything from 0 to 7."]]},{slug:"pt-switch-security",title:"Switch security: DHCP snooping, port security and BPDU Guard",obj:["4.3","4.2","5.2"],time:"60–75 min",goal:"Attack your own LAN with a rogue DHCP server, a MAC change and a rogue switch, then stop each one with the matching switch feature.",body:()=>`
${i(`                R1 G0/0 192.168.10.1 (legit DHCP)
                      │
                    Gi0/1  (trusted uplink)
PC1 ─Fa0/1─┐
PC2 ─Fa0/2─┤  SW1 (2960), all user ports in VLAN 10
           ├─Fa0/3─ SW-Rogue (added in Part 4)
           └─Fa0/5─ Rogue-DHCP server 192.168.10.250
Spare laptop "Attacker" (Part 3)`)}
<h3>Part 1: Build the network</h3>
${e("R1",`
enable
configure terminal
hostname R1
interface g0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit
ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp pool LAN
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.10.1
 end`)}
${e("SW1",`
enable
configure terminal
hostname SW1
no ip domain-lookup
vlan 10
 name USERS
 exit
interface range fa0/1 - 24
 switchport mode access
 switchport access vlan 10
interface gi0/1
 switchport mode access
 switchport access vlan 10
 end`)}
<ol class="steps"><li>Connect R1 G0/0 to SW1 Gi0/1, PC1 to Fa0/1 and PC2 to Fa0/2 (straight-through). Set both PCs to DHCP and confirm their gateway is 192.168.10.1.</li></ol>
<h3>Part 2: Rogue DHCP, then DHCP snooping</h3>
<ol class="steps">
<li>Add a server named Rogue-DHCP on Fa0/5 with static IP 192.168.10.250. In <b>Services → DHCP</b>, turn it On and set the pool's Default Gateway <b>192.168.10.250</b>, DNS 192.168.10.250, Start IP 192.168.10.200 → Save.</li>
<li>On the PCs, release and renew several times. Some leases will come from the rogue, with its own IP as the gateway. That puts the attacker on-path for all their traffic (Obj 4.2).</li>
</ol>
${e("SW1",`
configure terminal
ip dhcp snooping
ip dhcp snooping vlan 10
no ip dhcp snooping information option
interface gi0/1
 ip dhcp snooping trust
interface range fa0/1 - 24
 ip dhcp snooping limit rate 10
 end
show ip dhcp snooping`)}
<ol class="steps"><li>Renew the PCs again. Every lease now comes from R1, because DHCP server messages arriving on untrusted ports are dropped. Check <code>show ip dhcp snooping binding</code>; Dynamic ARP Inspection builds on this table.</li></ol>
${c("<code>no ip dhcp snooping information option</code> stops the switch inserting option 82, which a Cisco IOS DHCP server would otherwise reject. If your PT version doesn't accept the command, leave it out.")}
<h3>Part 3: Port security</h3>
${e("SW1",`
configure terminal
interface range fa0/1 - 2
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation shutdown
 end`)}
<ol class="steps">
<li>From each PC, ping 192.168.10.1 so the switch learns their MACs. Check <code>show port-security interface fa0/1</code> and <code>show running-config</code>: the MAC now appears as a sticky entry.</li>
<li>Delete PC1's cable. Add a laptop named Attacker (static 192.168.10.66 /24), connect it to <b>Fa0/1</b>, and ping 192.168.10.1.</li>
<li>Fa0/1 goes red. <code>show interfaces status</code> shows <b>err-disabled</b>, and <code>show port-security interface fa0/1</code> shows Secure-shutdown with a violation count of 1.</li>
<li>Recover: reconnect PC1, then on SW1 <code>interface fa0/1</code> → <code>shutdown</code> → <code>no shutdown</code>.</li>
</ol>
<h3>Part 4: PortFast and BPDU Guard</h3>
${e("SW1",`
configure terminal
interface range fa0/1 - 24
 spanning-tree portfast
 spanning-tree bpduguard enable
 end`)}
<ol class="steps"><li>Add a second 2960 named SW-Rogue and connect it to SW1 <b>Fa0/3</b> with a cross-over cable. SW1 logs a BPDU Guard message and Fa0/3 goes err-disabled straight away. This stops a user from adding a switch, creating a loop or trying to become root bridge.</li></ol>
<h3>Part 5: Park unused ports</h3>
${e("SW1",`
configure terminal
vlan 999
 name PARKING
interface range fa0/6 - 24
 switchport access vlan 999
 shutdown
 end
copy running-config startup-config`)}`,qs:[["Match each attack to the feature that stopped it.","Rogue DHCP → DHCP snooping. MAC flooding or an unauthorized device → port security. Rogue switch or STP manipulation → BPDU Guard. ARP poisoning → Dynamic ARP Inspection (which uses the snooping table)."],["Why is only Gi0/1 trusted for DHCP snooping?","It's the only port facing a legitimate DHCP server. Server messages (Offer, Ack) on any other port are dropped."],["How do you recover an err-disabled port?","Remove the cause, then <code>shutdown</code> and <code>no shutdown</code> on the interface (or configure errdisable recovery)."],["Why is PortFast risky on its own?","PortFast skips listening/learning. If a switch is plugged into that port, a loop can form before STP reacts. BPDU Guard closes that gap."]]},{slug:"pt-wireless",title:"Wireless LAN with WPA2, and an 802.1X stretch goal",obj:["2.3","4.3","5.4"],time:"45–75 min",goal:"Set up a secured SOHO wireless network, connect wireless clients, test weak controls like MAC filtering, then optionally move to WPA2-Enterprise with RADIUS.",body:()=>`
${i(`               HomeRouter (WRT300N) 192.168.0.1
                 │ Ethernet 1          ) ) )  SSID LabNet, channel 6, WPA2-PSK
             PC-Wired             Laptop-1 (WPC300N)   Tablet
                 │ Ethernet 2 (stretch)
             Server-AAA 192.168.0.10`)}
<h3>Part 1: Configure the wireless router</h3>
<ol class="steps">
<li>Place a <b>Wireless Devices → WRT300N</b>, a PC, a Laptop and a Tablet. Connect PC-Wired to the router's <b>Ethernet 1</b> with a straight-through cable. Set the PC to DHCP: it should get a 192.168.0.x address.</li>
<li>Click the router → <b>GUI</b> tab → <b>Setup → Basic Setup</b>: Router IP 192.168.0.1 / 255.255.255.0, DHCP Server Enabled, Start IP 192.168.0.100, Maximum Users 50. Click <b>Save Settings</b> at the bottom of each page.</li>
<li><b>Wireless → Basic Wireless Settings</b>: Network Mode Mixed, SSID <b>LabNet</b>, Standard Channel <b>6</b>. Save.</li>
<li><b>Wireless → Wireless Security</b>: Security Mode <b>WPA2 Personal</b>, Encryption <b>AES</b>, Passphrase <code>N3tPlus-Lab!</code>. Save.</li>
<li><b>Administration → Management</b>: change the router password from the default admin. Save. (Changing default credentials is hardening, Obj 4.3.)</li>
</ol>
<h3>Part 2: Connect wireless clients</h3>
<ol class="steps">
<li>Laptop → <b>Physical</b> tab: click the power button to turn it off. Drag the installed <b>PT-LAPTOP-NM-1CFE</b> module out to the module list, drag <b>WPC300N</b> into the empty slot, and power it back on.</li>
<li>Laptop → <b>Desktop → PC Wireless → Connect</b> → Refresh → select LabNet → Connect. Choose WPA2-Personal, enter the passphrase and click Connect. A dashed line to the router means it has associated. Then set IP Configuration to DHCP.</li>
<li>Tablet → <b>Config → Wireless0</b>: SSID LabNet, Authentication <b>WPA2-PSK</b>, enter the passphrase, Encryption AES. Set IP Configuration to DHCP.</li>
<li>Ping between the laptop, the tablet and PC-Wired.</li>
</ol>
<h3>Part 3: Experiments</h3>
${s(["Experiment","What to observe"],[["Enter a wrong passphrase on the tablet","No association line, no IP address"],[`Wireless → Wireless MAC Filter: Enabled, "Prevent PCs listed below", add the tablet's MAC (from Config → Wireless0)`,"The tablet drops off. MAC filtering is weak because MACs are visible over the air and easy to spoof. Disable it afterwards."],["Change the channel to 3, then back to 6","In 2.4 GHz only channels 1, 6 and 11 don't overlap. Channel 3 would interfere with neighbors on 1 and 6."],["Move the laptop far away in Physical view (if your PT version models range)","The signal weakens with distance (attenuation). Site surveys exist to find these dead spots."]])}
<h3>Stretch: WPA2-Enterprise with RADIUS (802.1X)</h3>
<ol class="steps">
<li>Add a server named Server-AAA on router <b>Ethernet 2</b>, static 192.168.0.10 / 24, gateway 192.168.0.1.</li>
<li>Server-AAA → <b>Services → AAA</b>: Service On. Under Network Configuration add Client Name <b>HomeRouter</b>, Client IP 192.168.0.1, Secret <code>RadiusKey1</code>, Server Type <b>Radius</b>. Under User Setup add user <b>alice</b> with password <code>Wifi-Pass1</code>.</li>
<li>Router GUI → Wireless Security: <b>WPA2 Enterprise</b>, RADIUS Server 192.168.0.10, Port 1812, Shared Secret RadiusKey1, Encryption AES. Save.</li>
<li>Laptop → <b>Config → Wireless0</b>: Authentication <b>WPA2</b> (enterprise), User ID alice, Password Wifi-Pass1, Encryption AES. It reconnects with its own credentials instead of a shared passphrase.</li>
</ol>
${c("Field names differ slightly between Packet Tracer versions. Look for the same settings under the router's GUI and the client's Wireless0 page.")}`,qs:[["WPA2-Personal vs WPA2-Enterprise: what's the practical difference?","Personal uses one shared passphrase for everyone. Enterprise uses 802.1X with per-user credentials checked by RADIUS, so you can revoke one person without changing everyone's key."],["Name the 802.1X roles in the stretch goal.","Laptop = supplicant, wireless router = authenticator, Server-AAA = authentication server (RADIUS)."],["What would WPA3 change?","SAE replaces the PSK handshake, which resists offline dictionary attacks. WPA3 is required on 6 GHz."],["Why is hiding the SSID not real security?","The SSID still appears in probe and association frames, so any wireless analyzer can see it."]]},{slug:"pt-ipv6",title:"IPv6 dual stack with SLAAC",obj:["1.8","3.4"],time:"45–60 min",goal:"Run IPv4 and IPv6 side by side, let hosts configure themselves with SLAAC, work out an EUI-64 address by hand, and watch NDP replace ARP.",body:()=>`
${i(`PC1 ─ SW1 ─ G0/0  R1  G0/1 ─ SW2 ─ PC2
 2001:db8:acad:10::/64      2001:db8:acad:20::/64
 192.168.10.0/24            192.168.20.0/24`)}
<h3>Part 1: Configure the router</h3>
${e("R1",`
enable
configure terminal
hostname R1
ipv6 unicast-routing
interface g0/0
 ip address 192.168.10.1 255.255.255.0
 ipv6 address 2001:db8:acad:10::1/64
 ipv6 address fe80::1 link-local
 no shutdown
interface g0/1
 ip address 192.168.20.1 255.255.255.0
 ipv6 address 2001:db8:acad:20::1/64
 ipv6 address fe80::1 link-local
 no shutdown
 end`)}
${c("<code>ipv6 unicast-routing</code> makes the router forward IPv6 and send Router Advertisements. Without it, SLAAC clients get no prefix. The same easy-to-read link-local address fe80::1 is used on both interfaces, which is fine because link-local addresses only matter on their own link.")}
<h3>Part 2: Configure the hosts</h3>
<ol class="steps">
<li>PC1: IPv4 static 192.168.10.10 / 24, gateway 192.168.10.1. Under <b>IPv6 Configuration</b> choose <b>Automatic</b>. You should see "IPv6 request successful", a 2001:db8:acad:10:… address and gateway fe80::1.</li>
<li>Do the same for PC2 on the 20 networks.</li>
<li>On PC1's Command Prompt run <code>ipconfig</code>. You should see a link-local fe80:: address and a global unicast address.</li>
</ol>
<h3>Part 3: Work out EUI-64 by hand</h3>
<ol class="steps">
<li>Read PC1's MAC on <b>Config → FastEthernet0</b>, for example <code>0001.6345.A2B1</code>.</li>
<li>Split it in half: 000163 | 45A2B1. Insert FFFE: 000163FFFE45A2B1.</li>
<li>Flip the 7th bit of the first byte: 00 → 02. The interface ID is <code>0201:63FF:FE45:A2B1</code>.</li>
<li>Add the prefix: 2001:db8:acad:10:201:63ff:fe45:a2b1. Compare with <code>ipconfig</code>. Packet Tracer uses EUI-64; real Windows uses random interface IDs for privacy.</li>
</ol>
<h3>Part 4: Verify and watch NDP</h3>
${e("R1",`
show ipv6 interface brief
show ipv6 route
show ipv6 neighbors`)}
<ol class="steps">
<li>From PC1: <code>ping</code> PC2's IPv6 address, then <code>tracert</code> it.</li>
<li><code>show ipv6 neighbors</code> on R1 lists the PCs. This is NDP's neighbor cache, the IPv6 replacement for the ARP table.</li>
<li>Simulation mode, filter <b>ICMPv6</b>. Switch PC2's IPv6 setting to Static and back to Automatic, and watch the <b>Router Solicitation</b> and <b>Router Advertisement</b>. Ping again to see <b>Neighbor Solicitation/Advertisement</b> take the place of ARP.</li>
<li>Also ping between the PCs over IPv4: both stacks run side by side (dual stack).</li>
</ol>
<h3>Stretch: Stateless DHCPv6 for DNS settings</h3>
${e("R1",`
configure terminal
ipv6 dhcp pool LAB-STATELESS
 dns-server 2001:db8:acad:10::53
 domain-name lab.local
interface g0/0
 ipv6 nd other-config-flag
 ipv6 dhcp server LAB-STATELESS
 end`)}
<p>Set PC1 to Automatic again. It still builds its own address (SLAAC) but now also learns the DNS server from DHCPv6.</p>`,qs:[["What does SLAAC need from the router?","A Router Advertisement carrying the /64 prefix and the default gateway (the router's link-local address)."],["SLAAC vs stateless DHCPv6 vs stateful DHCPv6?","SLAAC: the host builds its own address from the RA. Stateless DHCPv6: SLAAC address plus options such as DNS from DHCPv6. Stateful DHCPv6: the server assigns the address too."],["Why is the gateway a link-local address?","Routers advertise themselves from their link-local address, which is always present and never changes when global prefixes are renumbered."],["Which IPv4 feature has no IPv6 equivalent?","Broadcast. ARP's broadcast is replaced by NDP's solicited-node multicast."]]},{slug:"pt-break-fix",title:"Break and fix: troubleshooting the VLAN network",obj:["5.1","5.3","5.5"],time:"60–90 min",goal:"Practice the troubleshooting methodology on your own network. Read each symptom, predict the cause and the command that proves it, then recreate the fault to check yourself.",body:()=>`
<ol class="steps">
<li>Open <b>pt3-intervlan.pkt</b> (with router DHCP from Part 3, or the relay from Part 4) and Save As <b>pt-breakfix.pkt</b>.</li>
<li>For each ticket: read only the symptom, then write down (1) your theory, (2) the command that would prove it, (3) the fix. Open the answer only after that.</li>
<li>Then apply the fault yourself, confirm the symptom matches, use your command to prove it, fix it, and verify. That's methodology steps 2 → 6.</li>
<li>Even better: ask a coworker to apply a fault without telling you which one.</li>
</ol>
${[["Ticket 1","Sales users (VLAN 10) get 169.254.x.x addresses after renewing. HR users are fine.","R1 subinterface G0/0.10 is administratively down, so there's no gateway and no DHCP for VLAN 10.","R1: <code>interface g0/0.10</code> → <code>shutdown</code>",'<code>show ip interface brief</code> on R1 shows G0/0.10 "administratively down"',"<code>no shutdown</code>"],["Ticket 2","After a desk move, PC1 in Sales receives a 192.168.20.x address and can't reach the Sales file share.","The switch port is in the wrong VLAN (20 instead of 10).","SW1: <code>interface fa0/1</code> → <code>switchport access vlan 20</code>","<code>show vlan brief</code> on SW1 lists Fa0/1 under VLAN 20","<code>switchport access vlan 10</code>, then renew"],["Ticket 3","Everyone on SW2 can only reach people on SW2. Users on SW1 are fine.","The trunk to SW2 no longer carries VLANs 10 and 20.","SW1: <code>interface gi0/1</code> → <code>switchport trunk allowed vlan 99</code>","<code>show interfaces trunk</code> shows only VLAN 99 allowed on Gi0/1","<code>switchport trunk allowed vlan 10,20,99</code>"],["Ticket 4","HR users who renewed today can ping each other but nothing in Sales. HR users who didn't renew are fine.","The DHCP pool hands out the wrong default gateway.","R1: <code>ip dhcp pool HR</code> → <code>default-router 192.168.20.254</code> (or the same field on Server-DHCP)","On an affected PC: <code>ipconfig /all</code> shows gateway .254; <code>show running-config</code> shows the pool","Set default-router back to 192.168.20.1 and renew"],["Ticket 5","SW1 can no longer ping SW2's management address, and both consoles log CDP messages every minute.","Native VLAN mismatch on the trunk.","SW2: <code>interface gi0/1</code> → <code>switchport trunk native vlan 1</code>","The <code>%CDP-4-NATIVE_VLAN_MISMATCH</code> log, and <code>show interfaces trunk</code> on both switches","<code>switchport trunk native vlan 99</code>"],["Ticket 6","Nobody can reach any other VLAN, but users in the same VLAN can still talk, even across switches.","The router link is no longer a trunk.","SW1: <code>interface gi0/2</code> → <code>switchport mode access</code>","<code>show interfaces trunk</code> on SW1 no longer lists Gi0/2","<code>switchport mode trunk</code>"],["Ticket 7",'New Sales laptops get APIPA addresses; existing laptops work. It started after someone "cleaned up" the DHCP config.',"Scope exhaustion: almost the whole range is excluded.","R1: <code>ip dhcp excluded-address 192.168.10.11 192.168.10.254</code>","<code>show ip dhcp pool</code> and <code>show running-config</code>; existing bindings stay in <code>show ip dhcp binding</code>","<code>no ip dhcp excluded-address 192.168.10.11 192.168.10.254</code>"],["Ticket 8","HR users get no address at all after the DHCP server was moved to VLAN 99. Sales still works.","The relay is missing on the HR subinterface.","R1: <code>interface g0/0.20</code> → <code>no ip helper-address 192.168.99.10</code>","<code>show running-config</code> for g0/0.20; Simulation with a DHCP filter shows the Discover stopping at R1","<code>ip helper-address 192.168.99.10</code>"]].map(t=>`<div class="ticketbox"><p class="tk">${t[0]}</p><p><b>Symptom:</b> ${t[1]}</p><details><summary>Show the cause, how to recreate it, and the fix</summary><div class="tkans"><p><b>Cause:</b> ${t[2]}</p><p><b>Recreate:</b> ${t[3]}</p><p><b>Evidence:</b> ${t[4]}</p><p><b>Fix:</b> ${t[5]}</p></div></details></div>`).join("")}`,qs:[['For ticket 1, which methodology step is "check show ip interface brief"?',"Step 3, test the theory. Asking whether only VLAN 10 is affected, and what changed, is step 1."],["Which single command answered the most tickets?","show interfaces trunk and show vlan brief together cover most Layer 2 faults. ipconfig /all on the client is the fastest first look."],["What should you do after every fix?","Verify full functionality: renew the clients and test the original complaint plus a cross-VLAN ping. Then document the cause and fix in the ticket."]]},{slug:"pt-capstone",title:"Capstone: build a small office from requirements",obj:["1.7","2.1","2.2","3.4","4.3"],time:"3–5 hours",goal:"No step-by-step commands this time. Plan the addressing, build the network, and prove it meets every requirement. This is the kind of work you'll be handed on the job.",body:()=>`
<h3>The brief</h3>
<p>A two-floor office needs its network. You have the block <b>10.20.0.0/22</b> for internal use and an ISP link on <b>203.0.113.0/30</b> (ISP router is .1, yours is .2). The ISP router also connects to a web server at 198.51.100.10/24 that stands in for "the Internet".</p>
${s(["Segment","VLAN","Devices (not counting the gateway)"],[["Staff","10","100"],["Guest","20","40"],["Servers","30","10"],["Management","99","4"]])}
<h3>Requirements</h3>
<ol class="steps">
<li><b>Addressing:</b> allocate subnets from 10.20.0.0/22 with VLSM, largest first, using the smallest prefix that fits each segment plus its gateway. Write an addressing table before you build.</li>
<li><b>Switching:</b> one access switch per floor (SW-F1, SW-F2) with Staff and Guest ports on both floors, trunked to the router. Native VLAN 99 on all trunks. Unused ports shut and parked in VLAN 999.</li>
<li><b>Routing:</b> router-on-a-stick on R1 for all four VLANs, and a default route to the ISP.</li>
<li><b>Services:</b> a server in VLAN 30 runs DNS (A record for <code>intranet.office.local</code> pointing to a web server, also in VLAN 30) and HTTP. Staff and Guest get addresses by DHCP from R1, with the first 10 addresses of each excluded.</li>
<li><b>Internet:</b> PAT on R1 for Staff and Guest. Staff can browse http://198.51.100.10.</li>
<li><b>Security:</b> Guest can reach the Internet only: no 10.20.0.0/22 destinations except the DNS server on UDP 53. Switches and the router are managed by SSH only, from the Management VLAN. Port security (maximum 2, sticky) on staff access ports, BPDU Guard on all access ports.</li>
<li><b>Documentation:</b> addressing table, VLAN table, and a short note on how you tested each requirement.</li>
</ol>
<details class="reveal"><summary>Check your addressing plan</summary>
${s(["Segment","Subnet","Gateway","Usable hosts"],[["Staff (VLAN 10)","10.20.0.0/25","10.20.0.1","126"],["Guest (VLAN 20)","10.20.0.128/26","10.20.0.129","62"],["Servers (VLAN 30)","10.20.0.192/28","10.20.0.193","14"],["Management (VLAN 99)","10.20.0.208/29","10.20.0.209","6"]])}
<p class="small">Management needs 4 devices + 1 gateway = 5 addresses, which fits a /29 (6 usable). Everything from 10.20.0.216 to 10.20.3.255 is left for growth.</p></details>
<h3>Acceptance checklist</h3>
<ul class="checklist">
${["A Staff PC on each floor gets a DHCP address in 10.20.0.0/25 with gateway 10.20.0.1","A Guest PC gets an address in 10.20.0.128/26","Staff PC opens http://intranet.office.local by name","Staff PC opens http://198.51.100.10 and R1 shows PAT translations","Guest PC opens http://198.51.100.10","Guest PC cannot ping or browse anything in 10.20.0.0/22 except DNS lookups","show interfaces trunk shows native VLAN 99 on every trunk","Telnet to any device fails; SSH from the Management VLAN works","Plugging a switch into an access port err-disables it","Unused ports show as disabled in show interfaces status","All devices saved with copy running-config startup-config"].map((t,n)=>`<li><label><input type="checkbox" data-cap="${n}"> ${t}</label></li>`).join("")}
</ul>`,qs:[["Which earlier labs does each requirement come from?","Addressing → subnetting lab. Switching → VLANs lab. Routing and DHCP → inter-VLAN lab. Internet → NAT lab. Guest restrictions → ACL lab. SSH → first LAN lab. Port security and BPDU Guard → switch security lab."],["Where should the Guest ACL be applied?","Inbound on R1's Guest subinterface (G0/0.20), as close to the source as possible."]]}];var v=document.getElementById("main"),S={};S.pt=function(t){let n=d.get("pt",{});t.innerHTML=`${f("Packet Tracer","Packet Tracer labs","Twelve labs in order, each with a topology, an addressing table, every command, how to verify, experiments that break things on purpose, and questions to check yourself. They cover Network+ hands-on skills and lead straight into the CCNA.")}
  <ul class="list">${h.map((o,r)=>`<li><a href="#${o.slug}">${r+1}. ${o.title}<span class="desc">${o.goal}</span></a><span class="meta">${n[o.slug]?"done":o.time}</span></li>`).join("")}</ul>
  <div class="lab">${w}</div>`};function j(t){return function(n){let o=h.findIndex(a=>a.slug===t),r=h[o],m=d.get("pt",{}),u=h[o-1],p=h[o+1];n.innerHTML=`<article class="lab"><div class="labhead"><p class="eyebrow">Packet Tracer lab ${o+1} of ${h.length}</p><h1>${r.title}</h1>
  <p class="meta">${r.obj.map(a=>g(a)).join("  ·  ")}  ·  ${r.time}</p><p class="lede">${r.goal}</p></div>
  ${r.body()}
  <h2>Check your understanding</h2><div class="qa">${r.qs.map(([a,l])=>`<details><summary>${a}</summary><p>${l}</p></details>`).join("")}</div>
  <label class="done-row"><input type="checkbox" id="ptdone" ${m[t]?"checked":""}> I finished this lab</label>
  <div class="labnav"><span>${u?`<a href="#${u.slug}">← ${u.title}</a>`:'<a href="#pt">← All labs</a>'}</span><span>${p?`<a href="#${p.slug}">${p.title} →</a>`:""}</span></div></article>`;let P=d.get("cap",{});n.querySelectorAll("[data-cap]").forEach(a=>a.checked=!!P[a.dataset.cap]),v.onchange=a=>{if(a.target.id==="ptdone"){let l=d.get("pt",{});l[t]=a.target.checked,d.set("pt",l)}if(a.target.dataset.cap!=null){let l=d.get("cap",{});l[a.target.dataset.cap]=a.target.checked,d.set("cap",l)}}}}export{S as VIEWS,j as ptView};
