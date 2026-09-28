import type { D1Database } from '@cloudflare/workers-types';
import { jsonResponse } from '../types';
import {
  createRunToken,
  consumeRunToken,
  recordEndlessRun,
  getEndlessLeaderboard,
  recordLeaderboardEntry
} from '../db/runs';
import { createSignedRunToken, verifySignedRunToken } from '../auth/runTokens';
import { authenticateRequest } from '../auth/sessions';

const ENDLESS_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function handleEndlessRoute(
  request: Request,
  db: D1Database,
  secret = 'comtam-secret-run-token'
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method.toUpperCase();

  if (path === '/api/v1/endless/start' && method === 'POST') {
    const account = await authenticateRequest(db, request);
    const now = Date.now();
    const expiresAt = now + ENDLESS_EXPIRY_MS;
    const nonce = 'en_' + crypto.randomUUID().replace(/-/g, '');
    const seed = 'endless_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);

    await createRunToken(db, {
      tokenNonce: nonce,
      category: 'endless',
      challengeId: 'all-time',
      accountId: account?.id ?? null,
      seed,
      issuedAt: now,
      expiresAt
    });

    const token = await createSignedRunToken(
      {
        nonce,
        category: 'endless',
        challengeId: 'all-time',
        seed,
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
      seed,
      expiresAt
    });
  }

  if (path === '/api/v1/endless/finish' && method === 'POST') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const { token, nonce, displayName, daysSurvived, totalRevenue, finalReputation, score } = body || {};

    if (!token || !nonce) {
      return jsonResponse({ error: 'Thiếu thông tin chứng thực lượt chơi.' }, { status: 400 });
    }

    const verified = await verifySignedRunToken(token, secret);
    if (!verified || verified.nonce !== nonce || verified.category !== 'endless') {
      return jsonResponse({ error: 'Token lượt chơi không hợp lệ.' }, { status: 400 });
    }

    const now = Date.now();
    if (verified.expiresAt <= now) {
      return jsonResponse({ error: 'Lượt chơi đã hết hạn.' }, { status: 410 });
    }

    // Single-use atomic consumption
    const consumed = await consumeRunToken(db, nonce, now);
    if (!consumed) {
      return jsonResponse({ error: 'Lượt chơi này đã gửi thành tích rồi hoặc không tồn tại.' }, { status: 409 });
    }

    const numDays = Number(daysSurvived);
    const numRevenue = Number(totalRevenue);
    const numRep = Number(finalReputation);
    const numScore = Number(score);

    if (
      !Number.isFinite(numDays) ||
      numDays < 1 ||
      numDays > 10_000 ||
      !Number.isFinite(numRevenue) ||
      numRevenue < 0 ||
      numRevenue > 1_000_000_000 ||
      !Number.isFinite(numRep) ||
      numRep < 0 ||
      numRep > 100 ||
      !Number.isFinite(numScore) ||
      numScore < 0 ||
      numScore > 50_000_000
    ) {
      return jsonResponse({ error: 'Dữ liệu thành tích không hợp lệ.' }, { status: 400 });
    }

    const name = typeof displayName === 'string' && displayName.trim() ? displayName.trim().slice(0, 30) : 'Chủ Quán';
    const account = await authenticateRequest(db, request);

    const runId = 'erun_' + crypto.randomUUID().replace(/-/g, '');
    await recordEndlessRun(db, {
      id: runId,
      accountId: account?.id ?? null,
      displayName: name,
      daysSurvived: Math.round(numDays),
      totalRevenue: Math.round(numRevenue),
      finalReputation: Math.round(numRep),
      score: Math.round(numScore),
      finishedAt: now
    });

    await recordLeaderboardEntry(db, {
      id: 'lb_' + runId,
      category: 'endless',
      period: 'all-time',
      accountId: account?.id ?? null,
      displayName: name,
      score: Math.round(numScore),
      secondaryMetric: Math.round(numDays),
      now
    });

    const leaderboard = await getEndlessLeaderboard(db, 50);
    const rank = leaderboard.findIndex(item => item.displayName === name && item.score === Math.round(numScore)) + 1;

    return jsonResponse({
      ok: true,
      rank: rank > 0 ? rank : 1,
      total: leaderboard.length,
      leaderboard
    });
  }

  return jsonResponse({ error: 'Không tìm thấy API Endless.' }, { status: 404 });
}
