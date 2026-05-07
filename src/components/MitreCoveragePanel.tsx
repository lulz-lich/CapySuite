import { Network } from "lucide-react";
import { mitreCatalog } from "../data/mitreCatalog";
import { getMitreCoverage } from "../models/analytics";
import type { Engagement } from "../models/engagement";

export function MitreCoveragePanel({ engagement }: { engagement: Engagement }) {
  const coverage = getMitreCoverage(engagement);
  const mappedCatalog = mitreCatalog.filter((technique) =>
    coverage.uniqueIds.includes(technique.id)
  );
  const suggested = mitreCatalog
    .filter((technique) => !coverage.uniqueIds.includes(technique.id))
    .slice(0, 5);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">MITRE ATT&CK</p>
          <h2>Coverage</h2>
        </div>
        <Network size={18} aria-hidden="true" />
      </div>

      <div className="coverage-summary">
        <div>
          <strong>{coverage.uniqueIds.length}</strong>
          <span>unique techniques</span>
        </div>
        <div>
          <strong>
            {coverage.mappedFindings}/{engagement.findings.length}
          </strong>
          <span>findings mapped</span>
        </div>
        <div>
          <strong>
            {coverage.mappedSteps}/{engagement.attackChain.length}
          </strong>
          <span>steps mapped</span>
        </div>
      </div>

      <div className="technique-list">
        {(mappedCatalog.length > 0 ? mappedCatalog : suggested).map((technique) => (
          <div className="technique-row" key={technique.id}>
            <code>{technique.id}</code>
            <div>
              <strong>{technique.name}</strong>
              <span>{technique.tactic}</span>
              <small>{technique.safeUse}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
