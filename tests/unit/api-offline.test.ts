import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest } from '../../src/client/api/http';
import { isOnline, onNetworkStatusChange } from '../../src/client/api/networkStatus';

describe('Non-blocking API HTTP Wrapper & Offline Resilience', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('safely catches network rejections without throwing', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    const result = await apiRequest<{ data: string }>('/api/v1/health');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.networkError).toBe(true);
      expect(result.error).toContain('Failed to fetch');
    }
  });

  it('safely catches abort timeouts', async () => {
    globalThis.fetch = vi.fn().mockImplementation((_url, init) => {
      return new Promise((_, reject) => {
        if (init?.signal) {
          init.signal.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    });

    const result = await apiRequest<{ data: string }>('/api/v1/health', undefined, 50);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.networkError).toBe(true);
      expect(result.error).toContain('quá thời gian');
    }
  });

  it('safely handles non-JSON HTTP errors without throwing', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('<html>502 Bad Gateway</html>', {
        status: 502,
        headers: { 'Content-Type': 'text/html' }
      })
    );

    const result = await apiRequest<{ data: string }>('/api/v1/health');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(502);
  });

  it('tracks online/offline status listeners', () => {
    const listener = vi.fn();
    const unsubscribe = onNetworkStatusChange(listener);

    expect(typeof isOnline()).toBe('boolean');

    window.dispatchEvent(new Event('offline'));
    expect(listener).toHaveBeenCalledWith(false);

    window.dispatchEvent(new Event('online'));
    expect(listener).toHaveBeenCalledWith(true);

    unsubscribe();
    window.dispatchEvent(new Event('offline'));
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
