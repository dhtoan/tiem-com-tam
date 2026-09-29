#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const manifestFile = path.join(projectRoot, 'src/client/assets/manifest.ts');

if (!fs.existsSync(manifestFile)) {
  console.error(`[ERROR] Manifest file not found: ${manifestFile}`);
  process.exit(1);
}

const manifestContent = fs.readFileSync(manifestFile, 'utf-8');

// Extract asset entries: id and path
const entryRegex = /id:\s*['"]([^'"]+)['"],\s*path:\s*['"]([^'"]+)['"]/g;
let match;
const entries = [];
const seenIds = new Set();
const errors = [];

while ((match = entryRegex.exec(manifestContent)) !== null) {
  const [, id, assetPath] = match;
  if (!id || !assetPath) continue;

  if (seenIds.has(id)) {
    errors.push(`Duplicate asset ID: "${id}"`);
  }
  seenIds.add(id);

  entries.push({ id, path: assetPath });
}

console.log(`[INFO] Found ${entries.length} assets registered in manifest.`);

for (const entry of entries) {
  const relativePath = entry.path.replace(/^\/+/, '');
  const filePath = path.join(publicDir, relativePath);

  if (!fs.existsSync(filePath)) {
    errors.push(`Missing asset on disk: ${entry.path} (ID: ${entry.id})`);
  } else {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      errors.push(`Empty 0-byte asset file: ${entry.path} (ID: ${entry.id})`);
    }

    const MAX_IMAGE_BYTES = 2_000_000; // 2 MB
    const MAX_AUDIO_BYTES = 5_000_000; // 5 MB

    if (filePath.endsWith('.png') && stats.size > MAX_IMAGE_BYTES) {
      console.warn(`[WARN] Image asset ${entry.id} exceeds recommended limit: ${(stats.size / 1024).toFixed(1)} KB`);
    } else if (filePath.endsWith('.mp3') && stats.size > MAX_AUDIO_BYTES) {
      console.warn(`[WARN] Audio asset ${entry.id} exceeds recommended limit: ${(stats.size / 1024).toFixed(1)} KB`);
    }
  }
}

// Verify favicon exists in public
const faviconPath = path.join(publicDir, 'favicon.ico');
if (!fs.existsSync(faviconPath)) {
  errors.push('Missing favicon.ico in public directory');
}

if (errors.length > 0) {
  console.error(`\n[FAIL] Asset validation failed with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`[PASS] All ${entries.length} manifest assets strictly validated on disk (0 missing, 0 empty).`);
process.exit(0);
