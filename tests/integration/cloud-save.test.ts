import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createMockD1 } from '../helpers/mockD1';
import type { D1Database } from '@cloudflare/workers-types';
import { handleAuthRoute } from '../../src/worker/routes/auth';
import { handleSaveRoute } from '../../src/worker/routes/save';
import { parseSessionToken } from '../../src/worker/auth/sessions';

describe('Revisioned Cloud Save & Stale Write Conflict', () => {
  let db: D1Database;
  let sessionCookie: string;

  beforeEach(async () => {
    db = createMockD1();
    const migrationPath = path.resolve(process.cwd(), 'migrations/0001_init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    await db.exec(sql);

    // Register test account
    const regReq = new Request('https://comtam.aunomay.com/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'conflict_test@saigon.vn',
        password: 'password12345',
        displayName: 'Tiệm Sáu'
      })
    });
    const regRes = await handleAuthRoute(regReq, db);
    const rawCookie = regRes.headers.get('Set-Cookie');
    expect(rawCookie).toBeTruthy();
    const token = parseSessionToken(rawCookie);
    sessionCookie = `comtam_session=${token}`;
  });

  it('rejects unauthenticated requests with 401', async () => {
    const req = new Request('https://comtam.aunomay.com/api/v1/save', {
      method: 'GET'
    });
    const res = await handleSaveRoute(req, db);
    expect(res.status).toBe(401);
  });

  it('handles two-device conflict: Device B gets 409 when Device A has incremented revision', async () => {
    // 1. Initial GET: revision is 0
    const getReq = new Request('https://comtam.aunomay.com/api/v1/save', {
      headers: { Cookie: sessionCookie }
    });
    const getRes = await handleSaveRoute(getReq, db);
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json() as any;
    expect(getBody.revision).toBe(0);
    expect(getBody.save).toBeNull();

    // 2. Initial PUT from Device A (expectedRevision: 0)
    const initialSaveData = JSON.stringify({ day: 1, money: 100000 });
    const putReq1 = new Request('https://comtam.aunomay.com/api/v1/save', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({
        save: initialSaveData,
        expectedRevision: 0,
        clientUpdatedAt: 1000
      })
    });
    const putRes1 = await handleSaveRoute(putReq1, db);
    expect(putRes1.status).toBe(200);
    const putBody1 = await putRes1.json() as any;
    expect(putBody1.ok).toBe(true);
    expect(putBody1.revision).toBe(1);

    // 3. Device A plays more and writes revision 2 (expectedRevision: 1)
    const deviceASaveData = JSON.stringify({ day: 5, money: 850000 });
    const putReqA = new Request('https://comtam.aunomay.com/api/v1/save', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({
        save: deviceASaveData,
        expectedRevision: 1,
        clientUpdatedAt: 2000
      })
    });
    const putResA = await handleSaveRoute(putReqA, db);
    expect(putResA.status).toBe(200);
    const putBodyA = await putResA.json() as any;
    expect(putBodyA.revision).toBe(2);

    // 4. Device B was offline since revision 1. Device B now tries to write with expectedRevision: 1
    const deviceBSaveData = JSON.stringify({ day: 3, money: 200000 });
    const putReqB = new Request('https://comtam.aunomay.com/api/v1/save', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      body: JSON.stringify({
        save: deviceBSaveData,
        expectedRevision: 1,
        clientUpdatedAt: 1800
      })
    });
    const putResB = await handleSaveRoute(putReqB, db);
    expect(putResB.status).toBe(409);
    const putBodyB = await putResB.json() as any;
    expect(putBodyB.error).toContain('cloud đã thay đổi');
    expect(putBodyB.revision).toBe(2);
    expect(putBodyB.serverSave).toBe(deviceASaveData);
  });
});
