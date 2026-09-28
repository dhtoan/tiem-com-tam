import { test, expect } from '@playwright/test';

test.describe('Cloud Save Conflict UI E2E', () => {
  test('renders conflict options, inspects diffs, and selects cloud resolution', async ({ page }) => {
    await page.goto('/');

    // Dismiss morning brief if open
    const backdrop = page.locator('.overlay-backdrop');
    if (await backdrop.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(backdrop).not.toBeVisible();
    }

    // Open SaveConflictDialog via window helper
    await page.evaluate(() => {
      const win = window as any;
      win.__conflictChoice = null;

      win.__showSaveConflictDialog({
        localMeta: { day: 3, money: 150000, reputation: 65, updatedAt: 1727500000000 },
        cloudMeta: { day: 7, money: 450000, reputation: 80, revision: 4, updatedAt: 1727510000000 },
        localSaveJson: JSON.stringify({ day: 3, money: 150000 }),
        cloudSaveJson: JSON.stringify({ day: 7, money: 450000 }),
        onChoice: (choice: string) => {
          win.__conflictChoice = choice;
          if (choice !== 'inspect') {
            win.__overlayManager.close('save-conflict');
          }
        }
      });
    });

    const dialog = page.locator('[data-testid="save-conflict-dialog"]');
    await expect(dialog).toBeVisible();

    // Verify metadata cards
    await expect(page.locator('[data-testid="local-save-card"]')).toContainText('Thiết bị này');
    await expect(page.locator('[data-testid="cloud-save-card"]')).toContainText('Máy chủ đám mây');

    // Click inspect
    const inspectBtn = page.locator('[data-action="inspect"]');
    const inspectPanel = page.locator('[data-testid="conflict-inspect-panel"]');
    await expect(inspectPanel).not.toBeVisible();
    await inspectBtn.click();
    await expect(inspectPanel).toBeVisible();

    // Click use cloud button
    const useCloudBtn = page.locator('[data-action="use-cloud"]');
    await useCloudBtn.click();

    // Verify choice recorded and dialog closed
    await expect(dialog).not.toBeVisible();
    const recordedChoice = await page.evaluate(() => (window as any).__conflictChoice);
    expect(recordedChoice).toBe('use_cloud');
  });
});
