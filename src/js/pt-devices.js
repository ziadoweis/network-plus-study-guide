/* What to drag into Packet Tracer for each lab, with the exact model names from the device palette (Packet Tracer 8.2).
   Row: [name used in the lab, where to find it, model to pick, ports you'll use]. */
const R='Network Devices → Routers',S='Network Devices → Switches',W='Network Devices → Wireless Devices',E='End Devices → End Devices';
const RT='<b>2911</b>',SWM='<b>2960</b> (model 2960-24TT; some versions label it 2960 IOS15)',PCM='<b>PC</b> (PC-PT)',SRV='<b>Server</b> (Server-PT)',LAP='<b>Laptop</b> (Laptop-PT)';
const ST='<b>Copper Straight-Through</b>',CO='<b>Copper Cross-Over</b>';

export const DEVICES={
'pt-first-lan':{place:[['SW1',S,SWM,'Fa0/1, Fa0/2, Fa0/3, Console'],['PC1, PC2, PC3',E,PCM,'FastEthernet0; PC1 also RS 232']],
 cables:[[ST,'each PC → SW1'],['<b>Console</b>','PC1 RS 232 → SW1 Console']]},
'pt-static-routing':{place:[['R1, R2, R3',R,RT,'G0/0, G0/1, G0/2'],['SW-A, SW-C',S,SWM,'any two ports, e.g. Gi0/1 to the router and Fa0/1 to the PC'],['PC-A, PC-C',E,PCM,'FastEthernet0']],
 cables:[[CO,'R1 G0/1 ↔ R2 G0/1 and R2 G0/2 ↔ R3 G0/1 (router to router)'],[ST,'R1 G0/0 → SW-A, R3 G0/0 → SW-C, each PC → its switch']]},
'pt-ospf':{reuse:'Reuses your lab 2 file (pt2-static.pkt). No new devices.',
 cables:[[CO,'R1 G0/2 ↔ R3 G0/2 (the new direct link)']]},
'pt-nat':{place:[['R1, ISP',R,RT,'G0/0, G0/1'],['SW1, SW2',S,SWM,'any ports'],['PC1, PC2, PC-Out',E,PCM,'FastEthernet0'],['Web-In, Web-Out',E,SRV,'FastEthernet0']],
 cables:[[CO,'R1 G0/1 ↔ ISP G0/1'],[ST,'R1 G0/0 → SW1, ISP G0/0 → SW2, every PC and server → its switch']]},
'pt-services':{place:[['R1',R,RT,'G0/0'],['SW1',S,SWM,'any ports'],['PC1, PC2',E,PCM,'FastEthernet0'],['Server-Core, Server-Web',E,SRV,'FastEthernet0']],
 cables:[[ST,'R1 G0/0 → SW1, each PC and server → SW1']]},
'pt-vlans':{place:[['SW1, SW2',S,SWM,'Fa0/1, Fa0/11, Gi0/1'],['PC1, PC2, PC3, PC4',E,PCM,'FastEthernet0']],
 cables:[[CO,'SW1 Gi0/1 ↔ SW2 Gi0/1 (switch to switch)'],[ST,'PC1 → SW1 Fa0/1, PC2 → SW1 Fa0/11, PC3 → SW2 Fa0/1, PC4 → SW2 Fa0/11']]},
'pt-intervlan-dhcp':{reuse:'Starts from your lab 6 file (pt6-vlans.pkt) and adds:',place:[['R1',R,RT,'G0/0'],['Server-DHCP (Part 4)',E,SRV,'FastEthernet0']],
 cables:[[ST,'R1 G0/0 → SW1 Gi0/2, Server-DHCP → SW1 Fa0/24']]},
'pt-ipv6':{place:[['R1',R,RT,'G0/0, G0/1'],['SW1, SW2',S,SWM,'any ports'],['PC1, PC2',E,PCM,'FastEthernet0']],
 cables:[[ST,'R1 G0/0 → SW1, R1 G0/1 → SW2, PC1 → SW1, PC2 → SW2']]},
'pt-wireless':{place:[['The wireless router',W,'<b>WRT300N</b>','Ethernet 1 (and Ethernet 2 for the stretch goal)'],['PC-Wired',E,PCM,'FastEthernet0'],['Laptop',E,LAP,'swap its card for <b>WPC300N</b> (Part 2)'],['Tablet',E,'<b>Tablet</b> (TabletPC-PT; some versions label it Wireless Tablet)','Wireless0'],['Server-AAA (stretch goal)',E,SRV,'FastEthernet0']],
 cables:[[ST,'PC-Wired → WRT300N Ethernet 1 (stretch: Server-AAA → Ethernet 2)'],['None','the laptop and tablet connect over Wi-Fi']]},
'pt-acl':{place:[['R1',R,RT,'G0/0, G0/1, G0/2'],['SW-IN, SW-GUEST, SW-SCR',S,SWM,'any ports'],['PC-Staff, PC-Guest',E,PCM,'FastEthernet0'],['Server-HR, Server-Web',E,SRV,'FastEthernet0']],
 cables:[[ST,'R1 G0/0 → SW-IN, G0/1 → SW-GUEST, G0/2 → SW-SCR, each host → its switch']]},
'pt-switch-security':{place:[['R1',R,RT,'G0/0'],['SW1',S,SWM,'Gi0/1, Fa0/1, Fa0/2, Fa0/3, Fa0/5'],['PC1, PC2',E,PCM,'FastEthernet0'],['Rogue-DHCP (Part 2)',E,SRV,'FastEthernet0'],['Attacker (Part 3)',E,LAP,'FastEthernet0'],['SW-Rogue (Part 4)',S,SWM,'any port']],
 cables:[[ST,'R1 G0/0 → SW1 Gi0/1, PC1 → Fa0/1, PC2 → Fa0/2, Rogue-DHCP → Fa0/5, Attacker → Fa0/1'],[CO,'SW-Rogue → SW1 Fa0/3']]},
'pt-break-fix':{reuse:'Reuses your lab 7 file (pt7-intervlan.pkt). No new devices.'},
'pt-capstone':{place:[['R1 (your router), ISP',R,RT,'G0/0 (trunk to the switches), G0/1 (to the ISP)'],['SW-F1, SW-F2',S,SWM,'Fa0/1–24 for hosts, Gi0/1–2 for trunks'],['Staff and Guest PCs (a few of each, not 140)',E,PCM,'FastEthernet0'],['DNS/web server(s) in VLAN 30, Internet web server',E,SRV,'FastEthernet0'],['Admin PC in VLAN 99',E,PCM,'FastEthernet0']],
 cables:[[CO,'R1 G0/1 ↔ ISP G0/1, SW-F1 Gi0/2 ↔ SW-F2 Gi0/1, and ISP G0/0 ↔ the Internet web server (a router wired straight to a host also needs cross-over)'],[ST,'R1 G0/0 → SW-F1 Gi0/1, every host → its switch']]},
};
