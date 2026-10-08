let audioCtx: AudioContext | null = null;

/** A short, gentle two-tone chime synthesized with the Web Audio API — no asset to load. */
export function playChime(volume: number): void {
  if (typeof window === "undefined") return;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  try {
    audioCtx ??= new Ctx();
    const ctx = audioCtx;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = Math.min(1, Math.max(0, volume / 100)) * 0.2;

    const now = ctx.currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      const start = now + i * 0.18;
      osc.start(start);
      osc.stop(start + 0.35);
    });
  } catch {
    // audio unsupported/blocked; fail silently, it's a non-critical enhancement
  }
}

export function requestNotificationPermission(): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    void Notification.requestPermission();
  }
}

export function notify(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    try {
      new Notification(title, { body, silent: true });
    } catch {
      // some browsers restrict Notification outside a user gesture context
    }
  }
}
