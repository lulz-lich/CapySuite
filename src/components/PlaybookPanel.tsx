import { BookOpenCheck, Plus } from "lucide-react";
import { safePlaybooks } from "../data/playbooks";
import type { OpsecNote, TaskItem } from "../models/engagement";

interface PlaybookPanelProps {
  onApply: (payload: {
    objectives: string[];
    tasks: Array<Omit<TaskItem, "id">>;
    opsecNotes: Array<Omit<OpsecNote, "id" | "reviewed">>;
  }) => void;
}

export function PlaybookPanel({ onApply }: PlaybookPanelProps) {
  return (
    <section className="panel wide-panel playbook-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Playbooks</p>
          <h2>Safe operation packs</h2>
        </div>
        <BookOpenCheck size={18} aria-hidden="true" />
      </div>

      <div className="playbook-grid">
        {safePlaybooks.map((playbook) => (
          <article className="playbook-card" key={playbook.id}>
            <div>
              <span>{playbook.focus}</span>
              <h3>{playbook.name}</h3>
              <p>{playbook.description}</p>
            </div>
            <div className="playbook-metrics">
              <code>{playbook.objectives.length} objectives</code>
              <code>{playbook.tasks.length} tasks</code>
              <code>{playbook.opsecNotes.length} opsec</code>
            </div>
            <button className="action-button" type="button" onClick={() => onApply(playbook)}>
              <Plus size={16} />
              Apply pack
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
