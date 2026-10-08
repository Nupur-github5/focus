"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TaskInput({ onAdd }: { onAdd: (title: string, estimate: number) => void }) {
  const [title, setTitle] = useState("");
  const [estimate, setEstimate] = useState(1);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, estimate);
    setTitle("");
    setEstimate(1);
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        aria-label="New task title"
        className="flex-1"
      />
      <Input
        type="number"
        min={1}
        max={50}
        value={estimate}
        onChange={(e) => setEstimate(Math.max(1, Number(e.target.value) || 1))}
        aria-label="Estimated pomodoros"
        className="w-16 text-center"
      />
      <Button type="submit" size="icon" variant="outline" aria-label="Add task">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
