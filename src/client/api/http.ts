export type ApiResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status?: number; networkError?: boolean };

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 6000
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      ...init,
      signal: init?.signal ? init.signal : controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    let parsed: any = null;
    if (contentType.includes('application/json')) {
      try {
        parsed = await res.json();
      } catch {
        parsed = null;
      }
    } else {
      parsed = await res.text().catch(() => null);
    }

    if (!res.ok) {
      const errMsg =
        parsed && typeof parsed === 'object' && parsed.error
          ? parsed.error
          : `Lỗi kết nối máy chủ (${res.status})`;
      return {
        ok: false,
        error: errMsg,
        status: res.status,
        networkError: false
      };
    }

    return {
      ok: true,
      data: parsed as T,
      status: res.status
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === 'AbortError') {
      return {
        ok: false,
        error: 'Kết nối mạng quá thời gian (timeout)',
        networkError: true
      };
    }
    return {
      ok: false,
      error: err?.message || 'Lỗi kết nối mạng',
      networkError: true
    };
  }
}
