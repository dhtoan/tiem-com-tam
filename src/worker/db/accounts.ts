import type { D1Database } from '@cloudflare/workers-types';

export interface AccountRow {
  id: string;
  email: string;
  display_name: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  created_at: number;
  updated_at: number;
}

export interface SessionRow {
  token_hash: string;
  account_id: string;
  created_at: number;
  expires_at: number;
  last_seen: number;
}

export interface AccountInfo {
  id: string;
  email: string;
  displayName: string;
  createdAt: number;
  updatedAt: number;
}

export async function createAccount(
  db: D1Database,
  params: {
    id: string;
    email: string;
    displayName: string;
    passwordHash: string;
    salt: string;
    iterations?: number;
    now: number;
  }
): Promise<AccountInfo> {
  const iterations = params.iterations ?? 100000;
  await db.prepare(`
    INSERT INTO accounts (id, email, display_name, password_hash, password_salt, password_iterations, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    params.id,
    params.email.trim(),
    params.displayName.trim(),
    params.passwordHash,
    params.salt,
    iterations,
    params.now,
    params.now
  ).run();

  return {
    id: params.id,
    email: params.email.trim(),
    displayName: params.displayName.trim(),
    createdAt: params.now,
    updatedAt: params.now
  };
}

export async function getAccountByEmail(db: D1Database, email: string): Promise<AccountRow | null> {
  const row = await db.prepare(
    'SELECT * FROM accounts WHERE email = ? COLLATE NOCASE'
  ).bind(email.trim()).first<AccountRow>();

  return row ?? null;
}

export async function getAccountById(db: D1Database, id: string): Promise<AccountRow | null> {
  const row = await db.prepare(
    'SELECT * FROM accounts WHERE id = ?'
  ).bind(id).first<AccountRow>();

  return row ?? null;
}

export async function createSession(
  db: D1Database,
  params: {
    tokenHash: string;
    accountId: string;
    expiresAt: number;
    now: number;
  }
): Promise<void> {
  await db.prepare(`
    INSERT INTO sessions (token_hash, account_id, created_at, expires_at, last_seen)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    params.tokenHash,
    params.accountId,
    params.now,
    params.expiresAt,
    params.now
  ).run();
}

export async function getSession(
  db: D1Database,
  tokenHash: string,
  now: number
): Promise<{ accountId: string; expiresAt: number; lastSeen: number } | null> {
  const row = await db.prepare(
    'SELECT account_id, expires_at, last_seen FROM sessions WHERE token_hash = ? AND expires_at > ?'
  ).bind(tokenHash, now).first<{ account_id: string; expires_at: number; last_seen: number }>();

  if (!row) return null;

  // Touch last_seen
  await db.prepare('UPDATE sessions SET last_seen = ? WHERE token_hash = ?')
    .bind(now, tokenHash).run();

  return {
    accountId: row.account_id,
    expiresAt: row.expires_at,
    lastSeen: row.last_seen
  };
}

export async function deleteSession(db: D1Database, tokenHash: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
}

export async function cleanExpiredSessions(db: D1Database, now: number): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now).run();
}
