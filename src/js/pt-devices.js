/* What to drag into Packet Tracer (the cabling table comes from pt-topos.js) for each lab, with the exact model names from the device palette (Packet Tracer 8.2).
   Row: [name used in the lab, where to find it, model to pick, ports you'll use]. */
const R='Network Devices → Routers',S='Network Devices → Switches',W='Network Devices → Wireless Devices',E='End Devices → End Devices';
const RT='<b>2911</b>',SWM='<b>2960</b> (model 2960-24TT; some versions label it 2960 IOS15)',PCM='<b>PC</b> (PC-PT)',SRV='<b>Server</b> (Server-PT)',LAP='<b>Laptop</b> (Laptop-PT)';

export const DEVICES={
'pt-first-lan':{place:[['SW1',S,SWM,'Fa0/1, Fa0/2, Fa0/3, Console'],['PC1, PC2, PC3',E,PCM,'FastEthernet0; PC1 also RS 232']]},
'pt-static-routing':{place:[['R1, R2, R3',R,RT,'G0/0, G0/1, G0/2'],['SW-A, SW-C',S,SWM,'Gi0/1 (router), Fa0/1 (PC)'],['PC-A, PC-C',E,PCM,'FastEthernet0']]},
'pt-ospf':{reuse:'Reuses your lab 2 file (pt2-static.pkt). No new devices, one new cable:'},
'pt-nat':{place:[['R1, ISP',R,RT,'G0/0, G0/1'],['SW1, SW2',S,SWM,'Gi0/1 (router); SW1 Fa0/1–3, SW2 Fa0/1–2 (hosts)'],['PC1, PC2, PC-Out',E,PCM,'FastEthernet0'],['Web-In, Web-Out',E,SRV,'FastEthernet0']]},
'pt-services':{place:[['R1',R,RT,'G0/0'],['SW1',S,SWM,'Gi0/1 (R1), Fa0/1–4 (hosts)'],['PC1, PC2',E,PCM,'FastEthernet0'],['Server-Core, Server-Web',E,SRV,'FastEthernet0']]},
'pt-vlans':{place:[['SW1, SW2',S,SWM,'Fa0/1, Fa0/11, Gi0/1'],['PC1, PC2, PC3, PC4',E,PCM,'FastEthernet0']]},
'pt-intervlan-dhcp':{reuse:'Starts from your lab 6 file (pt6-vlans.pkt) and adds:',place:[['R1',R,RT,'G0/0'],['Server-DHCP (Part 4)',E,SRV,'FastEthernet0']]},
'pt-ipv6':{place:[['R1',R,RT,'G0/0, G0/1'],['SW1, SW2',S,SWM,'Gi0/1 (R1), Fa0/1 (PC)'],['PC1, PC2',E,PCM,'FastEthernet0']]},
'pt-wireless':{place:[['The wireless router',W,'<b>WRT300N</b>','Ethernet 1 (and Ethernet 2 for the stretch goal)'],['PC-Wired',E,PCM,'FastEthernet0'],['Laptop',E,LAP,'swap its card for <b>WPC300N</b> (Part 2)'],['Tablet',E,'<b>Tablet</b> (TabletPC-PT; some versions label it Wireless Tablet)','Wireless0'],['Server-AAA (stretch goal)',E,SRV,'FastEthernet0']]},
'pt-acl':{place:[['R1',R,RT,'G0/0, G0/1, G0/2'],['SW-IN, SW-GUEST, SW-SCR',S,SWM,'Gi0/1 (R1); Fa0/1 (and Fa0/2 on SW-IN) for hosts'],['PC-Staff, PC-Guest',E,PCM,'FastEthernet0'],['Server-HR, Server-Web',E,SRV,'FastEthernet0']]},
'pt-switch-security':{place:[['R1',R,RT,'G0/0'],['SW1',S,SWM,'Gi0/1, Fa0/1, Fa0/2, Fa0/3, Fa0/5'],['PC1, PC2',E,PCM,'FastEthernet0'],['Rogue-DHCP (Part 2)',E,SRV,'FastEthernet0'],['Attacker (Part 3)',E,LAP,'FastEthernet0'],['SW-Rogue (Part 4)',S,SWM,'Gi0/1']]},
'pt-break-fix':{reuse:'Reuses your lab 7 file (pt7-intervlan.pkt). No new devices; the cabling is the same as lab 7 (listed below for reference).'},
'pt-capstone':{place:[['R1 (your router), ISP',R,RT,'G0/0 (trunk to the switches), G0/1 (to the ISP)'],['SW-F1, SW-F2',S,SWM,'Gi0/1–2 for trunks; Fa0/1, Fa0/11, Fa0/21 or Fa0/24 for hosts'],['Staff and Guest PCs (a few of each, not 140)',E,PCM,'FastEthernet0'],['DNS/web server(s) in VLAN 30, Internet web server',E,SRV,'FastEthernet0'],['Admin PC in VLAN 99',E,PCM,'FastEthernet0']]},
};
