import { Database, FilePlus2, RefreshCcw, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { Engagement } from "../models/engagement";
import { StatusPill } from "./StatusPill";

interface ShellProps {
  engagements: Engagement[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onReset: () => void;
  children: ReactNode;
}

export function Shell({
  engagements,
  activeId,
  onSelect,
  onCreate,
  onReset,
  children
}: ShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="eyebrow">Authorized Ops</p>
            <h1>CapySuite</h1>
          </div>
        </div>

        <pre className="signal-frame" aria-hidden="true">{`scope map
  node---node
    \\   /
     hub
    /   \\
 evidence`}</pre>

        <div className="sidebar-actions">
          <button className="action-button primary" type="button" onClick={onCreate}>
            <FilePlus2 size={16} />
            New engagement
          </button>
          <button className="icon-text-button" type="button" onClick={onReset}>
            <RefreshCcw size={15} />
            Load sample
          </button>
        </div>

        <nav className="engagement-list" aria-label="Engagements">
          {engagements.map((engagement) => (
            <button
              className={`engagement-switcher ${engagement.id === activeId ? "active" : ""}`}
              key={engagement.id}
              type="button"
              onClick={() => onSelect(engagement.id)}
            >
              <span>{engagement.codename}</span>
              <small>{engagement.client}</small>
              <StatusPill value={engagement.status} />
            </button>
          ))}
        </nav>

        <div className="storage-indicator">
          <Database size={15} />
          Local workspace
        </div>
      </aside>
      <main className="main-surface">{children}</main>
    </div>
  );
}
