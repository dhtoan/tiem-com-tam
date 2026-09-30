import { describe, it, expect } from 'vitest';
import { runCampaignSimulation } from '../helpers/strategies';

describe('Headless Campaign Balance Simulation', () => {
  it('produces deterministic output with fixed seed and strategy', () => {
    const seed = 'simulation-deterministic-seed-42';
    const run1 = runCampaignSimulation('normal', seed, 'good');
    const run2 = runCampaignSimulation('normal', seed, 'good');

    expect(run1.daysCompleted).toBe(30);
    expect(run1.ending).toBe(run2.ending);
    expect(run1.finalCash).toBe(run2.finalCash);
    expect(run1.finalDebt).toBe(run2.finalDebt);
    expect(run1.totalRevenue).toBe(run2.totalRevenue);
  });

  it('demonstrates clear progression across poor, average, good, and optimized strategies', () => {
    const seed = 'strategy-benchmark-seed-101';
    const poorRun = runCampaignSimulation('normal', seed, 'poor');
    const avgRun = runCampaignSimulation('normal', seed, 'average');
    const goodRun = runCampaignSimulation('normal', seed, 'good');
    const optRun = runCampaignSimulation('normal', seed, 'optimized');

    // Revenue progression
    expect(optRun.totalRevenue).toBeGreaterThan(goodRun.totalRevenue);
    expect(goodRun.totalRevenue).toBeGreaterThan(avgRun.totalRevenue);
    expect(avgRun.totalRevenue).toBeGreaterThan(poorRun.totalRevenue);

    // Debt repayment progression
    expect(optRun.finalDebt).toBeLessThanOrEqual(goodRun.finalDebt);
    expect(goodRun.finalDebt).toBeLessThanOrEqual(avgRun.finalDebt);

    // Optimized achieves victory ending
    expect(['perfect', 'family', 'jd']).toContain(optRun.ending);

    // Poor achieves fail-forward ending
    expect(['husband-finance', 'comeback']).toContain(poorRun.ending);
  });

  it('scales difficulty correctly: Easy has higher margins than Hard', () => {
    const seed = 'difficulty-scaling-seed-202';
    const easyRun = runCampaignSimulation('easy', seed, 'average');
    const hardRun = runCampaignSimulation('hard', seed, 'average');

    expect(easyRun.totalRevenue).toBeGreaterThanOrEqual(hardRun.totalRevenue);
    expect(easyRun.netProfit).toBeGreaterThan(hardRun.netProfit);
  });
});
