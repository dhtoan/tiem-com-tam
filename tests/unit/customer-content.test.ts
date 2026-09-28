import { describe, it, expect } from 'vitest';
import {
  CUSTOMER_ARCHETYPES,
  CUSTOMER_VARIANTS,
  CUSTOMER_MOODS,
  COMMUNITY_NPCS,
  type CustomerArchetype,
  type CustomerMood,
  getCustomerVariant,
} from '../../src/client/data/customers';
import { GUARD_ROSTER } from '../../src/client/data/guards';

describe('Customer & Character Content Metrics', () => {
  it('defines exactly 10 gameplay customer archetypes', () => {
    expect(CUSTOMER_ARCHETYPES).toHaveLength(10);
    const uniqueArchetypes = new Set(CUSTOMER_ARCHETYPES);
    expect(uniqueArchetypes.size).toBe(10);

    const expectedArchetypes: CustomerArchetype[] = [
      'worker',
      'office',
      'student',
      'neighbor',
      'regular',
      'courier',
      'elder',
      'gourmet',
      'tourist',
      'family',
    ];
    expect(CUSTOMER_ARCHETYPES).toEqual(expect.arrayContaining(expectedArchetypes));
  });

  it('contains roughly 24-32 customer appearance variants covering all 10 archetypes', () => {
    expect(CUSTOMER_VARIANTS.length).toBeGreaterThanOrEqual(24);
    expect(CUSTOMER_VARIANTS.length).toBeLessThanOrEqual(32);

    const archetypesRepresented = new Set(CUSTOMER_VARIANTS.map(v => v.archetype));
    expect(archetypesRepresented.size).toBe(10);

    // Verify all IDs are unique
    const ids = new Set(CUSTOMER_VARIANTS.map(v => v.id));
    expect(ids.size).toBe(CUSTOMER_VARIANTS.length);
  });

  it('supports all 6 required customer mood states', () => {
    const expectedMoods: CustomerMood[] = [
      'happy',
      'neutral',
      'waiting',
      'impatient',
      'angry',
      'delighted',
    ];
    expect(CUSTOMER_MOODS).toEqual(expect.arrayContaining(expectedMoods));
    expect(CUSTOMER_MOODS).toHaveLength(6);
  });

  it('validates each customer variant has valid parameters and preferred recipes', () => {
    for (const variant of CUSTOMER_VARIANTS) {
      expect(variant.id).toBeTruthy();
      expect(variant.name).toBeTruthy();
      expect(variant.basePatienceMs).toBeGreaterThan(10_000);
      expect(variant.tipMultiplier).toBeGreaterThan(0);
      expect(variant.preferredRecipes.length).toBeGreaterThanOrEqual(1);

      // Verify helper lookup
      const found = getCustomerVariant(variant.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(variant.id);
    }
  });

  it('contains at least 3 distinct guards in roster', () => {
    const guards = Object.values(GUARD_ROSTER);
    expect(guards.length).toBeGreaterThanOrEqual(3);
    for (const guard of guards) {
      expect(guard.detection).toBeGreaterThan(0);
      expect(guard.shiftCost).toBeGreaterThan(0);
    }
  });

  it('defines fictionalized community and incident NPCs without stereotypes', () => {
    expect(COMMUNITY_NPCS.length).toBeGreaterThanOrEqual(3);
    const npcIds = COMMUNITY_NPCS.map(n => n.id);
    expect(npcIds).toContain('npc_tax_officer');
    expect(npcIds).toContain('npc_community_warden');
    expect(npcIds).toContain('npc_hygiene_inspector');

    for (const npc of COMMUNITY_NPCS) {
      expect(npc.fictionalDisclaimer).toBe(true);
      expect(npc.roleDescription).toBeTruthy();
    }
  });
});
