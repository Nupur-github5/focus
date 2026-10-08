"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Settings } from "@/lib/constants";
import { durationForType, SESSION_LABEL } from "@/lib/constants";

import { notify, playChime } from "./sound";
import {
  computeRemaining,
  createTimerState,
  nextSessionType,
  pause,
  reset as resetState,
  start,
  tick,
  type SessionType,
  type TimerState,
} from "./state-machine";
import type { SessionEndInfo } from "./types";

interface UseTimerOptions {
  settings: Settings;
  onSessionEnd: (info: SessionEndInfo) => void;
}

export interface UseTimerResult {
  sessionType: SessionType;
  phase: TimerState["phase"];
  remainingSeconds: number;
  durationSeconds: number;
  completedFocusCount: number;
  toggleStartPause: () => void;
  resetTimer: () => void;
  skip: () => void;
}

export function useTimer({ settings, onSessionEnd }: UseTimerOptions): UseTimerResult {
  const [sessionType, setSessionType] = useState<SessionType>("FOCUS");
  const [completedFocusCount, setCompletedFocusCount] = useState(0);
  const [state, setState] = useState<TimerState>(() =>
    createTimerState(durationForType("FOCUS", settings)),
  );
  const [, setClockTick] = useState(0);

  const stateRef = useRef(state);
  const sessionTypeRef = useRef(sessionType);
  const completedFocusCountRef = useRef(completedFocusCount);
  const settingsRef = useRef(settings);
  const startedAtRef = useRef<Date | null>(null);
  const onSessionEndRef = useRef(onSessionEnd);

  // Mirror the latest values into refs so callbacks (interval tick, keyboard
  // shortcuts) always see current data without resubscribing every render.
  useEffect(() => {
    stateRef.current = state;
    sessionTypeRef.current = sessionType;
    completedFocusCountRef.current = completedFocusCount;
    settingsRef.current = settings;
    onSessionEndRef.current = onSessionEnd;
  });

  // Keep the idle timer's duration in sync with settings changes.
  useEffect(() => {
    if (state.phase === "idle") {
      setState(createTimerState(durationForType(sessionType, settings)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes, sessionType]);

  const endCurrentSession = useCallback((completed: boolean, prev: TimerState, now: number) => {
    const type = sessionTypeRef.current;
    const currentSettings = settingsRef.current;
    const startedAt = startedAtRef.current ?? new Date(now);
    const elapsed = completed
      ? prev.durationSeconds
      : prev.durationSeconds - computeRemaining(prev, now);

    onSessionEndRef.current({
      type,
      plannedSeconds: prev.durationSeconds,
      actualSeconds: Math.max(0, Math.round(elapsed)),
      completed,
      startedAt,
      endedAt: new Date(now),
    });

    const newCompletedFocusCount =
      type === "FOCUS" && completed ? completedFocusCountRef.current + 1 : completedFocusCountRef.current;
    if (newCompletedFocusCount !== completedFocusCountRef.current) {
      setCompletedFocusCount(newCompletedFocusCount);
    }

    const upcoming = nextSessionType(type, newCompletedFocusCount, currentSettings.longBreakInterval);
    setSessionType(upcoming);
    startedAtRef.current = null;

    const fresh = createTimerState(durationForType(upcoming, currentSettings));
    playChime(currentSettings.soundEnabled ? currentSettings.volume : 0);
    notify(
      `${SESSION_LABEL[type]} session ${completed ? "complete" : "skipped"}`,
      `Time for ${SESSION_LABEL[upcoming].toLowerCase()}.`,
    );

    if (currentSettings.autoStart) {
      startedAtRef.current = new Date(now);
      setState(start(fresh, now));
    } else {
      setState(fresh);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const prev = stateRef.current;
      if (prev.phase !== "running") return;
      const now = Date.now();
      const next = tick(prev, now);
      if (next.phase === "finished") {
        endCurrentSession(true, prev, now);
      } else {
        setClockTick((c) => c + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endCurrentSession]);

  const toggleStartPause = useCallback(() => {
    const prev = stateRef.current;
    const now = Date.now();
    if (prev.phase === "running") {
      setState(pause(prev, now));
      return;
    }
    if (prev.phase === "idle" || prev.phase === "paused") {
      if (prev.phase === "idle") startedAtRef.current = new Date(now);
      setState(start(prev, now));
    }
  }, []);

  const resetTimer = useCallback(() => {
    startedAtRef.current = null;
    setState(resetState(stateRef.current, durationForType(sessionTypeRef.current, settingsRef.current)));
  }, []);

  const skip = useCallback(() => {
    const prev = stateRef.current;
    if (prev.phase === "idle") {
      // nothing ran yet; just move on without recording a session
      const upcoming = nextSessionType(
        sessionTypeRef.current,
        completedFocusCountRef.current,
        settingsRef.current.longBreakInterval,
      );
      setSessionType(upcoming);
      setState(createTimerState(durationForType(upcoming, settingsRef.current)));
      return;
    }
    const now = Date.now();
    endCurrentSession(false, prev, now);
  }, [endCurrentSession]);

  const remainingSeconds = computeRemaining(state, Date.now());

  return {
    sessionType,
    phase: state.phase,
    remainingSeconds,
    durationSeconds: state.durationSeconds,
    completedFocusCount,
    toggleStartPause,
    resetTimer,
    skip,
  };
}
