import { Sparkles } from "lucide-react";
import { getMitreCoverage, getReadinessScore, getSeverityCounts } from "../models/analytics";
import type { Engagement } from "../models/engagement";

function plural(count: number, singular: string, pluralText: string) {
  return `${count} ${count === 1 ? singular : pluralText}`;
}

export function ExecutiveBriefPanel({ engagement }: { engagement: Engagement }) {
  const readiness = getReadinessScore(engagement);
  const severity = getSeverityCounts(engagement);
  const mitre = getMitreCoverage(engagement);
  const inScope = engagement.targets.filter((target) => target.inScope).length;
  const criticalOrHigh = severity.Critical + severity.High;
  const completedTasks = engagement.tasks.filter((task) => task.status === "Done").length;
  const nextActions = [
    engagement.findings.some((finding) => finding.status === "Open")
      ? "Validate open findings and move report-ready items forward."
      : "",
    engagement.evidence.some((item) => !item.linkedFindingId)
      ? "Link unassigned evidence metadata to findings."
      : "",
    engagement.opsecNotes.some((note) => !note.reviewed)
      ? "Complete OPSEC review before final handoff."
      : "",
    mitre.unmappedFindings + mitre.unmappedSteps > 0
      ? "Finish manual MITRE mapping for unmapped records."
      : ""
  ].filter(Boolean);

  return (
    <section className="panel executive-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Executive Intelligence</p>
          <h2>Auto brief</h2>
        </div>
        <Sparkles size={18} aria-hidden="true" />
      </div>

      <div className="brief-copy">
        <p>
          {engagement.codename} is a {engagement.status.toLowerCase()} authorized assessment
          covering {plural(inScope, "in-scope target", "in-scope targets")} for {engagement.client}.
          Current readiness is {readiness}% with{" "}
          {plural(engagement.findings.length, "finding", "findings")},{" "}
          {plural(
            engagement.evidence.length,
            "evidence metadata record",
            "evidence metadata records"
          )}
          , and{" "}
          {plural(mitre.uniqueIds.length, "mapped ATT&CK technique", "mapped ATT&CK techniques")}.
        </p>
        <p>
          Risk posture currently includes{" "}
          {plural(criticalOrHigh, "critical/high item", "critical/high items")} and {completedTasks}
          /{engagement.tasks.length} completed tasks.
        </p>
      </div>

      <div className="next-actions">
        <strong>Recommended next actions</strong>
        {nextActions.length === 0 ? (
          <span>No immediate handoff blockers detected.</span>
        ) : (
          nextActions.map((action) => <span key={action}>{action}</span>)
        )}
      </div>
    </section>
  );
}
