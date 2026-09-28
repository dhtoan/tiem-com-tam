import { describe, it, expect } from 'vitest';
import { ingredientsCatalog } from '../../src/client/data/ingredients';
import { recipesCatalog } from '../../src/client/data/recipes';

describe('Food Catalog Content Counts & Integrity', () => {
  it('defines the required 23 production ingredients with valid shelf life and categories', () => {
    const list = Object.values(ingredientsCatalog);
    expect(list.length).toBe(23);

    for (const ing of list) {
      expect(ing.id).toBeTruthy();
      expect(ing.name).toBeTruthy();
      expect(ing.basePrice).toBeGreaterThan(0);
      expect(ing.shelfLifeDays).toBeGreaterThanOrEqual(2);
      expect(['rice', 'meat', 'topping', 'side']).toContain(ing.category);
    }
  });

  it('defines at least 25 balanced recipes with positive profit margins', () => {
    const recipes = Object.values(recipesCatalog);
    expect(recipes.length).toBeGreaterThanOrEqual(25);

    for (const recipe of recipes) {
      expect(recipe.recipeId).toBeTruthy();
      expect(recipe.name).toBeTruthy();
      expect(recipe.basePrice).toBeGreaterThan(20_000);
      expect(recipe.requiredRice).toBe(true);
      expect(recipe.requiredProteins.length).toBeGreaterThanOrEqual(1);

      // Verify every protein ingredient exists
      for (const p of recipe.requiredProteins) {
        expect(ingredientsCatalog[p]).toBeDefined();
      }

      // Verify every topping exists
      for (const t of recipe.requiredToppings) {
        expect(ingredientsCatalog[t]).toBeDefined();
      }

      // Verify every side exists
      for (const s of recipe.requiredSides) {
        expect(ingredientsCatalog[s]).toBeDefined();
      }
    }
  });
});
