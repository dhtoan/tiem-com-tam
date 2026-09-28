export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthResponse {
  ok: boolean;
  authenticated?: boolean;
  user?: AuthUser | null;
  error?: string;
}

export async function fetchCurrentUser(): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/v1/auth/me', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });
    if (!res.ok) {
      return { ok: false, authenticated: false, user: null, error: `HTTP ${res.status}` };
    }
    const data = await res.json() as { ok: boolean; authenticated: boolean; user: AuthUser | null; error?: string };
    return {
      ok: true,
      authenticated: data.authenticated,
      user: data.user
    };
  } catch (err: any) {
    return { ok: false, authenticated: false, user: null, error: err?.message || 'Lỗi mạng khi kiểm tra phiên đăng nhập' };
  }
}

export async function registerUser(email: string, password: string, displayName: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, displayName })
    });
    const data = await res.json() as { ok?: boolean; user?: AuthUser; error?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Đăng ký thất bại (${res.status})` };
    }
    return { ok: true, authenticated: true, user: data.user };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi đăng ký' };
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json() as { ok?: boolean; user?: AuthUser; error?: string };
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `Đăng nhập thất bại (${res.status})` };
    }
    return { ok: true, authenticated: true, user: data.user };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi đăng nhập' };
  }
}

export async function logoutUser(): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await res.json().catch(() => ({ ok: res.ok })) as { ok?: boolean; error?: string };
    return { ok: Boolean(data.ok) };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi kết nối khi đăng xuất' };
  }
}
