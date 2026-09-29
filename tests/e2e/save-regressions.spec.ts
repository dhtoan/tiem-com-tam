import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const day10Fixture = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/saves/day10.json'), 'utf-8'));
const day29Fixture = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/saves/day29.json'), 'utf-8'));
const endlessFixture = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/saves/endless.json'), 'utf-8'));

test.describe('Save, Migration & Persistence Regressions E2E', () => {
  test('restores Day 10 save with cash, debt milestone, inventory, JD and Director state', async ({ page }) => {
    await page.addInitScript((saveData) => {
      localStorage.setItem('tiem_com_tam_save_v1', JSON.stringify(saveData));
    }, day10Fixture);

    await page.goto('/');

    // Verify HUD and state restoration
    const state = await page.evaluate(() => (window as any).__store?.getState());
    expect(state).not.toBeNull();
    expect(state.campaign.day).toBe(10);
    expect(state.economy.shopCash).toBe(3500000);
    expect(state.debt.remainingDebt).toBe(24000000);
    expect(state.debt.milestones[0].isPaid).toBe(true);
    expect(state.jd.level).toBe(2);
    expect(state.jd.assignedRole).toBe('service-runner');
    expect(state.inventory.items['com-tam']).toBe(45);
    expect(state.inventory.items['suon-heo']).toBe(30);
    expect(state.director.campaignEventsTriggered['story-day-10']).toBe(1);
    expect(state.campaign.flags.betAccepted).toBe(true);
    expect(state.cooking.grillItems).toHaveLength(0);
    expect(state.cooking.plate.rice).toBe(false);

    // Verify UI reflects restored cash
    const hud = page.locator('.game-hud');
    await expect(hud.locator('.cash-value')).toContainText('3.500.000');
  });

  test('restores Day 29 save before finale with upgrades, security guard and high reputation', async ({ page }) => {
    await page.addInitScript((saveData) => {
      localStorage.setItem('tiem_com_tam_save_v1', JSON.stringify(saveData));
    }, day29Fixture);

    await page.goto('/');

    const state = await page.evaluate(() => (window as any).__store?.getState());
    expect(state.campaign.day).toBe(29);
    expect(state.economy.shopCash).toBe(16800000);
    expect(state.debt.remainingDebt).toBe(15000000);
    expect(state.debt.milestones[0].isPaid).toBe(true);
    expect(state.debt.milestones[1].isPaid).toBe(true);
    expect(state.debt.milestones[2].isPaid).toBe(false);
    expect(state.security.activeGuardId).toBe('anh-tuan');
    expect(state.security.cameraLevel).toBe(2);
    expect(state.jd.assignedRole).toBe('cashier');
    expect(state.jd.level).toBe(3);
    expect(state.economy.upgrades).toContain('security-lock-1');

    const hud = page.locator('.game-hud');
    await expect(hud.locator('.cash-value')).toContainText('16.800.000');
  });

  test('restores Endless mode save with debt cleared and endless flag active', async ({ page }) => {
    await page.addInitScript((saveData) => {
      localStorage.setItem('tiem_com_tam_save_v1', JSON.stringify(saveData));
    }, endlessFixture);

    await page.goto('/');

    const state = await page.evaluate(() => (window as any).__store?.getState());
    expect(state.campaign.isEndless).toBe(true);
    expect(state.campaign.endlessDay).toBe(1);
    expect(state.debt.remainingDebt).toBe(0);
    expect(state.debt.milestones[2].isPaid).toBe(true);
    expect(state.campaign.flags.ending_achieved).toBe('perfect');
    expect(state.campaign.flags.campaign_completed).toBe(true);
  });

  test('safely rejects unsupported future schema version and initializes fresh state', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'tiem_com_tam_save_v1',
        JSON.stringify({
          schemaVersion: 999,
          revision: 1,
          updatedAt: Date.now(),
          state: { invalid: true },
        })
      );
    });

    await page.goto('/');

    const state = await page.evaluate(() => (window as any).__store?.getState());
    expect(state).not.toBeNull();
    // Default fresh day 1 state is loaded
    expect(state.campaign.day).toBe(1);
    expect(state.campaign.difficulty).toBe('normal');
  });

  test('safely recovers from corrupted localStorage data without crashing', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('tiem_com_tam_save_v1', 'NOT_VALID_JSON{foo:bar');
    });

    await page.goto('/');

    const state = await page.evaluate(() => (window as any).__store?.getState());
    expect(state).not.toBeNull();
    expect(state.campaign.day).toBe(1);
  });
});
