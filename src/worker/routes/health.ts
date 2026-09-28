import type { Env } from "../types";

export async function handleHealthCheck(
  _request: Request,
  _env: Env
): Promise<Response> {
  const body = JSON.stringify({
    status: "ok",
    service: "tiem-com-tam-api",
    version: "1.0.0",
    timestamp: Date.now(),
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
