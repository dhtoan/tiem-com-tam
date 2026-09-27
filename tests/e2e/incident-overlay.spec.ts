import { test, expect } from "@playwright/test";

test.describe("Incident Overlay Controller & Slow-Time", () => {
  test("opens incident overlay, slows time, allows choosing action, and restores time & canvas interaction", async ({
    page,
  }) => {
    await page.goto("/");

    // If morning brief is open, close it
    const backdrop = page.locator(".overlay-backdrop");
    if (await backdrop.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(backdrop).not.toBeVisible();
    }

    // Trigger an incident via IncidentController
    await page.evaluate(() => {
      const win = window as unknown as {
        __incidentController: {
          start: (
            event: unknown,
            actions: unknown[],
            onChoose: (actionId: string) => void
          ) => void;
        };
        __incidentChosenAction?: string;
      };

      const event = {
        id: "test-theft",
        type: "theft",
        title: "Kẻ gian lén lút tiếp cận quầy",
        description: "Có người tiến lại gần hộp tiền trong lúc tiệm đang bận rộn!",
        urgency: "high",
        availableActions: [
          {
            id: "shout",
            label: "Hô hoán cảnh báo",
            description: "Cảnh báo lớn tiếng để đối tượng bỏ chạy",
          },
          {
            id: "guard",
            label: "Nhờ bảo vệ can thiệp",
            description: "Bảo vệ túc trực can ngăn đối tượng",
          },
        ],
      };

      win.__incidentController.start(event, event.availableActions, (chosen) => {
        win.__incidentChosenAction = chosen;
      });
    });

    // Verify incident modal is visible
    const incidentModal = page.locator(".incident-dialog");
    await expect(incidentModal).toBeVisible();
    await expect(incidentModal.locator(".incident-title")).toContainText("Kẻ gian lén lút");

    // Verify clock is slowed
    const clockScale = await page.evaluate(() => {
      const win = window as unknown as { __gameClock: { getScale: () => number } };
      return win.__gameClock.getScale();
    });
    expect(clockScale).toBeCloseTo(0.3, 2);

    // Click the "Hô hoán cảnh báo" action button
    const shoutBtn = page.locator(".incident-action-btn[data-action-id='shout']");
    await expect(shoutBtn).toBeVisible();
    await shoutBtn.click();

    // Verify overlay closed
    await expect(incidentModal).not.toBeVisible();

    // Verify action was chosen
    const chosen = await page.evaluate(() => {
      const win = window as unknown as { __incidentChosenAction?: string };
      return win.__incidentChosenAction;
    });
    expect(chosen).toBe("shout");

    // Verify time scale restored to 1.0
    const restoredScale = await page.evaluate(() => {
      const win = window as unknown as { __gameClock: { getScale: () => number } };
      return win.__gameClock.getScale();
    });
    expect(restoredScale).toBeCloseTo(1.0, 2);

    // Verify canvas receives click
    const canvas = page.locator("#game-root canvas");
    if (await canvas.isVisible()) {
      await canvas.click({ position: { x: 50, y: 50 } });
    }
  });
});
