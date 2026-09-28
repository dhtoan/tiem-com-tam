import type { D1Database } from '@cloudflare/workers-types';
import { getSession, getAccountById, type AccountRow } from '../db/accounts';

export const AUTH_COOKIE = 'comtam_session';
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashToken(token: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(token));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

export function createSessionCookie(
  token: string,
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
  isHttps = false
): string {
  return `${AUTH_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}${isHttps ? '; Secure' : ''}`;
}

export function clearSessionCookie(isHttps = false): string {
  return `${AUTH_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${isHttps ? '; Secure' : ''}`;
}

export function parseSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export async function authenticateRequest(
  db: D1Database,
  request: Request,
  now = Date.now()
): Promise<AccountRow | null> {
  const rawToken = parseSessionToken(request.headers.get('Cookie'));
  if (!rawToken) return null;

  const tokenHash = await hashToken(rawToken);
  const session = await getSession(db, tokenHash, now);
  if (!session) return null;

  const account = await getAccountById(db, session.accountId);
  return account;
}
