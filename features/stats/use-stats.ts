"use client";

import { useEffect, useState } from "react";

import { localSessions } from "@/lib/local-storage";

export interface StatsData {
  todayMinutes: number;
  weekMinutes: number;
  currentStreak: number;
  last7Days: { date: string; minutes: number }[];
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function computeLocalStats(): StatsData {
  const sessions = localSessions.get().filter((s) => s.type === "FOCUS");
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    const day = s.startedAt.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + s.actualSeconds);
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const last7Days: { date: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = isoDate(d);
    last7Days.push({ date: key, minutes: Math.round((byDay.get(key) ?? 0) / 60) });
  }

  const todayMinutes = last7Days[last7Days.length - 1]?.minutes ?? 0;
  const weekMinutes = last7Days.reduce((sum, d) => sum + d.minutes, 0);

  let currentStreak = 0;
  for (let i = 0; i < 365; i += 1) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const seconds = byDay.get(isoDate(d)) ?? 0;
    if (seconds > 0) {
      currentStreak += 1;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  return { todayMinutes, weekMinutes, currentStreak, last7Days };
}

export function useStats() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    setData(computeLocalStats());
  }, []);

  return data;
}
