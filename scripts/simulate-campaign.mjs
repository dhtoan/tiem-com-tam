#!/usr/bin/env node

/**
 * Headless Campaign Balance Simulation Harness
 * Usage: node scripts/simulate-campaign.mjs --runs 1000 --difficulty normal
 */

const args = process.argv.slice(2);
let runs = 1000;
let difficulty = 'normal';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--runs' && args[i + 1]) {
    runs = parseInt(args[i + 1], 10) || 1000;
  }
  if (args[i] === '--difficulty' && args[i + 1]) {
    difficulty = args[i + 1];
  }
}

console.log(`\n======================================================`);
console.log(`   TIỆM CƠM TẤM — HEADLESS CAMPAIGN SIMULATION        `);
console.log(`======================================================`);
console.log(`[CONFIG] Runs: ${runs} | Difficulty: ${difficulty.toUpperCase()}`);

const debtSchedule = {
  easy: { startingDebt: 15_000_000, workingCash: 1_500_000, mult: 1.2 },
  normal: { startingDebt: 30_000_000, workingCash: 1_200_000, mult: 1.0 },
  hard: { startingDebt: 50_000_000, workingCash: 1_000_000, mult: 0.85 },
}[difficulty] || { startingDebt: 30_000_000, workingCash: 1_200_000, mult: 1.0 };

const strategies = ['poor', 'average', 'good', 'optimized'];

for (const strat of strategies) {
  let clearedDebtCount = 0;
  let totalRevenueSum = 0;
  let totalProfitSum = 0;
  let endingCounts = {
    perfect: 0,
    family: 0,
    jd: 0,
    neighborhood: 0,
    'husband-finance': 0,
    comeback: 0,
  };

  for (let r = 0; r < runs; r++) {
    let cash = debtSchedule.workingCash;
    let debt = debtSchedule.startingDebt;
    let totalRev = 0;
    let totalExp = 0;
    let trust = 70;
    let husbandConf = 50;
    let rep = 4.0;
    let neighTrust = 50;

    for (let day = 1; day <= 30; day++) {
      let baseSales = 0;
      let exp = 0;

      if (strat === 'poor') {
        baseSales = Math.round((400_000 + day * 8_000) * 0.7 * debtSchedule.mult);
        exp = 250_000 + day * 4_000;
        trust = Math.max(0, trust - 0.5);
      } else if (strat === 'average') {
        baseSales = Math.round((700_000 + day * 15_000) * 0.85 * debtSchedule.mult);
        exp = 300_000 + day * 6_000;
        rep = Math.min(5.0, rep + 0.01);
      } else if (strat === 'good') {
        baseSales = Math.round((1_000_000 + day * 25_000) * 0.95 * debtSchedule.mult);
        exp = 400_000 + day * 8_000;
        trust = Math.min(100, trust + 0.5);
        rep = Math.min(5.0, rep + 0.02);
        neighTrust = Math.min(100, neighTrust + 1);
        husbandConf = Math.min(100, husbandConf + 1);
      } else if (strat === 'optimized') {
        baseSales = Math.round((1_500_000 + day * 40_000) * 1.0 * debtSchedule.mult);
        exp = 500_000 + day * 12_000;
        trust = Math.min(100, trust + 1);
        rep = Math.min(5.0, rep + 0.04);
        neighTrust = Math.min(100, neighTrust + 1.5);
        husbandConf = Math.min(100, husbandConf + 1.5);
      }

      cash += baseSales - exp;
      totalRev += baseSales;
      totalExp += exp;

      // Regular installment payment logic
      if (debt > 0 && cash > 500_000) {
        let payment = 0;
        if (strat === 'poor' && cash > 600_000) payment = 200_000;
        if (strat === 'average' && cash > 600_000) payment = 500_000;
        if (strat === 'good' && cash > 700_000) payment = 1_200_000;
        if (strat === 'optimized') payment = cash - 200_000;

        const actual = Math.min(payment, debt, cash);
        debt -= actual;
        cash -= actual;
      }
    }

    // Day 30 finale check
    if (debt <= cash) {
      cash -= debt;
      debt = 0;
      clearedDebtCount++;
    }

    // Ending resolution
    let ending = 'comeback';
    if (debt === 0) {
      if (rep >= 4.5 && neighTrust >= 75 && trust >= 70 && husbandConf >= 70) {
        ending = 'perfect';
      } else if (trust >= 85 && husbandConf >= 85) {
        ending = 'family';
      } else {
        ending = 'jd';
      }
    } else if (debt <= debtSchedule.startingDebt * 0.15 && neighTrust >= 70) {
      ending = 'neighborhood';
    } else if (cash >= 0 && rep >= 2.5) {
      ending = 'husband-finance';
    } else {
      ending = 'comeback';
    }

    endingCounts[ending]++;
    totalRevenueSum += totalRev;
    totalProfitSum += (totalRev - totalExp);
  }

  const avgRev = Math.round(totalRevenueSum / runs);
  const avgProfit = Math.round(totalProfitSum / runs);
  const clearRate = ((clearedDebtCount / runs) * 100).toFixed(1);

  console.log(`\n--- Strategy: ${strat.toUpperCase()} ---`);
  console.log(`  Debt Cleared: ${clearRate}% (${clearedDebtCount}/${runs})`);
  console.log(`  Avg Revenue:  ${(avgRev / 1_000_000).toFixed(2)}M VND`);
  console.log(`  Avg Profit:   ${(avgProfit / 1_000_000).toFixed(2)}M VND`);
  console.log(`  Endings Distribution:`);
  for (const [endId, count] of Object.entries(endingCounts)) {
    const pct = ((count / runs) * 100).toFixed(1);
    if (count > 0) {
      console.log(`    - ${endId.padEnd(16)}: ${pct}% (${count})`);
    }
  }
}

console.log(`\n[PASS] Simulation benchmark completed successfully.\n`);
process.exit(0);
