import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createMockD1 } from '../helpers/mockD1';
import type { D1Database } from '@cloudflare/workers-types';
import { hashPassword, verifyPassword, generateSalt } from '../../src/worker/auth/passwords';
import {
  generateSessionToken,
  hashToken,
  createSessionCookie,
  clearSessionCookie,
  parseSessionToken,
  authenticateRequest
} from '../../src/worker/auth/sessions';
import { handleAuthRoute } from '../../src/worker/routes/auth';

describe('Auth & Session Security', () => {
  let db: D1Database;

  beforeEach(async () => {
    db = createMockD1();
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await db.exec(sql);
  });

  describe('Password hashing with WebCrypto PBKDF2', () => {
    it('generates distinct hashes with distinct salts', async () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      expect(salt1).not.toBe(salt2);

      const hash1 = await hashPassword('matkhau123', salt1, 1000);
      const hash2 = await hashPassword('matkhau123', salt2, 1000);
      expect(hash1).not.toBe(hash2);

      expect(await verifyPassword('matkhau123', salt1, hash1, 1000)).toBe(true);
      expect(await verifyPassword('sai_mat_khau', salt1, hash1, 1000)).toBe(false);
    });
  });

  describe('Session token hashing and cookies', () => {
    it('never stores raw tokens in the database', async () => {
      const rawToken = generateSessionToken();
      const tokenHash = await hashToken(rawToken);
      expect(tokenHash).not.toBe(rawToken);

      const cookie = createSessionCookie(rawToken, 3600, true);
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Lax');
      expect(cookie).toContain('Secure');
      expect(cookie).toContain(rawToken);

      const parsed = parseSessionToken(`other=123; comtam_session=${rawToken}; test=abc`);
      expect(parsed).toBe(rawToken);

      const cleared = clearSessionCookie(false);
      expect(cleared).toContain('Max-Age=0');
    });
  });

  describe('Auth HTTP Routes', () => {
    it('registers a new account, logs in, checks /me, and logs out', async () => {
      // 1. Register
      const regReq = new Request('https://comtam.aunomay.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'ma@saigon.vn',
          password: 'saigoncomtam2026',
          displayName: 'Má Năm'
        })
      });

      const regRes = await handleAuthRoute(regReq, db);
      expect(regRes.status).toBe(201);
      const regBody = await regRes.json() as any;
      expect(regBody.ok).toBe(true);
      expect(regBody.user.email).toBe('ma@saigon.vn');
      expect(regBody.user.displayName).toBe('Má Năm');

      const setCookie = regRes.headers.get('Set-Cookie');
      expect(setCookie).toBeTruthy();
      expect(setCookie).toContain('comtam_session=');

      // Verify that the database stores the hashed token, NOT the raw cookie value
      const rawToken = parseSessionToken(setCookie);
      expect(rawToken).toBeTruthy();

      const sessionInDb = await db.prepare('SELECT token_hash FROM sessions').first<{ token_hash: string }>();
      expect(sessionInDb?.token_hash).not.toBe(rawToken);
      expect(sessionInDb?.token_hash).toBe(await hashToken(rawToken!));

      // 2. GET /me with valid cookie
      const meReq = new Request('https://comtam.aunomay.com/api/v1/auth/me', {
        headers: { Cookie: `comtam_session=${rawToken}` }
      });
      const meRes = await handleAuthRoute(meReq, db);
      expect(meRes.status).toBe(200);
      const meBody = await meRes.json() as any;
      expect(meBody.authenticated).toBe(true);
      expect(meBody.user.email).toBe('ma@saigon.vn');

      // 3. Login with wrong password fails
      const badLoginReq = new Request('https://comtam.aunomay.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'ma@saigon.vn',
          password: 'wrongpassword'
        })
      });
      const badRes = await handleAuthRoute(badLoginReq, db);
      expect(badRes.status).toBe(401);

      // 4. Logout deletes session and clears cookie
      const logoutReq = new Request('https://comtam.aunomay.com/api/v1/auth/logout', {
        method: 'POST',
        headers: { Cookie: `comtam_session=${rawToken}` }
      });
      const logoutRes = await handleAuthRoute(logoutReq, db);
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.headers.get('Set-Cookie')).toContain('Max-Age=0');

      // Check session is deleted
      const checkSession = await db.prepare('SELECT 1 FROM sessions').first();
      expect(checkSession).toBeNull();

      // Check /me is no longer authenticated
      const meAfterRes = await handleAuthRoute(meReq, db);
      const meAfterBody = await meAfterRes.json() as any;
      expect(meAfterBody.authenticated).toBe(false);
    });

    it('rejects duplicate email registration', async () => {
      const regReq1 = new Request('https://comtam.aunomay.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'duplicate@saigon.vn',
          password: 'password123',
          displayName: 'User 1'
        })
      });
      const res1 = await handleAuthRoute(regReq1, db);
      expect(res1.status).toBe(201);

      const regReq2 = new Request('https://comtam.aunomay.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'DUPLICATE@saigon.vn',
          password: 'password456',
          displayName: 'User 2'
        })
      });
      const res2 = await handleAuthRoute(regReq2, db);
      expect(res2.status).toBe(409);
    });
  });
});
