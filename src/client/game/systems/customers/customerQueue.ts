import type { CustomerTicket, OrderDefinition, PlateAssembly, ServeScore } from "../../../../shared/types/orders";
import { validatePlate } from "../orders/plateValidator";

export interface CustomerQueueState {
  tickets: CustomerTicket[];
  servedCount: number;
  rejectedCount: number;
  abandonedCount: number;
}

export interface SpawnCustomerInput {
  customerId: string;
  customerName: string;
  customerArchetype: string;
  recipe: OrderDefinition;
  patienceMs?: number;
  tipMultiplier?: number;
}

export function createCustomerQueue(): CustomerQueueState {
  return {
    tickets: [],
    servedCount: 0,
    rejectedCount: 0,
    abandonedCount: 0,
  };
}

export function spawnCustomer(
  queue: CustomerQueueState,
  input: SpawnCustomerInput
): CustomerQueueState {
  const totalPatienceMs = input.patienceMs ?? 30_000;
  const ticket: CustomerTicket = {
    ticketId: `ticket-${Date.now()}-${queue.tickets.length + 1}`,
    customerId: input.customerId,
    customerName: input.customerName,
    customerArchetype: input.customerArchetype,
    order: input.recipe,
    patienceRemainingMs: totalPatienceMs,
    totalPatienceMs,
    state: "waiting",
    tip: 0,
    paidAmount: 0,
  };

  return {
    ...queue,
    tickets: [...queue.tickets, ticket],
  };
}

export function advanceCustomerQueue(
  queue: CustomerQueueState,
  dtMs: number
): CustomerQueueState {
  let abandonedCount = queue.abandonedCount;

  const nextTickets = queue.tickets.map((ticket) => {
    if (ticket.state !== "waiting") {
      return ticket;
    }

    const remaining = Math.max(0, ticket.patienceRemainingMs - dtMs);
    if (remaining === 0) {
      abandonedCount++;
      return {
        ...ticket,
        patienceRemainingMs: 0,
        state: "abandoned" as const,
      };
    }

    return {
      ...ticket,
      patienceRemainingMs: remaining,
    };
  });

  return {
    ...queue,
    tickets: nextTickets,
    abandonedCount,
  };
}

export function serveCustomer(
  queue: CustomerQueueState,
  customerId: string,
  plate: PlateAssembly
): { queue: CustomerQueueState; score: ServeScore } {
  const ticketIndex = queue.tickets.findIndex(
    (t) => t.customerId === customerId && t.state === "waiting"
  );

  if (ticketIndex === -1) {
    const emptyScore: ServeScore = {
      accuracy: 0,
      cookQuality: 0,
      speed: 0,
      presentation: 0,
      accepted: false,
      feedback: "Khách hàng không tồn tại hoặc đã rời đi",
    };
    return { queue, score: emptyScore };
  }

  const ticket = queue.tickets[ticketIndex]!;
  const score = validatePlate(ticket.order, plate);

  if (score.accepted) {
    const tip = score.cookQuality >= 90 ? Math.round(ticket.order.basePrice * 0.1) : 0;
    const paidAmount = ticket.order.basePrice + tip;

    const updatedTicket: CustomerTicket = {
      ...ticket,
      state: "served",
      tip,
      paidAmount,
    };

    const nextTickets = [...queue.tickets];
    nextTickets[ticketIndex] = updatedTicket;

    return {
      queue: {
        ...queue,
        tickets: nextTickets,
        servedCount: queue.servedCount + 1,
      },
      score,
    };
  }

  // Plate was rejected by customer
  return {
    queue: {
      ...queue,
      rejectedCount: queue.rejectedCount + 1,
    },
    score,
  };
}
