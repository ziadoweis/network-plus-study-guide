export const DOMAINS=[
 {id:1,name:'Networking Concepts',w:23,ch:'1, 2, 3, 4, 6, 7, 8, 10, 12, 17'},
 {id:2,name:'Network Implementation',w:20,ch:'5, 8, 9, 10, 11, 12, 16'},
 {id:3,name:'Network Operations',w:19,ch:'5, 7, 13, 14, 15, 16'},
 {id:4,name:'Network Security',w:14,ch:'20, 21'},
 {id:5,name:'Network Troubleshooting',w:24,ch:'3, 11, 18, 19'}];
export const OBJ={
 '1.1':['OSI model',[2,6]],'1.2':['Appliances, applications, functions',[10]],'1.3':['Cloud concepts and connectivity',[17]],'1.4':['Ports, protocols, services, traffic types',[6,8]],
 '1.5':['Transmission media and transceivers',[3,4,12]],'1.6':['Topologies, architectures, network types',[1]],'1.7':['IPv4 addressing',[7,8]],'1.8':['Evolving use cases',[7,10,17]],
 '2.1':['Routing technologies',[8,9,10]],'2.2':['Switching technologies',[11]],'2.3':['Wireless devices and technologies',[5,12]],'2.4':['Physical installations',[16]],
 '3.1':['Organizational processes and procedures',[15]],'3.2':['Network monitoring',[14]],'3.3':['Disaster recovery',[16]],'3.4':['IPv4/IPv6 network services',[5,7]],'3.5':['Network access and management',[13]],
 '4.1':['Basic security concepts',[20,21]],'4.2':['Attack types',[21]],'4.3':['Security features and defenses',[21]],
 '5.1':['Troubleshooting methodology',[18]],'5.2':['Cabling and physical interface issues',[3,18]],'5.3':['Network service issues',[11,18]],'5.4':['Performance issues',[11,18]],'5.5':['Tools and protocols',[19]]};
export const CHAPTERS=['Intro to Networks','OSI Model','Connectors & Wiring Standards','Ethernet Specifications','Networking Devices','Intro to IP','IP Addressing','Subnetting, Troubleshooting IP, NAT','IP Routing','Routing Protocols','Switching & VLANs','Wireless','Remote Access','Statistics & Sensors','Organizational Documents & Policies','High Availability & DR','Data Center & Cloud','Troubleshooting Methodology','Software Tools & Commands','Security Concepts','Attacks'];
export const objTag=o=>`Obj ${o} · Book Ch. ${OBJ[o][1].join(', ')}`;


export const LABS=[
 {id:'subnet',hash:'lab-subnet',name:'Subnetting and addressing',obj:'1.7 · 1.8',desc:'Subnet math, sizing, binary, IPv6 shortening and EUI-64'},
 {id:'ports',hash:'lab-ports',name:'Ports and protocols',obj:'1.4',desc:'Quick recall sprint on the N10-009 port list'},
 {id:'osi',hash:'lab-osi',name:'OSI layer sorter',obj:'1.1',desc:'Put devices, protocols and PDUs on the right layer'},
 {id:'cables',hash:'lab-cables',name:'Cables, connectors and tools',obj:'1.5 · 5.2',desc:'Pick the right cable, optic or tester for each job'},
 {id:'cli',hash:'lab-cli',name:'CLI troubleshooting tickets',obj:'5.3 · 5.5',desc:'Six Windows help-desk tickets'},
 {id:'switch',hash:'lab-switch',name:'Switch configuration (IOS)',obj:'2.2',desc:'VLANs, trunk and management on a simulated 2960'},
 {id:'acl',hash:'lab-acl',name:'Firewall rule evaluation',obj:'4.3',desc:'First match wins, implicit deny, shadowed rules'},
 {id:'method',hash:'lab-method',name:'Troubleshooting methodology',obj:'5.1',desc:'Order the 7 steps and classify actions'}];


