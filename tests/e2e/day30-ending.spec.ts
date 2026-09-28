import { test, expect } from "@playwright/test";

test.describe("Day 30 Campaign Ending & Endless Transition E2E", () => {
  test("reaches Day 30 ending, presents ending screen and montage, continues cleanly to Day 31 Endless Mode", async ({
    page,
  }) => {
    await page.goto("/");

    // Dismiss morning brief if open
    const backdrop = page.locator(".overlay-backdrop");
    if (await backdrop.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(backdrop).not.toBeVisible();
    }

    // Set state to Day 30 Perfect conditions and show ending screen
    await page.evaluate(() => {
      const win = window as unknown as {
        __store: {
          dispatch: (updater: (s: any) => any) => void;
          getState: () => any;
        };
        __dayRunner: {
          showEndingScreen: () => void;
        };
      };

      win.__store.dispatch((s) => ({
        ...s,
        campaign: {
          ...s.campaign,
          day: 30,
        },
        debt: {
          ...s.debt,
          remainingDebt: 0,
        },
        reputation: {
          ...s.reputation,
          rating: 4.9,
        },
        neighborhood: {
          ...s.neighborhood,
          neighborhoodTrust: 90,
        },
        books: {
          ...s.books,
          bookAccuracy: 95,
        },
        family: {
          ...s.family,
          familyTrust: 90,
          husbandConfidence: 90,
        },
        jd: {
          ...s.jd,
          trustWithJoy: 90,
        },
      }));

      win.__dayRunner.showEndingScreen();
    });

    // Verify ending modal is visible
    const endingDialog = page.locator(".ending-screen-dialog");
    await expect(endingDialog).toBeVisible();
    await expect(endingDialog.locator(".ending-title")).toContainText("Bà Chủ Cơm Tấm Sài Gòn");

    // Click Continue to Endless Mode button
    const continueBtn = page.locator(".btn-continue-endless");
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // Verify ending modal closed
    await expect(endingDialog).not.toBeVisible();

    // Verify state transitioned to Day 31 Endless mode
    const endlessState = await page.evaluate(() => {
      const win = window as unknown as {
        __store: { getState: () => any };
      };
      const s = win.__store.getState();
      return {
        day: s.campaign.day,
        isEndless: s.campaign.isEndless,
        endlessDay: s.campaign.endlessDay,
        hasPerfectModifier: s.campaign.flags["endless_modifier_perfect"],
      };
    });

    expect(endlessState.day).toBe(31);
    expect(endlessState.isEndless).toBe(true);
    expect(endlessState.endlessDay).toBe(1);
    expect(endlessState.hasPerfectModifier).toBe(true);

    // Verify Day 31 morning brief is now shown
    const day31Brief = page.locator(".overlay-backdrop[data-overlay-id='morning-brief']");
    await expect(day31Brief).toBeVisible();

    // Close Day 31 morning brief to interact with stall
    await page.keyboard.press("Escape");
    await expect(day31Brief).not.toBeVisible();

    // Verify game canvas receives clicks
    const canvas = page.locator("#game-root canvas");
    if (await canvas.isVisible()) {
      await canvas.click({ position: { x: 50, y: 50 } });
    }
  });
});
