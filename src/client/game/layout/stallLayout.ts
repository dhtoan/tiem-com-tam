import type { StationId } from "../../../shared/types/core";

export interface StationRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StallLayout {
  isMobile: boolean;
  viewportWidth: number;
  viewportHeight: number;
  stations: Record<StationId, StationRect>;
  desktopOrder: StationId[];
}

export function getStallLayout(viewportWidth: number, viewportHeight: number): StallLayout {
  const isMobile = viewportWidth < 768;

  // Base virtual world dimensions: 1280 x 720
  const _worldWidth = 1280;
  const _worldHeight = 720;

  // Desktop stall hierarchy:
  // - Left: charcoal grill
  // - Center: glass food display
  // - Right: rice / utensil station
  // - Bottom foreground: plating counter
  // - Top background: customers / queue
  const desktopStations: Record<StationId, StationRect> = {
    customers: {
      x: 200,
      y: 40,
      width: 880,
      height: 180,
    },
    grill: {
      x: 30,
      y: 220,
      width: 320,
      height: 280,
    },
    display: {
      x: 360,
      y: 200,
      width: 560,
      height: 300,
    },
    plating: {
      x: 240,
      y: 510,
      width: 800,
      height: 200,
    },
  };

  // If mobile, stations are focused anchor regions that can be navigated
  const mobileStations: Record<StationId, StationRect> = {
    customers: {
      x: 100,
      y: 30,
      width: 1080,
      height: 220,
    },
    grill: {
      x: 20,
      y: 200,
      width: 400,
      height: 480,
    },
    display: {
      x: 340,
      y: 190,
      width: 600,
      height: 480,
    },
    plating: {
      x: 200,
      y: 480,
      width: 880,
      height: 230,
    },
  };

  return {
    isMobile,
    viewportWidth,
    viewportHeight,
    stations: isMobile ? mobileStations : desktopStations,
    desktopOrder: ["grill", "display", "plating", "customers"],
  };
}
