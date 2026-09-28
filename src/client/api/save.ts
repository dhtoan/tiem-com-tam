export interface CloudSaveData {
  save: string | null;
  revision: number;
  updatedAt: number | null;
  clientUpdatedAt: number | null;
}

export interface FetchSaveResult {
  ok: boolean;
  authenticated?: boolean;
  data?: CloudSaveData;
  error?: string;
}

export interface SyncSaveResult {
  ok: boolean;
  conflict?: boolean;
  revision?: number;
  currentRevision?: number;
  serverSave?: string;
  serverUpdatedAt?: number;
  error?: string;
}

export async function fetchCloudSave(): Promise<FetchSaveResult> {
  try {
    const res = await fetch('/api/v1/save', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    });

    if (res.status === 401) {
      return { ok: false, authenticated: false, error: 'Chưa đăng nhập' };
    }

    if (!res.ok) {
      return { ok: false, error: `Lỗi tải bản lưu cloud (${res.status})` };
    }

    const json = await res.json() as {
      ok: boolean;
      save: string | null;
      revision: number;
      updatedAt: number | null;
      clientUpdatedAt: number | null;
    };

    return {
      ok: true,
      authenticated: true,
      data: {
        save: json.save,
        revision: json.revision,
        updatedAt: json.updatedAt,
        clientUpdatedAt: json.clientUpdatedAt
      }
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi mạng khi tải bản lưu cloud' };
  }
}

export async function syncCloudSave(
  saveData: string,
  expectedRevision: number,
  clientUpdatedAt = Date.now()
): Promise<SyncSaveResult> {
  try {
    const res = await fetch('/api/v1/save', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        save: saveData,
        expectedRevision,
        clientUpdatedAt
      })
    });

    if (res.status === 409) {
      const data = await res.json() as {
        error?: string;
        conflict?: boolean;
        revision?: number;
        serverSave?: string;
        updatedAt?: number;
      };
      return {
        ok: false,
        conflict: true,
        currentRevision: data.revision,
        serverSave: data.serverSave,
        serverUpdatedAt: data.updatedAt,
        error: data.error || 'Bản lưu đám mây đã thay đổi'
      };
    }

    if (res.status === 401) {
      return { ok: false, error: 'Chưa đăng nhập' };
    }

    if (!res.ok) {
      return { ok: false, error: `Lỗi đồng bộ bản lưu (${res.status})` };
    }

    const data = await res.json() as { ok: boolean; revision: number; updatedAt: number };
    return {
      ok: true,
      revision: data.revision
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Lỗi mạng khi đồng bộ bản lưu' };
  }
}
