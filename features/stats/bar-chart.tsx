"use client";

const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: "short" });

export function BarChart({ data }: { data: { date: string; minutes: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.minutes));

  return (
    <div
      role="img"
      aria-label={`Focus minutes for the last 7 days: ${data
        .map((d) => `${WEEKDAY.format(new Date(d.date))} ${d.minutes} minutes`)
        .join(", ")}`}
      className="flex h-40 w-full items-end gap-3"
    >
      {data.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end">
            <div
              className="w-full rounded-t-md bg-[var(--accent)] transition-[height]"
              style={{ height: `${Math.max(4, (d.minutes / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">
            {WEEKDAY.format(new Date(d.date))}
          </span>
        </div>
      ))}
    </div>
  );
}
