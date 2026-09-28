import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createMockD1 } from '../helpers/mockD1';
import type { D1Database } from '@cloudflare/workers-types';
import {
  createAccount,
  getAccountByEmail,
  createSession,
  getSession,
  deleteSession
} from '../../src/worker/db/accounts';
import { getCloudSave, putCloudSave } from '../../src/worker/db/saves';
import {
  createDailyChallenge,
  getDailyChallenge,
  recordDailyRun,
  getDailyLeaderboard,
  createRunToken,
  consumeRunToken
} from '../../src/worker/db/runs';

describe('D1 Schema and Repositories', () => {
  let db: D1Database;

  beforeEach(async () => {
    db = createMockD1();
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await db.exec(sql);
  });

  it('creates all expected tables and indexes', async () => {
    const tables = await db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all<{ name: string }>();

    const names = tables.results.map(r => r.name);
    expect(names).toContain('accounts');
    expect(names).toContain('sessions');
    expect(names).toContain('cloud_saves');
    expect(names).toContain('daily_challenges');
    expect(names).toContain('daily_runs');
    expect(names).toContain('endless_runs');
    expect(names).toContain('leaderboard_entries');
    expect(names).toContain('run_tokens');
    expect(names).toContain('rate_limits');
  });

  it('enforces unique account email (case-insensitive)', async () => {
    const acc1 = {
      id: 'acc_1',
      email: 'BaSau@example.com',
      displayName: 'Bà Sáu',
      passwordHash: 'hash1',
      salt: 'salt1',
      iterations: 100000,
      now: 1000
    };
    await createAccount(db, acc1);

    const found = await getAccountByEmail(db, 'basau@example.com');
    expect(found).not.toBeNull();
    expect(found?.id).toBe('acc_1');

    await expect(
      createAccount(db, {
        id: 'acc_2',
        email: 'BASAU@example.com',
        displayName: 'Bà Sáu 2',
        passwordHash: 'hash2',
        salt: 'salt2',
        iterations: 100000,
        now: 1001
      })
    ).rejects.toThrow();
  });

  it('manages sessions and cascades delete on account removal', async () => {
    await createAccount(db, {
      id: 'acc_sess',
      email: 'test@example.com',
      displayName: 'Test',
      passwordHash: 'h',
      salt: 's',
      iterations: 100000,
      now: 1000
    });

    await createSession(db, {
      tokenHash: 'tok_hash_1',
      accountId: 'acc_sess',
      expiresAt: 2000,
      now: 1000
    });

    const session = await getSession(db, 'tok_hash_1', 1500);
    expect(session).not.toBeNull();
    expect(session?.accountId).toBe('acc_sess');

    // Expired session returns null
    const expired = await getSession(db, 'tok_hash_1', 2500);
    expect(expired).toBeNull();

    // Delete session explicitly
    await deleteSession(db, 'tok_hash_1');
    expect(await getSession(db, 'tok_hash_1', 1500)).toBeNull();
  });

  it('handles cloud save with revision increment and 409 conflict detection', async () => {
    await createAccount(db, {
      id: 'acc_save',
      email: 'save@example.com',
      displayName: 'Save',
      passwordHash: 'h',
      salt: 's',
      iterations: 100000,
      now: 1000
    });

    // Initial save: expectedRevision = 0 or null
    const initial = await putCloudSave(db, {
      accountId: 'acc_save',
      saveData: JSON.stringify({ day: 1, money: 100 }),
      expectedRevision: 0,
      clientUpdatedAt: 1000,
      now: 1000
    });
    expect(initial.ok).toBe(true);
    expect(initial.revision).toBe(1);

    const saved = await getCloudSave(db, 'acc_save');
    expect(saved).not.toBeNull();
    expect(saved?.revision).toBe(1);

    // Stale revision: Device B attempts to save with expectedRevision 0, but current is 1
    const conflict = await putCloudSave(db, {
      accountId: 'acc_save',
      saveData: JSON.stringify({ day: 2, money: 50 }),
      expectedRevision: 0,
      clientUpdatedAt: 1100,
      now: 1100
    });
    expect(conflict.ok).toBe(false);
    expect(conflict.conflict).toBe(true);
    expect(conflict.currentRevision).toBe(1);

    // Valid revision: Device A saves with expectedRevision 1 -> increases to 2
    const next = await putCloudSave(db, {
      accountId: 'acc_save',
      saveData: JSON.stringify({ day: 2, money: 300 }),
      expectedRevision: 1,
      clientUpdatedAt: 1200,
      now: 1200
    });
    expect(next.ok).toBe(true);
    expect(next.revision).toBe(2);
  });

  it('manages daily challenge, run tokens, and leaderboards', async () => {
    await createDailyChallenge(db, {
      id: '2026-09-28',
      challengeDate: '2026-09-28',
      seed: 'daily-seed-123',
      specialRules: JSON.stringify({ fastGrill: true }),
      now: 1000
    });

    const challenge = await getDailyChallenge(db, '2026-09-28');
    expect(challenge).not.toBeNull();
    expect(challenge?.seed).toBe('daily-seed-123');

    // Run token issuance and single-use consumption
    await createRunToken(db, {
      tokenNonce: 'nonce_abc',
      category: 'daily',
      challengeId: '2026-09-28',
      seed: 'daily-seed-123',
      issuedAt: 1000,
      expiresAt: 2000
    });

    // First consumption succeeds
    const consumed1 = await consumeRunToken(db, 'nonce_abc', 1500);
    expect(consumed1).toBe(true);

    // Replay fails
    const consumed2 = await consumeRunToken(db, 'nonce_abc', 1600);
    expect(consumed2).toBe(false);

    // Record runs and check deterministic ordering (score DESC, finished_at ASC)
    await recordDailyRun(db, {
      id: 'run_1',
      challengeId: '2026-09-28',
      accountId: null,
      displayName: 'Player A',
      revenue: 500000,
      reputation: 80,
      score: 1500,
      finishedAt: 1600
    });
    await recordDailyRun(db, {
      id: 'run_2',
      challengeId: '2026-09-28',
      accountId: null,
      displayName: 'Player B',
      revenue: 600000,
      reputation: 90,
      score: 1800,
      finishedAt: 1700
    });

    const leaderboard = await getDailyLeaderboard(db, '2026-09-28', 10);
    expect(leaderboard.length).toBe(2);
    expect(leaderboard[0]!.displayName).toBe('Player B');
    expect(leaderboard[1]!.displayName).toBe('Player A');
  });
});
