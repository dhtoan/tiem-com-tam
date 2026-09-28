export interface LeaderboardItem {
  id: string;
  category: string;
  period: string;
  display_name: string;
  score: number;
  secondary_metric: number;
  metadata: string | null;
  created_at: number;
}

export interface LeaderboardResponse {
  ok: boolean;
  category?: string;
  period?: string;
  entries?: LeaderboardItem[];
  total?: number;
  limit?: number;
  offset?: number;
  error?: string;
}

export interface EndlessStartResponse {
  ok: boolean;
  token?: string;
  nonce?: string;
  seed?: string;
  expiresAt?: number;
  error?: string;
}

export interface EndlessFinishResponse {
  ok: boolean;
  rank?: number;
  total?: number;
  leaderboard?: any[];
  error?: string;
}

export async function fetchLeaderboard(
  category = 'endless',
  period = 'all-time',
  limit = 50,
  offset = 0
): Promise<LeaderboardResponse> {
  try {
    const params = new URLSearchParams({
      category,
      period,
      limit: String(limit),
      offset: String(offset)
    });

    const res = await fetch(`/api/v1/leaderboards?${params.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    if (!res.ok) {
      return { ok: false, error: `Lỗi tải bảng xếp hạng (${res.status})` };
    }

    const data = await res.json() as LeaderboardResponse;
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi tải bảng xếp hạng' };
  }
}

export async function startEndlessRun(): Promise<EndlessStartResponse> {
  try {
    const res = await fetch('/api/v1/endless/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include'
    });
    const data = await res.json() as EndlessStartResponse;
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Lỗi bắt đầu chế độ Endless (${res.status})` };
    }
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi bắt đầu Endless' };
  }
}

export async function finishEndlessRun(params: {
  token: string;
  nonce: string;
  displayName: string;
  daysSurvived: number;
  totalRevenue: number;
  finalReputation: number;
  score: number;
}): Promise<EndlessFinishResponse> {
  try {
    const res = await fetch('/api/v1/endless/finish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params)
    });
    const data = await res.json() as EndlessFinishResponse;
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Lỗi lưu kết quả Endless (${res.status})` };
    }
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi gửi kết quả Endless' };
  }
}

export async function submitCampaignScore(params: {
  category: 'campaign' | 'reputation';
  displayName: string;
  score: number;
  secondaryMetric?: number;
  metadata?: string;
}): Promise<{ ok: boolean; rank?: number; total?: number; error?: string }> {
  try {
    const res = await fetch('/api/v1/leaderboards/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params)
    });
    const data = await res.json() as { ok: boolean; rank?: number; total?: number; error?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Lỗi nộp điểm chiến dịch (${res.status})` };
    }
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi nộp điểm chiến dịch' };
  }
}
