import type { DayPhase } from "../../shared/types/core";
import type { GameStore } from "../state/GameStore";
import type { OverlayManager } from "../ui/OverlayManager";
import { getCampaignDay } from "../data/campaignDays";
import { createMorningBriefElement } from "../ui/morning/MorningBrief";
import { createDaySummaryElement } from "../ui/daySummary/DaySummary";
import { saveLocal } from "../state/localSave";
import { resolveEnding } from "../director/EndingResolver";
import { ENDING_DEFINITIONS } from "../data/endings";
import { getEndingMontageEntries } from "./journal";
import { createEndingScreenElement } from "../ui/ending/EndingScreen";
import { transitionToEndless } from "../game/modes/EndlessMode";

export class DayRunner {
  private store: GameStore;
  private overlayManager: OverlayManager;
  private dayRevenue: number = 0;
  private dayExpenses: number = 0;
  private servedCount: number = 0;

  constructor(store: GameStore, overlayManager: OverlayManager) {
    this.store = store;
    this.overlayManager = overlayManager;
  }

  public startDay(day: number): void {
    const dayDef = getCampaignDay(day);

    this.dayRevenue = 0;
    this.dayExpenses = 0;
    this.servedCount = 0;

    this.store.dispatch((state) => ({
      ...state,
      campaign: {
        ...state.campaign,
        day: dayDef.day,
        phase: "morning",
      },
    }));

    // Auto-save at safe day start boundary
    saveLocal(this.store.getState());

    // Show Morning Brief
    const briefEl = createMorningBriefElement(this.store.getState(), {
      onStartDay: () => {
        this.overlayManager.close("morning-brief");
        this.setPhase("prep");
      },
    });

    this.overlayManager.open("morning-brief", briefEl, {
      closable: true,
      title: `Bản tin sáng ngày ${day}`,
    });
  }

  public setPhase(phase: DayPhase): void {
    this.store.dispatch((state) => ({
      ...state,
      campaign: {
        ...state.campaign,
        phase,
      },
    }));

    if (phase === "prep") {
      // In Day 1, prep transitions smoothly to service
      setTimeout(() => {
        this.setPhase("opening");
      }, 500);
    } else if (phase === "opening") {
      setTimeout(() => {
        this.setPhase("service");
      }, 500);
    } else if (phase === "closing") {
      setTimeout(() => {
        this.setPhase("books");
      }, 400);
    } else if (phase === "books") {
      setTimeout(() => {
        this.setPhase("family");
      }, 400);
    } else if (phase === "family") {
      setTimeout(() => {
        this.setPhase("summary");
      }, 400);
    } else if (phase === "summary") {
      this.showDaySummary();
    }
  }

  public recordSale(revenue: number): void {
    this.dayRevenue += revenue;
    this.servedCount += 1;
    this.store.dispatch((state) => ({
      ...state,
      economy: {
        ...state.economy,
        shopCash: state.economy.shopCash + revenue,
        totalRevenue: state.economy.totalRevenue + revenue,
      },
    }));
  }

  public recordExpense(expense: number): void {
    this.dayExpenses += expense;
    this.store.dispatch((state) => ({
      ...state,
      economy: {
        ...state.economy,
        shopCash: Math.max(0, state.economy.shopCash - expense),
        totalExpenses: state.economy.totalExpenses + expense,
      },
    }));
  }

  public endService(): void {
    this.setPhase("closing");
  }

  private showDaySummary(): void {
    const summaryEl = createDaySummaryElement(this.store.getState(), {
      dayRevenue: this.dayRevenue,
      dayExpenses: this.dayExpenses,
      servedCount: this.servedCount,
      onContinue: () => {
        this.overlayManager.close("day-summary");
        this.completeDay();
      },
    });

    this.overlayManager.open("day-summary", summaryEl, {
      closable: false,
      title: "Tổng kết ngày",
    });
  }

  public completeDay(): void {
    const currentDay = this.store.getState().campaign.day;
    this.store.dispatch((state) => ({
      ...state,
      campaign: {
        ...state.campaign,
        completedDays: [...state.campaign.completedDays, currentDay],
      },
      jd: {
        ...state.jd,
        xp: state.jd.xp + 15,
      },
    }));

    // Auto-save at day end
    saveLocal(this.store.getState());

    if (currentDay === 30 && !this.store.getState().campaign.isEndless) {
      this.showEndingScreen();
      return;
    }

    // Advance to next day
    this.startDay(currentDay + 1);
  }

  public showEndingScreen(): void {
    const state = this.store.getState();
    const endingId = resolveEnding(state);
    const endingDef = ENDING_DEFINITIONS[endingId];
    const montage = getEndingMontageEntries(state);

    const screenEl = createEndingScreenElement(endingDef, montage, () => {
      this.overlayManager.close("ending-screen");
      const nextState = transitionToEndless(this.store.getState(), endingId);
      this.store.dispatch(() => nextState);
      this.startDay(31);
    });

    this.overlayManager.open("ending-screen", screenEl, {
      closable: false,
      title: endingDef.title,
    });
  }
}
