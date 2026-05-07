import { getMitreCoverage, getReadinessScore, getSeverityCounts } from "../models/analytics";
import type { Engagement } from "../models/engagement";

function safeTargetName(engagement: Engagement, targetId: string) {
  return engagement.targets.find((target) => target.id === targetId)?.name ?? "Unlinked target";
}

export function engagementToMarkdown(engagement: Engagement) {
  const readinessScore = getReadinessScore(engagement);
  const severityCounts = getSeverityCounts(engagement);
  const mitreCoverage = getMitreCoverage(engagement);
  const lines = [
    `# ${engagement.name}`,
    "",
    `- Client: ${engagement.client}`,
    `- Codename: ${engagement.codename}`,
    `- Status: ${engagement.status}`,
    `- Window: ${engagement.startDate} to ${engagement.endDate}`,
    "",
    "## Safety Boundary",
    "",
    engagement.rulesOfEngagement,
    "",
    "## Operational Snapshot",
    "",
    `- Readiness score: ${readinessScore}%`,
    `- Targets tracked: ${engagement.targets.length}`,
    `- In-scope targets: ${engagement.targets.filter((target) => target.inScope).length}`,
    `- Findings recorded: ${engagement.findings.length}`,
    `- Evidence metadata records: ${engagement.evidence.length}`,
    `- MITRE ATT&CK techniques mapped: ${mitreCoverage.uniqueIds.join(", ") || "None"}`,
    "",
    "## Finding Severity Matrix",
    "",
    "| Severity | Count |",
    "| --- | ---: |",
    `| Critical | ${severityCounts.Critical} |`,
    `| High | ${severityCounts.High} |`,
    `| Medium | ${severityCounts.Medium} |`,
    `| Low | ${severityCounts.Low} |`,
    `| Info | ${severityCounts.Info} |`,
    "",
    "## Objectives",
    "",
    ...engagement.objectives.map((objective) => `- ${objective}`),
    "",
    "## Scope",
    "",
    "| Target | Type | Priority | Scope | Owner |",
    "| --- | --- | --- | --- | --- |",
    ...engagement.targets.map(
      (target) =>
        `| ${target.name} | ${target.type} | ${target.priority} | ${target.inScope ? "In scope" : "Out of scope"} | ${target.owner} |`
    ),
    "",
    "## Tasks",
    "",
    "| Task | Status | Owner | Due |",
    "| --- | --- | --- | --- |",
    ...engagement.tasks.map(
      (task) => `| ${task.title} | ${task.status} | ${task.owner} | ${task.dueDate || "Not set"} |`
    ),
    "",
    "## Findings",
    ""
  ];

  if (engagement.findings.length === 0) {
    lines.push("No findings recorded.");
  } else {
    engagement.findings.forEach((finding) => {
      lines.push(
        `### ${finding.title}`,
        "",
        `- Severity: ${finding.severity}`,
        `- Status: ${finding.status}`,
        `- Target: ${safeTargetName(engagement, finding.targetId)}`,
        `- MITRE ATT&CK: ${finding.mitreIds.join(", ") || "Not mapped"}`,
        "",
        finding.summary,
        "",
        `Recommendation: ${finding.recommendation}`,
        ""
      );
    });
  }

  lines.push("## Attack Chain Timeline", "");
  if (engagement.attackChain.length === 0) {
    lines.push("No attack chain steps recorded.");
  } else {
    engagement.attackChain.forEach((step) => {
      lines.push(
        `- ${step.timestamp} | ${step.phase} | ${step.title} | ${safeTargetName(engagement, step.targetId)} | ${step.mitreIds.join(", ") || "No MITRE mapping"}`
      );
    });
  }

  lines.push("", "## Evidence Metadata", "");
  if (engagement.evidence.length === 0) {
    lines.push("No evidence metadata recorded.");
  } else {
    engagement.evidence.forEach((item) => {
      const finding = engagement.findings.find((entry) => entry.id === item.linkedFindingId);
      lines.push(
        `- ${item.label} (${item.type})`,
        `  - Linked finding: ${finding?.title ?? "Unlinked"}`,
        `  - Source: ${item.source}`,
        `  - Timestamp: ${item.timestamp}`,
        `  - Notes: ${item.notes}`
      );
    });
  }

  lines.push("", "## OPSEC Notes", "");
  if (engagement.opsecNotes.length === 0) {
    lines.push("No OPSEC notes recorded.");
  } else {
    engagement.opsecNotes.forEach((note) => {
      lines.push(`- [${note.reviewed ? "x" : " "}] ${note.category}: ${note.note} (${note.owner})`);
    });
  }

  return `${lines.join("\n").trim()}\n`;
}

export function engagementToJson(engagement: Engagement) {
  return JSON.stringify(engagement, null, 2);
}

export function engagementToMitreNavigatorLayer(engagement: Engagement) {
  const coverage = getMitreCoverage(engagement);
  const findingCounts = new Map<string, number>();
  const stepCounts = new Map<string, number>();

  engagement.findings.forEach((finding) => {
    finding.mitreIds.forEach((id) => findingCounts.set(id, (findingCounts.get(id) ?? 0) + 1));
  });
  engagement.attackChain.forEach((step) => {
    step.mitreIds.forEach((id) => stepCounts.set(id, (stepCounts.get(id) ?? 0) + 1));
  });

  return JSON.stringify(
    {
      name: `${engagement.codename} ATT&CK Coverage`,
      versions: {
        attack: "15",
        navigator: "4.9.1",
        layer: "4.5"
      },
      domain: "enterprise-attack",
      description:
        "Manual CapySuite ATT&CK coverage layer for authorized assessment documentation. No offensive automation is included.",
      techniques: coverage.uniqueIds.map((techniqueID) => ({
        techniqueID,
        score: (findingCounts.get(techniqueID) ?? 0) + (stepCounts.get(techniqueID) ?? 0),
        comment: `Findings: ${findingCounts.get(techniqueID) ?? 0}; Timeline steps: ${stepCounts.get(techniqueID) ?? 0}`,
        enabled: true
      })),
      gradient: {
        colors: ["#1d342c", "#52f0a2"],
        minValue: 0,
        maxValue: Math.max(
          1,
          ...coverage.uniqueIds.map(
            (id) => (findingCounts.get(id) ?? 0) + (stepCounts.get(id) ?? 0)
          )
        )
      },
      legendItems: [
        {
          label: "Mapped by CapySuite",
          color: "#52f0a2"
        }
      ]
    },
    null,
    2
  );
}

export function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
