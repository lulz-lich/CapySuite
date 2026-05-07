import {
  Binary,
  Braces,
  ClipboardCheck,
  FileSearch,
  KeyRound,
  Radar,
  ShieldCheck
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  analyzeHeaders,
  analyzeScopeInput,
  analyzeSecrets,
  buildFindingDraft,
  extractIndicators,
  sanitizeEvidenceText
} from "../tools/safeTools";
import { StatusPill } from "./StatusPill";

type ToolTab = "scope" | "secrets" | "headers" | "ioc" | "sanitize" | "finding";

const tabs: Array<{ id: ToolTab; label: string; icon: typeof Radar }> = [
  { id: "scope", label: "Scope Lens", icon: Radar },
  { id: "secrets", label: "Secret Hygiene", icon: KeyRound },
  { id: "headers", label: "Header Review", icon: ShieldCheck },
  { id: "ioc", label: "IOC Triage", icon: Binary },
  { id: "sanitize", label: "Evidence Sanitizer", icon: Braces },
  { id: "finding", label: "Finding Draft", icon: ClipboardCheck }
];

export function SafeToolbox() {
  const [activeTab, setActiveTab] = useState<ToolTab>("scope");
  const [scopeInput, setScopeInput] = useState(
    "https://portal.example.test/login\nhttp://admin.example.test/users?id=1"
  );
  const [secretInput, setSecretInput] = useState('API_KEY="sample_token_value_1234567890"');
  const [headerInput, setHeaderInput] = useState(
    "Content-Security-Policy: default-src 'self'\nReferrer-Policy: no-referrer"
  );
  const [iocInput, setIocInput] = useState(
    "Observed https://portal.example.test from 10.0.0.5 with d41d8cd98f00b204e9800998ecf8427e"
  );
  const [sanitizeInput, setSanitizeInput] = useState(
    'Authorization: Bearer abcdefghijklmnopqrstuvwxyz\nanalyst@example.test API_KEY="sampletoken123456"'
  );
  const [findingTitle, setFindingTitle] = useState(
    "Missing security header on approved staging route"
  );
  const [findingImpact, setFindingImpact] = useState("");
  const [findingEvidence, setFindingEvidence] = useState("");
  const [findingRecommendation, setFindingRecommendation] = useState("");

  const scopeRecords = useMemo(() => analyzeScopeInput(scopeInput), [scopeInput]);
  const secretSignals = useMemo(() => analyzeSecrets(secretInput), [secretInput]);
  const headerFindings = useMemo(() => analyzeHeaders(headerInput), [headerInput]);
  const indicators = useMemo(() => extractIndicators(iocInput), [iocInput]);
  const indicatorEntries = Object.entries(indicators) as Array<[string, string[]]>;
  const sanitizedEvidence = useMemo(() => sanitizeEvidenceText(sanitizeInput), [sanitizeInput]);
  const findingDraft = useMemo(
    () => buildFindingDraft(findingTitle, findingImpact, findingEvidence, findingRecommendation),
    [findingEvidence, findingImpact, findingRecommendation, findingTitle]
  );

  return (
    <section className="panel wide-panel toolbox-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Safe Hacker Toolkit</p>
          <h2>Operator workbench</h2>
        </div>
        <FileSearch size={18} aria-hidden="true" />
      </div>

      <div className="tool-tabs" role="tablist" aria-label="Safe tools">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "active" : ""}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "scope" ? (
        <div className="tool-layout">
          <label className="tool-input">
            Authorized targets, URLs, or route notes
            <textarea
              value={scopeInput}
              onChange={(event) => setScopeInput(event.target.value)}
              rows={9}
            />
          </label>
          <div className="tool-output">
            <pre className="tool-ascii" aria-hidden="true">{`passive scope lens
  target --> host
     |       |
   flags <- path`}</pre>
            <div className="tool-table">
              {scopeRecords.map((record) => (
                <div className="scope-record" key={`${record.input}-${record.path}`}>
                  <strong>{record.host}</strong>
                  <span>
                    {record.scheme} / {record.path}
                  </span>
                  <div className="chip-line">
                    {record.queryKeys.map((key) => (
                      <code key={key}>{key}</code>
                    ))}
                    {record.flags.map((flag) => (
                      <StatusPill key={flag} value={flag} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "secrets" ? (
        <div className="tool-layout">
          <label className="tool-input">
            Local text sample for redacted secret hygiene review
            <textarea
              value={secretInput}
              onChange={(event) => setSecretInput(event.target.value)}
              rows={9}
            />
          </label>
          <div className="tool-output">
            <pre className="tool-ascii" aria-hidden="true">{`token hygiene
  raw --> redact
   |       |
 entropy  signal`}</pre>
            {secretSignals.length === 0 ? (
              <div className="empty-state">
                No token-like signals detected in this local sample.
              </div>
            ) : (
              <div className="tool-table">
                {secretSignals.map((signal, index) => (
                  <div className="secret-record" key={`${signal.label}-${index}`}>
                    <strong>{signal.label}</strong>
                    <code>{signal.redacted}</code>
                    <span>Entropy {signal.entropy}</span>
                    <StatusPill value={signal.confidence} />
                    <small>{signal.reason}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === "headers" ? (
        <div className="tool-layout">
          <label className="tool-input">
            Paste sanitized HTTP response headers
            <textarea
              value={headerInput}
              onChange={(event) => setHeaderInput(event.target.value)}
              rows={9}
            />
          </label>
          <div className="tool-output">
            <pre className="tool-ascii" aria-hidden="true">{`browser defense
 request <- header
    |        |
 policy -> note`}</pre>
            <div className="tool-table">
              {headerFindings.map((finding) => (
                <div className="header-record" key={finding.header}>
                  <strong>{finding.header}</strong>
                  <StatusPill value={finding.present ? "Present" : "Missing"} />
                  <span>{finding.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "ioc" ? (
        <div className="tool-layout">
          <label className="tool-input">
            Paste sanitized log excerpt or incident note
            <textarea
              value={iocInput}
              onChange={(event) => setIocInput(event.target.value)}
              rows={9}
            />
          </label>
          <div className="tool-output">
            <pre className="tool-ascii" aria-hidden="true">{`ioc triage
  log --> extract
   |       |
 hash   domain`}</pre>
            <div className="indicator-grid">
              {indicatorEntries.map(([kind, values]) => (
                <div className="indicator-card" key={kind}>
                  <strong>{kind}</strong>
                  {values.length === 0 ? (
                    <span>none</span>
                  ) : (
                    values.map((value) => <code key={value}>{value}</code>)
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "finding" ? (
        <div className="tool-layout">
          <div className="finding-builder">
            <input
              value={findingTitle}
              onChange={(event) => setFindingTitle(event.target.value)}
              placeholder="Finding title"
            />
            <textarea
              value={findingImpact}
              onChange={(event) => setFindingImpact(event.target.value)}
              placeholder="Impact"
              rows={3}
            />
            <textarea
              value={findingEvidence}
              onChange={(event) => setFindingEvidence(event.target.value)}
              placeholder="Evidence metadata"
              rows={3}
            />
            <textarea
              value={findingRecommendation}
              onChange={(event) => setFindingRecommendation(event.target.value)}
              placeholder="Recommendation"
              rows={3}
            />
          </div>
          <div className="tool-output">
            <pre className="tool-ascii" aria-hidden="true">{`finding builder
 evidence -> impact
     |        |
 recommendation`}</pre>
            <textarea
              className="export-preview compact-preview"
              readOnly
              value={findingDraft}
              rows={14}
            />
          </div>
        </div>
      ) : null}

      {activeTab === "sanitize" ? (
        <div className="tool-layout">
          <label className="tool-input">
            Paste evidence text before adding it to a report
            <textarea
              value={sanitizeInput}
              onChange={(event) => setSanitizeInput(event.target.value)}
              rows={9}
            />
          </label>
          <div className="tool-output">
            <pre className="tool-ascii" aria-hidden="true">{`evidence sanitizer
  raw text -> redact
      |        |
   metadata  report`}</pre>
            <div className="redaction-summary">
              {sanitizedEvidence.redactions.length === 0 ? (
                <span>No redactions applied.</span>
              ) : (
                sanitizedEvidence.redactions.map((item) => (
                  <StatusPill key={item.type} value={`${item.type}: ${item.count}`} />
                ))
              )}
            </div>
            <textarea
              className="export-preview compact-preview"
              readOnly
              value={sanitizedEvidence.output}
              rows={12}
            />
          </div>
        </div>
      ) : null}

      <div className="tool-boundary">
        <Braces size={15} />
        Local-only utilities. No network probing, exploitation, credential validation, phishing,
        malware, C2, or persistence.
      </div>
    </section>
  );
}
