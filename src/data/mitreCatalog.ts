export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  safeUse: string;
}

export const mitreCatalog: MitreTechnique[] = [
  {
    id: "T1592",
    name: "Gather Victim Host Information",
    tactic: "Reconnaissance",
    safeUse: "Document asset metadata from approved sources."
  },
  {
    id: "T1595",
    name: "Active Scanning",
    tactic: "Reconnaissance",
    safeUse: "Reference only when scanning is explicitly authorized and rate-limited."
  },
  {
    id: "T1598",
    name: "Phishing for Information",
    tactic: "Reconnaissance",
    safeUse: "Use as a defensive awareness mapping note only; no phishing modules are provided."
  },
  {
    id: "T1087",
    name: "Account Discovery",
    tactic: "Discovery",
    safeUse: "Map approved identity review notes without collecting credentials."
  },
  {
    id: "T1046",
    name: "Network Service Discovery",
    tactic: "Discovery",
    safeUse: "Track authorized service inventory work without implementing scanners."
  },
  {
    id: "T1069",
    name: "Permission Groups Discovery",
    tactic: "Discovery",
    safeUse: "Document approved permission review findings."
  },
  {
    id: "T1552",
    name: "Unsecured Credentials",
    tactic: "Credential Access",
    safeUse: "Use for secret hygiene findings with redacted evidence metadata only."
  },
  {
    id: "T1078",
    name: "Valid Accounts",
    tactic: "Defense Evasion / Persistence",
    safeUse: "Document approved test-account assumptions without credential validation."
  },
  {
    id: "T1021",
    name: "Remote Services",
    tactic: "Lateral Movement",
    safeUse: "Reference authorized architecture review or tabletop analysis."
  },
  {
    id: "T1567",
    name: "Exfiltration Over Web Service",
    tactic: "Exfiltration",
    safeUse: "Use for detection-planning narratives, not data movement automation."
  }
];
