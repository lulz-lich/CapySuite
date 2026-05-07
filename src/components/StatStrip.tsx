import {
  AlertTriangle,
  ClipboardCheck,
  Crosshair,
  FileStack,
  GitBranch,
  Shield
} from "lucide-react";
import type { Engagement } from "../models/engagement";

export function StatStrip({ engagement }: { engagement: Engagement }) {
  const inScopeTargets = engagement.targets.filter((target) => target.inScope).length;
  const openFindings = engagement.findings.filter((finding) => finding.status !== "Closed").length;
  const reviewedNotes = engagement.opsecNotes.filter((note) => note.reviewed).length;
  const doneTasks = engagement.tasks.filter((task) => task.status === "Done").length;

  const stats = [
    { label: "In-scope targets", value: inScopeTargets, icon: Crosshair },
    { label: "Open findings", value: openFindings, icon: AlertTriangle },
    { label: "Evidence records", value: engagement.evidence.length, icon: FileStack },
    { label: "Chain steps", value: engagement.attackChain.length, icon: GitBranch },
    { label: "Tasks done", value: `${doneTasks}/${engagement.tasks.length}`, icon: ClipboardCheck },
    {
      label: "OPSEC reviewed",
      value: `${reviewedNotes}/${engagement.opsecNotes.length}`,
      icon: Shield
    }
  ];

  return (
    <section className="stat-strip" aria-label="Engagement metrics">
      {stats.map((stat) => (
        <div className="stat-tile" key={stat.label}>
          <stat.icon size={18} />
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
      ))}
    </section>
  );
}
