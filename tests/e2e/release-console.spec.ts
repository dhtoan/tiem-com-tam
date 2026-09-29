import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const day10Fixture = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/saves/day10.json'), 'utf-8'));
const day29Fixture = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/saves/day29.json'), 'utf-8'));
const endlessFixture = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/saves/endless.json'), 'utf-8'));

test.describe('Release Console & Zero-404 Integrity Gate', () => {
  test('traverses campaign fixtures, events, and endings with zero console errors or asset 404s', async ({ page }) => {
    const pageErrors: Error[] = [];
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('requestfailed', (req) => {
      // Ignore aborts if any
      const failure = req.failure()?.errorText;
      if (failure !== 'net::ERR_ABORTED') {
        failedRequests.push(`${req.method()} ${req.url()}: ${failure}`);
      }
    });
    page.on('response', (res) => {
      if (res.status() >= 400) {
        failedRequests.push(`${res.status()} ${res.url()}`);
      }
    });

    // 1. Traverse Day 1 Fresh Boot
    await page.goto('/');
    const brief = page.locator('.brief-container');
    if (await brief.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(brief).not.toBeVisible();
    }
    const hud = page.locator('.game-hud');
    await expect(hud).toBeVisible();

    // Open/close Market and Settings on Day 1
    const marketBtn = hud.locator('.market-btn');
    await marketBtn.click();
    await expect(page.locator('.overlay-backdrop')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.overlay-backdrop')).not.toBeVisible();

    // 2. Traverse Day 10 Mid-Campaign Fixture
    await page.evaluate((saveData) => {
      localStorage.setItem('tiem_com_tam_save_v1', JSON.stringify(saveData));
    }, day10Fixture);
    await page.reload();

    const brief10 = page.locator('.overlay-backdrop');
    if (await brief10.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(brief10).not.toBeVisible();
    }

    const day10State = await page.evaluate(() => (window as any).__store?.getState());
    expect(day10State.campaign.day).toBe(10);
    expect(day10State.economy.shopCash).toBe(3500000);

    // Open JD panel
    const jdBtn = page.locator('.game-hud .jd-btn');
    await jdBtn.click();
    await expect(page.locator('.overlay-backdrop')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.overlay-backdrop')).not.toBeVisible();

    // 3. Traverse Day 29 Late-Campaign Fixture
    await page.evaluate((saveData) => {
      localStorage.setItem('tiem_com_tam_save_v1', JSON.stringify(saveData));
    }, day29Fixture);
    await page.reload();

    const brief29 = page.locator('.overlay-backdrop');
    if (await brief29.isVisible()) {
      await page.keyboard.press('Escape');
      await expect(brief29).not.toBeVisible();
    }

    const day29State = await page.evaluate(() => (window as any).__store?.getState());
    expect(day29State.campaign.day).toBe(29);
    expect(day29State.economy.shopCash).toBe(16800000);

    // Open Books Panel
    const booksBtn = page.locator('.game-hud .books-btn');
    await booksBtn.click();
    await expect(page.locator('.overlay-backdrop')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.overlay-backdrop')).not.toBeVisible();

    // 4. Traverse Endless / Ending Fixture
    await page.evaluate((saveData) => {
      localStorage.setItem('tiem_com_tam_save_v1', JSON.stringify(saveData));
    }, endlessFixture);
    await page.reload();

    const endlessState = await page.evaluate(() => (window as any).__store?.getState());
    expect(endlessState.campaign.isEndless).toBe(true);
    expect(endlessState.campaign.flags.ending_achieved).toBe('perfect');

    // 5. Strict Zero-Error Assertions
    expect(pageErrors, `Page errors encountered: ${JSON.stringify(pageErrors)}`).toHaveLength(0);
    expect(consoleErrors, `Console errors encountered: ${JSON.stringify(consoleErrors)}`).toHaveLength(0);
    expect(failedRequests, `Failed HTTP requests / 404s: ${JSON.stringify(failedRequests)}`).toHaveLength(0);
  });
});
