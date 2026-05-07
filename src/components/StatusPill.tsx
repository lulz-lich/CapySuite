import type { EngagementStatus, FindingSeverity, TaskStatus } from "../models/engagement";

type PillTone =
  | EngagementStatus
  | TaskStatus
  | FindingSeverity
  | "In Scope"
  | "Out of Scope"
  | "Reviewed"
  | "Open"
  | "Validated"
  | "Ready for Report"
  | "Present"
  | "Missing";

const toneClass: Record<string, string> = {
  Planning: "tone-cyan",
  Active: "tone-green",
  Reporting: "tone-amber",
  Closed: "tone-muted",
  Backlog: "tone-muted",
  "In Progress": "tone-cyan",
  Blocked: "tone-red",
  Done: "tone-green",
  Info: "tone-muted",
  Low: "tone-cyan",
  Medium: "tone-amber",
  High: "tone-orange",
  Critical: "tone-red",
  "In Scope": "tone-green",
  "Out of Scope": "tone-red",
  Reviewed: "tone-green",
  Open: "tone-amber",
  Validated: "tone-green",
  "Ready for Report": "tone-cyan",
  Present: "tone-green",
  Missing: "tone-red"
};

export function StatusPill({ value }: { value: PillTone | string }) {
  return <span className={`status-pill ${toneClass[value] ?? "tone-muted"}`}>{value}</span>;
}
