import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Engagement, EngagementStatus } from "../models/engagement";

interface EngagementOverviewProps {
  engagement: Engagement;
  onUpdate: (patch: Partial<Engagement>) => void;
}

const statuses: EngagementStatus[] = ["Planning", "Active", "Reporting", "Closed"];

export function EngagementOverview({ engagement, onUpdate }: EngagementOverviewProps) {
  const [objective, setObjective] = useState("");

  const addObjective = () => {
    const next = objective.trim();
    if (!next) return;
    onUpdate({ objectives: [...engagement.objectives, next] });
    setObjective("");
  };

  const removeObjective = (index: number) => {
    onUpdate({ objectives: engagement.objectives.filter((_, itemIndex) => itemIndex !== index) });
  };

  return (
    <section className="panel overview-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Engagement Control</p>
          <h2>Operation profile</h2>
        </div>
        <Save size={18} aria-hidden="true" />
      </div>

      <div className="form-grid compact">
        <label>
          Engagement
          <input
            value={engagement.name}
            onChange={(event) => onUpdate({ name: event.target.value })}
          />
        </label>
        <label>
          Client
          <input
            value={engagement.client}
            onChange={(event) => onUpdate({ client: event.target.value })}
          />
        </label>
        <label>
          Codename
          <input
            value={engagement.codename}
            onChange={(event) => onUpdate({ codename: event.target.value })}
          />
        </label>
        <label>
          Status
          <select
            value={engagement.status}
            onChange={(event) => onUpdate({ status: event.target.value as EngagementStatus })}
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Start
          <input
            type="date"
            value={engagement.startDate}
            onChange={(event) => onUpdate({ startDate: event.target.value })}
          />
        </label>
        <label>
          End
          <input
            type="date"
            value={engagement.endDate}
            onChange={(event) => onUpdate({ endDate: event.target.value })}
          />
        </label>
      </div>

      <label className="wide-field">
        Rules of engagement
        <textarea
          value={engagement.rulesOfEngagement}
          onChange={(event) => onUpdate({ rulesOfEngagement: event.target.value })}
          rows={4}
        />
      </label>

      <div className="inline-editor">
        <input
          value={objective}
          onChange={(event) => setObjective(event.target.value)}
          placeholder="Add assessment objective"
        />
        <button
          className="icon-button"
          type="button"
          onClick={addObjective}
          aria-label="Add objective"
        >
          <Plus size={17} />
        </button>
      </div>

      <div className="objective-list">
        {engagement.objectives.map((item, index) => (
          <div className="objective-row" key={`${item}-${index}`}>
            <span>{item}</span>
            <button
              className="ghost-icon"
              type="button"
              onClick={() => removeObjective(index)}
              aria-label="Remove objective"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
