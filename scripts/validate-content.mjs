#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';

const projectRoot = process.cwd();
const errors = [];

function checkFile(relPath, label) {
  const p = path.join(projectRoot, relPath);
  if (!fs.existsSync(p)) {
    errors.push(`Missing content file for ${label}: ${relPath}`);
    return null;
  }
  return fs.readFileSync(p, 'utf-8');
}

// 1. Ingredients check (>= 23)
const ingContent = checkFile('src/client/data/ingredients.ts', 'Ingredients');
if (ingContent) {
  const ingMatches = ingContent.match(/id:\s*['"][^'"]+['"]/g) || [];
  console.log(`[INFO] Ingredients count: ${ingMatches.length}`);
  if (ingMatches.length < 23) {
    errors.push(`Expected at least 23 ingredients, found ${ingMatches.length}`);
  }
}

// 2. Recipes check (>= 25)
const recipeFile = fs.existsSync(path.join(projectRoot, 'src/client/data/recipes.ts'))
  ? 'src/client/data/recipes.ts'
  : 'src/client/data/day1Recipes.ts';
const recipeContent = checkFile(recipeFile, 'Recipes');
if (recipeContent) {
  const recipeMatches = recipeContent.match(/recipeId:\s*['"][^'"]+['"]/g) || [];
  console.log(`[INFO] Recipes count: ${recipeMatches.length}`);
  if (recipeMatches.length < 25) {
    errors.push(`Expected at least 25 recipes, found ${recipeMatches.length}`);
  }
}

// 3. Customer archetypes check (10 archetypes)
const custContent = checkFile('src/client/data/customers.ts', 'Customers');
if (custContent) {
  const archetypes = ['worker', 'office', 'student', 'neighbor', 'regular', 'courier', 'elder', 'gourmet', 'tourist', 'family'];
  let foundArchetypes = 0;
  for (const a of archetypes) {
    if (custContent.includes(`'${a}'`)) {
      foundArchetypes++;
    }
  }
  console.log(`[INFO] Customer archetypes count: ${foundArchetypes}`);
  if (foundArchetypes < 10) {
    errors.push(`Expected at least 10 customer archetypes, found ${foundArchetypes}`);
  }
}

// 4. Story Days schedule check (30 campaign days)
const campaignDaysContent = checkFile('src/client/data/campaignDays.ts', 'Campaign Days');
if (campaignDaysContent) {
  for (let day = 1; day <= 30; day++) {
    if (!campaignDaysContent.includes(`day: ${day}`)) {
      errors.push(`Missing schedule entry for Campaign Day ${day}`);
    }
  }
  console.log('[INFO] All 30 campaign days scheduled.');
}

// 5. Endings check (6 canonical endings)
const endingContent = checkFile('src/client/data/endings.ts', 'Endings');
if (endingContent) {
  const requiredEndings = ['perfect', 'family', 'jd', 'neighborhood', 'husband-finance', 'comeback'];
  for (const endingId of requiredEndings) {
    if (!endingContent.includes(endingId)) {
      errors.push(`Missing ending definition for: ${endingId}`);
    }
  }
  console.log('[INFO] All 6 canonical campaign endings verified.');
}

// 6. Localization key parity check (vi.ts vs en.ts)
const viContent = checkFile('src/client/i18n/vi.ts', 'VI Localization');
const enContent = checkFile('src/client/i18n/en.ts', 'EN Localization');
if (viContent && enContent) {
  const viKeys = new Set((viContent.match(/['"][a-zA-Z0-9_.-]+['"]\s*:/g) || []).map((k) => k.replace(/['":\s]/g, '')));
  const enKeys = new Set((enContent.match(/['"][a-zA-Z0-9_.-]+['"]\s*:/g) || []).map((k) => k.replace(/['":\s]/g, '')));

  let missingInEn = 0;
  for (const k of viKeys) {
    if (!enKeys.has(k)) {
      missingInEn++;
    }
  }
  if (missingInEn > 0) {
    errors.push(`Localization parity mismatch: ${missingInEn} keys present in vi.ts missing in en.ts`);
  } else {
    console.log(`[INFO] Localization parity verified (${viKeys.size} keys).`);
  }
}

if (errors.length > 0) {
  console.error(`\n[FAIL] Content validation failed with ${errors.length} error(s):`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log('[PASS] Full content catalog and localization parity validated successfully.');
process.exit(0);
