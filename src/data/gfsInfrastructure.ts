// src/data/gfsInfrastructure.ts
// Complete GFS Infrastructure telemetry data for all Business Units

export interface GFSAsset {
  assetId: string;
  hostname: string;
  ip: string;
  os: string;
  role: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Degraded' | 'Offline' | 'Isolated';
  vlan: number;
  patches: 'Current' | 'Pending' | 'Overdue';
  mitreTechniques: string[];
}

export interface ThreatIndicator {
  id: string;
  type: 'Credential Stuffing' | 'Lateral Movement' | 'Exfiltration' | 'Ransomware' | 'Phishing' | 'SQL Injection' | 'Privilege Escalation' | 'C2 Beacon';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  sourceIp: string;
  destIp: string;
  timestamp: string;
  mitreTechnique: string;
  status: 'Open' | 'In_Progress' | 'Mitigated' | 'False_Positive';
  affectedBU: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  description: string;
  criticality: 'Tier_1' | 'Tier_2' | 'Tier_3';
  networkRange: string;
  vlanId: number;
  assets: GFSAsset[];
  activeThreats: ThreatIndicator[];
  controls: string[];
  complianceFrameworks: string[];
  rpoMinutes: number;
  rtoMinutes: number;
}

export const GFS_BUSINESS_UNITS: BusinessUnit[] = [
  {
    id: 'BU-01',
    name: 'Retail Banking',
    description: 'Provides transactional banking, checking/savings account management, consumer loans, and debit operations for 5M+ personal banking customers globally.',
    criticality: 'Tier_1',
    networkRange: '10.10.20.0/24',
    vlanId: 20,
    rpoMinutes: 15,
    rtoMinutes: 30,
    controls: ['AES-GCM-256 Encryption', 'HSM Key Management', 'Row-Level DB Authorization', 'MFA Enforcement', 'Privileged Access Management'],
    complianceFrameworks: ['PCI-DSS v4.0', 'NYDFS 500', 'GDPR Article 32', 'SOX IT Controls'],
    assets: [
      { assetId: 'GFS-SRV-0012', hostname: 'ny-dc01-corebank-db01.gfs.local', ip: '10.10.20.11', os: 'RHEL 9.4 LTS', role: 'Core Banking Database Primary', criticality: 'Critical', status: 'Active', vlan: 20, patches: 'Current', mitreTechniques: ['T1190', 'T1078', 'T1505.003'] },
      { assetId: 'GFS-SRV-0013', hostname: 'ny-dc01-corebank-db02.gfs.local', ip: '10.10.20.12', os: 'RHEL 9.4 LTS', role: 'Core Banking Database Replica', criticality: 'Critical', status: 'Active', vlan: 20, patches: 'Current', mitreTechniques: ['T1190', 'T1078'] },
      { assetId: 'GFS-SRV-0014', hostname: 'ny-dc01-teller-app01.gfs.local', ip: '10.10.20.21', os: 'Windows Server 2022', role: 'Teller Application Server', criticality: 'High', status: 'Active', vlan: 20, patches: 'Pending', mitreTechniques: ['T1059.001', 'T1547.001'] },
      { assetId: 'GFS-SRV-0015', hostname: 'ny-dc01-kyc-app01.gfs.local', ip: '10.10.20.31', os: 'Ubuntu 22.04 LTS', role: 'KYC-Veriflow Application', criticality: 'High', status: 'Active', vlan: 20, patches: 'Current', mitreTechniques: ['T1190', 'T1136'] },
      { assetId: 'GFS-ATM-CTRL-01', hostname: 'ny-dc01-atm-ctrl01.gfs.local', ip: '10.10.20.41', os: 'Windows 10 IoT Enterprise', role: 'ATM Network Controller', criticality: 'Critical', status: 'Active', vlan: 200, patches: 'Overdue', mitreTechniques: ['T1486', 'T1219'] },
    ],
    activeThreats: [
      { id: 'THR-001', type: 'Credential Stuffing', severity: 'High', sourceIp: '185.220.101.45', destIp: '10.10.20.21', timestamp: '2026-07-10T02:14:32Z', mitreTechnique: 'T1110.004', status: 'In_Progress', affectedBU: 'BU-01' },
      { id: 'THR-002', type: 'SQL Injection', severity: 'Critical', sourceIp: '198.51.100.82', destIp: '10.10.20.11', timestamp: '2026-07-10T01:47:19Z', mitreTechnique: 'T1190', status: 'Open', affectedBU: 'BU-01' },
    ],
  },
  {
    id: 'BU-02',
    name: 'Digital Banking',
    description: 'Orchestrates high-velocity electronic financial transactions across web portals, mobile platforms, API banking aggregators, and custom customer integrations.',
    criticality: 'Tier_1',
    networkRange: '10.200.0.0/16',
    vlanId: 200,
    rpoMinutes: 0,
    rtoMinutes: 15,
    controls: ['WAF (Cloudflare Enterprise)', 'OAuth2 / OpenID Connect', 'Runtime Application Self-Protection (RASP)', 'API Rate Limiting', 'Container Image Scanning'],
    complianceFrameworks: ['PCI-DSS v4.0', 'NYDFS 500', 'Open Banking PSD2'],
    assets: [
      { assetId: 'GFS-SRV-0842', hostname: 'aws-ec2-prod-amw-k8s-node04.gfs.cloud', ip: '10.200.44.114', os: 'Rocky Linux 9.3', role: 'Kubernetes Worker Node (Digital Banking)', criticality: 'High', status: 'Active', vlan: 200, patches: 'Pending', mitreTechniques: ['T1610', 'T1613'] },
      { assetId: 'GFS-SRV-0843', hostname: 'aws-ec2-prod-amw-k8s-node05.gfs.cloud', ip: '10.200.44.115', os: 'Rocky Linux 9.3', role: 'Kubernetes Worker Node (API Gateway)', criticality: 'High', status: 'Active', vlan: 200, patches: 'Pending', mitreTechniques: ['T1610', 'T1046'] },
      { assetId: 'GFS-SRV-0844', hostname: 'aws-ec2-prod-api-gw01.gfs.cloud', ip: '10.200.10.11', os: 'Amazon Linux 2023', role: 'API Gateway (Mule ESB)', criticality: 'Critical', status: 'Active', vlan: 200, patches: 'Current', mitreTechniques: ['T1190', 'T1595'] },
      { assetId: 'GFS-DB-0101', hostname: 'az-sql-prod-digitalbank-01.gfs.cloud', ip: '10.200.20.11', os: 'Azure SQL Managed Instance', role: 'Digital Banking Transaction Store', criticality: 'Critical', status: 'Active', vlan: 200, patches: 'Current', mitreTechniques: ['T1190', 'T1078'] },
    ],
    activeThreats: [
      { id: 'THR-003', type: 'C2 Beacon', severity: 'Critical', sourceIp: '10.200.44.114', destIp: '91.229.229.99', timestamp: '2026-07-10T03:02:44Z', mitreTechnique: 'T1071.001', status: 'Open', affectedBU: 'BU-02' },
      { id: 'THR-004', type: 'Privilege Escalation', severity: 'High', sourceIp: '10.200.10.11', destIp: '10.200.20.11', timestamp: '2026-07-10T02:58:11Z', mitreTechnique: 'T1078.004', status: 'In_Progress', affectedBU: 'BU-02' },
    ],
  },
  {
    id: 'BU-03',
    name: 'SWIFT & Treasury Operations',
    description: 'Executes international wholesale financial fund settlement, cross-currency asset alignment, clearinghouse liquidity updates, and SWIFT messaging networks.',
    criticality: 'Tier_1',
    networkRange: '10.10.30.0/24',
    vlanId: 30,
    rpoMinutes: 0,
    rtoMinutes: 5,
    controls: ['Air-Gapped Terminal Access', 'Hardware Multi-Party Transaction Signing', 'Network IPS Filtering', 'Jump Server Mandatory Access', 'HSM-Backed Key Storage'],
    complianceFrameworks: ['SWIFT CSCF v2025', 'PCI-DSS v4.0', 'ISO 27001', 'NYDFS 500'],
    assets: [
      { assetId: 'GFS-SRV-0301', hostname: 'ny-dc01-swift-gw01.gfs.local', ip: '10.10.30.11', os: 'RHEL 8.9 (Air-Gapped)', role: 'SWIFT Alliance Gateway Primary', criticality: 'Critical', status: 'Active', vlan: 30, patches: 'Current', mitreTechniques: ['T1565.002', 'T1021.002'] },
      { assetId: 'GFS-SRV-0302', hostname: 'ln-dc02-swift-gw01.gfs.local', ip: '10.10.30.21', os: 'RHEL 8.9 (Air-Gapped)', role: 'SWIFT Alliance Gateway DR', criticality: 'Critical', status: 'Active', vlan: 30, patches: 'Current', mitreTechniques: ['T1565.002'] },
      { assetId: 'GFS-SRV-0303', hostname: 'ny-dc01-treasury-app01.gfs.local', ip: '10.10.30.31', os: 'Windows Server 2022', role: 'Treasury Allocation Engine', criticality: 'Critical', status: 'Active', vlan: 30, patches: 'Current', mitreTechniques: ['T1059.001', 'T1078'] },
    ],
    activeThreats: [],
  },
  {
    id: 'BU-04',
    name: 'Investment Banking & Trading',
    description: 'Manages global market-making, algorithmic stock/bond trading execution, asset management portfolios, and corporate underwriting structures.',
    criticality: 'Tier_2',
    networkRange: '10.10.40.0/24',
    vlanId: 40,
    rpoMinutes: 30,
    rtoMinutes: 60,
    controls: ['Intraday Trading Threshold Limits', 'Memory-Space Protection Patches', 'Dark-Fiber Interconnects', 'FPGA Hardware Isolation', 'Zero-Trust API Policy'],
    complianceFrameworks: ['MiFID II', 'SEC Rule 15c3-5', 'CFTC Regulations', 'ISO 27001'],
    assets: [
      { assetId: 'GFS-SRV-0401', hostname: 'nj-dc03-trade01.gfs.local', ip: '10.10.40.11', os: 'Ubuntu 20.04 LTS (FPGA)', role: 'QuantumTrade Engine Primary', criticality: 'High', status: 'Active', vlan: 40, patches: 'Current', mitreTechniques: ['T1059.004', 'T1082'] },
      { assetId: 'GFS-SRV-0402', hostname: 'nj-dc03-trade02.gfs.local', ip: '10.10.40.12', os: 'Ubuntu 20.04 LTS (FPGA)', role: 'QuantumTrade Engine Secondary', criticality: 'High', status: 'Active', vlan: 40, patches: 'Current', mitreTechniques: ['T1059.004'] },
      { assetId: 'GFS-SRV-0403', hostname: 'nj-dc03-kafka01.gfs.local', ip: '10.10.40.21', os: 'Rocky Linux 9.2', role: 'Kafka Market Data Feed', criticality: 'High', status: 'Active', vlan: 40, patches: 'Pending', mitreTechniques: ['T1046', 'T1562.001'] },
    ],
    activeThreats: [
      { id: 'THR-005', type: 'Lateral Movement', severity: 'High', sourceIp: '10.10.40.21', destIp: '10.10.40.11', timestamp: '2026-07-10T00:34:18Z', mitreTechnique: 'T1021.001', status: 'Open', affectedBU: 'BU-04' },
    ],
  },
  {
    id: 'BU-SOC',
    name: 'Security Operations Center',
    description: 'Provides 24x7x365 enterprise protective monitoring, threat detection, incident response, and security orchestration across all corporate entities.',
    criticality: 'Tier_1',
    networkRange: '10.10.50.0/24',
    vlanId: 50,
    rpoMinutes: 0,
    rtoMinutes: 0,
    controls: ['Splunk ES SIEM', 'CrowdStrike Falcon EDR', 'Palo Alto XSOAR', 'CyberArk PAM', 'Recorded Future CTI Feed'],
    complianceFrameworks: ['NIST CSF 2.0', 'ISO 27035', 'NYDFS 500'],
    assets: [
      { assetId: 'GFS-SRV-0501', hostname: 'hy-dc05-splunk-sh01.gfs.local', ip: '10.10.50.11', os: 'RHEL 9.4 LTS', role: 'Splunk Search Head (Primary)', criticality: 'Critical', status: 'Active', vlan: 50, patches: 'Current', mitreTechniques: [] },
      { assetId: 'GFS-SRV-0502', hostname: 'hy-dc05-splunk-idx01.gfs.local', ip: '10.10.50.21', os: 'RHEL 9.4 LTS', role: 'Splunk Indexer Cluster Node 1', criticality: 'Critical', status: 'Active', vlan: 50, patches: 'Current', mitreTechniques: [] },
      { assetId: 'GFS-SRV-0503', hostname: 'hy-dc05-soar01.gfs.local', ip: '10.10.50.31', os: 'Ubuntu 22.04 LTS', role: 'Palo Alto XSOAR Orchestrator', criticality: 'High', status: 'Active', vlan: 50, patches: 'Current', mitreTechniques: [] },
    ],
    activeThreats: [],
  },
  {
    id: 'BU-NOC',
    name: 'Network Operations Center',
    description: 'Maintains global network infrastructure availability, performs capacity management, monitors BGP routing tables, and manages WAN connectivity across all GFS sites.',
    criticality: 'Tier_1',
    networkRange: '192.168.254.0/24',
    vlanId: 999,
    rpoMinutes: 15,
    rtoMinutes: 30,
    controls: ['Out-of-Band Management', 'BGP Route Policy Filtering', 'Network Flow Analysis (NetFlow)', 'OSPF Route Authentication', 'SD-WAN Policy Enforcement'],
    complianceFrameworks: ['NIST CSF 2.0', 'ISO 22301', 'NYDFS 500'],
    assets: [
      { assetId: 'GFS-NET-0001', hostname: 'ny-hq-core-rtr01.gfs.local', ip: '192.168.254.1', os: 'Cisco IOS-XE 17.12', role: 'ASR-9904 Edge Router Primary', criticality: 'Critical', status: 'Active', vlan: 999, patches: 'Current', mitreTechniques: ['T1498', 'T1595'] },
      { assetId: 'GFS-NET-0002', hostname: 'ny-hq-core-fw01.gfs.local', ip: '192.168.254.2', os: 'PAN-OS 11.1', role: 'Palo Alto PA-5450 Firewall Primary', criticality: 'Critical', status: 'Active', vlan: 999, patches: 'Current', mitreTechniques: [] },
      { assetId: 'GFS-NET-0003', hostname: 'ny-dc01-nexus01.gfs.local', ip: '192.168.254.11', os: 'NX-OS 10.3', role: 'Cisco Nexus 9508 Core Switch', criticality: 'Critical', status: 'Active', vlan: 999, patches: 'Current', mitreTechniques: [] },
    ],
    activeThreats: [],
  },
  {
    id: 'BU-ATM',
    name: 'ATM Network Operations',
    description: 'Manages the global ATM fleet of 8,500+ machines across 43 countries including cash replenishment, monitoring, security firmware updates, and transaction processing.',
    criticality: 'Tier_1',
    networkRange: '10.11.200.0/24',
    vlanId: 200,
    rpoMinutes: 15,
    rtoMinutes: 60,
    controls: ['ATM Anti-Skimming Firmware', 'Point-to-Point Encryption (P2PE)', 'Tamper-Evident Hardware', 'Jitter Detection Sensors', 'Isolated Network VLAN'],
    complianceFrameworks: ['PCI-DSS v4.0', 'EMVCo Standards', 'NYDFS 500'],
    assets: [
      { assetId: 'GFS-ATM-MGR-01', hostname: 'ny-dc01-atm-mgr01.gfs.local', ip: '10.11.200.11', os: 'Windows Server 2019', role: 'ATM Management Server (Diebold Nixdorf)', criticality: 'High', status: 'Active', vlan: 200, patches: 'Pending', mitreTechniques: ['T1486', 'T1219', 'T1563'] },
    ],
    activeThreats: [
      { id: 'THR-006', type: 'Exfiltration', severity: 'Medium', sourceIp: '10.11.200.24', destIp: '203.0.113.45', timestamp: '2026-07-09T23:12:09Z', mitreTechnique: 'T1048.003', status: 'In_Progress', affectedBU: 'BU-ATM' },
    ],
  },
  {
    id: 'BU-CC',
    name: 'Credit Card Processing',
    description: 'Handles credit card authorization, clearing, settlement, fraud scoring, chargebacks, and issuer processing for 12M+ GFS credit cardholders across 43 countries.',
    criticality: 'Tier_1',
    networkRange: '10.10.60.0/24',
    vlanId: 60,
    rpoMinutes: 0,
    rtoMinutes: 10,
    controls: ['Tokenization (PAN Vault)', 'P2PE Transaction Encryption', 'Fraud ML Scoring Engine', 'Velocity Check Rules', '3D Secure Authentication'],
    complianceFrameworks: ['PCI-DSS v4.0', 'PA-DSS', 'NYDFS 500'],
    assets: [
      { assetId: 'GFS-SRV-0601', hostname: 'ny-dc01-cc-auth01.gfs.local', ip: '10.10.60.11', os: 'RHEL 9.3 LTS', role: 'Credit Card Authorization Engine', criticality: 'Critical', status: 'Active', vlan: 60, patches: 'Current', mitreTechniques: ['T1190', 'T1078'] },
      { assetId: 'GFS-SRV-0602', hostname: 'ny-dc01-cc-fraud01.gfs.local', ip: '10.10.60.21', os: 'Ubuntu 22.04 LTS', role: 'Fraud ML Scoring Engine', criticality: 'High', status: 'Active', vlan: 60, patches: 'Current', mitreTechniques: ['T1059.003', 'T1082'] },
    ],
    activeThreats: [],
  },
];

