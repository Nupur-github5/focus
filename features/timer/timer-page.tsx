"use client";

import { useEffect, useRef, useState } from "react";

import { Header } from "@/components/header";
import { cn } from "@/lib/utils";
import { useSettings } from "@/features/settings/use-settings";
import { TaskPanel } from "@/features/tasks/task-panel";
import { useTasks } from "@/features/tasks/use-tasks";
import { localSessions, newId } from "@/lib/local-storage";
import { SESSION_LABEL } from "@/lib/constants";
import { formatClock } from "@/lib/utils";

import { ShortcutsDialog } from "./shortcuts-dialog";
import { TimerControls } from "./timer-controls";
import { TimerDisplay } from "./timer-display";
import { useTimer } from "./use-timer";
import type { SessionEndInfo } from "./types";

export function TimerPage() {
  const { settings, update: updateSettings } = useSettings();
  const { tasks, addTask, toggleDone, deleteTask, incrementCompletedPomodoros } = useTasks();

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const activeTaskIdRef = useRef(activeTaskId);

  useEffect(() => {
    activeTaskIdRef.current = activeTaskId;
  });

  function handleSessionEnd(info: SessionEndInfo) {
    const taskId = activeTaskIdRef.current;
    if (info.type === "FOCUS" && info.completed && taskId) {
      incrementCompletedPomodoros(taskId);
    }

    localSessions.append({
      id: newId(),
      taskId,
      type: info.type,
      startedAt: info.startedAt.toISOString(),
      endedAt: info.endedAt.toISOString(),
      plannedSeconds: info.plannedSeconds,
      actualSeconds: info.actualSeconds,
      completed: info.completed,
    });
  }

  const { sessionType, phase, remainingSeconds, durationSeconds, completedFocusCount, toggleStartPause, resetTimer, skip } =
    useTimer({ settings, onSessionEnd: handleSessionEnd });

  const isRunning = phase === "running";

  useEffect(() => {
    document.title = `${formatClock(remainingSeconds)} – ${SESSION_LABEL[sessionType]}`;
  }, [remainingSeconds, sessionType]);

  useEffect(() => {
    document.documentElement.dataset.mode = sessionType.toLowerCase();
  }, [sessionType]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;

      if (e.key === " ") {
        e.preventDefault();
        toggleStartPause();
      } else if (e.key.toLowerCase() === "r") {
        resetTimer();
      } else if (e.key.toLowerCase() === "s") {
        skip();
      } else if (e.key === "?") {
        setShortcutsOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleStartPause, resetTimer, skip]);

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        visible={!isRunning}
        settings={settings}
        onSettingsChange={updateSettings}
        tasksOpen={tasksOpen}
        onToggleTasks={() => setTasksOpen((o) => !o)}
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-16">
        <div
          className={cn(
            "transition-mode text-sm text-[var(--muted-foreground)]",
            isRunning && "pointer-events-none opacity-0",
          )}
        >
          {activeTask ? `Working on: ${activeTask.title}` : "Pick a task from the list, or just press start."}
        </div>

        <TimerDisplay
          sessionType={sessionType}
          remainingSeconds={remainingSeconds}
          durationSeconds={durationSeconds}
          completedFocusCount={completedFocusCount}
          longBreakInterval={settings.longBreakInterval}
        />

        <TimerControls
          isRunning={isRunning}
          onToggle={toggleStartPause}
          onReset={resetTimer}
          onSkip={skip}
          showSecondary={!isRunning}
        />

        {!isRunning && tasksOpen && (
          <TaskPanel
            tasks={tasks}
            activeTaskId={activeTaskId}
            onAdd={addTask}
            onToggleDone={toggleDone}
            onDelete={deleteTask}
            onSetActive={(id) => setActiveTaskId((prev) => (prev === id ? null : id))}
          />
        )}
      </main>

      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
