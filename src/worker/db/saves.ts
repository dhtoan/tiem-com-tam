import type { D1Database } from '@cloudflare/workers-types';

export interface CloudSaveRow {
  account_id: string;
  save_data: string;
  revision: number;
  client_updated_at: number | null;
  updated_at: number;
}

export interface PutSaveResult {
  ok: boolean;
  revision?: number;
  conflict?: boolean;
  currentRevision?: number;
  currentSave?: string;
  currentUpdatedAt?: number;
}

export async function getCloudSave(db: D1Database, accountId: string): Promise<CloudSaveRow | null> {
  const row = await db.prepare(
    'SELECT account_id, save_data, revision, client_updated_at, updated_at FROM cloud_saves WHERE account_id = ?'
  ).bind(accountId).first<CloudSaveRow>();

  return row ?? null;
}

export async function putCloudSave(
  db: D1Database,
  params: {
    accountId: string;
    saveData: string;
    expectedRevision?: number | null;
    clientUpdatedAt?: number | null;
    now: number;
  }
): Promise<PutSaveResult> {
  const current = await getCloudSave(db, params.accountId);
  const currentRevision = current?.revision ?? 0;

  if (params.expectedRevision !== undefined && params.expectedRevision !== null) {
    if (params.expectedRevision !== currentRevision) {
      return {
        ok: false,
        conflict: true,
        currentRevision,
        currentSave: current?.save_data,
        currentUpdatedAt: current?.updated_at
      };
    }
  }

  const nextRevision = currentRevision + 1;

  await db.prepare(`
    INSERT INTO cloud_saves (account_id, save_data, revision, client_updated_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (account_id) DO UPDATE SET
      save_data = excluded.save_data,
      revision = excluded.revision,
      client_updated_at = excluded.client_updated_at,
      updated_at = excluded.updated_at
  `).bind(
    params.accountId,
    params.saveData,
    nextRevision,
    params.clientUpdatedAt ?? null,
    params.now
  ).run();

  return {
    ok: true,
    revision: nextRevision
  };
}
