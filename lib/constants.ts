import type { SessionType } from "@/features/timer/state-machine";

export const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStart: false,
  soundEnabled: true,
  volume: 50,
  notificationsEnabled: false,
  theme: "SYSTEM" as "SYSTEM" | "LIGHT" | "DARK",
};

export type Settings = typeof DEFAULT_SETTINGS;

export const SESSION_LABEL: Record<SessionType, string> = {
  FOCUS: "Focus",
  SHORT_BREAK: "Short Break",
  LONG_BREAK: "Long Break",
};

export function durationForType(type: SessionType, settings: Settings): number {
  switch (type) {
    case "FOCUS":
      return settings.focusMinutes * 60;
    case "SHORT_BREAK":
      return settings.shortBreakMinutes * 60;
    case "LONG_BREAK":
      return settings.longBreakMinutes * 60;
  }
}
