import { describe, it, expect } from "vitest";
import { handleApi } from "../../src/worker/router";
import type { Env } from "../../src/worker/types";

describe("Worker Router and Security Middleware", () => {
  const mockEnv: Env = {
    DB: {} as unknown as Env["DB"],
    ENVIRONMENT: "test",
  };

  it("returns health check JSON with security headers on GET /api/v1/health", async () => {
    const req = new Request("https://example.com/api/v1/health", {
      method: "GET",
    });

    const res = await handleApi(req, mockEnv);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("tiem-com-tam-api");

    // Verify security headers
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("DENY");
    expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
  });

  it("returns 404 with security headers for unknown API route", async () => {
    const req = new Request("https://example.com/api/v1/nonexistent", {
      method: "GET",
    });

    const res = await handleApi(req, mockEnv);
    expect(res.status).toBe(404);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("rejects oversized request bodies exceeding 1MB guard", async () => {
    // 1MB = 1048576 bytes. Send 1.2MB content length header
    const req = new Request("https://example.com/api/v1/health", {
      method: "POST",
      headers: {
        "content-length": "1250000",
      },
      body: "a".repeat(100),
    });

    const res = await handleApi(req, mockEnv);
    expect(res.status).toBe(413);
  });
});
