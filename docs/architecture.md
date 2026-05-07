# CapySuite Architecture

CapySuite is a frontend-only React and TypeScript application designed to be simple to run, easy to review, and ready for future backend integration.

## Layers

```text
src/models/
  Engagement data model, domain types, and analytics helpers.

src/data/
  Sample engagement seed data, safe MITRE quick-reference catalog, and playbook packs.

src/storage/
  LocalStorage persistence, engagement creation helpers, and JSON import normalization.

src/export/
  Markdown and JSON export utilities.

src/tools/
  Local-only safe analysis utilities for scope, headers, token hygiene, IOCs, and finding drafts.

src/components/
  Focused dashboard panels for each workflow area.

src/hooks/
  Workspace state, persistence, and engagement actions.

src/pages/
  Main operations dashboard and state orchestration.
```

## Persistence

The current stable release uses LocalStorage under versioned keys:

```text
capysuite.engagements.v1
capysuite.activeEngagementId.v1
```

This keeps the app backend-free while preserving a clear migration path to an API later.

## Data Model

The engagement model includes:

- Engagement profile.
- Objectives and rules of engagement.
- Scope targets.
- Tasks.
- Findings.
- Evidence metadata.
- Attack-chain timeline steps.
- OPSEC notes.

## Analytics

CapySuite computes local, deterministic operational analytics:

- Readiness score.
- Safety and hygiene checks.
- Severity counts.
- MITRE coverage.
- Contextual operator log lines.
- Local-only workbench outputs.
- Executive brief summary and next-action prompts.

These analytics are derived from local engagement data and do not perform external calls.

## Safe Tool Workbench

The workbench provides browser-local helper utilities:

- Scope Lens normalizes user-supplied authorized targets and flags review notes.
- Secret Hygiene identifies token-like text and redacts values.
- Header Review checks pasted response headers against common defensive controls.
- IOC Triage extracts URLs, domains, IPv4 addresses, hashes, and emails from sanitized text.
- Finding Draft builds report-ready Markdown language without exploit instructions.
- Evidence Sanitizer redacts sensitive values before text is copied into reports.

None of these tools perform network requests, credential validation, exploitation, phishing, persistence, C2, or destructive actions.

## Playbooks

Safe playbooks add objectives, tasks, and OPSEC notes to the active engagement. They are designed as workflow accelerators, not automated attack modules.

## Export Model

Exports are generated locally in the browser:

- Markdown for reports and handoffs.
- JSON for archival or future import workflows.

Markdown exports include operational snapshot data, severity matrix, tasks, scope, findings, attack-chain timeline, evidence metadata, and OPSEC notes.

CapySuite can also export a MITRE ATT&CK Navigator-compatible layer based on manually mapped technique IDs.

## Future Backend Path

A future FastAPI backend can preserve the current frontend model and add:

- User authentication.
- Workspace authorization.
- Server-side audit logging.
- File storage controls.
- Report template rendering.
- External case-management integrations.
