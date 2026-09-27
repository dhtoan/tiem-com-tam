import type { GameState } from "../../shared/types/game-state";
import type { EventDefinition } from "../../shared/types/events";
import type { DailyEventBudget } from "./EventBudget";
import { calculateStress } from "./StressBudget";
import { evaluateCondition } from "./conditions";
import { createSeededRandom } from "../../shared/random/seededRandom";

export interface EventSelectionInput {
  state: GameState;
  candidateEvents: EventDefinition[];
  budget: DailyEventBudget;
  activeMutexGroupsToday?: string[];
  seed: string;
}

export function selectEvent(input: EventSelectionInput): EventDefinition | null {
  const stress = calculateStress(input.state);

  const eligible = input.candidateEvents.filter((event) => {
    // Check budget allowance
    if (!input.budget.canTrigger(event.urgency, stress)) {
      return false;
    }

    // Check mutex groups
    if (
      event.mutexGroup &&
      input.activeMutexGroupsToday?.includes(event.mutexGroup)
    ) {
      return false;
    }

    const count = input.state.director.campaignEventsTriggered[event.id] ?? 0;

    // Check max per run
    if (event.maxPerRun !== undefined && count >= event.maxPerRun) {
      return false;
    }

    // Check cooldown
    const lastDay = input.state.director.lastEventDay[event.id];
    if (
      lastDay !== undefined &&
      event.cooldownDays !== undefined &&
      input.state.campaign.day - lastDay < event.cooldownDays
    ) {
      return false;
    }

    // Check custom state conditions
    if (
      event.conditions &&
      !event.conditions.every((c) => evaluateCondition(c, input.state))
    ) {
      return false;
    }

    return true;
  });

  if (eligible.length === 0) {
    return null;
  }

  // Calculate weighted probabilities with repetition penalty
  const weightedList = eligible.map((event) => {
    const count = input.state.director.campaignEventsTriggered[event.id] ?? 0;
    const baseWeight = event.weight ?? 10;
    const repetitionPenalty = 1 + count * 0.5;
    const effectiveWeight = Math.max(1, baseWeight / repetitionPenalty);
    return { event, weight: effectiveWeight };
  });

  const totalWeight = weightedList.reduce((sum, item) => sum + item.weight, 0);

  const rng = createSeededRandom(
    `${input.seed}::selectEvent::${input.state.campaign.day}::${input.budget.eventsTriggeredToday}`
  );
  let roll = rng.next() * totalWeight;

  for (const item of weightedList) {
    if (roll < item.weight) {
      return item.event;
    }
    roll -= item.weight;
  }

  return weightedList[weightedList.length - 1]?.event ?? null;
}
