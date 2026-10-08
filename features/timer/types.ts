import type { SessionType } from "./state-machine";

export interface SessionEndInfo {
  type: SessionType;
  plannedSeconds: number;
  actualSeconds: number;
  completed: boolean;
  startedAt: Date;
  endedAt: Date;
}
