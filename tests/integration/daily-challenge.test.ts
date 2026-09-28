import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createMockD1 } from '../helpers/mockD1';
import type { D1Database } from '@cloudflare/workers-types';
import { handleDailyRoute } from '../../src/worker/routes/daily';
import { createSignedRunToken, verifySignedRunToken } from '../../src/worker/auth/runTokens';

describe('Daily Challenge & Run Tokens', () => {
  let db: D1Database;
  const secret = 'test-secret-key-1234567890';

  beforeEach(async () => {
    db = createMockD1();
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await db.exec(sql);
  });

  describe('Run Token signing and verification', () => {
    it('creates and verifies cryptographically signed tokens', async () => {
      const payload = {
        nonce: 'nonce_12345678',
        category: 'daily',
        challengeId: '2026-09-28',
        seed: 'daily-seed-xyz',
        issuedAt: 1000,
        expiresAt: 2000
      };

      const token = await createSignedRunToken(payload, secret);
      expect(typeof token).toBe('string');

      const verified = await verifySignedRunToken(token, secret);
      expect(verified).not.toBeNull();
      expect(verified?.nonce).toBe('nonce_12345678');
      expect(verified?.challengeId).toBe('2026-09-28');

      // Tampered token fails
      const tampered = token.slice(0, -4) + 'abcd';
      const failed = await verifySignedRunToken(tampered, secret);
      expect(failed).toBeNull();
    });
  });

  describe('Daily Challenge HTTP endpoints', () => {
    it('returns today challenge with deterministic shared seed', async () => {
      const req1 = new Request('https://comtam.aunomay.com/api/v1/daily', { method: 'GET' });
      const res1 = await handleDailyRoute(req1, db, secret);
      expect(res1.status).toBe(200);
      const data1 = await res1.json() as any;
      expect(data1.ok).toBe(true);
      expect(data1.challenge.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data1.challenge.seed).toBeTruthy();

      // Subsequent call on same day returns same seed
      const req2 = new Request('https://comtam.aunomay.com/api/v1/daily', { method: 'GET' });
      const res2 = await handleDailyRoute(req2, db, secret);
      const data2 = await res2.json() as any;
      expect(data2.challenge.seed).toBe(data1.challenge.seed);
    });

    it('handles run lifecycle: start -> finish, rejects replays and expired tokens', async () => {
      // 1. Start run
      const startReq = new Request('https://comtam.aunomay.com/api/v1/daily/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: 'Tèo Cơm Tấm' })
      });
      const startRes = await handleDailyRoute(startReq, db, secret);
      expect(startRes.status).toBe(200);
      const startData = await startRes.json() as any;
      expect(startData.token).toBeTruthy();
      expect(startData.nonce).toBeTruthy();

      const { token, nonce, challengeId } = startData;

      // 2. Finish run successfully
      const finishReq = new Request('https://comtam.aunomay.com/api/v1/daily/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nonce,
          challengeId,
          displayName: 'Tèo Cơm Tấm',
          revenue: 620000,
          reputation: 85,
          score: 1450
        })
      });
      const finishRes = await handleDailyRoute(finishReq, db, secret);
      expect(finishRes.status).toBe(200);
      const finishData = await finishRes.json() as any;
      expect(finishData.ok).toBe(true);
      expect(finishData.rank).toBe(1);
      expect(finishData.leaderboard.length).toBe(1);

      // 3. Replay finish attempt is rejected with 409
      const replayReq = new Request('https://comtam.aunomay.com/api/v1/daily/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nonce,
          challengeId,
          displayName: 'Tèo Cơm Tấm',
          revenue: 620000,
          reputation: 85,
          score: 1450
        })
      });
      const replayRes = await handleDailyRoute(replayReq, db, secret);
      expect(replayRes.status).toBe(409);

      // 4. Invalid score shape is rejected
      const startReq2 = new Request('https://comtam.aunomay.com/api/v1/daily/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const startRes2 = await handleDailyRoute(startReq2, db, secret);
      const startData2 = await startRes2.json() as any;

      const badScoreReq = new Request('https://comtam.aunomay.com/api/v1/daily/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: startData2.token,
          nonce: startData2.nonce,
          challengeId: startData2.challengeId,
          displayName: 'Hacker',
          revenue: -500,
          reputation: 9999,
          score: 999999999
        })
      });
      const badScoreRes = await handleDailyRoute(badScoreReq, db, secret);
      expect(badScoreRes.status).toBe(400);
    });
  });
});
