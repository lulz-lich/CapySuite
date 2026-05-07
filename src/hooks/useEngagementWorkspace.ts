import { useEffect, useMemo, useState } from "react";
import type {
  ActivityCategory,
  AttackChainStep,
  Engagement,
  EvidenceItem,
  Finding,
  OpsecNote,
  ScopeTarget,
  TaskItem,
  TaskStatus
} from "../models/engagement";
import { parseEngagementJson } from "../storage/engagementImport";
import {
  createActivity,
  createBlankEngagement,
  createId,
  hydrateEngagement,
  loadActiveEngagementId,
  loadEngagements,
  nowIso,
  resetToSample,
  saveActiveEngagementId,
  saveEngagements
} from "../storage/engagementStore";

function appendActivity(
  engagement: Engagement,
  category: ActivityCategory,
  message: string
): Engagement {
  return {
    ...engagement,
    activityLog: [createActivity(category, message), ...engagement.activityLog].slice(0, 80)
  };
}

export function useEngagementWorkspace() {
  const initialEngagements = useMemo(() => loadEngagements(), []);
  const [engagements, setEngagements] = useState<Engagement[]>(initialEngagements);
  const [activeId, setActiveId] = useState(
    () => loadActiveEngagementId() ?? initialEngagements[0].id
  );

  const activeEngagement = useMemo(
    () => engagements.find((engagement) => engagement.id === activeId) ?? engagements[0],
    [activeId, engagements]
  );

  useEffect(() => {
    saveEngagements(engagements);
  }, [engagements]);

  useEffect(() => {
    if (activeEngagement) {
      saveActiveEngagementId(activeEngagement.id);
    }
  }, [activeEngagement]);

  const replaceActive = (
    next: Engagement,
    activity?: { category: ActivityCategory; message: string }
  ) => {
    const updated = {
      ...(activity ? appendActivity(next, activity.category, activity.message) : next),
      updatedAt: nowIso()
    };

    setEngagements((current) =>
      current.map((engagement) => (engagement.id === updated.id ? updated : engagement))
    );
  };

  const updateActive = (
    patch: Partial<Engagement>,
    activity?: { category: ActivityCategory; message: string }
  ) => {
    replaceActive({ ...activeEngagement, ...patch }, activity);
  };

  const createEngagement = () => {
    const next = createBlankEngagement();
    setEngagements((current) => [next, ...current]);
    setActiveId(next.id);
  };

  const duplicateEngagement = () => {
    const duplicate = hydrateEngagement({
      ...(JSON.parse(JSON.stringify(activeEngagement)) as Engagement),
      id: createId("eng"),
      codename: `${activeEngagement.codename} COPY`,
      name: `${activeEngagement.name} Copy`,
      status: "Planning",
      updatedAt: nowIso()
    });
    const withActivity = appendActivity(duplicate, "workspace", "Duplicated engagement workspace.");
    setEngagements((current) => [withActivity, ...current]);
    setActiveId(withActivity.id);
  };

  const deleteEngagement = () => {
    if (engagements.length <= 1) return;
    const remaining = engagements.filter((engagement) => engagement.id !== activeEngagement.id);
    setEngagements(remaining);
    setActiveId(remaining[0].id);
  };

  const importEngagement = (content: string) => {
    const imported = parseEngagementJson(content);
    const next = engagements.some((engagement) => engagement.id === imported.id)
      ? { ...imported, id: createId("eng"), codename: `${imported.codename} IMPORT` }
      : imported;
    setEngagements((current) => [next, ...current]);
    setActiveId(next.id);
  };

  const resetWorkspace = () => {
    const next = resetToSample();
    setEngagements(next);
    setActiveId(next[0].id);
  };

  const applyPlaybook = (payload: {
    objectives: string[];
    tasks: Array<Omit<TaskItem, "id">>;
    opsecNotes: Array<Omit<OpsecNote, "id" | "reviewed">>;
  }) => {
    updateActive(
      {
        objectives: Array.from(new Set([...activeEngagement.objectives, ...payload.objectives])),
        tasks: [
          ...activeEngagement.tasks,
          ...payload.tasks.map((task) => ({ ...task, id: createId("task") }))
        ],
        opsecNotes: [
          ...activeEngagement.opsecNotes,
          ...payload.opsecNotes.map((note) => ({ ...note, id: createId("opsec"), reviewed: false }))
        ]
      },
      { category: "playbook", message: "Applied a safe operation playbook to the engagement." }
    );
  };

  const addTarget = (target: Omit<ScopeTarget, "id">) => {
    updateActive(
      { targets: [...activeEngagement.targets, { ...target, id: createId("target") }] },
      { category: "scope", message: `Added target ${target.name}.` }
    );
  };

  const toggleTargetScope = (id: string) => {
    const target = activeEngagement.targets.find((item) => item.id === id);
    updateActive(
      {
        targets: activeEngagement.targets.map((item) =>
          item.id === id ? { ...item, inScope: !item.inScope } : item
        )
      },
      { category: "scope", message: `Toggled scope status for ${target?.name ?? "target"}.` }
    );
  };

  const removeTarget = (id: string) => {
    const target = activeEngagement.targets.find((item) => item.id === id);
    updateActive(
      {
        targets: activeEngagement.targets.filter((item) => item.id !== id),
        findings: activeEngagement.findings.map((finding) =>
          finding.targetId === id ? { ...finding, targetId: "" } : finding
        ),
        attackChain: activeEngagement.attackChain.map((step) =>
          step.targetId === id ? { ...step, targetId: "" } : step
        )
      },
      { category: "scope", message: `Removed target ${target?.name ?? id}.` }
    );
  };

  const addTask = (task: Omit<TaskItem, "id">) => {
    updateActive(
      { tasks: [...activeEngagement.tasks, { ...task, id: createId("task") }] },
      { category: "task", message: `Added task ${task.title}.` }
    );
  };

  const changeTaskStatus = (id: string, status: TaskStatus) => {
    const task = activeEngagement.tasks.find((item) => item.id === id);
    updateActive(
      {
        tasks: activeEngagement.tasks.map((item) => (item.id === id ? { ...item, status } : item))
      },
      { category: "task", message: `Updated task ${task?.title ?? id} to ${status}.` }
    );
  };

  const removeTask = (id: string) => {
    const task = activeEngagement.tasks.find((item) => item.id === id);
    updateActive(
      { tasks: activeEngagement.tasks.filter((item) => item.id !== id) },
      { category: "task", message: `Removed task ${task?.title ?? id}.` }
    );
  };

  const addFinding = (finding: Omit<Finding, "id" | "status">) => {
    updateActive(
      {
        findings: [
          ...activeEngagement.findings,
          { ...finding, id: createId("finding"), status: "Open" }
        ]
      },
      { category: "finding", message: `Added finding ${finding.title}.` }
    );
  };

  const changeFindingStatus = (id: string, status: Finding["status"]) => {
    const finding = activeEngagement.findings.find((item) => item.id === id);
    updateActive(
      {
        findings: activeEngagement.findings.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      },
      { category: "finding", message: `Updated finding ${finding?.title ?? id} to ${status}.` }
    );
  };

  const removeFinding = (id: string) => {
    const finding = activeEngagement.findings.find((item) => item.id === id);
    updateActive(
      {
        findings: activeEngagement.findings.filter((item) => item.id !== id),
        evidence: activeEngagement.evidence.map((item) =>
          item.linkedFindingId === id ? { ...item, linkedFindingId: "" } : item
        )
      },
      { category: "finding", message: `Removed finding ${finding?.title ?? id}.` }
    );
  };

  const addEvidence = (item: Omit<EvidenceItem, "id">) => {
    updateActive(
      { evidence: [...activeEngagement.evidence, { ...item, id: createId("evidence") }] },
      { category: "evidence", message: `Added evidence metadata ${item.label}.` }
    );
  };

  const removeEvidence = (id: string) => {
    const evidence = activeEngagement.evidence.find((item) => item.id === id);
    updateActive(
      {
        evidence: activeEngagement.evidence.filter((item) => item.id !== id),
        attackChain: activeEngagement.attackChain.map((step) => ({
          ...step,
          evidenceIds: step.evidenceIds.filter((evidenceId) => evidenceId !== id)
        }))
      },
      { category: "evidence", message: `Removed evidence metadata ${evidence?.label ?? id}.` }
    );
  };

  const addAttackStep = (step: Omit<AttackChainStep, "id">) => {
    updateActive(
      { attackChain: [...activeEngagement.attackChain, { ...step, id: createId("chain") }] },
      { category: "timeline", message: `Added timeline step ${step.title}.` }
    );
  };

  const removeAttackStep = (id: string) => {
    const step = activeEngagement.attackChain.find((item) => item.id === id);
    updateActive(
      { attackChain: activeEngagement.attackChain.filter((item) => item.id !== id) },
      { category: "timeline", message: `Removed timeline step ${step?.title ?? id}.` }
    );
  };

  const addOpsecNote = (note: Omit<OpsecNote, "id" | "reviewed">) => {
    updateActive(
      {
        opsecNotes: [
          ...activeEngagement.opsecNotes,
          { ...note, id: createId("opsec"), reviewed: false }
        ]
      },
      { category: "opsec", message: `Added ${note.category} OPSEC note.` }
    );
  };

  const toggleOpsecNote = (id: string) => {
    const note = activeEngagement.opsecNotes.find((item) => item.id === id);
    updateActive(
      {
        opsecNotes: activeEngagement.opsecNotes.map((item) =>
          item.id === id ? { ...item, reviewed: !item.reviewed } : item
        )
      },
      { category: "opsec", message: `Toggled OPSEC review state for ${note?.category ?? "note"}.` }
    );
  };

  const removeOpsecNote = (id: string) => {
    const note = activeEngagement.opsecNotes.find((item) => item.id === id);
    updateActive(
      { opsecNotes: activeEngagement.opsecNotes.filter((item) => item.id !== id) },
      { category: "opsec", message: `Removed ${note?.category ?? "OPSEC"} note.` }
    );
  };

  return {
    activeEngagement,
    activeId,
    engagements,
    actions: {
      addAttackStep,
      addEvidence,
      addFinding,
      addOpsecNote,
      addTarget,
      addTask,
      applyPlaybook,
      changeFindingStatus,
      changeTaskStatus,
      createEngagement,
      deleteEngagement,
      duplicateEngagement,
      importEngagement,
      removeAttackStep,
      removeEvidence,
      removeFinding,
      removeOpsecNote,
      removeTarget,
      removeTask,
      resetWorkspace,
      setActiveId,
      toggleOpsecNote,
      toggleTargetScope,
      updateActive
    }
  };
}
