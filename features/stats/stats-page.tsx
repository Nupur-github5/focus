"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BarChart } from "./bar-chart";
import { useStats } from "./use-stats";

export function StatsPage() {
  const stats = useStats();

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-10 px-6 py-10">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" aria-label="Back to timer">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Stats</h1>
      </div>

      {!stats ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Today" value={`${stats.todayMinutes}m`} />
            <Stat label="This week" value={`${stats.weekMinutes}m`} />
            <Stat label="Streak" value={`${stats.currentStreak}d`} />
          </div>

          <div>
            <h2 className="mb-4 text-sm font-medium text-[var(--muted-foreground)]">Last 7 days</h2>
            <BarChart data={stats.last7Days} />
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
      <div className="tabular-timer text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-[var(--muted-foreground)]">{label}</div>
    </div>
  );
}
