import { GitBranch, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { mitreCatalog } from "../data/mitreCatalog";
import type { AttackChainStep, ChainPhase, EvidenceItem, ScopeTarget } from "../models/engagement";

interface AttackTimelineProps {
  steps: AttackChainStep[];
  targets: ScopeTarget[];
  evidence: EvidenceItem[];
  onAdd: (step: Omit<AttackChainStep, "id">) => void;
  onRemove: (id: string) => void;
}

const phases: ChainPhase[] = [
  "Recon",
  "Initial Access Simulation",
  "Privilege Review",
  "Lateral Movement Analysis",
  "Impact Validation",
  "Reporting"
];

export function AttackTimeline({ steps, targets, evidence, onAdd, onRemove }: AttackTimelineProps) {
  const [phase, setPhase] = useState<ChainPhase>("Recon");
  const [title, setTitle] = useState("");
  const [targetId, setTargetId] = useState(targets[0]?.id ?? "");
  const [mitre, setMitre] = useState("");
  const [evidenceId, setEvidenceId] = useState("");
  const [operatorNote, setOperatorNote] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      phase,
      title: title.trim(),
      targetId,
      timestamp: new Date().toISOString(),
      mitreIds: mitre
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      evidenceIds: evidenceId ? [evidenceId] : [],
      operatorNote: operatorNote.trim() || "Operator note pending."
    });
    setTitle("");
    setMitre("");
    setEvidenceId("");
    setOperatorNote("");
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
          <p className="eyebrow">Attack Chain</p>
          <h2>Timeline</h2>
        </div>
        <GitBranch size={18} aria-hidden="true" />
      </div>

      <div className="form-grid timeline-form">
        <select value={phase} onChange={(event) => setPhase(event.target.value as ChainPhase)}>
          {phases.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Timeline step"
        />
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
          placeholder="MITRE IDs"
        />
        <div className="mitre-picker">
          {mitreCatalog.slice(0, 6).map((technique) => (
            <button type="button" key={technique.id} onClick={() => appendMitre(technique.id)}>
              {technique.id}
            </button>
          ))}
        </div>
        <select value={evidenceId} onChange={(event) => setEvidenceId(event.target.value)}>
          <option value="">No evidence link</option>
          {evidence.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input
          value={operatorNote}
          onChange={(event) => setOperatorNote(event.target.value)}
          placeholder="Operator note"
        />
        <button
          className="icon-button"
          type="button"
          onClick={submit}
          aria-label="Add timeline step"
        >
          <Plus size={17} />
        </button>
      </div>

      <div className="timeline">
        {steps.map((step, index) => (
          <article className="timeline-step" key={step.id}>
            <div className="timeline-index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <div className="timeline-title">
                <strong>{step.title}</strong>
                <span>{step.phase}</span>
              </div>
              <p>{step.operatorNote}</p>
              <div className="timeline-meta">
                <time>{step.timestamp}</time>
                <span>{targetName(step.targetId)}</span>
                {step.mitreIds.map((id) => (
                  <code key={id}>{id}</code>
                ))}
                <button
                  className="ghost-icon"
                  type="button"
                  onClick={() => onRemove(step.id)}
                  aria-label={`Remove ${step.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
