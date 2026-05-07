import { AlertOctagon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { mitreCatalog } from "../data/mitreCatalog";
import type { Finding, FindingSeverity, ScopeTarget } from "../models/engagement";
import { StatusPill } from "./StatusPill";

interface FindingsManagerProps {
  findings: Finding[];
  targets: ScopeTarget[];
  onAdd: (finding: Omit<Finding, "id" | "status">) => void;
  onStatusChange: (id: string, status: Finding["status"]) => void;
  onRemove: (id: string) => void;
}

const severities: FindingSeverity[] = ["Info", "Low", "Medium", "High", "Critical"];
const findingStatuses: Finding["status"][] = ["Open", "Validated", "Ready for Report", "Closed"];

export function FindingsManager({
  findings,
  targets,
  onAdd,
  onStatusChange,
  onRemove
}: FindingsManagerProps) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<FindingSeverity>("Medium");
  const [targetId, setTargetId] = useState(targets[0]?.id ?? "");
  const [mitre, setMitre] = useState("");
  const [summary, setSummary] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      severity,
      targetId: targetId || targets[0]?.id || "",
      mitreIds: mitre
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      summary: summary.trim() || "Finding summary pending analyst review.",
      recommendation: recommendation.trim() || "Recommendation pending analyst review."
    });
    setTitle("");
    setMitre("");
    setSummary("");
    setRecommendation("");
  };

  const targetName = (id: string) =>
    targets.find((target) => target.id === id)?.name ?? "Unlinked target";
  const appendMitre = (id: string) => {
    const current = mitre
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!current.includes(id)) {
      setMitre([...current, id].join(", "));
    }
  };

  return (
    <section className="panel wide-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Assessment Output</p>
          <h2>Findings</h2>
        </div>
        <AlertOctagon size={18} aria-hidden="true" />
      </div>

      <div className="form-grid finding-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Finding title"
        />
        <select
          value={severity}
          onChange={(event) => setSeverity(event.target.value as FindingSeverity)}
        >
          {severities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={targetId} onChange={(event) => setTargetId(event.target.value)}>
          <option value="">Unlinked target</option>
          {targets.map((target) => (
            <option key={target.id} value={target.id}>
              {target.name}
            </option>
          ))}
        </select>
        <input
          value={mitre}
          onChange={(event) => setMitre(event.target.value)}
          placeholder="MITRE IDs, comma separated"
        />
        <div className="mitre-picker">
          {mitreCatalog.slice(0, 6).map((technique) => (
            <button type="button" key={technique.id} onClick={() => appendMitre(technique.id)}>
              {technique.id}
            </button>
          ))}
        </div>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Summary"
          rows={3}
        />
        <textarea
          value={recommendation}
          onChange={(event) => setRecommendation(event.target.value)}
          placeholder="Recommendation"
          rows={3}
        />
        <button className="icon-button" type="button" onClick={submit} aria-label="Add finding">
          <Plus size={17} />
        </button>
      </div>

      <div className="finding-list">
        {findings.map((finding) => (
          <article className="finding-row" key={finding.id}>
            <div className="finding-main">
              <div className="finding-title-line">
                <strong>{finding.title}</strong>
                <StatusPill value={finding.severity} />
                <StatusPill value={finding.status} />
              </div>
              <p>{finding.summary}</p>
              <span>{targetName(finding.targetId)}</span>
            </div>
            <div className="finding-actions">
              <div className="mitre-stack">
                {finding.mitreIds.length > 0 ? (
                  finding.mitreIds.map((id) => <code key={id}>{id}</code>)
                ) : (
                  <code>MITRE pending</code>
                )}
              </div>
              <select
                value={finding.status}
                onChange={(event) =>
                  onStatusChange(finding.id, event.target.value as Finding["status"])
                }
              >
                {findingStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <button
                className="ghost-icon"
                type="button"
                onClick={() => onRemove(finding.id)}
                aria-label={`Remove ${finding.title}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
