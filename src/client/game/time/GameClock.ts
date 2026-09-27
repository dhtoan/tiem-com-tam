export type SlowTimeMode = "standard" | "extra-slow" | "auto-pause" | "no-timed";

export class GameClock {
  private scale: number = 1.0;
  private previousScale: number = 1.0;
  private slowMode: SlowTimeMode = "standard";

  public getScale(): number {
    return this.scale;
  }

  public setScale(scale: number): void {
    this.scale = Math.max(0.0, Math.min(10.0, scale));
  }

  public getScaledDelta(rawDtMs: number): number {
    return rawDtMs * this.scale;
  }

  public setSlowMode(mode: SlowTimeMode): void {
    this.slowMode = mode;
    switch (mode) {
      case "standard":
        this.setScale(0.30);
        break;
      case "extra-slow":
        this.setScale(0.15);
        break;
      case "auto-pause":
      case "no-timed":
        this.setScale(0.0);
        break;
    }
  }

  public getSlowMode(): SlowTimeMode {
    return this.slowMode;
  }

  public isPaused(): boolean {
    return this.scale === 0.0;
  }

  public pause(): void {
    if (this.scale > 0.0) {
      this.previousScale = this.scale;
    }
    this.scale = 0.0;
  }

  public resume(): void {
    this.scale = this.previousScale > 0.0 ? this.previousScale : 1.0;
  }
}
