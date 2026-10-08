"use client";

import { useCallback, useEffect, useState } from "react";

import { localTasks, newId, type LocalTask } from "@/lib/local-storage";

import type { TaskItem } from "./types";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    setTasks(localTasks.get());
  }, []);

  const persistLocal = useCallback((next: TaskItem[]) => {
    localTasks.set(next as LocalTask[]);
  }, []);

  const addTask = useCallback(
    (title: string, estimatedPomodoros = 1) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      setTasks((prev) => {
        const next: TaskItem[] = [
          ...prev,
          {
            id: newId(),
            title: trimmed,
            estimatedPomodoros,
            completedPomodoros: 0,
            isDone: false,
            order: prev.length,
            createdAt: new Date().toISOString(),
          },
        ];
        persistLocal(next);
        return next;
      });
    },
    [persistLocal],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<TaskItem>) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
        persistLocal(next);
        return next;
      });
    },
    [persistLocal],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        persistLocal(next);
        return next;
      });
    },
    [persistLocal],
  );

  const toggleDone = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      updateTask(id, { isDone: !task.isDone });
    },
    [tasks, updateTask],
  );

  const incrementCompletedPomodoros = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      updateTask(id, { completedPomodoros: task.completedPomodoros + 1 });
    },
    [tasks, updateTask],
  );

  return { tasks, addTask, updateTask, deleteTask, toggleDone, incrementCompletedPomodoros };
}
