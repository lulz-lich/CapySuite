import { Activity } from "lucide-react";
import { getSeverityCounts } from "../models/analytics";
import type { Engagement, FindingSeverity } from "../models/engagement";

const severities: FindingSeverity[] = ["Critical", "High", "Medium", "Low", "Info"];

export function RiskMatrix({ engagement }: { engagement: Engagement }) {
  const counts = getSeverityCounts(engagement);
  const max = Math.max(...Object.values(counts), 1);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Risk</p>
          <h2>Finding matrix</h2>
        </div>
        <Activity size={18} aria-hidden="true" />
      </div>

      <div className="risk-bars">
        {severities.map((severity) => (
          <div className="risk-row" key={severity}>
            <span>{severity}</span>
            <div className="risk-track">
              <i
                className={`risk-fill severity-${severity.toLowerCase()}`}
                style={{ width: `${(counts[severity] / max) * 100}%` }}
              />
            </div>
            <strong>{counts[severity]}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
