export interface DailyChallengeInfo {
  id: string;
  date: string;
  seed: string;
  specialRules: string | null;
}

export interface DailyLeaderboardItem {
  displayName: string;
  score: number;
  revenue: number;
  reputation: number;
  finishedAt: number;
}

export interface DailyInfoResponse {
  ok: boolean;
  challenge?: DailyChallengeInfo;
  leaderboard?: DailyLeaderboardItem[];
  error?: string;
}

export interface DailyStartResponse {
  ok: boolean;
  token?: string;
  nonce?: string;
  challengeId?: string;
  seed?: string;
  expiresAt?: number;
  error?: string;
}

export interface DailyFinishResponse {
  ok: boolean;
  rank?: number;
  total?: number;
  leaderboard?: DailyLeaderboardItem[];
  error?: string;
}

export async function fetchDailyChallenge(): Promise<DailyInfoResponse> {
  try {
    const res = await fetch('/api/v1/daily', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });
    if (!res.ok) {
      return { ok: false, error: `Lỗi tải thử thách ngày (${res.status})` };
    }
    const data = await res.json() as DailyInfoResponse;
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi tải thử thách' };
  }
}

export async function startDailyChallenge(): Promise<DailyStartResponse> {
  try {
    const res = await fetch('/api/v1/daily/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    const data = await res.json() as DailyStartResponse;
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Lỗi bắt đầu thử thách (${res.status})` };
    }
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi bắt đầu thử thách' };
  }
}

export async function finishDailyChallenge(params: {
  token: string;
  nonce: string;
  challengeId: string;
  displayName: string;
  revenue: number;
  reputation: number;
  score: number;
}): Promise<DailyFinishResponse> {
  try {
    const res = await fetch('/api/v1/daily/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(params)
    });
    const data = await res.json() as DailyFinishResponse;
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Lỗi gửi kết quả (${res.status})` };
    }
    return data;
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi gửi kết quả' };
  }
}
