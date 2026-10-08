let audioCtx: AudioContext | null = null;

// Bell partials as [frequency ratio, relative amplitude, decay seconds]. Real bells are
// inharmonic (hum, prime, minor-third tierce, quint, nominal, ...); the low partials ring
// longest, which is what gives a deep bell its long resonant tail.
const BELL_PARTIALS: [number, number, number][] = [
  [0.5, 0.55, 4.5], // hum
  [1.0, 1.0, 3.5], // prime / strike tone
  [1.19, 0.4, 2.6], // tierce (minor third — the characteristic bell colour)
  [1.5, 0.3, 2.0], // quint
  [2.0, 0.45, 1.6], // nominal
  [2.52, 0.18, 1.1],
  [3.01, 0.12, 0.8],
  [4.07, 0.08, 0.5],
];
const BELL_FUNDAMENTAL = 196; // G3 — low enough to read as "deep" without needing big speakers

/** A single deep, resonant bell strike synthesized with the Web Audio API — no asset to load. */
export function playChime(volume: number): void {
  if (typeof window === "undefined" || volume <= 0) return;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  try {
    audioCtx ??= new Ctx();
    const ctx = audioCtx;
    if (ctx.state === "suspended") void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = Math.min(1, volume / 100) * 0.25;
    master.connect(ctx.destination);

    const now = ctx.currentTime + 0.02;
    for (const [ratio, amp, decay] of BELL_PARTIALS) {
      // Two slightly detuned oscillators per partial produce the slow "beating" shimmer of a real bell.
      for (const detune of [-1.5, 1.5]) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = BELL_FUNDAMENTAL * ratio;
        osc.detune.value = detune;

        const env = ctx.createGain();
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(amp * 0.5, now + 0.005); // sharp strike
        env.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(env).connect(master);
        osc.start(now);
        osc.stop(now + decay + 0.05);
      }
    }
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
