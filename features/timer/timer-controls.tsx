"use client";

import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  showSecondary: boolean;
}

export function TimerControls({ isRunning, onToggle, onReset, onSkip, showSecondary }: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {showSecondary && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset timer"
          title="Reset (R)"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={onToggle}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        title="Start / pause (Space)"
        className="w-40"
      >
        {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        {isRunning ? "Pause" : "Start"}
      </Button>

      {showSecondary && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSkip}
          aria-label="Skip to next session"
          title="Skip (S)"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
