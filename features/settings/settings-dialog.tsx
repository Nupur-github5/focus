"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import type { Settings } from "@/lib/constants";
import { requestNotificationPermission } from "@/features/timer/sound";

interface SettingsDialogProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  trigger: React.ReactNode;
}

export function SettingsDialog({ settings, onChange, trigger }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title="Settings">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            <NumberField
              label="Focus (min)"
              value={settings.focusMinutes}
              onChange={(v) => onChange({ focusMinutes: v })}
              min={1}
              max={180}
            />
            <NumberField
              label="Short break"
              value={settings.shortBreakMinutes}
              onChange={(v) => onChange({ shortBreakMinutes: v })}
              min={1}
              max={60}
            />
            <NumberField
              label="Long break"
              value={settings.longBreakMinutes}
              onChange={(v) => onChange({ longBreakMinutes: v })}
              min={1}
              max={120}
            />
          </div>

          <NumberField
            label="Long break after how many focus sessions"
            value={settings.longBreakInterval}
            onChange={(v) => onChange({ longBreakInterval: v })}
            min={1}
            max={12}
          />

          <Row label="Auto-start next session">
            <Switch
              checked={settings.autoStart}
              onCheckedChange={(v) => onChange({ autoStart: v })}
            />
          </Row>

          <Row label="Sound">
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(v) => onChange({ soundEnabled: v })}
            />
          </Row>

          {settings.soundEnabled && (
            <div className="flex items-center gap-3">
              <Label className="w-20 shrink-0">Volume</Label>
              <Slider
                value={[settings.volume]}
                onValueChange={([v]) => onChange({ volume: v })}
                min={0}
                max={100}
                step={5}
              />
            </div>
          )}

          <Row label="Browser notifications">
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(v) => {
                if (v) requestNotificationPermission();
                onChange({ notificationsEnabled: v });
              }}
            />
          </Row>

          <div>
            <Label className="mb-2 block">Theme</Label>
            <div className="flex gap-2">
              {(["SYSTEM", "LIGHT", "DARK"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTheme(t);
                    onChange({ theme: t });
                  }}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                    theme === t
                      ? "border-[var(--accent)] bg-[var(--muted)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  {t.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs text-[var(--muted-foreground)]">{label}</Label>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
      />
    </div>
  );
}
