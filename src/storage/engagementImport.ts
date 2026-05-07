import type {
  AttackChainStep,
  ActivityEvent,
  ChainPhase,
  Engagement,
  EngagementStatus,
  EvidenceItem,
  Finding,
  FindingSeverity,
  OpsecNote,
  ScopeTarget,
  TargetPriority,
  TargetType,
  TaskItem,
  TaskStatus
} from "../models/engagement";
import { createActivity, createId, hydrateEngagement, nowIso } from "./engagementStore";

type UnknownRecord = Record<string, unknown>;

const engagementStatuses: EngagementStatus[] = ["Planning", "Active", "Reporting", "Closed"];
const targetTypes: TargetType[] = ["Web App", "API", "Host", "Cloud", "Identity", "Other"];
const priorities: TargetPriority[] = ["Low", "Medium", "High", "Critical"];
const taskStatuses: TaskStatus[] = ["Backlog", "In Progress", "Blocked", "Done"];
const severities: FindingSeverity[] = ["Info", "Low", "Medium", "High", "Critical"];
const phases: ChainPhase[] = [
  "Recon",
  "Initial Access Simulation",
  "Privilege Review",
  "Lateral Movement Analysis",
  "Impact Validation",
  "Reporting"
];
const evidenceTypes: EvidenceItem["type"][] = [
  "Screenshot",
  "Log Excerpt",
  "Request Metadata",
  "Meeting Note",
  "Other"
];
const opsecCategories: OpsecNote["category"][] = [
  "Authorization",
  "Data Handling",
  "Identity",
  "Comms",
  "Detection",
  "Safety"
];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function stringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T) {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function records(value: unknown) {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function normalizeTarget(value: UnknownRecord): ScopeTarget {
  return {
    id: stringValue(value.id, createId("target")),
    name: stringValue(value.name, "Imported target"),
    type: enumValue(value.type, targetTypes, "Other"),
    owner: stringValue(value.owner, "Unassigned"),
    priority: enumValue(value.priority, priorities, "Medium"),
    inScope: typeof value.inScope === "boolean" ? value.inScope : true,
    notes: stringValue(value.notes, "")
  };
}

function normalizeTask(value: UnknownRecord): TaskItem {
  return {
    id: stringValue(value.id, createId("task")),
    title: stringValue(value.title, "Imported task"),
    status: enumValue(value.status, taskStatuses, "Backlog"),
    owner: stringValue(value.owner, "Unassigned"),
    dueDate: stringValue(value.dueDate, "")
  };
}

function normalizeFinding(value: UnknownRecord): Finding {
  return {
    id: stringValue(value.id, createId("finding")),
    title: stringValue(value.title, "Imported finding"),
    severity: enumValue(value.severity, severities, "Medium"),
    targetId: stringValue(value.targetId, ""),
    status: enumValue(
      value.status,
      ["Open", "Validated", "Ready for Report", "Closed"] as const,
      "Open"
    ),
    mitreIds: stringList(value.mitreIds),
    summary: stringValue(value.summary, "Imported finding summary pending review."),
    recommendation: stringValue(value.recommendation, "Imported recommendation pending review.")
  };
}

function normalizeEvidence(value: UnknownRecord): EvidenceItem {
  return {
    id: stringValue(value.id, createId("evidence")),
    label: stringValue(value.label, "Imported evidence metadata"),
    type: enumValue(value.type, evidenceTypes, "Other"),
    linkedFindingId: stringValue(value.linkedFindingId, ""),
    timestamp: stringValue(value.timestamp, nowIso()),
    source: stringValue(value.source, "Imported workspace"),
    notes: stringValue(value.notes, "Imported metadata record.")
  };
}

function normalizeStep(value: UnknownRecord): AttackChainStep {
  return {
    id: stringValue(value.id, createId("chain")),
    phase: enumValue(value.phase, phases, "Reporting"),
    title: stringValue(value.title, "Imported timeline step"),
    timestamp: stringValue(value.timestamp, nowIso()),
    targetId: stringValue(value.targetId, ""),
    mitreIds: stringList(value.mitreIds),
    evidenceIds: stringList(value.evidenceIds),
    operatorNote: stringValue(value.operatorNote, "Imported operator note pending review.")
  };
}

function normalizeOpsec(value: UnknownRecord): OpsecNote {
  return {
    id: stringValue(value.id, createId("opsec")),
    category: enumValue(value.category, opsecCategories, "Safety"),
    note: stringValue(value.note, "Imported OPSEC note."),
    owner: stringValue(value.owner, "Unassigned"),
    reviewed: typeof value.reviewed === "boolean" ? value.reviewed : false
  };
}

function normalizeActivity(value: UnknownRecord): ActivityEvent {
  return {
    id: stringValue(value.id, createId("activity")),
    timestamp: stringValue(value.timestamp, nowIso()),
    category: enumValue(
      value.category,
      [
        "workspace",
        "engagement",
        "scope",
        "task",
        "finding",
        "evidence",
        "timeline",
        "opsec",
        "playbook",
        "import",
        "export"
      ] as const,
      "import"
    ),
    message: stringValue(value.message, "Imported activity event.")
  };
}

export function parseEngagementJson(content: string): Engagement {
  const parsed: unknown = JSON.parse(content);
  if (!isRecord(parsed)) {
    throw new Error("Engagement import must be a JSON object.");
  }

  const name = stringValue(parsed.name, "");
  const client = stringValue(parsed.client, "");
  const codename = stringValue(parsed.codename, "");

  if (!name || !client || !codename) {
    throw new Error("Engagement import requires name, client, and codename.");
  }

  return hydrateEngagement({
    id: stringValue(parsed.id, createId("eng")),
    name,
    client,
    codename,
    status: enumValue(parsed.status, engagementStatuses, "Planning"),
    startDate: stringValue(parsed.startDate, new Date().toISOString().slice(0, 10)),
    endDate: stringValue(parsed.endDate, new Date().toISOString().slice(0, 10)),
    rulesOfEngagement: stringValue(
      parsed.rulesOfEngagement,
      "Imported rules of engagement pending review."
    ),
    objectives: stringList(parsed.objectives),
    targets: records(parsed.targets).map(normalizeTarget),
    tasks: records(parsed.tasks).map(normalizeTask),
    findings: records(parsed.findings).map(normalizeFinding),
    evidence: records(parsed.evidence).map(normalizeEvidence),
    attackChain: records(parsed.attackChain).map(normalizeStep),
    opsecNotes: records(parsed.opsecNotes).map(normalizeOpsec),
    activityLog: [
      createActivity("import", "Imported engagement JSON into the local workspace."),
      ...records(parsed.activityLog).map(normalizeActivity)
    ],
    updatedAt: nowIso()
  });
}
