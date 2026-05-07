import { ShieldCheck } from "lucide-react";
import { getReadinessChecks, getReadinessScore } from "../models/analytics";
import type { Engagement } from "../models/engagement";

export function ReadinessPanel({ engagement }: { engagement: Engagement }) {
  const score = getReadinessScore(engagement);
  const checks = getReadinessChecks(engagement);
  const scoreClass = score >= 85 ? "score-good" : score >= 65 ? "score-watch" : "score-risk";

  return (
    <section className="panel readiness-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Readiness</p>
          <h2>Operational hygiene</h2>
        </div>
        <ShieldCheck size={18} aria-hidden="true" />
      </div>

      <div className="readiness-header">
        <div className={`readiness-score ${scoreClass}`}>
          <strong>{score}</strong>
          <span>%</span>
        </div>
        <div className="progress-shell" aria-label={`Readiness score ${score}%`}>
          <span style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="check-grid">
        {checks.map((check) => (
          <div className={`check-row ${check.passed ? "passed" : "open"}`} key={check.id}>
            <span>{check.passed ? "OK" : "TODO"}</span>
            <div>
              <strong>{check.label}</strong>
              <small>{check.detail}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
