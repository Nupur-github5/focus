"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

const SHORTCUTS: [string, string][] = [
  ["Space", "Start / pause"],
  ["R", "Reset"],
  ["S", "Skip"],
  ["?", "Show this help"],
];

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Keyboard shortcuts">
        <dl className="flex flex-col gap-3">
          {SHORTCUTS.map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <dt>
                <kbd className="rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 py-1 font-mono text-sm">
                  {key}
                </kbd>
              </dt>
              <dd className="text-sm text-[var(--muted-foreground)]">{desc}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
