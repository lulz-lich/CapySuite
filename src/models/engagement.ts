export type EngagementStatus = "Planning" | "Active" | "Reporting" | "Closed";

export type TargetType = "Web App" | "API" | "Host" | "Cloud" | "Identity" | "Other";

export type TargetPriority = "Low" | "Medium" | "High" | "Critical";

export type TaskStatus = "Backlog" | "In Progress" | "Blocked" | "Done";

export type FindingSeverity = "Info" | "Low" | "Medium" | "High" | "Critical";

export type ChainPhase =
  | "Recon"
  | "Initial Access Simulation"
  | "Privilege Review"
  | "Lateral Movement Analysis"
  | "Impact Validation"
  | "Reporting";

export interface ScopeTarget {
  id: string;
  name: string;
  type: TargetType;
  owner: string;
  priority: TargetPriority;
  inScope: boolean;
  notes: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  owner: string;
  dueDate: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: FindingSeverity;
  targetId: string;
  status: "Open" | "Validated" | "Ready for Report" | "Closed";
  mitreIds: string[];
  summary: string;
  recommendation: string;
}

export interface EvidenceItem {
  id: string;
  label: string;
  type: "Screenshot" | "Log Excerpt" | "Request Metadata" | "Meeting Note" | "Other";
  linkedFindingId: string;
  timestamp: string;
  source: string;
  notes: string;
}

export interface AttackChainStep {
  id: string;
  phase: ChainPhase;
  title: string;
  timestamp: string;
  targetId: string;
  mitreIds: string[];
  evidenceIds: string[];
  operatorNote: string;
}

export interface OpsecNote {
  id: string;
  category: "Authorization" | "Data Handling" | "Identity" | "Comms" | "Detection" | "Safety";
  note: string;
  owner: string;
  reviewed: boolean;
}

export type ActivityCategory =
  | "workspace"
  | "engagement"
  | "scope"
  | "task"
  | "finding"
  | "evidence"
  | "timeline"
  | "opsec"
  | "playbook"
  | "import"
  | "export";

export interface ActivityEvent {
  id: string;
  timestamp: string;
  category: ActivityCategory;
  message: string;
}

export interface Engagement {
  id: string;
  name: string;
  client: string;
  codename: string;
  status: EngagementStatus;
  startDate: string;
  endDate: string;
  rulesOfEngagement: string;
  objectives: string[];
  targets: ScopeTarget[];
  tasks: TaskItem[];
  findings: Finding[];
  evidence: EvidenceItem[];
  attackChain: AttackChainStep[];
  opsecNotes: OpsecNote[];
  activityLog: ActivityEvent[];
  updatedAt: string;
}