export const ALL_THREATS: ThreatIndicator[] = GFS_BUSINESS_UNITS.flatMap(bu => bu.activeThreats);

export const NETWORK_VLANS = [
  { vlanId: 10, subnet: '10.10.10.0/24', name: 'DMZ_Perimeter_Public_Proxies', zone: 'DMZ' },
  { vlanId: 20, subnet: '10.10.20.0/24', name: 'Core_Banking_Database_Cluster', zone: 'Restricted' },
  { vlanId: 30, subnet: '10.10.30.0/24', name: 'SWIFT_Transaction_Enclave', zone: 'Air-Gapped' },
  { vlanId: 40, subnet: '10.10.40.0/24', name: 'Trading_Engine_Cluster', zone: 'Restricted' },
  { vlanId: 50, subnet: '10.10.50.0/24', name: 'SOC_Operations_Infrastructure', zone: 'Restricted' },
  { vlanId: 60, subnet: '10.10.60.0/24', name: 'Credit_Card_Processing', zone: 'Restricted' },
  { vlanId: 110, subnet: '10.100.10.0/22', name: 'Workstations_HQ_Operations', zone: 'Internal' },
  { vlanId: 120, subnet: '10.100.20.0/22', name: 'Wireless_Corporate_Identified', zone: 'Internal' },
  { vlanId: 200, subnet: '10.11.200.0/24', name: 'ATM_Endpoint_Aggregation', zone: 'Semi-Isolated' },
  { vlanId: 999, subnet: '192.168.254.0/24', name: 'Out_Of_Band_Hardware_Management', zone: 'Management' },
];
