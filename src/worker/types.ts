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

export function jsonResponse(data: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}
