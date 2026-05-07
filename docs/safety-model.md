# CapySuite Safety Model

CapySuite is an operations platform for authorized Red Team and security assessment workflows. Its purpose is to organize work, not to perform attacks.

## Allowed Workflows

- Create engagement records.
- Track scope and exclusions.
- Record findings and recommendations.
- Store evidence metadata.
- Build assessment timelines.
- Add OPSEC notes.
- Manually map work to MITRE ATT&CK technique IDs.
- Export engagement summaries.
- Import previously exported engagement JSON.
- Compute readiness and coverage metrics from local data.
- Run local-only safe helper tools for scope normalization, redacted secret hygiene, header checks, IOC extraction, and finding drafts.

## Explicit Non-Goals

CapySuite does not implement:

- Exploit modules.
- Malware.
- Phishing.
- Command and control.
- Credential theft or validation.
- Persistence.
- Evasion.
- Destructive actions.
- Unauthorized automation.

## Safe Helper Tools

The Safe Hacker Workbench operates only on text supplied by the user inside the browser. It does not probe targets, make outbound requests, execute payloads, validate credentials, or attempt exploitation. Its outputs are intended for documentation, triage, and authorized assessment notes.

## Evidence Handling

CapySuite stores evidence metadata only. Operators should not paste secrets, customer data, tokens, credentials, payloads, or sensitive raw logs into the app. Evidence records should reference approved storage locations and sanitized notes.

## Import Handling

JSON import is intended for CapySuite engagement records. Imported data is normalized into the local engagement model and should still be reviewed by an operator before use in a real engagement.

## Authorization

Every engagement should include written authorization, approved assets, excluded assets, testing windows, emergency contacts, stop conditions, and data handling expectations before any assessment activity begins.
