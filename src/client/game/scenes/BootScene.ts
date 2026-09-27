import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    // Generate programmatic fallback textures for vertical slice
    this.createFallbackTextures();
  }

  create(): void {
    this.scene.start("StallScene");
  }

  private createFallbackTextures(): void {
    // Plate texture
    const plateGraphics = this.make.graphics({ x: 0, y: 0 });
    plateGraphics.fillStyle(0xfaf3e8, 1);
    plateGraphics.fillCircle(40, 40, 38);
    plateGraphics.lineStyle(3, 0xd47a60, 0.8);
    plateGraphics.strokeCircle(40, 40, 36);
    plateGraphics.generateTexture("plate", 80, 80);

    // Rice texture
    const riceGraphics = this.make.graphics({ x: 0, y: 0 });
    riceGraphics.fillStyle(0xffffff, 1);
    riceGraphics.fillCircle(25, 25, 24);
    riceGraphics.generateTexture("food-rice", 50, 50);

    // Suon raw, cooking-a, ready-to-flip, cooking-b, perfect, overcooked, burnt
    const suonColors: Record<string, number> = {
      "suon-raw": 0xdc6868,
      "suon-cooking-a": 0xc05040,
      "suon-ready-to-flip": 0xa84230,
      "suon-cooking-b": 0x943220,
      "suon-perfect": 0xb84b12,
      "suon-overcooked": 0x5a2410,
      "suon-burnt": 0x221814,
    };

    for (const [key, color] of Object.entries(suonColors)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(color, 1);
      g.fillRoundedRect(0, 0, 70, 45, 8);
      g.lineStyle(2, 0x4a1e12, 0.8);
      g.strokeRoundedRect(0, 0, 70, 45, 8);
      g.generateTexture(key, 70, 45);
    }

    // Toppings textures: bi, cha-trung, trung-op-la, mo-hanh, do-chua, dua-leo
    const toppings: Array<{ id: string; color: number }> = [
      { id: "topping-bi", color: 0xdeb887 },
      { id: "topping-cha-trung", color: 0xf5c242 },
      { id: "topping-trung-op-la", color: 0xffffff },
      { id: "topping-mo-hanh", color: 0x2e8b57 },
      { id: "topping-do-chua", color: 0xff7f50 },
      { id: "topping-dua-leo", color: 0x90ee90 },
    ];

    for (const t of toppings) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(t.color, 1);
      g.fillCircle(18, 18, 16);
      g.generateTexture(t.id, 36, 36);
    }
  }
}
