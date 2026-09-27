export interface UpgradeDefinition {
  id: string;
  name: string;
  cost: number;
  category: "kitchen" | "security" | "books" | "marketing";
  description: string;
  modifiers: Record<string, number>;
}

export const upgradesCatalog: Record<string, UpgradeDefinition> = {
  "grill-rack": {
    id: "grill-rack",
    name: "Vỉ nướng inox chống dính",
    cost: 650_000,
    category: "kitchen",
    description: "Tăng khoảng thời gian thịt đạt chất lượng hoàn hảo (perfect window +15%).",
    modifiers: { grillWindow: 0.15 },
  },
  "grill-lv2": {
    id: "grill-lv2",
    name: "Bếp than nâng cấp Lv.2",
    cost: 1_200_000,
    category: "kitchen",
    description: "Thêm 2 vị trí nướng trên lò và tăng tốc độ nướng chín đều 10%.",
    modifiers: { grillCapacity: 2, cookSpeed: 0.1 },
  },
  "rice-cooker-large": {
    id: "rice-cooker-large",
    name: "Nồi hấp cơm tấm 2 tầng",
    cost: 850_000,
    category: "kitchen",
    description: "Giữ cơm tấm luôn nóng hổi, thơm ngon suốt cả ngày.",
    modifiers: { riceCapacity: 20, riceQuality: 5 },
  },
  "prep-table": {
    id: "prep-table",
    name: "Bàn sơ chế inox lớn",
    cost: 700_000,
    category: "kitchen",
    description: "Tăng tốc độ ra món của Joy và JD thêm 15%.",
    modifiers: { prepSpeed: 0.15 },
  },
  "safe-lock": {
    id: "safe-lock",
    name: "Khoá két sắt gia cố",
    cost: 250_000,
    category: "security",
    description: "Giảm nguy cơ mất trộm tiền mặt trong quầy thu ngân.",
    modifiers: { securityScore: 15 },
  },
  "security-lighting": {
    id: "security-lighting",
    name: "Đèn chiếu sáng khu vực tiệm",
    cost: 350_000,
    category: "security",
    description: "Kẻ gian khó ẩn nấp, tăng khả năng phát hiện hành vi khả nghi thêm 20%.",
    modifiers: { detectionBonus: 20 },
  },
  "camera-lv1": {
    id: "camera-lv1",
    name: "Camera an ninh cơ bản",
    cost: 600_000,
    category: "security",
    description: "Quan sát khu vực trước tiệm, JD có thể theo dõi màn hình.",
    modifiers: { cameraLevel: 1, securityScore: 25 },
  },
  "cash-register": {
    id: "cash-register",
    name: "Máy tính tiền cơ học",
    cost: 450_000,
    category: "books",
    description: "Giảm sai sót tính tiền và ghi sổ của JD và Joy.",
    modifiers: { bookAccuracy: 10 },
  },
  "pos-terminal": {
    id: "pos-terminal",
    name: "Máy POS quẹt thẻ & QR",
    cost: 900_000,
    category: "books",
    description: "Khách trả tiền nhanh hơn, sổ sách tự động đối soát chính xác 98%.",
    modifiers: { bookAccuracy: 25, customerThroughput: 0.1 },
  },
};
