import type { D1Database } from '@cloudflare/workers-types';
import { jsonResponse } from '../types';
import {
  getDailyChallenge,
  createDailyChallenge,
  createRunToken,
  consumeRunToken,
  recordDailyRun,
  getDailyLeaderboard,
  recordLeaderboardEntry
} from '../db/runs';
import { createSignedRunToken, verifySignedRunToken } from '../auth/runTokens';
import { authenticateRequest } from '../auth/sessions';

const RUN_EXPIRY_MS = 45 * 60 * 1000; // 45 minutes

export function getVietnamDate(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(date);
}

export function generateDailySeed(dateStr: string): string {
  // Deterministic 32-bit hash representation
  let hash = 2166136261;
  const input = `comtam-daily-${dateStr}`;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `seed_${dateStr.replace(/-/g, '')}_${(hash >>> 0).toString(16)}`;
}

export async function handleDailyRoute(
  request: Request,
  db: D1Database,
  secret = 'comtam-secret-run-token'
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method.toUpperCase();

  const todayStr = getVietnamDate();
  const challengeId = todayStr;

  // Ensure daily challenge exists
  let challenge = await getDailyChallenge(db, todayStr);
  if (!challenge) {
    const seed = generateDailySeed(todayStr);
    challenge = await createDailyChallenge(db, {
      id: challengeId,
      challengeDate: todayStr,
      seed,
      specialRules: JSON.stringify({ rushHourExtra: true }),
      now: Date.now()
    });
  }

  if (path === '/api/v1/daily' && method === 'GET') {
    const leaderboard = await getDailyLeaderboard(db, challengeId, 50);
    return jsonResponse({
      ok: true,
      challenge: {
        id: challenge.id,
        date: challenge.challenge_date,
        seed: challenge.seed,
        specialRules: challenge.special_rules
      },
      leaderboard
    });
  }

  if (path === '/api/v1/daily/start' && method === 'POST') {
    const account = await authenticateRequest(db, request);
    const now = Date.now();
    const expiresAt = now + RUN_EXPIRY_MS;
    const nonce = 'dn_' + crypto.randomUUID().replace(/-/g, '');

    await createRunToken(db, {
      tokenNonce: nonce,
      category: 'daily',
      challengeId: challenge.id,
      accountId: account?.id ?? null,
      seed: challenge.seed,
      issuedAt: now,
      expiresAt
    });

    const token = await createSignedRunToken(
      {
        nonce,
        category: 'daily',
        challengeId: challenge.id,
        seed: challenge.seed,
        issuedAt: now,
        expiresAt,
        accountId: account?.id ?? null
      },
      secret
    );

    return jsonResponse({
      ok: true,
      token,
      nonce,
      challengeId: challenge.id,
      seed: challenge.seed,
      expiresAt
    });
  }

  if (path === '/api/v1/daily/finish' && method === 'POST') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const { token, nonce, challengeId: reqChallengeId, displayName, revenue, reputation, score } = body || {};

    if (!token || !nonce || !reqChallengeId) {
      return jsonResponse({ error: 'Thông tin lượt chơi không đầy đủ.' }, { status: 400 });
    }

    const verified = await verifySignedRunToken(token, secret);
    if (!verified || verified.nonce !== nonce || verified.challengeId !== reqChallengeId) {
      return jsonResponse({ error: 'Token lượt chơi không hợp lệ.' }, { status: 400 });
    }

    const now = Date.now();
    if (verified.expiresAt <= now) {
      return jsonResponse({ error: 'Lượt chơi đã hết hạn.' }, { status: 410 });
    }

    // Single-use check and atomic consumption
    const consumed = await consumeRunToken(db, nonce, now);
    if (!consumed) {
      return jsonResponse({ error: 'Lượt thi này đã gửi điểm rồi hoặc không tồn tại.' }, { status: 409 });
    }

    // Score validation
    const numRevenue = Number(revenue);
    const numReputation = Number(reputation);
    const numScore = Number(score);

    if (
      !Number.isFinite(numRevenue) ||
      numRevenue < 0 ||
      numRevenue > 50_000_000 ||
      !Number.isFinite(numReputation) ||
      numReputation < 0 ||
      numReputation > 100 ||
      !Number.isFinite(numScore) ||
      numScore < 0 ||
      numScore > 100_000
    ) {
      return jsonResponse({ error: 'Điểm số vượt giới hạn hợp lệ.' }, { status: 400 });
    }

    const name = typeof displayName === 'string' && displayName.trim() ? displayName.trim().slice(0, 30) : 'Chủ Quán';
    const account = await authenticateRequest(db, request);

    const runId = 'drun_' + crypto.randomUUID().replace(/-/g, '');
    await recordDailyRun(db, {
      id: runId,
      challengeId: reqChallengeId,
      accountId: account?.id ?? null,
      displayName: name,
      revenue: Math.round(numRevenue),
      reputation: Math.round(numReputation),
      score: Math.round(numScore),
      finishedAt: now
    });

    // Record into unified leaderboard_entries
    await recordLeaderboardEntry(db, {
      id: 'lb_' + runId,
      category: 'daily',
      period: reqChallengeId,
      accountId: account?.id ?? null,
      displayName: name,
      score: Math.round(numScore),
      secondaryMetric: Math.round(numRevenue),
      now
    });

    const leaderboard = await getDailyLeaderboard(db, reqChallengeId, 50);
    const rank = leaderboard.findIndex(item => item.displayName === name && item.score === Math.round(numScore)) + 1;

    return jsonResponse({
      ok: true,
      rank: rank > 0 ? rank : 1,
      total: leaderboard.length,
      leaderboard
    });
  }

  return jsonResponse({ error: 'Không tìm thấy API thử thách ngày.' }, { status: 404 });
}
