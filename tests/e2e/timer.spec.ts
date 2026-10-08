import { expect, test } from "@playwright/test";

test("guest can start, pause, reset and skip a focus session", async ({ page }) => {
  await page.goto("/");

  const timer = page.getByRole("timer");
  const sessionLabel = page.getByTestId("session-label");
  await expect(timer).toHaveText("25:00");
  await expect(sessionLabel).toHaveText("Focus");

  const startButton = page.getByRole("button", { name: "Start timer" });
  await startButton.click();
  await expect(page.getByRole("button", { name: "Pause timer" })).toBeVisible();

  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Pause timer" }).click();
  await expect(page.getByRole("button", { name: "Start timer" })).toBeVisible();
  await expect(timer).not.toHaveText("25:00");

  await page.getByRole("button", { name: "Reset timer" }).click();
  await expect(timer).toHaveText("25:00");

  await page.getByRole("button", { name: "Skip to next session" }).click();
  await expect(sessionLabel).toHaveText("Short Break");
  await expect(timer).toHaveText("05:00");

  await expect(page).toHaveTitle(/05:00 – Short Break/);
});
