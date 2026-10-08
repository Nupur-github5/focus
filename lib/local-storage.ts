import type { SessionType } from "@/features/timer/state-machine";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/constants";

const KEYS = {
  settings: "focus:settings",
  tasks: "focus:tasks",
  sessions: "focus:sessions",
} as const;

export interface LocalTask {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isDone: boolean;
  order: number;
  createdAt: string;
}

export interface LocalSession {
  id: string;
  taskId: string | null;
  type: SessionType;
  startedAt: string;
  endedAt: string | null;
  plannedSeconds: number;
  actualSeconds: number;
  completed: boolean;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or disabled; silently drop, guest mode degrades gracefully
  }
}

export const localSettings = {
  get: (): Settings => read(KEYS.settings, DEFAULT_SETTINGS),
  set: (settings: Settings): void => write(KEYS.settings, settings),
};

export const localTasks = {
  get: (): LocalTask[] => read(KEYS.tasks, []),
  set: (tasks: LocalTask[]): void => write(KEYS.tasks, tasks),
};

export const localSessions = {
  get: (): LocalSession[] => read(KEYS.sessions, []),
  set: (sessions: LocalSession[]): void => write(KEYS.sessions, sessions),
  append: (session: LocalSession): void => {
    const current = read<LocalSession[]>(KEYS.sessions, []);
    write(KEYS.sessions, [...current, session]);
  },
};

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
