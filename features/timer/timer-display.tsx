"use client";

import { SESSION_LABEL } from "@/lib/constants";
import { formatClock } from "@/lib/utils";

import type { SessionType } from "./state-machine";

interface TimerDisplayProps {
  sessionType: SessionType;
  remainingSeconds: number;
  durationSeconds: number;
  completedFocusCount: number;
  longBreakInterval: number;
}

export function TimerDisplay({
  sessionType,
  remainingSeconds,
  durationSeconds,
  completedFocusCount,
  longBreakInterval,
}: TimerDisplayProps) {
  const progress = durationSeconds > 0 ? 1 - remainingSeconds / durationSeconds : 0;
  const dotsInCycle = ((completedFocusCount - 1) % longBreakInterval) + 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <p
        data-testid="session-label"
        className="transition-mode text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]"
      >
        {SESSION_LABEL[sessionType]}
      </p>

      <div
        role="timer"
        aria-live="off"
        aria-label={`${SESSION_LABEL[sessionType]}, ${formatClock(remainingSeconds)} remaining`}
        className="tabular-timer text-[clamp(4.5rem,18vw,10rem)] font-semibold leading-none text-[var(--foreground)]"
      >
        {formatClock(remainingSeconds)}
      </div>

      <div
        className="h-1 w-48 overflow-hidden rounded-full bg-[var(--muted)]"
        aria-hidden="true"
      >
        <div
          className="transition-mode h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {sessionType === "FOCUS" && (
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: longBreakInterval }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i < dotsInCycle ? "bg-[var(--accent)]" : "bg-[var(--muted)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
