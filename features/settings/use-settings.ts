"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_SETTINGS, type Settings } from "@/lib/constants";
import { localSettings } from "@/lib/local-storage";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Read localStorage once on mount.
  useEffect(() => {
    setSettings(localSettings.get());
    setLoaded(true);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      localSettings.set(next);
      return next;
    });
  }, []);

  return { settings, update, loaded };
}
