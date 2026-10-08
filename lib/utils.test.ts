import { describe, expect, it } from "vitest";
import { formatClock } from "./utils";

describe("formatClock", () => {
  it("pads minutes and seconds to two digits", () => {
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(5)).toBe("00:05");
    expect(formatClock(65)).toBe("01:05");
    expect(formatClock(1500)).toBe("25:00");
  });

  it("floors fractional seconds and clamps negatives to zero", () => {
    expect(formatClock(59.9)).toBe("00:59");
    expect(formatClock(-10)).toBe("00:00");
  });
});
