import type { SecurityUpgradeItem } from "../../shared/types/security";

export const securityUpgradesCatalog: Record<string, SecurityUpgradeItem> = {
  "safe-lock": {
    id: "safe-lock",
    name: "Khoá két sắt gia cố",
    cost: 250_000,
    type: "lock",
    scoreBonus: 15,
    description: "Ngăn chặn trộm tiền mặt nhanh tại quầy.",
  },
  "security-lighting": {
    id: "security-lighting",
    name: "Đèn chiếu sáng trước quán",
    cost: 350_000,
    type: "lighting",
    scoreBonus: 20,
    description: "Khu vực sáng sủa giúp dễ phát hiện người lạ lén lút.",
  },
  "camera-lv1": {
    id: "camera-lv1",
    name: "Camera an ninh cơ bản (Lv.1)",
    cost: 600_000,
    type: "camera",
    level: 1,
    scoreBonus: 25,
    description: "Quan sát khu vực trước bàn ăn và quầy tính tiền.",
  },
  "camera-lv2": {
    id: "camera-lv2",
    name: "Camera hồng ngoại góc rộng (Lv.2)",
    cost: 1_000_000,
    type: "camera",
    level: 2,
    scoreBonus: 40,
    description: "Nhìn rõ cả góc tối và ghi lại hình ảnh sắc nét.",
  },
  "camera-lv3": {
    id: "camera-lv3",
    name: "Hệ thống Camera AI thông minh (Lv.3)",
    cost: 1_600_000,
    type: "camera",
    level: 3,
    scoreBonus: 60,
    description: "Cảnh báo hành vi khả nghi theo thời gian thực.",
  },
};
