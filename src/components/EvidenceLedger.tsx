import { FileStack, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { EvidenceItem, Finding } from "../models/engagement";

interface EvidenceLedgerProps {
  evidence: EvidenceItem[];
  findings: Finding[];
  onAdd: (item: Omit<EvidenceItem, "id">) => void;
  onRemove: (id: string) => void;
}

const evidenceTypes: EvidenceItem["type"][] = [
  "Screenshot",
  "Log Excerpt",
  "Request Metadata",
  "Meeting Note",
  "Other"
];

export function EvidenceLedger({ evidence, findings, onAdd, onRemove }: EvidenceLedgerProps) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<EvidenceItem["type"]>("Request Metadata");
  const [linkedFindingId, setLinkedFindingId] = useState(findings[0]?.id ?? "");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!label.trim()) return;
    onAdd({
      label: label.trim(),
      type,
      linkedFindingId,
      source: source.trim() || "Assessment workspace",
      timestamp: new Date().toISOString(),
      notes: notes.trim() || "Metadata record only."
    });
    setLabel("");
    setSource("");
    setNotes("");
  };

  const findingName = (id: string) =>
    findings.find((finding) => finding.id === id)?.title ?? "Unlinked";

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Evidence</p>
          <h2>Metadata ledger</h2>
        </div>
        <FileStack size={18} aria-hidden="true" />
      </div>

      <div className="form-grid evidence-form">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Evidence label"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as EvidenceItem["type"])}
        >
          {evidenceTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={linkedFindingId}
          onChange={(event) => setLinkedFindingId(event.target.value)}
        >
          <option value="">Unlinked finding</option>
          {findings.map((finding) => (
            <option key={finding.id} value={finding.id}>
              {finding.title}
            </option>
          ))}
        </select>
        <input
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="Source"
        />
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Notes"
        />
        <button className="icon-button" type="button" onClick={submit} aria-label="Add evidence">
          <Plus size={17} />
        </button>
      </div>

      <div className="ledger-list">
        {evidence.map((item) => (
          <div className="ledger-row" key={item.id}>
            <strong>{item.label}</strong>
            <span>{item.type}</span>
            <span>{findingName(item.linkedFindingId)}</span>
            <time>{item.timestamp}</time>
            <button
              className="ghost-icon"
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.label}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
