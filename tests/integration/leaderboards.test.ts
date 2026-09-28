import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createMockD1 } from '../helpers/mockD1';
import type { D1Database } from '@cloudflare/workers-types';
import { handleEndlessRoute } from '../../src/worker/routes/endless';
import { handleLeaderboardsRoute } from '../../src/worker/routes/leaderboards';

describe('Endless Run & Online Leaderboards', () => {
  let db: D1Database;
  const secret = 'test-secret-leaderboard-987';

  beforeEach(async () => {
    db = createMockD1();
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await db.exec(sql);
  });

  describe('Endless Run Lifecycle', () => {
    it('starts an endless run, finishes, and registers on the leaderboard', async () => {
      // 1. Start endless run
      const startReq = new Request('https://comtam.aunomay.com/api/v1/endless/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: 'Cao Thủ Cơm Tấm' })
      });
      const startRes = await handleEndlessRoute(startReq, db, secret);
      expect(startRes.status).toBe(200);
      const startData = await startRes.json() as any;
      expect(startData.token).toBeTruthy();
      expect(startData.nonce).toBeTruthy();

      // 2. Finish endless run
      const finishReq = new Request('https://comtam.aunomay.com/api/v1/endless/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: startData.token,
          nonce: startData.nonce,
          displayName: 'Cao Thủ Cơm Tấm',
          daysSurvived: 45,
          totalRevenue: 28500000,
          finalReputation: 95,
          score: 14250
        })
      });
      const finishRes = await handleEndlessRoute(finishReq, db, secret);
      expect(finishRes.status).toBe(200);
      const finishData = await finishRes.json() as any;
      expect(finishData.ok).toBe(true);
      expect(finishData.rank).toBe(1);

      // 3. Duplicate finish attempt rejected with 409
      const dupReq = new Request('https://comtam.aunomay.com/api/v1/endless/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: startData.token,
          nonce: startData.nonce,
          displayName: 'Cao Thủ Cơm Tấm',
          daysSurvived: 45,
          totalRevenue: 28500000,
          finalReputation: 95,
          score: 14250
        })
      });
      const dupRes = await handleEndlessRoute(dupReq, db, secret);
      expect(dupRes.status).toBe(409);

      // 4. Invalid/NaN payload rejected with 400
      const startReq2 = new Request('https://comtam.aunomay.com/api/v1/endless/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const startRes2 = await handleEndlessRoute(startReq2, db, secret);
      const startData2 = await startRes2.json() as any;

      const badReq = new Request('https://comtam.aunomay.com/api/v1/endless/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: startData2.token,
          nonce: startData2.nonce,
          displayName: 'Cheater',
          daysSurvived: -5,
          totalRevenue: 'NaN',
          finalReputation: 150,
          score: -100
        })
      });
      const badRes = await handleEndlessRoute(badReq, db, secret);
      expect(badRes.status).toBe(400);
    });
  });

  describe('Leaderboard Sorting & Pagination', () => {
    it('returns deterministically sorted entries and supports limit & offset', async () => {
      // Seed leaderboard entries
      const entries = [
        { id: 'e1', displayName: 'Quán A', score: 1000, secondary: 500, time: 100 },
        { id: 'e2', displayName: 'Quán B', score: 2500, secondary: 800, time: 200 },
        { id: 'e3', displayName: 'Quán C', score: 1800, secondary: 600, time: 300 },
        { id: 'e4', displayName: 'Quán D', score: 2500, secondary: 900, time: 150 }, // Tie with B, but earlier time
      ];

      for (const e of entries) {
        await db.prepare(`
          INSERT INTO leaderboard_entries (id, category, period, display_name, score, secondary_metric, created_at)
          VALUES (?, 'endless', 'all-time', ?, ?, ?, ?)
        `).bind(e.id, e.displayName, e.score, e.secondary, e.time).run();
      }

      // Fetch top 2
      const reqPage1 = new Request('https://comtam.aunomay.com/api/v1/leaderboards?category=endless&limit=2&offset=0');
      const resPage1 = await handleLeaderboardsRoute(reqPage1, db);
      expect(resPage1.status).toBe(200);
      const dataPage1 = await resPage1.json() as any;
      expect(dataPage1.entries.length).toBe(2);
      expect(dataPage1.total).toBe(4);
      // Quán D has score 2500 and created_at 150 (earlier than B's 200) -> ranks first
      expect(dataPage1.entries[0].display_name).toBe('Quán D');
      expect(dataPage1.entries[1].display_name).toBe('Quán B');

      // Fetch next 2
      const reqPage2 = new Request('https://comtam.aunomay.com/api/v1/leaderboards?category=endless&limit=2&offset=2');
      const resPage2 = await handleLeaderboardsRoute(reqPage2, db);
      const dataPage2 = await resPage2.json() as any;
      expect(dataPage2.entries.length).toBe(2);
      expect(dataPage2.entries[0].display_name).toBe('Quán C'); // score 1800
      expect(dataPage2.entries[1].display_name).toBe('Quán A'); // score 1000
    });
  });
});
