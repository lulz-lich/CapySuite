import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import type { OpsecNote } from "../models/engagement";
import { StatusPill } from "./StatusPill";

interface OpsecPanelProps {
  notes: OpsecNote[];
  onAdd: (note: Omit<OpsecNote, "id" | "reviewed">) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const categories: OpsecNote["category"][] = [
  "Authorization",
  "Data Handling",
  "Identity",
  "Comms",
  "Detection",
  "Safety"
];

export function OpsecPanel({ notes, onAdd, onToggle, onRemove }: OpsecPanelProps) {
  const [category, setCategory] = useState<OpsecNote["category"]>("Authorization");
  const [note, setNote] = useState("");
  const [owner, setOwner] = useState("");

  const submit = () => {
    if (!note.trim()) return;
    onAdd({ category, note: note.trim(), owner: owner.trim() || "Unassigned" });
    setNote("");
    setOwner("");
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">OPSEC</p>
          <h2>Notes</h2>
        </div>
        <ShieldCheck size={18} aria-hidden="true" />
      </div>

      <div className="form-grid opsec-form">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as OpsecNote["category"])}
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="OPSEC note"
        />
        <input
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Owner"
        />
        <button className="icon-button" type="button" onClick={submit} aria-label="Add OPSEC note">
          <Plus size={17} />
        </button>
      </div>

      <div className="opsec-list">
        {notes.map((item) => (
          <div className="opsec-row" key={item.id}>
            <div>
              <strong>{item.category}</strong>
              <span>{item.note}</span>
            </div>
            <button className="scope-toggle" type="button" onClick={() => onToggle(item.id)}>
              <StatusPill value={item.reviewed ? "Reviewed" : "Open"} />
            </button>
            <button
              className="ghost-icon"
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.category} note`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
