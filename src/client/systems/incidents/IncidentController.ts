import type { IncidentAction, IncidentEvent } from "../../../shared/types/incidents";
import type { GameClock } from "../../game/time/GameClock";
import type { OverlayManager } from "../../ui/OverlayManager";
import { createIncidentOverlay } from "../../ui/events/IncidentOverlay";

export class IncidentController {
  private clock: GameClock;
  private overlayManager: OverlayManager;
  private activeEvent: IncidentEvent | null = null;
  private savedScale: number = 1.0;

  constructor(clock: GameClock, overlayManager: OverlayManager) {
    this.clock = clock;
    this.overlayManager = overlayManager;
  }

  public start(
    event: IncidentEvent,
    actions: IncidentAction[],
    onChoose: (actionId: string) => void
  ): void {
    this.activeEvent = event;
    this.savedScale = this.clock.getScale();
    // Apply slow-time mode while incident is active
    this.clock.setSlowMode(this.clock.getSlowMode());

    const content = createIncidentOverlay(event, actions, (actionId) => {
      this.choose(actionId, onChoose);
    });

    this.overlayManager.open("incident-overlay", content, {
      title: event.title,
      closable: event.urgency === "low",
      onClose: () => {
        this.restoreClock();
        this.activeEvent = null;
      },
    });
  }

  public choose(actionId: string, callback?: (id: string) => void): void {
    if (!this.activeEvent) return;
    this.overlayManager.close("incident-overlay");
    this.restoreClock();
    this.activeEvent = null;
    if (callback) {
      callback(actionId);
    }
  }

  public cancelIfAllowed(): boolean {
    if (!this.activeEvent || this.activeEvent.urgency !== "low") {
      return false;
    }
    this.overlayManager.close("incident-overlay");
    this.restoreClock();
    this.activeEvent = null;
    return true;
  }

  public getActiveEvent(): IncidentEvent | null {
    return this.activeEvent;
  }

  private restoreClock(): void {
    this.clock.setScale(this.savedScale > 0 ? this.savedScale : 1.0);
  }
}
