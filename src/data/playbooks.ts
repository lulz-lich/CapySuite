import type { OpsecNote, TaskItem } from "../models/engagement";

export interface SafePlaybook {
  id: string;
  name: string;
  focus: string;
  description: string;
  objectives: string[];
  tasks: Array<Omit<TaskItem, "id">>;
  opsecNotes: Array<Omit<OpsecNote, "id" | "reviewed">>;
}

export const safePlaybooks: SafePlaybook[] = [
  {
    id: "web-app-readiness",
    name: "Web App Assessment Readiness",
    focus: "Web / API",
    description: "Preparation workflow for authorized web application and API assessments.",
    objectives: [
      "Confirm routes, roles, test accounts, rate limits, and evidence handling expectations.",
      "Document defensive signal expectations before assessment execution."
    ],
    tasks: [
      {
        title: "Confirm staging tenant, test accounts, and excluded production routes",
        status: "Backlog",
        owner: "Lead Operator",
        dueDate: ""
      },
      {
        title: "Review application routes and business-critical workflows",
        status: "Backlog",
        owner: "Assessment Team",
        dueDate: ""
      },
      {
        title: "Prepare sanitized request metadata capture plan",
        status: "Backlog",
        owner: "Reporting",
        dueDate: ""
      }
    ],
    opsecNotes: [
      {
        category: "Authorization",
        note: "Confirm written approval for every route, tenant, and account used during web assessment activity.",
        owner: "Lead Operator"
      },
      {
        category: "Data Handling",
        note: "Store only sanitized request metadata and avoid copying tokens, cookies, customer records, or secrets.",
        owner: "Reporting"
      }
    ]
  },
  {
    id: "detection-validation",
    name: "Detection-Aware Validation",
    focus: "Blue Team Coordination",
    description: "Builds a defender-visible plan for authorized activity and report correlation.",
    objectives: [
      "Map each assessment step to expected logs, alerts, and ownership.",
      "Preserve timestamps and request IDs for blue-team review."
    ],
    tasks: [
      {
        title: "Define expected signals for each authorized assessment phase",
        status: "Backlog",
        owner: "Detection Liaison",
        dueDate: ""
      },
      {
        title: "Schedule blue-team correlation review",
        status: "Backlog",
        owner: "Detection Liaison",
        dueDate: ""
      },
      {
        title: "Document observed logging gaps and owner follow-up",
        status: "Backlog",
        owner: "Reporting",
        dueDate: ""
      }
    ],
    opsecNotes: [
      {
        category: "Detection",
        note: "Coordinate alert review using timestamps, source identity, request IDs, and sanitized evidence notes.",
        owner: "Detection Liaison"
      }
    ]
  },
  {
    id: "reporting-handoff",
    name: "Executive Reporting Handoff",
    focus: "Reporting",
    description:
      "Moves validated assessment work into professional report and remediation handoff.",
    objectives: [
      "Prepare executive narrative, technical finding details, and remediation owners.",
      "Ensure evidence metadata is sanitized and linked before final export."
    ],
    tasks: [
      {
        title: "Validate every finding has owner, target, recommendation, and evidence metadata",
        status: "Backlog",
        owner: "Reporting",
        dueDate: ""
      },
      {
        title: "Generate Markdown, JSON, and ATT&CK Navigator exports",
        status: "Backlog",
        owner: "Reporting",
        dueDate: ""
      },
      {
        title: "Run final OPSEC and sensitive-data review",
        status: "Backlog",
        owner: "Lead Operator",
        dueDate: ""
      }
    ],
    opsecNotes: [
      {
        category: "Safety",
        note: "Final report must not include credentials, secrets, exploit payloads, raw sensitive logs, or customer data.",
        owner: "Reporting"
      }
    ]
  }
];
