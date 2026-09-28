import type { D1Database } from '@cloudflare/workers-types';
import { jsonResponse } from '../types';
import {
  createAccount,
  getAccountByEmail,
  createSession,
  deleteSession
} from '../db/accounts';
import { hashPassword, verifyPassword, generateSalt } from '../auth/passwords';
import {
  generateSessionToken,
  hashToken,
  createSessionCookie,
  clearSessionCookie,
  parseSessionToken,
  authenticateRequest,
  SESSION_MAX_AGE_SECONDS
} from '../auth/sessions';

function isHttps(request: Request): boolean {
  return new URL(request.url).protocol === 'https:';
}

export async function handleAuthRoute(request: Request, db: D1Database): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');

  if (path === '/api/v1/auth/register') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
    }
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : email.split('@')[0] || 'Chủ Quán';

    if (!email || !email.includes('@') || email.length < 5 || email.length > 100) {
      return jsonResponse({ error: 'Email không hợp lệ.' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return jsonResponse({ error: 'Mật khẩu cần từ 8 đến 128 ký tự.' }, { status: 400 });
    }
    if (!displayName || displayName.length > 40) {
      return jsonResponse({ error: 'Tên hiển thị cần từ 1 đến 40 ký tự.' }, { status: 400 });
    }

    const existing = await getAccountByEmail(db, email);
    if (existing) {
      return jsonResponse({ error: 'Email này đã được sử dụng.' }, { status: 409 });
    }

    const now = Date.now();
    const accountId = 'acc_' + crypto.randomUUID().replace(/-/g, '');
    const salt = generateSalt();
    const iterations = 100000;
    const passwordHash = await hashPassword(password, salt, iterations);

    try {
      await createAccount(db, {
        id: accountId,
        email,
        displayName,
        passwordHash,
        salt,
        iterations,
        now
      });
    } catch (e: any) {
      if (String(e).toLowerCase().includes('unique')) {
        return jsonResponse({ error: 'Email này đã được sử dụng.' }, { status: 409 });
      }
      return jsonResponse({ error: 'Không thể tạo tài khoản.' }, { status: 500 });
    }

    // Issue session
    const rawToken = generateSessionToken();
    const tokenHash = await hashToken(rawToken);
    const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;
    await createSession(db, {
      tokenHash,
      accountId,
      expiresAt,
      now
    });

    const res = jsonResponse({
      ok: true,
      user: {
        id: accountId,
        email,
        displayName
      }
    }, { status: 201 });

    res.headers.set('Set-Cookie', createSessionCookie(rawToken, SESSION_MAX_AGE_SECONDS, isHttps(request)));
    return res;
  }

  if (path === '/api/v1/auth/login') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
    }
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return jsonResponse({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
    }

    const account = await getAccountByEmail(db, email);
    if (!account) {
      return jsonResponse({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
    }

    const valid = await verifyPassword(
      password,
      account.password_salt,
      account.password_hash,
      account.password_iterations
    );
    if (!valid) {
      return jsonResponse({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
    }

    const now = Date.now();
    const rawToken = generateSessionToken();
    const tokenHash = await hashToken(rawToken);
    const expiresAt = now + SESSION_MAX_AGE_SECONDS * 1000;
    await createSession(db, {
      tokenHash,
      accountId: account.id,
      expiresAt,
      now
    });

    const res = jsonResponse({
      ok: true,
      user: {
        id: account.id,
        email: account.email,
        displayName: account.display_name
      }
    }, { status: 200 });

    res.headers.set('Set-Cookie', createSessionCookie(rawToken, SESSION_MAX_AGE_SECONDS, isHttps(request)));
    return res;
  }

  if (path === '/api/v1/auth/logout') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
    }

    const rawToken = parseSessionToken(request.headers.get('Cookie'));
    if (rawToken) {
      const tokenHash = await hashToken(rawToken);
      await deleteSession(db, tokenHash);
    }

    const res = jsonResponse({ ok: true });
    res.headers.set('Set-Cookie', clearSessionCookie(isHttps(request)));
    return res;
  }

  if (path === '/api/v1/auth/me') {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
    }

    const account = await authenticateRequest(db, request);
    if (!account) {
      return jsonResponse({ ok: true, authenticated: false, user: null });
    }

    return jsonResponse({
      ok: true,
      authenticated: true,
      user: {
        id: account.id,
        email: account.email,
        displayName: account.display_name
      }
    });
  }

  return jsonResponse({ error: 'Không tìm thấy API xác thực.' }, { status: 404 });
}
