import type { CookStage, GrillItemState } from "../../../../shared/types/cooking";

export function createGrillItem(proteinId: string, id?: string): GrillItemState {
  return {
    id: id ?? `grill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    proteinId,
    stage: "raw",
    heat: 1.0,
    sideAElapsedMs: 0,
    sideBElapsedMs: 0,
    flipCount: 0,
    quality: 100,
  };
}

export function advanceCook(
  item: GrillItemState,
  dtMs: number,
  heat: number = 1.0
): GrillItemState {
  if (item.stage === "burnt") {
    return { ...item, quality: 0 };
  }

  const effectiveDt = dtMs * (item.heat || 1.0) * heat;

  // Unflipped (Side A)
  if (item.flipCount === 0) {
    const sideA = item.sideAElapsedMs + effectiveDt;
    let stage: CookStage = item.stage;
    let quality = item.quality;

    if (sideA < 3000) {
      stage = "cooking-a";
    } else if (sideA < 6000) {
      stage = "ready-to-flip";
    } else if (sideA < 8500) {
      stage = "overcooked";
      quality = Math.max(30, 100 - Math.floor((sideA - 6000) / 40));
    } else {
      stage = "burnt";
      quality = 0;
    }

    return {
      ...item,
      sideAElapsedMs: sideA,
      stage,
      quality,
    };
  }

  // Flipped (Side B)
  const sideB = item.sideBElapsedMs + effectiveDt;
  let stage: CookStage = item.stage;
  let quality = item.quality;

  if (sideB < 3000) {
    stage = "cooking-b";
  } else if (sideB < 6000) {
    stage = "perfect";
    // If not damaged by early/late flip, keeps quality 100
  } else if (sideB < 8500) {
    stage = "overcooked";
    quality = Math.max(30, quality - Math.floor((sideB - 6000) / 50));
  } else {
    stage = "burnt";
    quality = 0;
  }

  return {
    ...item,
    sideBElapsedMs: sideB,
    stage,
    quality,
  };
}

export function flipCookItem(item: GrillItemState): GrillItemState {
  if (item.stage === "burnt") {
    return item;
  }

  // First flip
  if (item.flipCount === 0) {
    let quality = item.quality;
    if (item.stage !== "ready-to-flip") {
      // Premature or late flip penalty
      quality = Math.max(30, quality - 30);
    }
    return {
      ...item,
      flipCount: 1,
      stage: "cooking-b",
      quality,
    };
  }

  // Repeated invalid flips drop quality
  const newQuality = Math.max(10, item.quality - 15);
  return {
    ...item,
    flipCount: item.flipCount + 1,
    quality: newQuality,
  };
}
