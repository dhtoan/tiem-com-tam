import { describe, it, expect } from "vitest";
import {
  createCustomerQueue,
  spawnCustomer,
  advanceCustomerQueue,
  serveCustomer,
} from "../../src/client/game/systems/customers/customerQueue";
import { day1Recipes } from "../../src/client/data/day1Recipes";
import type { PlateAssembly } from "../../src/shared/types/orders";

describe("Customer Queue & Service Lifecycle", () => {
  it("spawns customer into queue and advances waiting patience", () => {
    let queue = createCustomerQueue();
    expect(queue.tickets).toHaveLength(0);

    queue = spawnCustomer(queue, {
      customerId: "cust-1",
      customerName: "Anh Hùng Xe Ôm",
      customerArchetype: "xe-om",
      recipe: day1Recipes["com-suon"]!,
      patienceMs: 30_000,
    });

    expect(queue.tickets).toHaveLength(1);
    expect(queue.tickets[0]?.state).toBe("waiting");

    // Advance 5 seconds
    queue = advanceCustomerQueue(queue, 5000);
    expect(queue.tickets[0]?.patienceRemainingMs).toBe(25_000);
  });

  it("marks customer abandoned when patience expires", () => {
    let queue = createCustomerQueue();
    queue = spawnCustomer(queue, {
      customerId: "cust-2",
      customerName: "Cô Thuỷ Văn Phòng",
      customerArchetype: "office",
      recipe: day1Recipes["com-suon"]!,
      patienceMs: 10_000,
    });

    queue = advanceCustomerQueue(queue, 12_000);
    expect(queue.tickets[0]?.state).toBe("abandoned");
    expect(queue.abandonedCount).toBe(1);
  });

  it("handles successful serve with payment and tip", () => {
    let queue = createCustomerQueue();
    queue = spawnCustomer(queue, {
      customerId: "cust-3",
      customerName: "Bác Ba",
      customerArchetype: "neighbor",
      recipe: day1Recipes["com-suon"]!,
      patienceMs: 30_000,
    });

    const perfectPlate: PlateAssembly = {
      rice: true,
      proteins: ["suon-heo"],
      proteinCookQualities: { "suon-heo": 100 },
      toppings: ["mo-hanh", "do-chua", "dua-leo"],
      sides: ["nuoc-mam"],
    };

    const result = serveCustomer(queue, "cust-3", perfectPlate);
    expect(result.score.accepted).toBe(true);
    expect(result.queue.tickets[0]?.state).toBe("served");
    expect(result.queue.tickets[0]?.paidAmount).toBe(38_500);
    expect(result.queue.tickets[0]?.tip).toBe(3_500);
    expect(result.queue.servedCount).toBe(1);
  });

  it("rejects invalid plate without paying or completing ticket", () => {
    let queue = createCustomerQueue();
    queue = spawnCustomer(queue, {
      customerId: "cust-4",
      customerName: "Chú Năm",
      customerArchetype: "regular",
      recipe: day1Recipes["com-suon"]!,
      patienceMs: 30_000,
    });

    const wrongPlate: PlateAssembly = {
      rice: false, // missing rice!
      proteins: ["suon-heo"],
      proteinCookQualities: { "suon-heo": 100 },
      toppings: [],
      sides: [],
    };

    const result = serveCustomer(queue, "cust-4", wrongPlate);
    expect(result.score.accepted).toBe(false);
    expect(result.queue.tickets[0]?.state).toBe("waiting"); // Still waiting for correct plate!
    expect(result.queue.tickets[0]?.paidAmount).toBe(0);
    expect(result.queue.servedCount).toBe(0);
    expect(result.queue.rejectedCount).toBe(1);
  });
});
