import { describe, it, expect } from "vitest";
import {
  adjustFamilyTrust,
  adjustHusbandConfidence,
} from "../../src/client/systems/family/family";
import { adjustReputation } from "../../src/client/systems/reputation/reputation";
import { recordCustomerOutcome } from "../../src/client/systems/customers/loyalty";
import type { LoyaltyState } from "../../src/shared/types/relationships";

describe("Family, Reputation, and Customer Loyalty Metrics", () => {
  it("adjusts family trust and husband confidence clamped between 0 and 100", () => {
    expect(adjustFamilyTrust(70, +15)).toBe(85);
    expect(adjustFamilyTrust(95, +20)).toBe(100);
    expect(adjustFamilyTrust(10, -30)).toBe(0);

    expect(adjustHusbandConfidence(50, -10)).toBe(40);
    expect(adjustHusbandConfidence(90, +25)).toBe(100);
    expect(adjustHusbandConfidence(5, -20)).toBe(0);
  });

  it("adjusts reputation rating clamped between 1.0 and 5.0", () => {
    expect(adjustReputation(4.0, +0.2)).toBe(4.2);
    expect(adjustReputation(4.9, +0.5)).toBe(5.0);
    expect(adjustReputation(1.2, -0.8)).toBe(1.0);
  });

  it("records customer visits and promotes to regular customer after 3 happy visits", () => {
    let loyalty: LoyaltyState = {};

    // Visit 1
    loyalty = recordCustomerOutcome(loyalty, "cust-hung", {
      accepted: true,
      dishPrice: 35_000,
      tip: 3_500,
      recipeId: "com-suon",
    });
    expect(loyalty["cust-hung"]?.visits).toBe(1);
    expect(loyalty["cust-hung"]?.isRegular).toBe(false);

    // Visit 2
    loyalty = recordCustomerOutcome(loyalty, "cust-hung", {
      accepted: true,
      dishPrice: 35_000,
      tip: 3_500,
      recipeId: "com-suon",
    });
    expect(loyalty["cust-hung"]?.visits).toBe(2);
    expect(loyalty["cust-hung"]?.isRegular).toBe(false);

    // Visit 3
    loyalty = recordCustomerOutcome(loyalty, "cust-hung", {
      accepted: true,
      dishPrice: 35_000,
      tip: 3_500,
      recipeId: "com-suon",
    });
    expect(loyalty["cust-hung"]?.visits).toBe(3);
    expect(loyalty["cust-hung"]?.isRegular).toBe(true);
    expect(loyalty["cust-hung"]?.totalSpent).toBe(115_500);
  });
});
