export type Level =
  | "Foundation"
  | "Operations"
  | "Specialist"
  | "Senior"
  | "Lead"
  | "Architect"
  | "Management"
  | "Executive";

export interface LadderRole {
  title: string;
  band: string; // e.g. T1, T2, M3
  level: Level;
  years: string;
  track: "Technology" | "Security Ops" | "Engineering" | "GRC" | "Offensive" | "Architecture" | "Leadership";
  summary: string;
}

export const CAREER_LADDER: LadderRole[] = [
  { title: "Associate Technology Trainee", band: "T1", level: "Foundation", years: "0–1 yr", track: "Technology", summary: "Rotational program across infrastructure, help desk and security operations." },
  { title: "IT Support Associate", band: "T2", level: "Foundation", years: "0–2 yr", track: "Technology", summary: "First line of support for GFS employees; incident and access requests." },
  { title: "Desktop Engineer", band: "T2", level: "Foundation", years: "1–3 yr", track: "Technology", summary: "Endpoint imaging, MDM, patching and workstation security baselines." },
  { title: "System Administrator", band: "T3", level: "Operations", years: "2–4 yr", track: "Technology", summary: "Directory services, backups and enterprise application ops." },
  { title: "Linux Administrator", band: "T3", level: "Operations", years: "2–4 yr", track: "Technology", summary: "Hardening, automation and observability across the Linux fleet." },
  { title: "Windows Administrator", band: "T3", level: "Operations", years: "2–4 yr", track: "Technology", summary: "GPOs, AD, Intune and Defender for the Windows estate." },
  { title: "Network Administrator", band: "T3", level: "Operations", years: "2–5 yr", track: "Technology", summary: "Routing, segmentation, firewalls and zero-trust network access." },
  { title: "Cloud Operations Engineer", band: "T3", level: "Operations", years: "2–5 yr", track: "Technology", summary: "Multi-cloud landing zones, IaC and platform reliability." },

  { title: "Security Operations Associate", band: "S1", level: "Operations", years: "0–2 yr", track: "Security Ops", summary: "Triage, tuning and enrichment inside the 24×7 GFS SOC." },
  { title: "SOC Analyst L1", band: "S1", level: "Operations", years: "1–2 yr", track: "Security Ops", summary: "First responder for detections; playbook-driven investigation." },
  { title: "SOC Analyst L2", band: "S2", level: "Specialist", years: "2–4 yr", track: "Security Ops", summary: "Deep-dive investigations, correlation and containment." },
  { title: "SOC Analyst L3", band: "S3", level: "Senior", years: "4–6 yr", track: "Security Ops", summary: "Escalation authority, root-cause analysis and detection tuning." },
  { title: "Threat Hunter", band: "S3", level: "Senior", years: "4–7 yr", track: "Security Ops", summary: "Hypothesis-driven hunting across EDR, cloud and identity telemetry." },
  { title: "Incident Responder", band: "S3", level: "Senior", years: "4–7 yr", track: "Security Ops", summary: "Leads containment, eradication and recovery for major incidents." },
  { title: "DFIR Analyst", band: "S3", level: "Senior", years: "4–8 yr", track: "Security Ops", summary: "Host, memory, cloud and mobile forensics for enterprise incidents." },
  { title: "Malware Analyst", band: "S3", level: "Senior", years: "4–8 yr", track: "Security Ops", summary: "Static and dynamic reverse engineering; YARA and detection authoring." },
  { title: "Detection Engineer", band: "S3", level: "Senior", years: "3–6 yr", track: "Engineering", summary: "Codifies threats into high-fidelity, testable detections across the stack." },

  { title: "Security Engineer", band: "E2", level: "Specialist", years: "2–5 yr", track: "Engineering", summary: "Ships preventive and detective controls across the enterprise." },
  { title: "Cloud Security Engineer", band: "E3", level: "Senior", years: "3–6 yr", track: "Engineering", summary: "CSPM, workload protection and secure landing zones for AWS/Azure/GCP." },
  { title: "Application Security Engineer", band: "E3", level: "Senior", years: "3–6 yr", track: "Engineering", summary: "Threat modeling, SAST/DAST, secure SDLC partnership with product." },
  { title: "DevSecOps Engineer", band: "E3", level: "Senior", years: "3–6 yr", track: "Engineering", summary: "Guardrails in pipelines, policy-as-code and paved-road platforms." },
  { title: "IAM Engineer", band: "E3", level: "Senior", years: "3–6 yr", track: "Engineering", summary: "Workforce and workload identity, PAM, federation and access reviews." },

  { title: "GRC Analyst", band: "G2", level: "Specialist", years: "1–4 yr", track: "GRC", summary: "Policy, controls testing, risk register and audit evidence." },
  { title: "Risk Consultant", band: "G3", level: "Senior", years: "3–6 yr", track: "GRC", summary: "Enterprise risk assessments across business units and third parties." },
  { title: "Compliance Specialist", band: "G3", level: "Senior", years: "3–6 yr", track: "GRC", summary: "PCI DSS, SOX, DORA, ISO 27001 and regional financial regulations." },
  { title: "Security Consultant", band: "G3", level: "Senior", years: "3–7 yr", track: "GRC", summary: "Advisory across product, M&A and technology transformation." },

  { title: "Vulnerability Analyst", band: "O2", level: "Specialist", years: "1–4 yr", track: "Offensive", summary: "Continuous scanning, prioritization and remediation partnership." },
  { title: "Penetration Tester", band: "O3", level: "Senior", years: "3–6 yr", track: "Offensive", summary: "Web, network, cloud and mobile pentesting engagements." },
  { title: "Red Team Operator", band: "O4", level: "Senior", years: "5–8 yr", track: "Offensive", summary: "Adversary emulation against people, process and technology." },
  { title: "Purple Team Engineer", band: "O4", level: "Senior", years: "5–8 yr", track: "Offensive", summary: "Closes the loop between red operations and blue detections." },

  { title: "Security Architect", band: "A4", level: "Architect", years: "6–10 yr", track: "Architecture", summary: "Reference architectures, control frameworks and design authority." },
  { title: "Cloud Security Architect", band: "A4", level: "Architect", years: "6–10 yr", track: "Architecture", summary: "Secure-by-default patterns across the multi-cloud estate." },
  { title: "Principal Security Engineer", band: "A5", level: "Architect", years: "8–12 yr", track: "Architecture", summary: "Cross-domain technical leader; sets standards firm-wide." },

  { title: "SOC Manager", band: "M3", level: "Management", years: "6–9 yr", track: "Leadership", summary: "Runs the 24×7 SOC, on-call, KPIs and analyst development." },
  { title: "Cyber Defense Manager", band: "M4", level: "Management", years: "7–10 yr", track: "Leadership", summary: "Owns SOC + IR + Threat Intel and detection engineering." },
  { title: "Head of Security Operations", band: "M5", level: "Management", years: "9–13 yr", track: "Leadership", summary: "Global cyber defense leader across regions and business units." },
  { title: "Director Cybersecurity", band: "D1", level: "Executive", years: "12–16 yr", track: "Leadership", summary: "Owns a security pillar and its multi-year strategy and budget." },
  { title: "Deputy CISO", band: "D2", level: "Executive", years: "14–18 yr", track: "Leadership", summary: "Runs the security organization day-to-day; board reporting deputy." },
  { title: "Chief Information Security Officer", band: "E1", level: "Executive", years: "18+ yr", track: "Leadership", summary: "Accountable for GFS cyber risk to the board and regulators." },
];

