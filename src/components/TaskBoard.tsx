import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TaskItem, TaskStatus } from "../models/engagement";
import { StatusPill } from "./StatusPill";

interface TaskBoardProps {
  tasks: TaskItem[];
  onAdd: (task: Omit<TaskItem, "id">) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onRemove: (id: string) => void;
}

const taskStatuses: TaskStatus[] = ["Backlog", "In Progress", "Blocked", "Done"];

export function TaskBoard({ tasks, onAdd, onStatusChange, onRemove }: TaskBoardProps) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), owner: owner.trim() || "Unassigned", dueDate, status: "Backlog" });
    setTitle("");
    setOwner("");
    setDueDate("");
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Execution</p>
          <h2>Tasks</h2>
        </div>
        <CheckCircle2 size={18} aria-hidden="true" />
      </div>

      <div className="form-grid task-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
        />
        <input
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Owner"
        />
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <button className="icon-button" type="button" onClick={submit} aria-label="Add task">
          <Plus size={17} />
        </button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-row" key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <span>
                {task.owner} / {task.dueDate || "No due date"}
              </span>
            </div>
            <StatusPill value={task.status} />
            <select
              value={task.status}
              onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
            >
              {taskStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <button
              className="ghost-icon"
              type="button"
              onClick={() => onRemove(task.id)}
              aria-label={`Remove ${task.title}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
