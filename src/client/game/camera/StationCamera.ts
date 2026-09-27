import type Phaser from "phaser";
import type { StationId } from "../../../shared/types/core";
import { getStallLayout, type StallLayout } from "../layout/stallLayout";

export class StationCamera {
  private currentStation: StationId = "plating";
  private layout: StallLayout;
  private camera?: Phaser.Cameras.Scene2D.Camera;

  constructor(viewportWidth: number, viewportHeight: number, camera?: Phaser.Cameras.Scene2D.Camera) {
    this.layout = getStallLayout(viewportWidth, viewportHeight);
    this.camera = camera;
  }

  public setCamera(camera: Phaser.Cameras.Scene2D.Camera): void {
    this.camera = camera;
  }

  public updateViewport(width: number, height: number): void {
    this.layout = getStallLayout(width, height);
    if (!this.layout.isMobile) {
      this.resetToDesktop();
    } else {
      this.focus(this.currentStation);
    }
  }

  public focus(station: StationId): void {
    this.currentStation = station;
    if (!this.camera) return;

    if (!this.layout.isMobile) {
      this.resetToDesktop();
      return;
    }

    const rect = this.layout.stations[station];
    if (rect) {
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      this.camera.pan(centerX, centerY, 300, "Cubic.easeOut");
    }
  }

  public getCurrentStation(): StationId {
    return this.currentStation;
  }

  public resetToDesktop(): void {
    if (!this.camera) return;
    this.camera.pan(640, 360, 200, "Linear");
    this.camera.setZoom(1);
  }
}