export interface Department {
  name: string;
  code: string;
  mission: string;
  responsibilities: string[];
  careerPaths: string[];
  skills: string[];
  teamSize: string;
  impact: string;
  stack: string[];
  openPositions: number;
}

export const DEPARTMENTS: Department[] = [
  {
    name: "Security Operations Center",
    code: "SOC",
    mission: "Detect, triage and contain threats to GFS 24×7 across 43 countries.",
    responsibilities: ["24×7 monitoring", "Alert triage & tuning", "Containment", "Runbook execution"],
    careerPaths: ["SOC L1 → L2 → L3 → SOC Manager → Head of SecOps"],
    skills: ["SIEM", "EDR", "KQL/SPL", "MITRE ATT&CK", "Networking"],
    teamSize: "120 analysts",
    impact: "Median MTTD 6 min · MTTR 41 min",
    stack: ["Splunk", "Sentinel", "CrowdStrike", "Chronicle", "SOAR"],
    openPositions: 14,
  },
  {
    name: "Threat Intelligence",
    code: "CTI",
    mission: "Turn adversary insight into decisions the business can act on.",
    responsibilities: ["Actor tracking", "Strategic reporting", "IOC enrichment", "Brand & exec protection"],
    careerPaths: ["CTI Analyst → Senior → Lead → Head of CTI"],
    skills: ["OSINT", "Diamond Model", "Malware triage", "Geopolitics"],
    teamSize: "18 analysts",
    impact: "Briefs 9 exec committees quarterly",
    stack: ["Recorded Future", "MISP", "Maltego", "Anomali"],
    openPositions: 3,
  },
  {
    name: "Threat Hunting",
    code: "HUNT",
    mission: "Find what detections miss — before adversaries find us.",
    responsibilities: ["Hypothesis-driven hunts", "Detection gap analysis", "Purple exchange"],
    careerPaths: ["Hunter → Senior Hunter → Lead → Detection Engineering Lead"],
    skills: ["EDR telemetry", "Sigma", "Python", "MITRE ATT&CK", "Cloud logs"],
    teamSize: "14 hunters",
    impact: "37 new detections shipped last quarter",
    stack: ["Jupyter", "Sigma", "Elastic", "BigQuery"],
    openPositions: 2,
  },
  {
    name: "Incident Response",
    code: "IR",
    mission: "Lead GFS through the worst days — with clarity and control.",
    responsibilities: ["Major incident command", "Comms & legal liaison", "Post-incident learning"],
    careerPaths: ["IR Analyst → IR Lead → IR Manager → Head of IR"],
    skills: ["Forensics", "Cloud IR", "Crisis comms", "Playbooks"],
    teamSize: "22 responders",
    impact: "Zero material breaches in 24 months",
    stack: ["Velociraptor", "Chronicle", "Slack IR", "PagerDuty"],
    openPositions: 4,
  },
  {
    name: "Digital Forensics",
    code: "DFIR",
    mission: "Reconstruct truth from evidence — host, cloud, memory and mobile.",
    responsibilities: ["Host & memory forensics", "Cloud IR", "Court-ready evidence"],
    careerPaths: ["DFIR Analyst → Senior → Principal Forensic Investigator"],
    skills: ["Volatility", "Autopsy", "AWS/Azure forensics", "Chain of custody"],
    teamSize: "12 investigators",
    impact: "Supports Legal, HR and Regulatory workflows",
    stack: ["Velociraptor", "X-Ways", "Magnet Axiom"],
    openPositions: 2,
  },
  {
    name: "Malware Research",
    code: "MAL",
    mission: "Understand what attacks GFS at the binary level.",
    responsibilities: ["Reverse engineering", "YARA authoring", "Detection handoff"],
    careerPaths: ["Malware Analyst → Senior RE → Principal Researcher"],
    skills: ["Assembly", "IDA/Ghidra", "Sandboxing", "Windows internals"],
    teamSize: "8 researchers",
    impact: "Publishes internal threat teardowns monthly",
    stack: ["Ghidra", "IDA Pro", "CAPE", "YARA"],
    openPositions: 1,
  },
  {
    name: "Application Security",
    code: "AppSec",
    mission: "Ship secure software with product teams, not against them.",
    responsibilities: ["Threat modeling", "SAST/DAST", "Secure code review", "Champions program"],
    careerPaths: ["AppSec Engineer → Senior → Principal → AppSec Architect"],
    skills: ["OWASP", "Threat modeling", "Cloud native", "Languages"],
    teamSize: "34 engineers",
    impact: "Embedded with 62 product squads",
    stack: ["Semgrep", "Snyk", "Burp", "GitHub Advanced Security"],
    openPositions: 6,
  },
  {
    name: "Cloud Security",
    code: "CloudSec",
    mission: "Make secure the paved road across AWS, Azure and GCP.",
    responsibilities: ["Landing zones", "CSPM/CWPP", "Workload identity", "Data protection"],
    careerPaths: ["Cloud Sec Engineer → Senior → Cloud Security Architect"],
    skills: ["IaC", "Kubernetes", "IAM", "Detection as code"],
    teamSize: "28 engineers",
    impact: "Protects 4,200+ cloud accounts",
    stack: ["Wiz", "Prisma Cloud", "Terraform", "OPA"],
    openPositions: 5,
  },
  {
    name: "Identity & Access Management",
    code: "IAM",
    mission: "Right person, right access, right time — everywhere at GFS.",
    responsibilities: ["Workforce & workload identity", "PAM", "Access reviews", "Federation"],
    careerPaths: ["IAM Engineer → Senior → Principal → IAM Architect"],
    skills: ["OIDC/SAML", "Okta/Entra", "PAM", "Zero Trust"],
    teamSize: "24 engineers",
    impact: "1.2M identities under management",
    stack: ["Okta", "Entra ID", "CyberArk", "SailPoint"],
    openPositions: 4,
  },
  {
    name: "Governance, Risk & Compliance",
    code: "GRC",
    mission: "Translate cyber risk into a language the business decides on.",
    responsibilities: ["Policy", "Risk register", "Regulatory response", "Third-party risk"],
    careerPaths: ["GRC Analyst → Risk Consultant → GRC Manager → Head of GRC"],
    skills: ["NIST CSF", "ISO 27001", "DORA", "PCI DSS", "SOX"],
    teamSize: "40 professionals",
    impact: "Owns response to 9 regulators globally",
    stack: ["Archer", "ServiceNow GRC", "OneTrust"],
    openPositions: 7,
  },
  {
    name: "Security Engineering",
    code: "SecEng",
    mission: "Build and run the security platform GFS depends on.",
    responsibilities: ["Tooling", "Automation", "Platform reliability", "Detection infra"],
    careerPaths: ["Security Engineer → Senior → Principal → Distinguished Engineer"],
    skills: ["Python/Go", "Kubernetes", "SRE", "APIs"],
    teamSize: "45 engineers",
    impact: "Runs the shared control plane for all of Cyber",
    stack: ["Kubernetes", "Kafka", "Terraform", "Argo"],
    openPositions: 6,
  },
  {
    name: "Security Architecture",
    code: "Arch",
    mission: "Set the technical direction of GFS cybersecurity for the next 5 years.",
    responsibilities: ["Reference architectures", "Standards", "Design authority", "Roadmaps"],
    careerPaths: ["Architect → Principal → Chief Architect"],
    skills: ["Systems thinking", "Enterprise architecture", "TOGAF", "Business acumen"],
    teamSize: "16 architects",
    impact: "Owns 27 domain reference architectures",
    stack: ["Ardoq", "LucidChart", "Confluence"],
    openPositions: 2,
  },
  {
    name: "DevSecOps",
    code: "DevSecOps",
    mission: "Make the secure way the easy way for every engineering team.",
    responsibilities: ["Pipeline guardrails", "Policy as code", "Paved roads", "Developer platforms"],
    careerPaths: ["DevSecOps Engineer → Senior → Platform Lead"],
    skills: ["CI/CD", "OPA/Rego", "Kubernetes", "Supply chain"],
    teamSize: "22 engineers",
    impact: "Guardrails on 3,800+ pipelines",
    stack: ["GitHub Actions", "ArgoCD", "OPA", "Sigstore"],
    openPositions: 3,
  },
  {
    name: "Red Team",
    code: "Red",
    mission: "Emulate the adversaries that actually target global finance.",
    responsibilities: ["Operations", "TIBER-EU exercises", "Custom tooling"],
    careerPaths: ["Operator → Senior Operator → Red Team Lead"],
    skills: ["OffSec", "C2 development", "Cloud attack paths", "OpSec"],
    teamSize: "10 operators",
    impact: "Runs 6 full-scope engagements a year",
    stack: ["Cobalt Strike", "BloodHound", "Custom C2"],
    openPositions: 1,
  },
  {
    name: "Blue Team",
    code: "Blue",
    mission: "Defenders who build, tune and operate the controls that catch red.",
    responsibilities: ["Detection engineering", "Deception", "Hardening"],
    careerPaths: ["Blue Engineer → Senior → Detection Engineering Lead"],
    skills: ["Sigma", "EDR", "Cloud logs", "Purple exchange"],
    teamSize: "26 engineers",
    impact: "1,240 production detections owned",
    stack: ["Sigma", "Elastic", "Sentinel", "CrowdStrike"],
    openPositions: 4,
  },
  {
    name: "Purple Team",
    code: "Purple",
    mission: "The connective tissue between red and blue.",
    responsibilities: ["Adversary emulation exercises", "Detection validation", "ATT&CK coverage"],
    careerPaths: ["Purple Engineer → Senior → Program Lead"],
    skills: ["Atomic Red Team", "CALDERA", "Sigma", "Metrics"],
    teamSize: "6 engineers",
    impact: "ATT&CK coverage +38% in 12 months",
    stack: ["CALDERA", "Atomic Red Team", "VECTR"],
    openPositions: 1,
  },
  {
    name: "Security Awareness",
    code: "SAT",
    mission: "Turn 180,000 GFS employees into an active line of defense.",
    responsibilities: ["Phishing simulation", "Role-based training", "Culture"],
    careerPaths: ["Awareness Specialist → Manager → Head of Human Risk"],
    skills: ["Behavioral design", "Comms", "Metrics", "Content"],
    teamSize: "9 specialists",
    impact: "Phish click rate 24% → 3.1% in 18 months",
    stack: ["KnowBe4", "Hoxhunt", "Adobe Suite"],
    openPositions: 2,
  },
  {
    name: "Cyber Risk",
    code: "Risk",
    mission: "Quantify cyber risk so the business can price and prioritize it.",
    responsibilities: ["FAIR modeling", "Scenario analysis", "Board reporting"],
    careerPaths: ["Risk Analyst → Senior → Head of Cyber Risk"],
    skills: ["FAIR", "Statistics", "Business acumen", "Storytelling"],
    teamSize: "12 analysts",
    impact: "Top-10 risks refreshed each quarter",
    stack: ["RiskLens", "Archer", "Python"],
    openPositions: 2,
  },
  {
    name: "Compliance",
    code: "Comp",
    mission: "Prove — with evidence — that GFS controls actually work.",
    responsibilities: ["Controls testing", "Regulator interactions", "Attestations"],
    careerPaths: ["Compliance Analyst → Manager → Head of Compliance"],
    skills: ["Auditing", "Regulations", "Evidence", "Communication"],
    teamSize: "34 professionals",
    impact: "Passed 27 audits in the last 12 months",
    stack: ["Archer", "ServiceNow", "Drata"],
    openPositions: 3,
  },
  {
    name: "Audit",
    code: "Aud",
    mission: "Independent assurance to the board on cyber control effectiveness.",
    responsibilities: ["Internal audit", "Regulatory audit support", "Deep-dive reviews"],
    careerPaths: ["IT Auditor → Senior → Audit Manager → Head of IT Audit"],
    skills: ["CISA", "Sampling", "Report writing", "Independence"],
    teamSize: "18 auditors",
    impact: "12 deep-dive audits a year",
    stack: ["TeamMate", "ACL", "Excel"],
    openPositions: 1,
  },
];

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  businessUnit: string;
  experience: string;
  location: string;
  hiringManager: string;
  skillMatch: number; // 0..100
  eligibility: "Eligible now" | "Eligible in 6 mo" | "Eligible in 12 mo";
  learningPath: string;
  openings: number;
  promotion: boolean;
  level: "L1" | "L2" | "L3" | "Senior" | "Lead" | "Manager" | "Principal";
}

