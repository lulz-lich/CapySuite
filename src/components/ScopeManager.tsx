import { Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ScopeTarget, TargetPriority, TargetType } from "../models/engagement";
import { StatusPill } from "./StatusPill";

interface ScopeManagerProps {
  targets: ScopeTarget[];
  onAdd: (target: Omit<ScopeTarget, "id">) => void;
  onToggleScope: (id: string) => void;
  onRemove: (id: string) => void;
}

const targetTypes: TargetType[] = ["Web App", "API", "Host", "Cloud", "Identity", "Other"];
const priorities: TargetPriority[] = ["Low", "Medium", "High", "Critical"];

export function ScopeManager({ targets, onAdd, onToggleScope, onRemove }: ScopeManagerProps) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [type, setType] = useState<TargetType>("Web App");
  const [priority, setPriority] = useState<TargetPriority>("Medium");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      owner: owner.trim() || "Unassigned",
      type,
      priority,
      inScope: true,
      notes
    });
    setName("");
    setOwner("");
    setNotes("");
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Scope</p>
          <h2>Targets</h2>
        </div>
        <Target size={18} aria-hidden="true" />
      </div>

      <div className="form-grid target-form">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Target name or asset"
        />
        <select value={type} onChange={(event) => setType(event.target.value as TargetType)}>
          {targetTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as TargetPriority)}
        >
          {priorities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Owner"
        />
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Scope note"
        />
        <button className="icon-button" type="button" onClick={submit} aria-label="Add target">
          <Plus size={17} />
        </button>
      </div>

      <div className="data-table">
        <div className="table-header scope-grid">
          <span>Target</span>
          <span>Type</span>
          <span>Priority</span>
          <span>Scope</span>
          <span>Owner</span>
          <span>Action</span>
        </div>
        {targets.map((target) => (
          <div className="table-row scope-grid" key={target.id}>
            <strong>{target.name}</strong>
            <span>{target.type}</span>
            <StatusPill value={target.priority} />
            <button className="scope-toggle" type="button" onClick={() => onToggleScope(target.id)}>
              <StatusPill value={target.inScope ? "In Scope" : "Out of Scope"} />
            </button>
            <span>{target.owner}</span>
            <button
              className="ghost-icon"
              type="button"
              onClick={() => onRemove(target.id)}
              aria-label={`Remove ${target.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
