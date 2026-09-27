import type { OrderDefinition, PlateAssembly, ServeScore } from "../../../../shared/types/orders";

export function validatePlate(order: OrderDefinition, plate: PlateAssembly): ServeScore {
  let accuracy = 100;
  const issues: string[] = [];

  // 1. Rice check
  if (order.requiredRice && !plate.rice) {
    accuracy -= 40;
    issues.push("Thiếu cơm tấm");
  } else if (!order.requiredRice && plate.rice) {
    accuracy -= 20;
    issues.push("Thừa cơm");
  }

  // 2. Protein check
  for (const reqProtein of order.requiredProteins) {
    if (!plate.proteins.includes(reqProtein)) {
      accuracy -= Math.round(50 / order.requiredProteins.length);
      issues.push(`Thiếu món đạm: ${reqProtein}`);
    }
  }

  for (const extraProtein of plate.proteins) {
    if (!order.requiredProteins.includes(extraProtein)) {
      accuracy -= 20;
      issues.push(`Món đạm không yêu cầu: ${extraProtein}`);
    }
  }

  // 3. Toppings check
  for (const reqTopping of order.requiredToppings) {
    if (!plate.toppings.includes(reqTopping)) {
      accuracy -= Math.round(20 / Math.max(1, order.requiredToppings.length));
      issues.push(`Thiếu đồ ăn kèm: ${reqTopping}`);
    }
  }

  for (const extraTopping of plate.toppings) {
    if (!order.requiredToppings.includes(extraTopping)) {
      accuracy -= 5;
      issues.push(`Thừa đồ ăn kèm: ${extraTopping}`);
    }
  }

  // 4. Sides check
  for (const reqSide of order.requiredSides) {
    if (!plate.sides.includes(reqSide)) {
      accuracy -= 10;
      issues.push(`Thiếu chén nước mắm`);
    }
  }

  accuracy = Math.max(0, Math.min(100, accuracy));

  // 5. Cook quality check
  let cookQuality = 100;
  if (order.requiredProteins.length > 0) {
    const qualities: number[] = [];
    for (const p of plate.proteins) {
      const q = plate.proteinCookQualities[p] ?? 100;
      if (q === 0) {
        cookQuality = 0; // Burnt meat ruins the dish
        issues.push("Thịt nướng bị cháy đen!");
        break;
      }
      qualities.push(q);
    }
    if (cookQuality !== 0 && qualities.length > 0) {
      cookQuality = Math.round(qualities.reduce((a, b) => a + b, 0) / qualities.length);
    } else if (plate.proteins.length === 0) {
      cookQuality = 0;
    }
  }

  const speed = 90;
  const presentation = Math.max(50, Math.min(100, accuracy - 5));
  const accepted = accuracy >= 80 && cookQuality >= 40;

  const feedback = accepted
    ? cookQuality >= 90
      ? "Cơm sườn ngon xuất sắc, đúng chuẩn Sài Gòn!"
      : "Món ăn vừa miệng, phục vụ nhanh nhẹn."
    : issues.join(", ") || "Dĩa cơm chưa đạt yêu cầu.";

  return {
    accuracy,
    cookQuality,
    speed,
    presentation,
    accepted,
    feedback,
  };
}
