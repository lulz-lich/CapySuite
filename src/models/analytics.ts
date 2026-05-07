import type { Engagement, FindingSeverity } from "./engagement";

export interface ReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface MitreCoverage {
  uniqueIds: string[];
  mappedFindings: number;
  mappedSteps: number;
  unmappedFindings: number;
  unmappedSteps: number;
}

const severityOrder: FindingSeverity[] = ["Info", "Low", "Medium", "High", "Critical"];

export function getSeverityCounts(engagement: Engagement) {
  return severityOrder.reduce<Record<FindingSeverity, number>>(
    (counts, severity) => ({
      ...counts,
      [severity]: engagement.findings.filter((finding) => finding.severity === severity).length
    }),
    { Info: 0, Low: 0, Medium: 0, High: 0, Critical: 0 }
  );
}

export function getMitreCoverage(engagement: Engagement): MitreCoverage {
  const findingIds = engagement.findings.flatMap((finding) => finding.mitreIds);
  const stepIds = engagement.attackChain.flatMap((step) => step.mitreIds);

  return {
    uniqueIds: Array.from(new Set([...findingIds, ...stepIds])).sort(),
    mappedFindings: engagement.findings.filter((finding) => finding.mitreIds.length > 0).length,
    mappedSteps: engagement.attackChain.filter((step) => step.mitreIds.length > 0).length,
    unmappedFindings: engagement.findings.filter((finding) => finding.mitreIds.length === 0).length,
    unmappedSteps: engagement.attackChain.filter((step) => step.mitreIds.length === 0).length
  };
}

export function getReadinessChecks(engagement: Engagement): ReadinessCheck[] {
  const hasRules = engagement.rulesOfEngagement.trim().length >= 80;
  const hasInScopeTargets = engagement.targets.some((target) => target.inScope);
  const hasExplicitExclusions = engagement.targets.some((target) => !target.inScope);
  const hasObjectives = engagement.objectives.some((objective) => objective.trim().length > 0);
  const noBlockedTasks = engagement.tasks.every((task) => task.status !== "Blocked");
  const allFindingsHaveTargets = engagement.findings.every((finding) => Boolean(finding.targetId));
  const allEvidenceLinked = engagement.evidence.every((item) => Boolean(item.linkedFindingId));
  const opsecReviewed =
    engagement.opsecNotes.length > 0 && engagement.opsecNotes.every((note) => note.reviewed);
  const timelineMapped =
    engagement.attackChain.length > 0 &&
    engagement.attackChain.every((step) => step.mitreIds.length > 0);

  return [
    {
      id: "roe",
      label: "Rules of engagement documented",
      passed: hasRules,
      detail: hasRules
        ? "Authorization boundary is captured."
        : "Add testing windows, exclusions, stop conditions, and contacts."
    },
    {
      id: "scope",
      label: "In-scope targets present",
      passed: hasInScopeTargets,
      detail: hasInScopeTargets
        ? "At least one approved asset is marked in scope."
        : "Add an approved in-scope asset."
    },
    {
      id: "exclusions",
      label: "Explicit exclusions recorded",
      passed: hasExplicitExclusions,
      detail: hasExplicitExclusions
        ? "Out-of-scope boundaries are visible."
        : "Record excluded systems to reduce ambiguity."
    },
    {
      id: "objectives",
      label: "Assessment objectives defined",
      passed: hasObjectives,
      detail: hasObjectives
        ? "Mission objectives are available for reporting."
        : "Add one or more engagement objectives."
    },
    {
      id: "tasks",
      label: "No blocked tasks",
      passed: noBlockedTasks,
      detail: noBlockedTasks
        ? "Execution board has no blockers."
        : "Resolve or annotate blocked work before handoff."
    },
    {
      id: "findings",
      label: "Findings linked to targets",
      passed: allFindingsHaveTargets,
      detail: allFindingsHaveTargets
        ? "Findings have target context."
        : "Link every finding to a target or explain why unlinked."
    },
    {
      id: "evidence",
      label: "Evidence metadata linked",
      passed: allEvidenceLinked,
      detail: allEvidenceLinked
        ? "Evidence records map back to findings."
        : "Link evidence metadata to findings."
    },
    {
      id: "opsec",
      label: "OPSEC notes reviewed",
      passed: opsecReviewed,
      detail: opsecReviewed
        ? "OPSEC notes are marked reviewed."
        : "Review all OPSEC notes before final export."
    },
    {
      id: "mitre",
      label: "Timeline mapped to MITRE",
      passed: timelineMapped,
      detail: timelineMapped
        ? "Attack-chain steps include MITRE IDs."
        : "Map timeline steps manually where relevant."
    }
  ];
}

export function getReadinessScore(engagement: Engagement) {
  const checks = getReadinessChecks(engagement);
  const passed = checks.filter((check) => check.passed).length;
  return Math.round((passed / checks.length) * 100);
}

export function getOperatorLog(engagement: Engagement) {
  const coverage = getMitreCoverage(engagement);
  const score = getReadinessScore(engagement);
  const latestTimeline = engagement.attackChain[engagement.attackChain.length - 1];
  const latestFinding = engagement.findings[engagement.findings.length - 1];

  return [
    `workspace: ${engagement.codename} / ${engagement.status}`,
    `readiness: ${score}% operational hygiene`,
    `scope: ${engagement.targets.filter((target) => target.inScope).length} in-scope / ${engagement.targets.length} tracked`,
    `mitre: ${coverage.uniqueIds.length} unique techniques mapped`,
    latestFinding
      ? `latest finding: ${latestFinding.severity} / ${latestFinding.title}`
      : "latest finding: none recorded",
    latestTimeline
      ? `last chain step: ${latestTimeline.phase} / ${latestTimeline.title}`
      : "last chain step: none recorded"
  ];
}