export const JOBS: JobPosting[] = [
  { id: "GFS-24011", title: "SOC Analyst L1", department: "SOC", businessUnit: "Global Cyber Defense", experience: "0–2 yrs", location: "Bengaluru · Hybrid", hiringManager: "Priya Nair", skillMatch: 82, eligibility: "Eligible now", learningPath: "SOC Foundations · Splunk · KQL", openings: 6, promotion: false, level: "L1" },
  { id: "GFS-24019", title: "SOC Analyst L2", department: "SOC", businessUnit: "Global Cyber Defense", experience: "2–4 yrs", location: "Warsaw · Hybrid", hiringManager: "Marek Kowalski", skillMatch: 71, eligibility: "Eligible in 6 mo", learningPath: "Detection Engineering · Cloud Logs", openings: 3, promotion: true, level: "L2" },
  { id: "GFS-24020", title: "Threat Hunter", department: "HUNT", businessUnit: "Global Cyber Defense", experience: "4–7 yrs", location: "Singapore · Onsite", hiringManager: "Wei Chen", skillMatch: 46, eligibility: "Eligible in 12 mo", learningPath: "ATT&CK · Sigma · Python for Hunters", openings: 2, promotion: true, level: "Senior" },
  { id: "GFS-24028", title: "Incident Responder", department: "IR", businessUnit: "Global Cyber Defense", experience: "3–6 yrs", location: "Frankfurt · Hybrid", hiringManager: "Lena Krüger", skillMatch: 58, eligibility: "Eligible in 6 mo", learningPath: "IR Playbooks · Cloud Forensics", openings: 2, promotion: false, level: "Senior" },
  { id: "GFS-24031", title: "Detection Engineer", department: "Blue", businessUnit: "Cyber Engineering", experience: "3–6 yrs", location: "London · Hybrid", hiringManager: "Daniel Osei", skillMatch: 63, eligibility: "Eligible in 6 mo", learningPath: "Sigma · Detection-as-Code", openings: 2, promotion: false, level: "Senior" },
  { id: "GFS-24044", title: "Security Engineer", department: "SecEng", businessUnit: "Cyber Engineering", experience: "2–5 yrs", location: "Toronto · Hybrid", hiringManager: "Sofia Alvarez", skillMatch: 74, eligibility: "Eligible now", learningPath: "Python · Kubernetes · Security Automation", openings: 4, promotion: false, level: "L2" },
  { id: "GFS-24052", title: "Cloud Security Engineer", department: "CloudSec", businessUnit: "Cyber Engineering", experience: "3–6 yrs", location: "Dublin · Remote", hiringManager: "Ronan Byrne", skillMatch: 61, eligibility: "Eligible in 6 mo", learningPath: "AWS Security · CSPM · IaC", openings: 3, promotion: false, level: "Senior" },
  { id: "GFS-24067", title: "Application Security Engineer", department: "AppSec", businessUnit: "Cyber Engineering", experience: "3–6 yrs", location: "Austin · Hybrid", hiringManager: "Jamal Thompson", skillMatch: 55, eligibility: "Eligible in 6 mo", learningPath: "Threat Modeling · SAST · Secure SDLC", openings: 5, promotion: false, level: "Senior" },
  { id: "GFS-24071", title: "DevSecOps Engineer", department: "DevSecOps", businessUnit: "Platform Engineering", experience: "3–6 yrs", location: "Amsterdam · Hybrid", hiringManager: "Femke de Vries", skillMatch: 68, eligibility: "Eligible in 6 mo", learningPath: "OPA · Supply Chain · CI/CD Guardrails", openings: 3, promotion: false, level: "Senior" },
  { id: "GFS-24079", title: "IAM Engineer", department: "IAM", businessUnit: "Cyber Engineering", experience: "3–6 yrs", location: "Bengaluru · Hybrid", hiringManager: "Anitha Rao", skillMatch: 59, eligibility: "Eligible in 6 mo", learningPath: "Okta · Entra · PAM · Zero Trust", openings: 3, promotion: false, level: "Senior" },
  { id: "GFS-24084", title: "GRC Analyst", department: "GRC", businessUnit: "Cyber Risk & Governance", experience: "1–4 yrs", location: "New York · Hybrid", hiringManager: "Rachel Levine", skillMatch: 77, eligibility: "Eligible now", learningPath: "NIST CSF · ISO 27001 · Controls Testing", openings: 4, promotion: false, level: "L2" },
  { id: "GFS-24088", title: "Security Consultant", department: "GRC", businessUnit: "Cyber Advisory", experience: "3–7 yrs", location: "Zurich · Hybrid", hiringManager: "Matthias Berger", skillMatch: 52, eligibility: "Eligible in 12 mo", learningPath: "Advisory · M&A Diligence", openings: 2, promotion: true, level: "Senior" },
  { id: "GFS-24091", title: "Malware Analyst", department: "MAL", businessUnit: "Global Cyber Defense", experience: "4–8 yrs", location: "Tel Aviv · Onsite", hiringManager: "Noa Cohen", skillMatch: 34, eligibility: "Eligible in 12 mo", learningPath: "Ghidra · Windows Internals · YARA", openings: 1, promotion: true, level: "Senior" },
  { id: "GFS-24095", title: "Threat Intelligence Analyst", department: "CTI", businessUnit: "Global Cyber Defense", experience: "2–5 yrs", location: "London · Hybrid", hiringManager: "Aoife Doyle", skillMatch: 64, eligibility: "Eligible in 6 mo", learningPath: "OSINT · Diamond Model · Reporting", openings: 2, promotion: false, level: "L2" },
  { id: "GFS-24099", title: "Digital Forensics Analyst", department: "DFIR", businessUnit: "Global Cyber Defense", experience: "3–6 yrs", location: "São Paulo · Hybrid", hiringManager: "Bruno Cardoso", skillMatch: 42, eligibility: "Eligible in 12 mo", learningPath: "Host Forensics · Cloud IR · Chain of Custody", openings: 1, promotion: false, level: "Senior" },
  { id: "GFS-24104", title: "Red Team Operator", department: "Red", businessUnit: "Offensive Security", experience: "5–8 yrs", location: "London · Onsite", hiringManager: "Elena Petrova", skillMatch: 39, eligibility: "Eligible in 12 mo", learningPath: "OSEP · C2 Dev · Cloud Attack Paths", openings: 1, promotion: true, level: "Senior" },
  { id: "GFS-24110", title: "Blue Team Engineer", department: "Blue", businessUnit: "Global Cyber Defense", experience: "3–6 yrs", location: "Dublin · Hybrid", hiringManager: "Ciara Walsh", skillMatch: 66, eligibility: "Eligible in 6 mo", learningPath: "Sigma · EDR Tuning · Purple Exchange", openings: 3, promotion: false, level: "Senior" },
  { id: "GFS-24118", title: "Purple Team Specialist", department: "Purple", businessUnit: "Offensive Security", experience: "5–8 yrs", location: "Berlin · Hybrid", hiringManager: "Jonas Fischer", skillMatch: 44, eligibility: "Eligible in 12 mo", learningPath: "ATT&CK Emulation · CALDERA · VECTR", openings: 1, promotion: true, level: "Lead" },
  { id: "GFS-24123", title: "Security Architect", department: "Arch", businessUnit: "Cyber Architecture", experience: "8–12 yrs", location: "New York · Hybrid", hiringManager: "Isabella Romano", skillMatch: 31, eligibility: "Eligible in 12 mo", learningPath: "Reference Architectures · Design Authority", openings: 2, promotion: true, level: "Principal" },
  { id: "GFS-24128", title: "Cloud Security Architect", department: "CloudSec", businessUnit: "Cyber Architecture", experience: "8–12 yrs", location: "Sydney · Hybrid", hiringManager: "Liam O'Connor", skillMatch: 28, eligibility: "Eligible in 12 mo", learningPath: "Cloud Native Patterns · Zero Trust", openings: 1, promotion: true, level: "Principal" },
  { id: "GFS-24134", title: "SOC Manager", department: "SOC", businessUnit: "Global Cyber Defense", experience: "7–10 yrs", location: "Bengaluru · Onsite", hiringManager: "Vikram Shah", skillMatch: 22, eligibility: "Eligible in 12 mo", learningPath: "SOC Leadership · KPIs · People Management", openings: 1, promotion: true, level: "Manager" },
];

