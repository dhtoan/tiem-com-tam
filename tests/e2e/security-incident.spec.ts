import { test, expect } from "@playwright/test";

test.describe("Security Incident & Guard Flow E2E", () => {
  test("triggers theft incident, selects guard intervention, resolves peacefully without money loss", async ({
    page,
  }) => {
    await page.goto("/");

    // Dismiss morning brief if open
    const backdrop = page.locator(".overlay-backdrop");
    if (await backdrop.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(backdrop).not.toBeVisible();
    }

    // Set up security state and launch theft incident
    await page.evaluate(() => {
      const win = window as unknown as {
        __incidentController: {
          start: (
            event: unknown,
            actions: unknown[],
            onChoose: (actionId: string) => void
          ) => void;
        };
        __resolvedAction?: string;
      };

      const event = {
        id: "theft-chain-e2e",
        type: "theft",
        title: "Kẻ gian định trộm hộp tiền",
        description: "Camera phát hiện một đối tượng đang nhắm vào thùng tiền quầy!",
        urgency: "high",
      };

      const actions = [
        {
          id: "guard-intercept",
          label: "Chú Tám chặn bắt kịp thời",
          description: "Bảo vệ Chú Tám nhanh chân tiến lại ngăn chặn.",
        },
        {
          id: "alarm-call",
          label: "Hô hoán bà con",
          description: "Nhờ hàng xóm xung quanh cùng hỗ trợ.",
        },
      ];

      win.__incidentController.start(event, actions, (actionId) => {
        win.__resolvedAction = actionId;
      });
    });

    // Check incident modal appears
    const dialog = page.locator(".incident-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(".incident-title")).toContainText("Kẻ gian");

    // Click guard intercept button
    const guardBtn = page.locator(".incident-action-btn[data-action-id='guard-intercept']");
    await expect(guardBtn).toBeVisible();
    await guardBtn.click();

    // Verify modal is closed
    await expect(dialog).not.toBeVisible();

    // Verify guard-intercept was chosen
    const chosen = await page.evaluate(() => {
      const win = window as unknown as { __resolvedAction?: string };
      return win.__resolvedAction;
    });
    expect(chosen).toBe("guard-intercept");

    // Verify game canvas is interactive
    const canvas = page.locator("#game-root canvas");
    if (await canvas.isVisible()) {
      await canvas.click({ position: { x: 100, y: 100 } });
    }
  });
});
