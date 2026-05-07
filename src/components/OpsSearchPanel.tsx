import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Engagement } from "../models/engagement";
import { StatusPill } from "./StatusPill";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  detail: string;
  badge: string;
}

function includesQuery(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export function OpsSearchPanel({ engagement }: { engagement: Engagement }) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    const allResults: SearchResult[] = [
      ...engagement.targets.map((target) => ({
        id: target.id,
        type: "Target",
        title: target.name,
        detail: `${target.type} / ${target.owner} / ${target.notes}`,
        badge: target.inScope ? "In Scope" : "Out of Scope"
      })),
      ...engagement.tasks.map((task) => ({
        id: task.id,
        type: "Task",
        title: task.title,
        detail: `${task.owner} / ${task.dueDate || "No due date"}`,
        badge: task.status
      })),
      ...engagement.findings.map((finding) => ({
        id: finding.id,
        type: "Finding",
        title: finding.title,
        detail: `${finding.summary} / ${finding.recommendation} / ${finding.mitreIds.join(", ")}`,
        badge: finding.severity
      })),
      ...engagement.evidence.map((item) => ({
        id: item.id,
        type: "Evidence",
        title: item.label,
        detail: `${item.type} / ${item.source} / ${item.notes}`,
        badge: item.type
      })),
      ...engagement.attackChain.map((step) => ({
        id: step.id,
        type: "Timeline",
        title: step.title,
        detail: `${step.phase} / ${step.operatorNote} / ${step.mitreIds.join(", ")}`,
        badge: step.phase
      }))
    ];

    if (!query.trim()) {
      return allResults.slice(0, 8);
    }

    return allResults
      .filter((item) =>
        includesQuery(`${item.type} ${item.title} ${item.detail} ${item.badge}`, query)
      )
      .slice(0, 12);
  }, [engagement, query]);

  return (
    <section className="panel ops-search-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Command Center</p>
          <h2>Ops search</h2>
        </div>
        <Search size={18} aria-hidden="true" />
      </div>

      <label className="search-field">
        <Search size={16} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search targets, findings, MITRE IDs, evidence, owners..."
        />
      </label>

      <div className="search-results">
        {results.map((result) => (
          <article className="search-result" key={`${result.type}-${result.id}`}>
            <div>
              <span>{result.type}</span>
              <strong>{result.title}</strong>
              <small>{result.detail}</small>
            </div>
            <StatusPill value={result.badge} />
          </article>
        ))}
      </div>
    </section>
  );
}