export const ORG_TREE: {
  name: string;
  title: string;
  color: string;
  children: { name: string; open: number }[];
}[] = [
  {
    name: "Chief Information Security Officer",
    title: "CISO · Reports to Group CIO & Board Risk Committee",
    color: "cyan",
    children: [
      { name: "Security Architecture", open: 2 },
      { name: "Cyber Defense (SOC · IR · CTI · Hunt)", open: 25 },
      { name: "Cyber Engineering (SecEng · AppSec · CloudSec · IAM · DevSecOps)", open: 24 },
      { name: "Offensive Security (Red · Purple · Vuln)", open: 4 },
      { name: "Cyber Risk & Governance (GRC · Risk · Compliance · Audit)", open: 13 },
      { name: "Security Awareness & Human Risk", open: 2 },
    ],
  },
];

export interface ExplorerTrack {
  name: string;
  tint: string;
  steps: { title: string; band: string; years: string }[];
}

export const EXPLORER_TRACKS: ExplorerTrack[] = [
  {
    name: "Security Operations Center",
    tint: "cyan",
    steps: [
      { title: "SOC Analyst L1", band: "S1", years: "0–2" },
      { title: "SOC Analyst L2", band: "S2", years: "2–4" },
      { title: "SOC Analyst L3", band: "S3", years: "4–6" },
      { title: "SOC Lead", band: "S4", years: "6–8" },
      { title: "SOC Manager", band: "M3", years: "8–11" },
      { title: "Head of SecOps", band: "M5", years: "11–14" },
      { title: "Director Cybersecurity", band: "D1", years: "14+" },
    ],
  },
  {
    name: "Red Team",
    tint: "rose",
    steps: [
      { title: "Vulnerability Analyst", band: "O2", years: "1–3" },
      { title: "Penetration Tester", band: "O3", years: "3–5" },
      { title: "Red Team Operator", band: "O4", years: "5–8" },
      { title: "Senior Red Operator", band: "O5", years: "8–10" },
      { title: "Red Team Lead", band: "M4", years: "10–13" },
      { title: "Head of Offensive Security", band: "M5", years: "13+" },
    ],
  },
  {
    name: "Cloud Security",
    tint: "emerald",
    steps: [
      { title: "Cloud Ops Engineer", band: "T3", years: "1–3" },
      { title: "Cloud Security Engineer", band: "E3", years: "3–5" },
      { title: "Senior Cloud Sec Engineer", band: "E4", years: "5–8" },
      { title: "Cloud Security Architect", band: "A4", years: "8–11" },
      { title: "Principal Cloud Architect", band: "A5", years: "11–14" },
      { title: "Director Cloud Security", band: "D1", years: "14+" },
    ],
  },
  {
    name: "Governance, Risk & Compliance",
    tint: "amber",
    steps: [
      { title: "GRC Analyst", band: "G2", years: "1–3" },
      { title: "Risk Consultant", band: "G3", years: "3–5" },
      { title: "Compliance Specialist", band: "G3", years: "3–6" },
      { title: "GRC Manager", band: "M3", years: "7–10" },
      { title: "Head of GRC", band: "M5", years: "11–14" },
      { title: "Director Cyber Risk", band: "D1", years: "14+" },
    ],
  },
  {
    name: "Identity & Access Management",
    tint: "violet",
    steps: [
      { title: "IAM Analyst", band: "E2", years: "1–3" },
      { title: "IAM Engineer", band: "E3", years: "3–5" },
      { title: "Senior IAM Engineer", band: "E4", years: "5–8" },
      { title: "IAM Architect", band: "A4", years: "8–11" },
      { title: "Head of IAM", band: "M5", years: "11+" },
    ],
  },
  {
    name: "Application Security",
    tint: "cyan",
    steps: [
      { title: "AppSec Engineer", band: "E2", years: "1–3" },
      { title: "Senior AppSec Engineer", band: "E3", years: "3–6" },
      { title: "Principal AppSec Engineer", band: "E4", years: "6–9" },
      { title: "AppSec Architect", band: "A4", years: "9–12" },
      { title: "Head of AppSec", band: "M5", years: "12+" },
    ],
  },
];

