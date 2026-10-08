import { describe, expect, it } from "vitest";
import {
  computeRemaining,
  createTimerState,
  finish,
  nextSessionType,
  pause,
  reset,
  start,
  tick,
} from "./state-machine";

describe("timer state machine", () => {
  it("starts idle with full duration", () => {
    const state = createTimerState(1500);
    expect(state.phase).toBe("idle");
    expect(state.remainingSeconds).toBe(1500);
  });

  it("start sets an absolute endAt timestamp", () => {
    const now = 1_000_000;
    const state = start(createTimerState(1500), now);
    expect(state.phase).toBe("running");
    expect(state.endAt).toBe(now + 1500 * 1000);
  });

  it("computes remaining time from elapsed wall-clock time, not tick count", () => {
    const now = 1_000_000;
    const running = start(createTimerState(1500), now);
    // simulate the tab being backgrounded for 90s with zero intervening ticks
    const remaining = computeRemaining(running, now + 90_000);
    expect(remaining).toBe(1410);
  });

  it("pause freezes remaining time and clears endAt", () => {
    const now = 1_000_000;
    const running = start(createTimerState(1500), now);
    const paused = pause(running, now + 10_000);
    expect(paused.phase).toBe("paused");
    expect(paused.endAt).toBeNull();
    expect(paused.remainingSeconds).toBe(1490);
  });

  it("resuming from pause continues from the frozen remaining time", () => {
    const t0 = 1_000_000;
    const running = start(createTimerState(100), t0);
    const paused = pause(running, t0 + 40_000); // 60s left
    const resumed = start(paused, t0 + 100_000);
    expect(resumed.endAt).toBe(t0 + 100_000 + 60_000);
  });

  it("tick transitions to finished once time is exhausted", () => {
    const now = 1_000_000;
    const running = start(createTimerState(10), now);
    const stillRunning = tick(running, now + 5_000);
    expect(stillRunning.phase).toBe("running");
    const finished = tick(running, now + 10_000);
    expect(finished.phase).toBe("finished");
    expect(finished.remainingSeconds).toBe(0);
  });

  it("finish ends the session immediately regardless of remaining time", () => {
    const now = 1_000_000;
    const running = start(createTimerState(1500), now);
    const finished = finish(running);
    expect(finished.phase).toBe("finished");
    expect(finished.remainingSeconds).toBe(0);
  });

  it("reset returns to idle with the given (or current) duration", () => {
    const running = start(createTimerState(1500), 0);
    expect(reset(running).remainingSeconds).toBe(1500);
    expect(reset(running, 300).remainingSeconds).toBe(300);
    expect(reset(running, 300).phase).toBe("idle");
  });

  it("ignores start on an already-finished timer", () => {
    const finished = finish(start(createTimerState(10), 0));
    expect(start(finished, 1000)).toBe(finished);
  });

  it("ignores pause when not running", () => {
    const idle = createTimerState(1500);
    expect(pause(idle, 0)).toBe(idle);
  });

  describe("nextSessionType", () => {
    it("always follows a break with a focus session", () => {
      expect(nextSessionType("SHORT_BREAK", 1, 4)).toBe("FOCUS");
      expect(nextSessionType("LONG_BREAK", 4, 4)).toBe("FOCUS");
    });

    it("schedules a long break every `interval` completed focus sessions", () => {
      expect(nextSessionType("FOCUS", 1, 4)).toBe("SHORT_BREAK");
      expect(nextSessionType("FOCUS", 2, 4)).toBe("SHORT_BREAK");
      expect(nextSessionType("FOCUS", 3, 4)).toBe("SHORT_BREAK");
      expect(nextSessionType("FOCUS", 4, 4)).toBe("LONG_BREAK");
      expect(nextSessionType("FOCUS", 8, 4)).toBe("LONG_BREAK");
    });

    it("never triggers a long break on zero completed sessions", () => {
      expect(nextSessionType("FOCUS", 0, 4)).toBe("SHORT_BREAK");
    });
  });
});
