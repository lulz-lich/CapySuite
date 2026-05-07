import { History } from "lucide-react";
import type { ActivityEvent } from "../models/engagement";
import { StatusPill } from "./StatusPill";

export function ActivityLogPanel({ events }: { events: ActivityEvent[] }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Audit Trail</p>
          <h2>Activity log</h2>
        </div>
        <History size={18} aria-hidden="true" />
      </div>

      <div className="activity-list">
        {events.length === 0 ? (
          <div className="empty-state">No activity recorded yet.</div>
        ) : (
          events.slice(0, 12).map((event) => (
            <article className="activity-row" key={event.id}>
              <div>
                <strong>{event.message}</strong>
                <time>{new Date(event.timestamp).toLocaleString()}</time>
              </div>
              <StatusPill value={event.category} />
            </article>
          ))
        )}
      </div>
    </section>
  );
}
