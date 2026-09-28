import type { D1Database } from '@cloudflare/workers-types';

export interface DailyChallengeRow {
  id: string;
  challenge_date: string;
  seed: string;
  special_rules: string | null;
  created_at: number;
}

export interface DailyRunRow {
  id: string;
  challenge_id: string;
  account_id: string | null;
  display_name: string;
  revenue: number;
  reputation: number;
  score: number;
  finished_at: number;
}

export interface EndlessRunRow {
  id: string;
  account_id: string | null;
  display_name: string;
  days_survived: number;
  total_revenue: number;
  final_reputation: number;
  score: number;
  finished_at: number;
}

export interface LeaderboardEntryRow {
  id: string;
  category: string;
  period: string;
  account_id: string | null;
  display_name: string;
  score: number;
  secondary_metric: number;
  metadata: string | null;
  created_at: number;
}

export interface RunTokenRow {
  token_nonce: string;
  category: string;
  challenge_id: string | null;
  account_id: string | null;
  seed: string;
  issued_at: number;
  expires_at: number;
  used: number;
}

export async function createDailyChallenge(
  db: D1Database,
  params: {
    id: string;
    challengeDate: string;
    seed: string;
    specialRules?: string | null;
    now: number;
  }
): Promise<DailyChallengeRow> {
  await db.prepare(`
    INSERT INTO daily_challenges (id, challenge_date, seed, special_rules, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (challenge_date) DO UPDATE SET
      seed = excluded.seed,
      special_rules = excluded.special_rules
  `).bind(
    params.id,
    params.challengeDate,
    params.seed,
    params.specialRules ?? null,
    params.now
  ).run();

  return {
    id: params.id,
    challenge_date: params.challengeDate,
    seed: params.seed,
    special_rules: params.specialRules ?? null,
    created_at: params.now
  };
}

export async function getDailyChallenge(db: D1Database, challengeDate: string): Promise<DailyChallengeRow | null> {
  const row = await db.prepare(
    'SELECT * FROM daily_challenges WHERE challenge_date = ?'
  ).bind(challengeDate).first<DailyChallengeRow>();

  return row ?? null;
}

export async function recordDailyRun(
  db: D1Database,
  params: {
    id: string;
    challengeId: string;
    accountId?: string | null;
    displayName: string;
    revenue: number;
    reputation: number;
    score: number;
    finishedAt: number;
  }
): Promise<void> {
  await db.prepare(`
    INSERT INTO daily_runs (id, challenge_id, account_id, display_name, revenue, reputation, score, finished_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    params.id,
    params.challengeId,
    params.accountId ?? null,
    params.displayName.trim(),
    params.revenue,
    params.reputation,
    params.score,
    params.finishedAt
  ).run();
}

export async function getDailyLeaderboard(
  db: D1Database,
  challengeId: string,
  limit = 50
): Promise<{ displayName: string; score: number; revenue: number; reputation: number; finishedAt: number }[]> {
  const res = await db.prepare(`
    SELECT display_name AS displayName, score, revenue, reputation, finished_at AS finishedAt
    FROM daily_runs
    WHERE challenge_id = ?
    ORDER BY score DESC, finished_at ASC
    LIMIT ?
  `).bind(challengeId, limit).all<{ displayName: string; score: number; revenue: number; reputation: number; finishedAt: number }>();

  return res.results;
}

export async function recordEndlessRun(
  db: D1Database,
  params: {
    id: string;
    accountId?: string | null;
    displayName: string;
    daysSurvived: number;
    totalRevenue: number;
    finalReputation: number;
    score: number;
    finishedAt: number;
  }
): Promise<void> {
  await db.prepare(`
    INSERT INTO endless_runs (id, account_id, display_name, days_survived, total_revenue, final_reputation, score, finished_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    params.id,
    params.accountId ?? null,
    params.displayName.trim(),
    params.daysSurvived,
    params.totalRevenue,
    params.finalReputation,
    params.score,
    params.finishedAt
  ).run();
}

export async function getEndlessLeaderboard(
  db: D1Database,
  limit = 50
): Promise<{ displayName: string; score: number; daysSurvived: number; totalRevenue: number; finishedAt: number }[]> {
  const res = await db.prepare(`
    SELECT display_name AS displayName, score, days_survived AS daysSurvived, total_revenue AS totalRevenue, finished_at AS finishedAt
    FROM endless_runs
    ORDER BY score DESC, finished_at ASC
    LIMIT ?
  `).bind(limit).all<{ displayName: string; score: number; daysSurvived: number; totalRevenue: number; finishedAt: number }>();

  return res.results;
}

export async function recordLeaderboardEntry(
  db: D1Database,
  params: {
    id: string;
    category: string;
    period: string;
    accountId?: string | null;
    displayName: string;
    score: number;
    secondaryMetric?: number;
    metadata?: string | null;
    now: number;
  }
): Promise<void> {
  await db.prepare(`
    INSERT INTO leaderboard_entries (id, category, period, account_id, display_name, score, secondary_metric, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    params.id,
    params.category,
    params.period,
    params.accountId ?? null,
    params.displayName.trim(),
    params.score,
    params.secondaryMetric ?? 0,
    params.metadata ?? null,
    params.now
  ).run();
}

export async function getLeaderboardEntries(
  db: D1Database,
  category: string,
  period: string,
  limit = 50
): Promise<LeaderboardEntryRow[]> {
  const res = await db.prepare(`
    SELECT * FROM leaderboard_entries
    WHERE category = ? AND period = ?
    ORDER BY score DESC, created_at ASC
    LIMIT ?
  `).bind(category, period, limit).all<LeaderboardEntryRow>();

  return res.results;
}

export async function createRunToken(
  db: D1Database,
  params: {
    tokenNonce: string;
    category: string;
    challengeId?: string | null;
    accountId?: string | null;
    seed: string;
    issuedAt: number;
    expiresAt: number;
  }
): Promise<void> {
  await db.prepare(`
    INSERT INTO run_tokens (token_nonce, category, challenge_id, account_id, seed, issued_at, expires_at, used)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `).bind(
    params.tokenNonce,
    params.category,
    params.challengeId ?? null,
    params.accountId ?? null,
    params.seed,
    params.issuedAt,
    params.expiresAt
  ).run();
}

export async function consumeRunToken(
  db: D1Database,
  tokenNonce: string,
  now: number
): Promise<boolean> {
  const row = await db.prepare(`
    SELECT token_nonce, expires_at, used FROM run_tokens WHERE token_nonce = ?
  `).bind(tokenNonce).first<RunTokenRow>();

  if (!row) return false;
  if (row.used === 1) return false;
  if (row.expires_at <= now) return false;

  const res = await db.prepare(`
    UPDATE run_tokens SET used = 1 WHERE token_nonce = ? AND used = 0
  `).bind(tokenNonce).run();

  return (res.meta.changes ?? 0) > 0;
}
