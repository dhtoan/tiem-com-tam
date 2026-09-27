import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

describe("Application Bootstrap & Toolchain", () => {
  it("exposes index.html with #app, #game-root, and #ui-root", () => {
    const indexPath = resolve(process.cwd(), "index.html");
    expect(existsSync(indexPath)).toBe(true);
    const html = readFileSync(indexPath, "utf-8");
    expect(html).toContain('id="app"');
    expect(html).toContain('id="game-root"');
    expect(html).toContain('id="ui-root"');
  });

  it("exposes all required npm scripts in package.json", () => {
    const pkgPath = resolve(process.cwd(), "package.json");
    expect(existsSync(pkgPath)).toBe(true);
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const requiredScripts = [
      "dev",
      "build",
      "typecheck",
      "lint",
      "test",
      "test:run",
      "test:e2e",
      "validate:assets",
      "validate:content",
      "db:local",
    ];
    for (const script of requiredScripts) {
      expect(pkg.scripts?.[script], `Missing script: ${script}`).toBeDefined();
    }
  });
});
