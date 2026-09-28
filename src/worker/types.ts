import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  JWT_SECRET?: string;
  ENVIRONMENT?: string;
}

export type RouteHandler = (
  request: Request,
  env: Env,
  params?: Record<string, string>
) => Promise<Response>;
