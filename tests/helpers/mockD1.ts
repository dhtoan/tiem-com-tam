import { DatabaseSync } from 'node:sqlite';
import type { D1Database, D1PreparedStatement, D1Response, D1Result, D1ExecResult } from '@cloudflare/workers-types';

export function createMockD1(): D1Database {
  const sqlite = new DatabaseSync(':memory:');
  // Enable foreign keys
  sqlite.exec('PRAGMA foreign_keys = ON;');

  function prepare(query: string): D1PreparedStatement {
    let boundValues: any[] = [];
    const stmt = {
      bind(...values: any[]): D1PreparedStatement {
        boundValues = values.map(v => (v === undefined ? null : v));
        return stmt as unknown as D1PreparedStatement;
      },
      async first<T = unknown>(colName?: string): Promise<T | null> {
        try {
          const sqlStmt = sqlite.prepare(query);
          const row = sqlStmt.get(...boundValues) as Record<string, unknown> | undefined;
          if (!row) return null;
          if (colName) {
            return (row[colName] as T) ?? null;
          }
          return row as T;
        } catch (err) {
          throw err;
        }
      },
      async all<T = unknown>(): Promise<D1Result<T>> {
        try {
          const sqlStmt = sqlite.prepare(query);
          const rows = sqlStmt.all(...boundValues) as T[];
          return {
            results: rows,
            success: true,
            meta: {
              changes: 0,
              last_row_id: 0,
              duration: 0,
              served_by: 'mock',
              rows_read: rows.length,
              rows_written: 0,
              size_after: 0,
              changed_db: false
            }
          };
        } catch (err) {
          throw err;
        }
      },
      async run<T = unknown>(): Promise<D1Response> {
        try {
          const sqlStmt = sqlite.prepare(query);
          const info = sqlStmt.run(...boundValues);
          return {
            success: true,
            meta: {
              changes: Number(info.changes),
              last_row_id: Number(info.lastInsertRowid),
              duration: 0,
              served_by: 'mock',
              rows_read: 0,
              rows_written: Number(info.changes),
              size_after: 0,
              changed_db: Number(info.changes) > 0
            }
          };
        } catch (err) {
          throw err;
        }
      }
    };
    return stmt as unknown as D1PreparedStatement;
  }

  const d1: Partial<D1Database> = {
    prepare,
    async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      const results: D1Result<T>[] = [];
      for (const statement of statements) {
        const res = await (statement as any).all();
        results.push(res);
      }
      return results;
    },
    async exec(query: string): Promise<D1ExecResult> {
      sqlite.exec(query);
      return {
        count: 1,
        duration: 0
      };
    },
    dump: async () => new ArrayBuffer(0)
  };

  return d1 as unknown as D1Database;
}
