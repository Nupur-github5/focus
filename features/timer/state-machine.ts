/**
 * Pure timer state machine. No timers, no I/O, no React.
 *
 * Accuracy while the tab is backgrounded is achieved by deriving remaining
 * time from an absolute `endAt` timestamp instead of counting ticks.
 */

export type SessionType = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
export type Phase = "idle" | "running" | "paused" | "finished";

export interface TimerState {
  phase: Phase;
  /** epoch ms at which the running session will end; null unless running */
  endAt: number | null;
  /** authoritative remaining seconds while idle/paused/finished */
  remainingSeconds: number;
  /** total planned duration (seconds) of the current session */
  durationSeconds: number;
}

export function createTimerState(durationSeconds: number): TimerState {
  return {
    phase: "idle",
    endAt: null,
    remainingSeconds: durationSeconds,
    durationSeconds,
  };
}

export function start(state: TimerState, now: number): TimerState {
  if (state.phase === "running" || state.phase === "finished") return state;
  if (state.remainingSeconds <= 0) return state;
  return { ...state, phase: "running", endAt: now + state.remainingSeconds * 1000 };
}

export function pause(state: TimerState, now: number): TimerState {
  if (state.phase !== "running") return state;
  return {
    ...state,
    phase: "paused",
    endAt: null,
    remainingSeconds: computeRemaining(state, now),
  };
}

export function reset(state: TimerState, durationSeconds: number = state.durationSeconds): TimerState {
  return createTimerState(durationSeconds);
}

/** Ends the session immediately, e.g. in response to the Skip action. */
export function finish(state: TimerState): TimerState {
  return { ...state, phase: "finished", endAt: null, remainingSeconds: 0 };
}

/**
 * Re-evaluates a running timer against the current time, transitioning to
 * "finished" if it has naturally expired. Call this from an interval/RAF
 * loop; it is a no-op unless the timer is running.
 */
export function tick(state: TimerState, now: number): TimerState {
  if (state.phase !== "running") return state;
  const remaining = computeRemaining(state, now);
  if (remaining <= 0) return finish(state);
  return state;
}

/** Derives remaining seconds for display without mutating state. */
export function computeRemaining(state: TimerState, now: number): number {
  if (state.phase === "running" && state.endAt !== null) {
    return Math.max(0, Math.ceil((state.endAt - now) / 1000));
  }
  return state.remainingSeconds;
}

export function nextSessionType(
  current: SessionType,
  completedFocusCount: number,
  longBreakInterval: number,
): SessionType {
  if (current !== "FOCUS") return "FOCUS";
  const isLongBreakDue = completedFocusCount > 0 && completedFocusCount % longBreakInterval === 0;
  return isLongBreakDue ? "LONG_BREAK" : "SHORT_BREAK";
}
