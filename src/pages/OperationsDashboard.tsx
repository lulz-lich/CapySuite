import { ActivityLogPanel } from "../components/ActivityLogPanel";
import { AttackTimeline } from "../components/AttackTimeline";
import { EngagementOverview } from "../components/EngagementOverview";
import { EvidenceLedger } from "../components/EvidenceLedger";
import { ExecutiveBriefPanel } from "../components/ExecutiveBriefPanel";
import { ExportPanel } from "../components/ExportPanel";
import { FindingsManager } from "../components/FindingsManager";
import { MitreCoveragePanel } from "../components/MitreCoveragePanel";
import { OpsecPanel } from "../components/OpsecPanel";
import { OperatorConsole } from "../components/OperatorConsole";
import { OpsSearchPanel } from "../components/OpsSearchPanel";
import { PlaybookPanel } from "../components/PlaybookPanel";
import { ReadinessPanel } from "../components/ReadinessPanel";
import { RiskMatrix } from "../components/RiskMatrix";
import { SafeToolbox } from "../components/SafeToolbox";
import { ScopeManager } from "../components/ScopeManager";
import { Shell } from "../components/Shell";
import { StatStrip } from "../components/StatStrip";
import { StatusPill } from "../components/StatusPill";
import { TaskBoard } from "../components/TaskBoard";
import { WorkspaceToolbar } from "../components/WorkspaceToolbar";
import { useEngagementWorkspace } from "../hooks/useEngagementWorkspace";

export function OperationsDashboard() {
  const { activeEngagement, actions, engagements } = useEngagementWorkspace();

  return (
    <Shell
      engagements={engagements}
      activeId={activeEngagement.id}
      onSelect={actions.setActiveId}
      onCreate={actions.createEngagement}
      onReset={actions.resetWorkspace}
    >
      <header className="topbar">
        <div>
          <p className="eyebrow">Red Team Operations Platform</p>
          <h1>{activeEngagement.codename}</h1>
          <p>
            {activeEngagement.name} / {activeEngagement.client}
          </p>
        </div>
        <div className="topbar-status">
          <StatusPill value={activeEngagement.status} />
          <span>Updated {new Date(activeEngagement.updatedAt).toLocaleString()}</span>
          <WorkspaceToolbar
            canDelete={engagements.length > 1}
            onDuplicate={actions.duplicateEngagement}
            onDelete={actions.deleteEngagement}
            onImport={actions.importEngagement}
          />
        </div>
      </header>

      <StatStrip engagement={activeEngagement} />

      <div className="dashboard-grid">
        <OperatorConsole engagement={activeEngagement} />
        <ExecutiveBriefPanel engagement={activeEngagement} />
        <OpsSearchPanel engagement={activeEngagement} />
        <PlaybookPanel onApply={actions.applyPlaybook} />
        <SafeToolbox />
        <ReadinessPanel engagement={activeEngagement} />
        <RiskMatrix engagement={activeEngagement} />
        <MitreCoveragePanel engagement={activeEngagement} />
        <ActivityLogPanel events={activeEngagement.activityLog} />
        <EngagementOverview engagement={activeEngagement} onUpdate={actions.updateActive} />
        <ExportPanel engagement={activeEngagement} />
        <ScopeManager
          targets={activeEngagement.targets}
          onAdd={actions.addTarget}
          onToggleScope={actions.toggleTargetScope}
          onRemove={actions.removeTarget}
        />
        <TaskBoard
          tasks={activeEngagement.tasks}
          onAdd={actions.addTask}
          onStatusChange={actions.changeTaskStatus}
          onRemove={actions.removeTask}
        />
        <FindingsManager
          findings={activeEngagement.findings}
          targets={activeEngagement.targets}
          onAdd={actions.addFinding}
          onStatusChange={actions.changeFindingStatus}
          onRemove={actions.removeFinding}
        />
        <EvidenceLedger
          evidence={activeEngagement.evidence}
          findings={activeEngagement.findings}
          onAdd={actions.addEvidence}
          onRemove={actions.removeEvidence}
        />
        <OpsecPanel
          notes={activeEngagement.opsecNotes}
          onAdd={actions.addOpsecNote}
          onToggle={actions.toggleOpsecNote}
          onRemove={actions.removeOpsecNote}
        />
        <AttackTimeline
          steps={activeEngagement.attackChain}
          targets={activeEngagement.targets}
          evidence={activeEngagement.evidence}
          onAdd={actions.addAttackStep}
          onRemove={actions.removeAttackStep}
        />
      </div>
    </Shell>
  );
}
