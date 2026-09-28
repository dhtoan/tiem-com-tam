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

// 1. Ingredients check
const ingContent = checkFile('src/client/data/ingredients.ts', 'Ingredients');
if (ingContent) {
  const ingMatches = ingContent.match(/id:\s*['"][^'"]+['"]/g) || [];
  console.log(`[INFO] Ingredients count: ${ingMatches.length}`);
  if (ingMatches.length < 23) {
    errors.push(`Expected at least 23 ingredients, found ${ingMatches.length}`);
  }
}

// 2. Recipes check
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

// 3. Story Events check
const day01Content = checkFile('src/client/data/story/day01-10.ts', 'Story Days 1-10');
const day11Content = checkFile('src/client/data/story/day11-20.ts', 'Story Days 11-20');
const day21Content = checkFile('src/client/data/story/day21-30.ts', 'Story Days 21-30');

if (day01Content && day11Content && day21Content) {
  console.log('[INFO] 30-day story schedule files verified.');
}

// 4. Endings check
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

if (errors.length > 0) {
  console.error(`[FAIL] Content validation failed with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

console.log('[PASS] Content catalog validated successfully.');
process.exit(0);
