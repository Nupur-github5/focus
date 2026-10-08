"use client";

import { Check, Star, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { TaskItem } from "./types";

interface TaskListProps {
  tasks: TaskItem[];
  activeTaskId: string | null;
  onToggleDone: (id: string) => void;
  onDelete: (id: string) => void;
  onSetActive: (id: string) => void;
}

export function TaskList({ tasks, activeTaskId, onToggleDone, onDelete, onSetActive }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">No tasks yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2",
            activeTaskId === task.id && "bg-[var(--muted)]",
          )}
        >
          <button
            type="button"
            role="checkbox"
            aria-checked={task.isDone}
            aria-label={task.isDone ? "Mark task not done" : "Mark task done"}
            onClick={() => onToggleDone(task.id)}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border)]",
              task.isDone && "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]",
            )}
          >
            {task.isDone && <Check className="h-3 w-3" />}
          </button>

          <button
            type="button"
            onClick={() => onSetActive(task.id)}
            className={cn(
              "flex-1 truncate text-left text-sm",
              task.isDone && "text-[var(--muted-foreground)] line-through",
            )}
            title="Set as current focus"
          >
            {task.title}
          </button>

          <span className="shrink-0 text-xs tabular-nums text-[var(--muted-foreground)]">
            {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>

          <button
            type="button"
            onClick={() => onSetActive(task.id)}
            aria-label="Set as current focus"
            aria-pressed={activeTaskId === task.id}
            className={cn(
              "shrink-0 text-[var(--muted-foreground)] hover:text-[var(--accent)]",
              activeTaskId === task.id && "text-[var(--accent)]",
            )}
          >
            <Star className="h-4 w-4" fill={activeTaskId === task.id ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
