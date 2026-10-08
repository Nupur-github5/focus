"use client";

import { ListTodo, Settings as SettingsIcon, BarChart3 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SettingsDialog } from "@/features/settings/settings-dialog";
import type { Settings } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface HeaderProps {
  visible: boolean;
  settings: Settings;
  onSettingsChange: (patch: Partial<Settings>) => void;
  tasksOpen: boolean;
  onToggleTasks: () => void;
}

export function Header({ visible, settings, onSettingsChange, tasksOpen, onToggleTasks }: HeaderProps) {
  return (
    <header
      className={cn(
        "transition-mode flex w-full items-center justify-between px-5 py-4 sm:px-8",
        !visible && "pointer-events-none opacity-0",
      )}
    >
      <span className="text-sm font-semibold tracking-tight">Focus</span>

      <nav className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle task list"
          aria-pressed={tasksOpen}
          onClick={onToggleTasks}
        >
          <ListTodo className="h-5 w-5" />
        </Button>

        <Link href="/stats">
          <Button variant="ghost" size="icon" aria-label="View stats">
            <BarChart3 className="h-5 w-5" />
          </Button>
        </Link>

        <SettingsDialog
          settings={settings}
          onChange={onSettingsChange}
          trigger={
            <Button variant="ghost" size="icon" aria-label="Open settings">
              <SettingsIcon className="h-5 w-5" />
            </Button>
          }
        />
      </nav>
    </header>
  );
}
