import type { SupplierDefinition } from "../../shared/types/market";

export const suppliersCatalog: Record<string, SupplierDefinition> = {
  "wholesale-chobenthanh": {
    id: "wholesale-chobenthanh",
    name: "Mối sỉ Chợ Đầu Mối Bình Điền",
    archetype: "wholesale",
    costMultiplier: 0.88,
    qualityBonus: 0,
    description: "Giá sỉ rẻ nhất nhưng chất lượng từng đợt có thể biến động nhẹ.",
  },
  "regular-kimhang": {
    id: "regular-kimhang",
    name: "Lò mổ & Vựa Kim Hằng",
    archetype: "regular",
    costMultiplier: 1.0,
    qualityBonus: 5,
    description: "Nhà cung cấp quen thuộc của khu phố, giá cả ổn định và giao đúng giờ.",
  },
  "premium-organic": {
    id: "premium-organic",
    name: "Nông trại Thịt Sạch Ba Tri",
    archetype: "premium",
    costMultiplier: 1.25,
    qualityBonus: 15,
    description: "Sườn heo thảo mộc đạt chuẩn kiểm định, thịt ngọt mềm giúp tăng danh tiếng quán.",
  },
};