export interface SkillRow {
  skill: string;
  category: "Foundations" | "Security" | "Programming" | "Governance" | "Adversary";
  roles: Partial<Record<
    | "SOC"
    | "IR"
    | "Hunt"
    | "CTI"
    | "AppSec"
    | "CloudSec"
    | "IAM"
    | "GRC"
    | "Red"
    | "Blue"
    | "Purple"
    | "Arch",
    1 | 2 | 3
  >>;
}

export const SKILL_MATRIX: SkillRow[] = [
  { skill: "Linux", category: "Foundations", roles: { SOC: 2, IR: 3, Hunt: 3, CloudSec: 3, Red: 3, Blue: 2, Arch: 2 } },
  { skill: "Windows / AD", category: "Foundations", roles: { SOC: 3, IR: 3, Hunt: 3, IAM: 3, Red: 3, Blue: 3 } },
  { skill: "Networking", category: "Foundations", roles: { SOC: 3, IR: 2, Hunt: 2, CloudSec: 3, Red: 3, Blue: 3, Arch: 3 } },
  { skill: "Cloud (AWS/Azure/GCP)", category: "Foundations", roles: { SOC: 2, IR: 3, Hunt: 3, AppSec: 2, CloudSec: 3, IAM: 3, Red: 3, Blue: 2, Arch: 3 } },
  { skill: "Python", category: "Programming", roles: { SOC: 2, IR: 2, Hunt: 3, CTI: 2, AppSec: 3, CloudSec: 2, Red: 3, Blue: 3 } },
  { skill: "PowerShell", category: "Programming", roles: { SOC: 3, IR: 3, Hunt: 3, IAM: 2, Red: 3, Blue: 3 } },
  { skill: "SIEM & Detection", category: "Security", roles: { SOC: 3, IR: 3, Hunt: 3, Blue: 3, Purple: 3 } },
  { skill: "Threat Hunting", category: "Adversary", roles: { SOC: 2, IR: 2, Hunt: 3, CTI: 2, Blue: 3, Purple: 3 } },
  { skill: "Forensics", category: "Security", roles: { IR: 3, Hunt: 2, Blue: 2 } },
  { skill: "Malware Analysis", category: "Adversary", roles: { IR: 2, Hunt: 2, CTI: 3, Blue: 2 } },
  { skill: "MITRE ATT&CK", category: "Adversary", roles: { SOC: 3, IR: 3, Hunt: 3, CTI: 3, Red: 3, Blue: 3, Purple: 3 } },
  { skill: "NIST CSF / ISO 27001", category: "Governance", roles: { GRC: 3, Arch: 3, AppSec: 2, CloudSec: 2 } },
  { skill: "Risk Quantification", category: "Governance", roles: { GRC: 3, Arch: 2 } },
  { skill: "Compliance (PCI/DORA/SOX)", category: "Governance", roles: { GRC: 3, IAM: 2, CloudSec: 2 } },
  { skill: "Purple Team Ops", category: "Adversary", roles: { Red: 3, Blue: 3, Purple: 3 } },
  { skill: "Detection Engineering", category: "Security", roles: { Hunt: 3, Blue: 3, Purple: 3, SOC: 2 } },
  { skill: "IAM / Zero Trust", category: "Security", roles: { IAM: 3, CloudSec: 3, Arch: 3 } },
  { skill: "Secure SDLC", category: "Security", roles: { AppSec: 3, Arch: 3, CloudSec: 2 } },
];

