import type { D1Database } from '@cloudflare/workers-types';
import { jsonResponse } from '../types';
import { authenticateRequest } from '../auth/sessions';
import { getCloudSave, putCloudSave } from '../db/saves';

const MAX_SAVE_SIZE_BYTES = 256 * 1024; // 256KB

export async function handleSaveRoute(request: Request, db: D1Database): Promise<Response> {
  const account = await authenticateRequest(db, request);
  if (!account) {
    return jsonResponse({ error: 'Chưa đăng nhập.' }, { status: 401 });
  }

  const method = request.method.toUpperCase();

  if (method === 'GET') {
    const row = await getCloudSave(db, account.id);
    if (!row) {
      return jsonResponse({
        ok: true,
        save: null,
        revision: 0,
        updatedAt: null,
        clientUpdatedAt: null
      });
    }

    return jsonResponse({
      ok: true,
      save: row.save_data,
      revision: row.revision,
      updatedAt: row.updated_at,
      clientUpdatedAt: row.client_updated_at
    });
  }

  if (method === 'PUT') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
    }

    if (!body || typeof body.save !== 'string') {
      return jsonResponse({ error: 'Bản lưu không hợp lệ.' }, { status: 400 });
    }

    const byteLength = new TextEncoder().encode(body.save).byteLength;
    if (byteLength > MAX_SAVE_SIZE_BYTES) {
      return jsonResponse({ error: 'Bản lưu vượt quá dung lượng cho phép.' }, { status: 413 });
    }

    const expectedRevision = typeof body.expectedRevision === 'number' ? body.expectedRevision : null;
    const clientUpdatedAt = typeof body.clientUpdatedAt === 'number' ? body.clientUpdatedAt : null;
    const now = Date.now();

    const res = await putCloudSave(db, {
      accountId: account.id,
      saveData: body.save,
      expectedRevision,
      clientUpdatedAt,
      now
    });

    if (!res.ok) {
      return jsonResponse({
        error: 'Bản lưu trên cloud đã thay đổi ở thiết bị khác.',
        conflict: true,
        revision: res.currentRevision,
        serverSave: res.currentSave,
        updatedAt: res.currentUpdatedAt
      }, { status: 409 });
    }

    return jsonResponse({
      ok: true,
      revision: res.revision,
      updatedAt: now
    }, { status: 200 });
  }

  return jsonResponse({ error: 'Method not allowed' }, { status: 405 });
}
