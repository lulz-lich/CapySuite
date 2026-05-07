import { sampleEngagement } from "../data/sampleEngagement";
import type { ActivityCategory, ActivityEvent, Engagement } from "../models/engagement";

const STORAGE_KEY = "capysuite.engagements.v1";
const ACTIVE_KEY = "capysuite.activeEngagementId.v1";

export function nowIso() {
  return new Date().toISOString();
}

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createActivity(category: ActivityCategory, message: string): ActivityEvent {
  return {
    id: createId("activity"),
    timestamp: nowIso(),
    category,
    message
  };
}

export function hydrateEngagement(engagement: Engagement): Engagement {
  return {
    ...engagement,
    objectives: engagement.objectives ?? [],
    targets: engagement.targets ?? [],
    tasks: engagement.tasks ?? [],
    findings: engagement.findings ?? [],
    evidence: engagement.evidence ?? [],
    attackChain: engagement.attackChain ?? [],
    opsecNotes: engagement.opsecNotes ?? [],
    activityLog: engagement.activityLog ?? [
      {
        id: "activity-imported-hydration",
        timestamp: engagement.updatedAt ?? nowIso(),
        category: "workspace",
        message: "Workspace record hydrated for the current CapySuite schema."
      }
    ],
    updatedAt: engagement.updatedAt ?? nowIso()
  };
}

export function createBlankEngagement(): Engagement {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: createId("eng"),
    name: "New Authorized Assessment",
    client: "Client Name",
    codename: "NEW OPERATION",
    status: "Planning",
    startDate: today,
    endDate: today,
    rulesOfEngagement:
      "Document written authorization, approved assets, excluded activities, emergency contacts, data handling rules, and stop conditions before assessment work begins.",
    objectives: ["Define authorized assessment objectives."],
    targets: [],
    tasks: [],
    findings: [],
    evidence: [],
    attackChain: [],
    opsecNotes: [],
    activityLog: [createActivity("engagement", "Created a new authorized assessment workspace.")],
    updatedAt: nowIso()
  };
}

export function loadEngagements(): Engagement[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [hydrateEngagement(sampleEngagement)];
  }

  try {
    const parsed = JSON.parse(stored) as Engagement[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map(hydrateEngagement)
      : [hydrateEngagement(sampleEngagement)];
  } catch {
    return [hydrateEngagement(sampleEngagement)];
  }
}

export function saveEngagements(engagements: Engagement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(engagements));
}

export function loadActiveEngagementId() {
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveEngagementId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}

export function resetToSample() {
  const sample = hydrateEngagement(sampleEngagement);
  saveEngagements([sample]);
  saveActiveEngagementId(sampleEngagement.id);
  return [sample];
}
