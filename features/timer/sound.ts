const CHIME_SRC = "/sounds/bell-chime.mp3";

let chime: HTMLAudioElement | null = null;

/** Plays the bell chime once at the given volume (0–100). */
export function playChime(volume: number): void {
  if (typeof window === "undefined" || volume <= 0) return;
  try {
    chime ??= new Audio(CHIME_SRC);
    chime.volume = Math.min(1, volume / 100);
    chime.currentTime = 0;
    // play() rejects when the browser blocks autoplay; the chime is non-critical, so ignore it
    void chime.play().catch(() => {});
  } catch {
    // audio unsupported; fail silently, it's a non-critical enhancement
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
