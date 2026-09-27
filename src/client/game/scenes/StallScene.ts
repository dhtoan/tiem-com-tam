import Phaser from "phaser";
import { StationCamera } from "../camera/StationCamera";
import { getStallLayout, type StallLayout } from "../layout/stallLayout";
import { GrillInteraction } from "../interactions/GrillInteraction";
import { day1Recipes } from "../../data/day1Recipes";
import { day1CustomerPool } from "../../data/day1Customers";
import {
  createCustomerQueue,
  spawnCustomer,
  advanceCustomerQueue,
  serveCustomer,
  type CustomerQueueState,
} from "../systems/customers/customerQueue";
import type { PlateAssembly } from "../../../shared/types/orders";
import type { StationId } from "../../../shared/types/core";

export class StallScene extends Phaser.Scene {
  public stationCamera!: StationCamera;
  private currentLayout!: StallLayout;
  public grillInteraction!: GrillInteraction;
  public customerQueue: CustomerQueueState = createCustomerQueue();

  // Current plate assembly on counter
  public currentPlate: PlateAssembly = {
    rice: false,
    proteins: [],
    proteinCookQualities: {},
    toppings: [],
    sides: [],
  };

  private customerText?: Phaser.GameObjects.Text;
  private plateText?: Phaser.GameObjects.Text;
  private feedbackText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "StallScene" });
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    this.currentLayout = getStallLayout(width, height);
    this.stationCamera = new StationCamera(width, height, this.cameras.main);

    this.renderEnvironment(width, height);
    this.renderStations();
    this.setupInteractions();
    this.initDay1Queue();

    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.currentLayout = getStallLayout(gameSize.width, gameSize.height);
      this.stationCamera.updateViewport(gameSize.width, gameSize.height);
    });
  }

  private renderEnvironment(width: number, height: number): void {
    const bg = this.add.graphics();
    bg.fillStyle(0xedd8c0, 1);
    bg.fillRect(0, 0, width, height);

    bg.fillStyle(0x8c5338, 1);
    bg.fillRect(0, height * 0.45, width, height * 0.55);

    bg.fillStyle(0xa66547, 1);
    bg.fillRect(0, height * 0.45, width, 12);
  }

  private renderStations(): void {
    const { grill, display, plating, customers } = this.currentLayout.stations;

    // 1. Customer Area
    const custBg = this.add.graphics();
    custBg.fillStyle(0xddc4aa, 0.6);
    custBg.fillRoundedRect(customers.x, customers.y, customers.width, customers.height, 12);
    custBg.lineStyle(2, 0xbfa080, 0.8);
    custBg.strokeRoundedRect(customers.x, customers.y, customers.width, customers.height, 12);

    this.customerText = this.add.text(customers.x + 20, customers.y + 15, "Đang chuẩn bị đón khách...", {
      fontSize: "16px",
      color: "#3e2723",
      fontStyle: "bold",
    });

    // 2. Grill Station
    const grillG = this.add.graphics();
    grillG.fillStyle(0x383535, 1);
    grillG.fillRoundedRect(grill.x, grill.y, grill.width, grill.height, 10);
    grillG.fillStyle(0xc0392b, 0.8);
    grillG.fillRect(grill.x + 10, grill.y + 35, grill.width - 20, grill.height - 45);

    grillG.lineStyle(2, 0x1a1a1a, 0.9);
    for (let x = grill.x + 15; x < grill.x + grill.width - 10; x += 22) {
      grillG.lineBetween(x, grill.y + 35, x, grill.y + grill.height - 15);
    }

    this.add.text(grill.x + 12, grill.y + 10, "LÒ NƯỚNG SƯỜN", {
      fontSize: "13px",
      color: "#f5b041",
      fontStyle: "bold",
    });

    // Button to place raw meat on grill
    const addMeatBtn = this.add.text(grill.x + grill.width - 110, grill.y + 8, "+ Đặt Sườn", {
      fontSize: "12px",
      color: "#ffffff",
      backgroundColor: "#b84b12",
      padding: { x: 6, y: 4 },
    });
    addMeatBtn.setInteractive({ useHandCursor: true });
    addMeatBtn.on("pointerdown", () => {
      this.grillInteraction.placeItem("suon-heo");
    });

    this.grillInteraction = new GrillInteraction(this, grill.x + 15, grill.y + 40, 4);

    // 3. Center Display (Toppings)
    const dispG = this.add.graphics();
    dispG.fillStyle(0xd5e5eb, 0.4);
    dispG.fillRoundedRect(display.x, display.y, display.width, display.height, 8);
    dispG.lineStyle(3, 0x85929e, 0.9);
    dispG.strokeRoundedRect(display.x, display.y, display.width, display.height, 8);
    this.add.text(display.x + 16, display.y + 12, "TỦ KÍNH THỨC ĂN (NHẤP ĐỂ THÊM VÀO DĨA)", {
      fontSize: "13px",
      color: "#1f618d",
      fontStyle: "bold",
    });

    const displayItems: Array<{ id: string; name: string; x: number; y: number }> = [
      { id: "mo-hanh", name: "Mỡ hành", x: display.x + 30, y: display.y + 50 },
      { id: "do-chua", name: "Đồ chua", x: display.x + 140, y: display.y + 50 },
      { id: "dua-leo", name: "Dưa leo", x: display.x + 250, y: display.y + 50 },
      { id: "nuoc-mam", name: "Nước mắm", x: display.x + 360, y: display.y + 50 },
      { id: "bi-heo", name: "Bì heo", x: display.x + 30, y: display.y + 120 },
      { id: "cha-trung", name: "Chả trứng", x: display.x + 140, y: display.y + 120 },
      { id: "trung-ga", name: "Trứng ốp la", x: display.x + 250, y: display.y + 120 },
    ];

    for (const item of displayItems) {
      const btn = this.add.text(item.x, item.y, `[+ ${item.name}]`, {
        fontSize: "13px",
        color: "#faedcd",
        backgroundColor: "#5c3826",
        padding: { x: 8, y: 6 },
      });
      btn.setInteractive({ useHandCursor: true });
      btn.on("pointerdown", () => {
        if (item.id === "nuoc-mam") {
          if (!this.currentPlate.sides.includes("nuoc-mam")) {
            this.currentPlate.sides.push("nuoc-mam");
          }
        } else {
          if (!this.currentPlate.toppings.includes(item.id)) {
            this.currentPlate.toppings.push(item.id);
          }
        }
        this.updatePlateVisual();
      });
    }

    // 4. Plating Counter (Bottom)
    const plateG = this.add.graphics();
    plateG.fillStyle(0x5c3826, 0.9);
    plateG.fillRoundedRect(plating.x, plating.y, plating.width, plating.height, 12);
    plateG.lineStyle(2, 0xd4a373, 0.8);
    plateG.strokeRoundedRect(plating.x, plating.y, plating.width, plating.height, 12);

    this.add.text(plating.x + 20, plating.y + 10, "BÀN RA MÓN / PLATING COUNTER", {
      fontSize: "13px",
      color: "#faedcd",
      fontStyle: "bold",
    });

    // Rice button
    const riceBtn = this.add.text(plating.x + 20, plating.y + 40, "[🍚 Thêm Cơm Tấm]", {
      fontSize: "14px",
      color: "#ffffff",
      backgroundColor: "#2e7d32",
      padding: { x: 10, y: 6 },
    });
    riceBtn.setInteractive({ useHandCursor: true });
    riceBtn.on("pointerdown", () => {
      this.currentPlate.rice = true;
      this.updatePlateVisual();
    });

    // Clear plate button
    const clearBtn = this.add.text(plating.x + 180, plating.y + 40, "[🗑️ Dọn Dĩa Mới]", {
      fontSize: "14px",
      color: "#ffffff",
      backgroundColor: "#c0392b",
      padding: { x: 10, y: 6 },
    });
    clearBtn.setInteractive({ useHandCursor: true });
    clearBtn.on("pointerdown", () => {
      this.resetPlate();
    });

    // Plate contents text
    this.plateText = this.add.text(plating.x + 20, plating.y + 85, "Dĩa trống: Chưa có cơm hoặc thức ăn.", {
      fontSize: "14px",
      color: "#faedcd",
    });

    // Serve button
    const serveBtn = this.add.text(plating.x + plating.width - 160, plating.y + 40, "🍽️ GIAO MÓN", {
      fontSize: "16px",
      fontStyle: "bold",
      color: "#2b1810",
      backgroundColor: "#f5b041",
      padding: { x: 16, y: 10 },
    });
    serveBtn.setInteractive({ useHandCursor: true });
    serveBtn.on("pointerdown", () => {
      this.serveCurrentCustomer();
    });

    // Feedback text
    this.feedbackText = this.add.text(plating.x + 20, plating.y + 130, "", {
      fontSize: "14px",
      color: "#2ecc71",
      fontStyle: "bold",
    });
  }

  private setupInteractions(): void {
    // Listen for meat pickup from grill to plate
    this.events.on("grill:pickup", (item: any) => {
      this.currentPlate.proteins.push(item.proteinId);
      this.currentPlate.proteinCookQualities[item.proteinId] = item.quality;
      this.updatePlateVisual();
    });
  }

  private updatePlateVisual(): void {
    if (!this.plateText) return;
    const parts: string[] = [];
    if (this.currentPlate.rice) parts.push("Cơm tấm");
    if (this.currentPlate.proteins.length > 0) {
      parts.push(`Thịt: ${this.currentPlate.proteins.join(", ")}`);
    }
    if (this.currentPlate.toppings.length > 0) {
      parts.push(`Kèm: ${this.currentPlate.toppings.join(", ")}`);
    }
    if (this.currentPlate.sides.length > 0) {
      parts.push(`Nước mắm`);
    }

    this.plateText.setText(
      parts.length > 0 ? `Dĩa đang làm: ${parts.join(" + ")}` : "Dĩa trống: Chưa có cơm hoặc thức ăn."
    );
  }

  public resetPlate(): void {
    this.currentPlate = {
      rice: false,
      proteins: [],
      proteinCookQualities: {},
      toppings: [],
      sides: [],
    };
    this.updatePlateVisual();
  }

  private initDay1Queue(): void {
    // Spawn initial customers for Day 1
    for (let i = 0; i < 4; i++) {
      const profile = day1CustomerPool[i % day1CustomerPool.length]!;
      const recipe = day1Recipes["com-suon"]!;
      this.customerQueue = spawnCustomer(this.customerQueue, {
        customerId: `day1-${profile.id}-${i}`,
        customerName: profile.name,
        customerArchetype: profile.archetype,
        recipe,
        patienceMs: profile.basePatienceMs,
      });
    }
    this.updateCustomerDisplay();
  }

  private updateCustomerDisplay(): void {
    if (!this.customerText) return;
    const currentTicket = this.customerQueue.tickets.find((t) => t.state === "waiting");
    if (currentTicket) {
      const remainingSec = Math.ceil(currentTicket.patienceRemainingMs / 1000);
      this.customerText.setText(
        `👤 ${currentTicket.customerName} | Gọi món: ${currentTicket.order.name} | ⏳ Còn ${remainingSec}s`
      );
    } else {
      this.customerText.setText("🎉 Đã phục vụ hết khách của ca!");
      this.events.emit("service:completed");
    }
  }

  public serveCurrentCustomer(): void {
    const currentTicket = this.customerQueue.tickets.find((t) => t.state === "waiting");
    if (!currentTicket) {
      if (this.feedbackText) this.feedbackText.setText("Không có khách đang chờ!");
      return;
    }

    const { queue, score } = serveCustomer(this.customerQueue, currentTicket.customerId, this.currentPlate);
    this.customerQueue = queue;

    if (score.accepted) {
      if (this.feedbackText) {
        this.feedbackText.setColor("#2ecc71");
        this.feedbackText.setText(`✅ ${score.feedback} (+${(currentTicket.order.basePrice + (score.cookQuality >= 90 ? Math.round(currentTicket.order.basePrice * 0.1) : 0)).toLocaleString("vi-VN")}đ)`);
      }
      this.events.emit("customer:paid", currentTicket.order.basePrice + (score.cookQuality >= 90 ? Math.round(currentTicket.order.basePrice * 0.1) : 0));
      this.resetPlate();
    } else {
      if (this.feedbackText) {
        this.feedbackText.setColor("#e74c3c");
        this.feedbackText.setText(`❌ Khách không nhận: ${score.feedback}`);
      }
    }
    this.updateCustomerDisplay();
  }

  override update(_time: number, delta: number): void {
    if (this.grillInteraction) {
      this.grillInteraction.update(delta);
    }
    if (this.customerQueue) {
      this.customerQueue = advanceCustomerQueue(this.customerQueue, delta);
      this.updateCustomerDisplay();
    }
  }

  public focusStation(station: StationId): void {
    this.stationCamera.focus(station);
  }
}
