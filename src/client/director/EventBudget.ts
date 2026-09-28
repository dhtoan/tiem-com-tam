import type { Difficulty } from "../../shared/types/core";
import type { EventUrgency } from "../../shared/types/events";

export class DailyEventBudget {
  public day: number;
  public difficulty: Difficulty;
  public maxEvents: number;
  public eventsTriggeredToday: number = 0;
  public hasMajorTriggered: boolean = false;

  constructor(day: number, difficulty: Difficulty) {
    this.day = day;
    this.difficulty = difficulty;
    switch (difficulty) {
      case "easy":
        this.maxEvents = 1;
        break;
      case "normal":
        this.maxEvents = 2;
        break;
      case "hard":
        this.maxEvents = 3;
        break;
      default:
        this.maxEvents = 2;
        break;
    }
  }

  public canTrigger(urgency: EventUrgency, currentStress: number): boolean {
    if (this.eventsTriggeredToday >= this.maxEvents) {
      return false;
    }

    const isMajor = urgency === "high" || urgency === "critical";

    if (isMajor && this.hasMajorTriggered) {
      return false;
    }

    // High stress suppresses major disruption events to prevent death spirals
    if (isMajor && currentStress >= 70) {
      return false;
    }

    return true;
  }

  public consume(urgency: EventUrgency): void {
    this.eventsTriggeredToday++;
    if (urgency === "high" || urgency === "critical") {
      this.hasMajorTriggered = true;
    }
  }
}

export function createDailyEventBudget(
  day: number,
  difficulty: Difficulty
): DailyEventBudget {
  return new DailyEventBudget(day, difficulty);
}
