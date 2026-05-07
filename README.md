# CapySuite

CapySuite is a flagship Red Team operations platform for managing authorized security assessments. It helps operators document engagements, scope, targets, tasks, findings, evidence metadata, OPSEC notes, attack-chain timelines, and manual MITRE ATT&CK mapping in one polished workspace.

This stable release is a safe operations and documentation tool. It does not include exploit modules, malware, phishing, C2, credential theft, persistence, stealth abuse, destructive actions, or unauthorized automation.

## Highlights

- Create and manage Red Team engagements.
- Track scope, in-scope targets, and explicit exclusions.
- Manage assessment tasks and execution status.
- Record findings with severity, target links, recommendations, and MITRE ATT&CK IDs.
- Attach evidence metadata without storing sensitive evidence files.
- Build a simple attack-chain timeline for authorized assessment narratives.
- Maintain OPSEC notes for authorization, data handling, identity, communications, detection, and safety.
- Export engagement summaries to Markdown and JSON.
- Import existing engagement JSON files.
- Duplicate or delete local engagements.
- Review operational readiness with automated safety and hygiene checks.
- Visualize finding severity distribution and MITRE ATT&CK coverage.
- Generate an executive auto-brief from current engagement data.
- Apply safe operation playbooks for web, detection, and reporting workflows.
- Search across targets, findings, evidence, tasks, timeline steps, owners, and MITRE IDs.
- Export a MITRE ATT&CK Navigator layer from manual mappings.
- Use a built-in Safe Hacker Workbench for local-only analysis:
  - Scope Lens for passive URL and target normalization.
  - Secret Hygiene for redacted token-like signal review.
  - Header Review for browser defense header checks.
  - IOC Triage for sanitized indicator extraction.
  - Evidence Sanitizer for local redaction before reporting.
  - Finding Draft builder for professional report language.
- Use LocalStorage for a backend-free MVP.
- Includes a realistic sample engagement for portfolio review.

## Safety Boundary

CapySuite is designed for authorized assessments, security program management, reporting, and education. It intentionally avoids offensive automation and real-world abuse capabilities.

Appropriate use cases:

- Engagement planning.
- Scope tracking.
- Findings documentation.
- Evidence metadata management.
- Operator handoff notes.
- Detection-aware reporting.
- Manual MITRE ATT&CK mapping.

Out of scope:

- Exploitation.
- Malware or payload generation.
- Phishing.
- Command and control.
- Persistence.
- Credential collection or validation.
- Unauthorized scanning or automation.

## Tech Stack

- React
- TypeScript
- Vite
- Lucide React icons
- LocalStorage persistence
- Vitest
- ESLint
- Prettier
- GitHub Actions CI

## Project Structure

```text
capysuite/
  src/
    components/        # Dashboard panels and reusable UI
    hooks/             # Workspace state and action orchestration
    pages/             # Main operations dashboard
    models/            # TypeScript engagement model and analytics
    storage/           # LocalStorage persistence and import normalization
    export/            # Markdown and JSON export logic
    tools/             # Local-only safe analysis utilities
    data/              # Sample engagement, playbooks and safe MITRE catalog
    styles/            # Global tactical UI theme
  examples/            # Portable sample engagement JSON
  docs/                # Architecture and safety notes
  README.md
  package.json
```

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Run the full quality gate:

```bash
npm run check
```

Other useful commands:

```bash
npm run lint
npm run format:check
npm run test:coverage
```

## UX Direction

CapySuite uses a dark, tactical, terminal-inspired interface with compact panels, status indicators, structured tables, readiness gates, risk bars, timeline records, and subtle signal-map ASCII motifs. The aesthetic is tied to the product workflow: scope mapping, evidence handling, OPSEC review, attack-chain documentation, MITRE mapping, and report generation.

## Product Modules

- Mission console: contextual operation signal and activity summary.
- Executive auto-brief: stakeholder-ready summary and next actions.
- Ops search: command-center search across the full engagement.
- Safe playbooks: apply authorized workflow packs to objectives, tasks, and OPSEC notes.
- Readiness panel: safety and hygiene checks before handoff.
- Risk matrix: severity distribution across recorded findings.
- MITRE coverage: unique technique IDs mapped across findings and timeline steps.
- Operation profile: engagement metadata, objectives, and rules of engagement.
- Scope manager: targets, ownership, priority, and explicit exclusions.
- Task board: execution status and ownership.
- Findings manager: status, severity, recommendations, target links, and MITRE IDs.
- Evidence ledger: metadata records linked to findings.
- OPSEC board: authorization, data handling, identity, communications, detection, and safety notes.
- Attack-chain timeline: ordered narrative with manual ATT&CK mapping.
- Export panel: Markdown, JSON, and MITRE ATT&CK Navigator layer output.
- Safe Hacker Workbench: local-only operator tools for scope, secrets, headers, IOCs, and finding drafts.

## Sample Data

The app starts with a sample engagement called `GREEN HARBOR`. A portable JSON copy is available at:

```text
examples/sample-engagement.json
```

The sample uses fictional assets and demonstrates safe documentation workflows only.

## Portfolio Positioning

CapySuite demonstrates:

- Product-minded Red Team operations design.
- Safe offensive-security portfolio work.
- Clean TypeScript data modeling.
- Local-only security analysis utilities.
- MITRE ATT&CK Navigator export support.
- Engagement playbook application.
- Modular React architecture.
- Professional UX for security workflows.
- Ethical boundaries and clear documentation.

## Future Integrations

The stable release is intentionally frontend-only, but the model is structured to support later integrations:

- FastAPI backend.
- Authenticated multi-user workspaces.
- Evidence file vault with access controls.
- Case management integrations.
- MITRE ATT&CK technique lookup.
- SIEM ticket references.
- Report templates.
- Workspace encryption.
- Import validation schemas.
- Role-based review states.

## License

MIT