export const CORRECTIONS=[
 ['Handouts','Objective numbers like "1.5 ports" or "4.5 physical security"','These follow the older N10-008 numbering. In N10-009, ports are 1.4 and physical security is part of 4.1.'],
 ['Quiz Q2.2','"RG-32" as the common cable/broadband coax','RG-32 is not a common grade. Cable broadband uses RG-6 (75 Ω, F-type). RG-59 is older and thinner.'],
 ['Quiz & handouts','"SPF" transceivers','A typo for SFP (small form-factor pluggable).'],
 ['Quiz Q6.5','Class A = 0–126','The usable Class A first-octet range is 1–126. 0 is reserved and 127 is loopback.'],
 ['Handouts','"PoE+ 802.3af, 15.4 W"','802.3af is plain PoE at 15.4 W. PoE+ is 802.3at at 30 W. PoE++ is 802.3bt at 60 or 90–100 W.'],
 ['Handouts','"Kerberos is a Microsoft proprietary technology"','Kerberos is an open standard from MIT (RFC 4120). Active Directory implements it.'],
 ['Handouts','"Encapsulating Security Payload (EAP)"','The abbreviation is ESP (IPsec). EAP is the Extensible Authentication Protocol used with 802.1X.'],
 ['Book Ch. 12','MU-MIMO is "used in the new 802.11ax" (and "802.11zc")','Downlink MU-MIMO arrived with 802.11ac Wave 2. 802.11ax added uplink MU-MIMO and OFDMA. "802.11zc" is a typo for 802.11ac.'],
 ['Book Ch. 3','Cat 6 is "used for 1000BaseTX (two pair)"','Standard gigabit copper is 1000BASE-T and uses all four pairs on Cat 5e or better.'],
 ['Book / objectives','SMTPS port','For the exam, use 587 (submission with STARTTLS). Port 465 is SMTP over implicit TLS.'],
 ['Quiz Q10.4','RBAC = "assigning rights to a folder based on a user"','RBAC assigns rights by role or job function. Per-user rights set by the owner are closer to DAC.'],
 ['Quiz Q13.6','"L2TP/IPsec is used by Cisco"','L2TP is an IETF open standard (it merged Cisco\'s L2F and Microsoft\'s PPTP). Many vendors use it.'],
 ['Quiz Q18.9','"Cloud site is fastest" to recover','The textbook answer is a hot site. A cloud site only qualifies if it is kept hot.'],
 ['Quiz','Misaligned or misnumbered rows (2.8, 5.3/15.3, 7.6, and 6.10/8.10/18.10/19.10 shown as 6.1/8.1/18.1/19.1)','Check the question against the answer key before trusting those items.']];

/* Where to revise each objective: video chapters (handouts numbering) and site practice pages */
export const OBJ_VIDEO={'1.1':[1,3],'1.2':[3,16],'1.3':[15],'1.4':[8,10],'1.5':[2,4],'1.6':[2,13,16],'1.7':[6],'1.8':[12,15],
 '2.1':[7],'2.2':[11],'2.3':[14],'2.4':[5],'3.1':[18],'3.2':[20],'3.3':[16,18],'3.4':[9],'3.5':[13],
 '4.1':[10,17],'4.2':[19],'4.3':[19],'5.1':[21],'5.2':[5,21],'5.3':[21],'5.4':[14,21],'5.5':[21]};
export const OBJ_PRACTICE={'1.1':['lab-osi'],'1.4':['lab-ports'],'1.5':['lab-cables'],'1.7':['lab-subnet'],'1.8':['lab-subnet','pt-ipv6'],
 '2.1':['pt-static-routing','pt-ospf','pt-nat'],'2.2':['lab-switch','pt-vlans'],'2.3':['pt-wireless'],'2.4':['lab-cables'],
 '3.2':['pt-services'],'3.4':['lab-cli','pt-services','pt-intervlan-dhcp'],'3.5':['pt-first-lan'],
 '4.2':['pt-switch-security'],'4.3':['lab-acl','pt-acl','pt-switch-security'],
 '5.1':['lab-method'],'5.2':['lab-cables'],'5.3':['lab-cli','pt-break-fix'],'5.4':['pt-wireless'],'5.5':['lab-cli']};
