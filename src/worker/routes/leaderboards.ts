import type { D1Database } from '@cloudflare/workers-types';
import { jsonResponse } from '../types';
import { recordLeaderboardEntry, type LeaderboardEntryRow } from '../db/runs';
import { authenticateRequest } from '../auth/sessions';

const VALID_CATEGORIES = new Set(['campaign', 'endless', 'daily', 'reputation']);

export async function handleLeaderboardsRoute(
  request: Request,
  db: D1Database
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  const method = request.method.toUpperCase();

  if (path === '/api/v1/leaderboards' && method === 'GET') {
    const category = url.searchParams.get('category') || 'endless';
    const period = url.searchParams.get('period') || 'all-time';

    if (!VALID_CATEGORIES.has(category)) {
      return jsonResponse({ error: 'Danh mục bảng xếp hạng không hợp lệ.' }, { status: 400 });
    }

    const rawLimit = parseInt(url.searchParams.get('limit') || '50', 10);
    const rawOffset = parseInt(url.searchParams.get('offset') || '0', 10);
    const limit = Math.max(1, Math.min(100, isNaN(rawLimit) ? 50 : rawLimit));
    const offset = Math.max(0, isNaN(rawOffset) ? 0 : rawOffset);

    const totalRow = await db.prepare(
      'SELECT COUNT(*) AS total FROM leaderboard_entries WHERE category = ? AND period = ?'
    ).bind(category, period).first<{ total: number }>();

    const total = Number(totalRow?.total || 0);

    const query = `
      SELECT id, category, period, account_id, display_name, score, secondary_metric, metadata, created_at
      FROM leaderboard_entries
      WHERE category = ? AND period = ?
      ORDER BY score DESC, created_at ASC
      LIMIT ? OFFSET ?
    `;

    const res = await db.prepare(query)
      .bind(category, period, limit, offset)
      .all<LeaderboardEntryRow>();

    return jsonResponse({
      ok: true,
      category,
      period,
      entries: res.results,
      total,
      limit,
      offset
    });
  }

  if (path === '/api/v1/leaderboards/submit' && method === 'POST') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const { category, displayName, score, secondaryMetric, metadata } = body || {};

    if (!VALID_CATEGORIES.has(category)) {
      return jsonResponse({ error: 'Danh mục bảng xếp hạng không hợp lệ.' }, { status: 400 });
    }

    const numScore = Number(score);
    const numSecondary = Number(secondaryMetric ?? 0);

    if (!Number.isFinite(numScore) || numScore < 0 || numScore > 100_000_000) {
      return jsonResponse({ error: 'Điểm số không hợp lệ.' }, { status: 400 });
    }

    const name = typeof displayName === 'string' && displayName.trim() ? displayName.trim().slice(0, 30) : 'Chủ Quán';
    const account = await authenticateRequest(db, request);
    const now = Date.now();
    const period = typeof body.period === 'string' && body.period.trim() ? body.period.trim() : 'all-time';

    const id = 'lbe_' + crypto.randomUUID().replace(/-/g, '');
    await recordLeaderboardEntry(db, {
      id,
      category,
      period,
      accountId: account?.id ?? null,
      displayName: name,
      score: Math.round(numScore),
      secondaryMetric: Math.round(numSecondary),
      metadata: typeof metadata === 'string' ? metadata.slice(0, 500) : null,
      now
    });

    const rankRow = await db.prepare(`
      SELECT COUNT(*) + 1 AS rank
      FROM leaderboard_entries
      WHERE category = ? AND period = ? AND score > ?
    `).bind(category, period, Math.round(numScore)).first<{ rank: number }>();

    const totalRow = await db.prepare(
      'SELECT COUNT(*) AS total FROM leaderboard_entries WHERE category = ? AND period = ?'
    ).bind(category, period).first<{ total: number }>();

    return jsonResponse({
      ok: true,
      rank: Number(rankRow?.rank || 1),
      total: Number(totalRow?.total || 1)
    });
  }

  return jsonResponse({ error: 'Không tìm thấy API bảng xếp hạng.' }, { status: 404 });
}
