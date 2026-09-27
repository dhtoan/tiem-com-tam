import type Phaser from "phaser";
import type { GrillItemState } from "../../../shared/types/cooking";
import { createGrillItem, advanceCook, flipCookItem } from "../systems/cooking/cookingModel";

export interface GrillSlot {
  x: number;
  y: number;
  item?: GrillItemState;
  sprite?: Phaser.GameObjects.Sprite;
  progressText?: Phaser.GameObjects.Text;
}

export class GrillInteraction {
  private scene: Phaser.Scene;
  private slots: GrillSlot[] = [];

  constructor(scene: Phaser.Scene, startX: number, startY: number, count: number = 4) {
    this.scene = scene;
    for (let i = 0; i < count; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      this.slots.push({
        x: startX + col * 85 + 40,
        y: startY + row * 65 + 40,
      });
    }
  }

  public placeItem(proteinId: string = "suon-heo"): GrillItemState | null {
    const emptySlot = this.slots.find((s) => !s.item);
    if (!emptySlot) return null;

    const item = createGrillItem(proteinId);
    emptySlot.item = item;

    // Create sprite for item
    const sprite = this.scene.add.sprite(emptySlot.x, emptySlot.y, `suon-${item.stage}`);
    sprite.setInteractive({ useHandCursor: true });
    sprite.on("pointerdown", () => {
      this.onItemClick(emptySlot);
    });

    emptySlot.sprite = sprite;

    const label = this.scene.add.text(emptySlot.x - 20, emptySlot.y + 25, item.stage, {
      fontSize: "10px",
      color: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.6)",
    });
    emptySlot.progressText = label;

    return item;
  }

  public onItemClick(slot: GrillSlot): void {
    if (!slot.item) return;

    if (slot.item.stage === "ready-to-flip") {
      slot.item = flipCookItem(slot.item);
      this.updateSlotVisual(slot);
    } else if (slot.item.stage === "perfect" || slot.item.stage === "overcooked") {
      // Pick up item to plate
      this.scene.events.emit("grill:pickup", slot.item);
      this.removeItem(slot);
    } else if (slot.item.stage === "burnt") {
      // Discard burnt meat
      this.scene.events.emit("grill:discard", slot.item);
      this.removeItem(slot);
    } else {
      // Premature flip
      slot.item = flipCookItem(slot.item);
      this.updateSlotVisual(slot);
    }
  }

  public removeItem(slot: GrillSlot): void {
    if (slot.sprite) {
      slot.sprite.destroy();
      slot.sprite = undefined;
    }
    if (slot.progressText) {
      slot.progressText.destroy();
      slot.progressText = undefined;
    }
    slot.item = undefined;
  }

  public update(dtMs: number, heat: number = 1.0): void {
    for (const slot of this.slots) {
      if (slot.item) {
        slot.item = advanceCook(slot.item, dtMs, heat);
        this.updateSlotVisual(slot);
      }
    }
  }

  private updateSlotVisual(slot: GrillSlot): void {
    if (!slot.item || !slot.sprite) return;
    const textureKey = `suon-${slot.item.stage}`;
    if (this.scene.textures.exists(textureKey)) {
      slot.sprite.setTexture(textureKey);
    }
    if (slot.progressText) {
      slot.progressText.setText(slot.item.stage);
    }
  }

  public getItems(): GrillItemState[] {
    return this.slots.filter((s) => s.item).map((s) => s.item!);
  }
}