export const RELATIONSHIP_GRAPH: { from: string; to: string; via: string }[] = [
  { from: "SOC", to: "Incident Response", via: "Escalation" },
  { from: "Incident Response", to: "Threat Hunting", via: "Lessons learned" },
  { from: "Threat Hunting", to: "Malware Research", via: "Sample handoff" },
  { from: "Malware Research", to: "Detection Engineering", via: "Signatures & TTPs" },
  { from: "Detection Engineering", to: "Threat Intelligence", via: "Priorities" },
  { from: "Threat Intelligence", to: "Purple Team", via: "Adversary emulation" },
  { from: "Purple Team", to: "Security Engineering", via: "Control gaps" },
  { from: "Security Engineering", to: "Security Architecture", via: "Standards" },
  { from: "Cloud Security", to: "Security Architecture", via: "Reference patterns" },
  { from: "IAM", to: "Cloud Security", via: "Workload identity" },
  { from: "AppSec", to: "DevSecOps", via: "Pipeline guardrails" },
  { from: "GRC", to: "Cyber Risk", via: "Risk register" },
  { from: "Cyber Risk", to: "Security Architecture", via: "Roadmap inputs" },
];

export const JOURNEY = {
  current: {
    role: "SOC Analyst L1",
    department: "Global Cyber Defense",
    startedAt: "Jan 2026",
  },
  next: {
    role: "SOC Analyst L2",
    band: "S2",
    expected: "9–14 months",
    salaryRange: "+18% to +26% (illustrative range, not a guarantee)",
    readiness: 68,
  },
  requiredSkills: [
    { name: "Advanced SIEM (Splunk/Sentinel)", have: true },
    { name: "KQL / SPL at scale", have: true },
    { name: "Cloud log analysis (AWS/Azure)", have: false },
    { name: "Detection tuning", have: false },
    { name: "Python for analysts", have: true },
    { name: "MITRE ATT&CK mapping", have: true },
    { name: "Purple team exchange", have: false },
  ],
  labs: [
    "Cloud SOC Simulator · GFS-Lab-207",
    "Detection-as-Code Workshop",
    "Ransomware Playbook Drill",
  ],
  modules: [
    "CyberOS · Cloud Detection Fundamentals",
    "CyberOS · Detection Engineering with Sigma",
    "CyberOS · Python for Security Analysts",
  ],
  certifications: ["CompTIA CySA+", "Splunk Core Certified Power User", "AZ-500 · Azure Security"],
  projects: [
    "Rotate through IR on-call for 2 sprints",
    "Ship 5 production detections with the Blue Team",
    "Present a post-incident retro to Cyber Defense leadership",
  ],
};