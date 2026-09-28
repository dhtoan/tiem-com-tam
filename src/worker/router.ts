import type { Env } from "./types";
import { applySecurityHeaders, checkBodySize } from "./middleware/security";
import { handleHealthCheck } from "./routes/health";
import { handleAuthRoute } from "./routes/auth";
import { handleSaveRoute } from "./routes/save";

export async function handleApi(request: Request, env: Env): Promise<Response> {
  // Guard: body size limit
  if (!checkBodySize(request)) {
    return applySecurityHeaders(
      new Response(JSON.stringify({ error: "Payload Too Large" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      })
    );
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  let response: Response;

  try {
    if (path === "/api/v1/health" && method === "GET") {
      response = await handleHealthCheck(request, env);
    } else if (path.startsWith("/api/v1/auth/")) {
      response = await handleAuthRoute(request, env.DB);
    } else if (path === "/api/v1/save") {
      response = await handleSaveRoute(request, env.DB);
    } else {
      response = new Response(
        JSON.stringify({ error: "Not Found", path }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    response = new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return applySecurityHeaders(response);
}
