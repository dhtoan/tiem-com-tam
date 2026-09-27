import type { JDRole } from "./game-state";

export interface JDRoleInfo {
  role: JDRole;
  name: string;
  description: string;
  isSafe: true;
}

export const JD_SAFE_ROLES: Record<JDRole, JDRoleInfo> = {
  "shop-helper": {
    role: "shop-helper",
    name: "Phụ việc quán",
    description: "Lau dọn bàn ghế, xếp đũa muỗng, chuẩn bị đồ chua nước mắm.",
    isSafe: true,
  },
  "service-runner": {
    role: "service-runner",
    name: "Chạy bàn & Phục vụ",
    description: "Bưng dĩa cơm đã ra món giao tận bàn cho khách quen.",
    isSafe: true,
  },
  cashier: {
    role: "cashier",
    name: "Hỗ trợ thu ngân",
    description: "Đứng cạnh Joy phụ thối tiền lẻ, đếm tiền và đưa hoá đơn.",
    isSafe: true,
  },
  "camera-awareness": {
    role: "camera-awareness",
    name: "Quan sát an ninh",
    description: "Theo dõi màn hình camera, báo cho mẹ nếu thấy người lạ lén lút.",
    isSafe: true,
  },
  "family-support": {
    role: "family-support",
    name: "Hậu phương gia đình",
    description: "Gắn kết ba mẹ, động viên Joy những ngày buôn bán mệt mỏi.",
    isSafe: true,
  },
};
