"use client";

import { TaskInput } from "./task-input";
import { TaskList } from "./task-list";
import type { TaskItem } from "./types";

interface TaskPanelProps {
  tasks: TaskItem[];
  activeTaskId: string | null;
  onAdd: (title: string, estimate: number) => void;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function TaskPanel(props: TaskPanelProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <TaskInput onAdd={props.onAdd} />
      <div className="mt-3">
        <TaskList
          tasks={props.tasks}
          activeTaskId={props.activeTaskId}
          onToggleDone={props.onToggleDone}
          onDelete={props.onDelete}
          onSetActive={props.onSetActive}
        />
      </div>
    </div>
  );
}
