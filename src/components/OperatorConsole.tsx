import { Terminal } from "lucide-react";
import { getOperatorLog } from "../models/analytics";
import type { Engagement } from "../models/engagement";

export function OperatorConsole({ engagement }: { engagement: Engagement }) {
  const logLines = getOperatorLog(engagement);

  return (
    <section className="panel operator-console">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Console</p>
          <h2>Mission signal</h2>
        </div>
        <Terminal size={18} aria-hidden="true" />
      </div>

      <div className="console-grid">
        <pre aria-hidden="true">{`attack chain
  scope --> evidence
    |         |
    v         v
  finding -> report`}</pre>
        <div className="console-log">
          {logLines.map((line) => (
            <span key={line}>
              <b>capy://ops</b> {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
