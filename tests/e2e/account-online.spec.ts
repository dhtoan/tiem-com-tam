import { test, expect, type Route } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createMockD1 } from '../helpers/mockD1';
import { handleApi } from '../../src/worker/router';
import type { Env } from '../../src/worker/types';

test.describe('Account Online, Cloud Save & Leaderboard E2E Gate', () => {
  let env: Env;

  test.beforeEach(async ({ page }) => {
    const db = createMockD1();
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await db.exec(sql);

    env = {
      DB: db,
      JWT_SECRET: 'e2e-secret-key-comtam-99'
    };

    // Route /api/v1/* calls to our Worker handleApi
    await page.route('**/api/v1/**', async (route: Route) => {
      const req = route.request();
      const method = req.method();
      const postData = req.postData();

      const workerReq = new Request(req.url(), {
        method,
        headers: new Headers(req.headers()),
        body: ['GET', 'HEAD'].includes(method) ? undefined : postData
      });

      const workerRes = await handleApi(workerReq, env);
      const headers: Record<string, string> = {};
      workerRes.headers.forEach((val, key) => {
        headers[key] = val;
      });

      await route.fulfill({
        status: workerRes.status,
        headers,
        body: await workerRes.text()
      });
    });
  });

  test('complete flow: register -> cloud save -> conflict dialog -> daily challenge -> leaderboard', async ({ page }) => {
    await page.goto('/');

    // Dismiss morning brief
    const backdrop = page.locator('.overlay-backdrop');
    if (await backdrop.isVisible()) {
      await page.keyboard.press('Escape');
    }

    // 1. Register new user via client API
    const regResult = await page.evaluate(async () => {
      const win = window as any;
      return await win.__api.auth.registerUser('chulam@saigon.vn', 'matkhaucomtam123', 'Chú Lâm');
    });

    expect(regResult.ok).toBe(true);
    expect(regResult.user?.displayName).toBe('Chú Lâm');

    // 2. Initial cloud save: revision 1
    const saveResult1 = await page.evaluate(async () => {
      const win = window as any;
      return await win.__api.save.syncCloudSave(JSON.stringify({ day: 2, money: 250000 }), 0);
    });

    expect(saveResult1.ok).toBe(true);
    expect(saveResult1.revision).toBe(1);

    // 3. Stale revision save triggers 409 conflict
    const conflictResult = await page.evaluate(async () => {
      const win = window as any;
      // Pass expectedRevision: 0 when cloud is already at revision 1
      return await win.__api.save.syncCloudSave(JSON.stringify({ day: 3, money: 500000 }), 0);
    });

    expect(conflictResult.ok).toBe(false);
    expect(conflictResult.conflict).toBe(true);
    expect(conflictResult.currentRevision).toBe(1);

    // 4. Start Daily Challenge via client API
    const dailyStart = await page.evaluate(async () => {
      const win = window as any;
      return await win.__api.daily.startDailyChallenge();
    });

    expect(dailyStart.ok).toBe(true);
    expect(dailyStart.token).toBeTruthy();
    expect(dailyStart.nonce).toBeTruthy();

    // 5. Finish Daily Challenge and verify rank on leaderboard
    const dailyFinish = await page.evaluate(async (startInfo) => {
      const win = window as any;
      return await win.__api.daily.finishDailyChallenge({
        token: startInfo.token!,
        nonce: startInfo.nonce!,
        challengeId: startInfo.challengeId!,
        displayName: 'Chú Lâm',
        revenue: 850000,
        reputation: 92,
        score: 1850
      });
    }, dailyStart);

    expect(dailyFinish.ok).toBe(true);
    expect(dailyFinish.rank).toBe(1);
    expect(dailyFinish.leaderboard?.[0]?.displayName).toBe('Chú Lâm');

    // 6. Start & finish Endless Run
    const endlessStart = await page.evaluate(async () => {
      const win = window as any;
      return await win.__api.leaderboards.startEndlessRun();
    });

    expect(endlessStart.ok).toBe(true);

    const endlessFinish = await page.evaluate(async (startInfo) => {
      const win = window as any;
      return await win.__api.leaderboards.finishEndlessRun({
        token: startInfo.token!,
        nonce: startInfo.nonce!,
        displayName: 'Chú Lâm',
        daysSurvived: 32,
        totalRevenue: 21000000,
        finalReputation: 88,
        score: 10500
      });
    }, endlessStart);

    expect(endlessFinish.ok).toBe(true);
    expect(endlessFinish.rank).toBe(1);

    // 7. Query Endless Leaderboard
    const lbResult = await page.evaluate(async () => {
      const win = window as any;
      return await win.__api.leaderboards.fetchLeaderboard('endless', 'all-time');
    });

    expect(lbResult.ok).toBe(true);
    expect(lbResult.total).toBe(1);
    expect(lbResult.entries?.[0]?.display_name).toBe('Chú Lâm');
    expect(lbResult.entries?.[0]?.score).toBe(10500);
  });
});
