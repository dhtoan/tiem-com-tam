import type { GuardId, GuardProfile } from "../../shared/types/guards";

export const GUARD_ROSTER: Record<GuardId, GuardProfile> = {
  "chu-tam": {
    id: "chu-tam",
    name: "Chú Tám",
    shiftCost: 160_000,
    detection: 60,
    speed: 50,
    intimidation: 30,
    customerCare: 80,
    reliability: 85,
    stamina: 70,
    comfortModifier: 0.05,
    description: "Bác bảo vệ hiền lành, nhiệt tình quen thuộc trong xóm. Chi phí vừa phải, được lòng khách hàng.",
  },
  "anh-hung": {
    id: "anh-hung",
    name: "Anh Hùng",
    shiftCost: 280_000,
    detection: 85,
    speed: 90,
    intimidation: 85,
    customerCare: 40,
    reliability: 90,
    stamina: 90,
    comfortModifier: -0.10,
    description: "Cựu vệ sĩ cơ bắp, phản xạ cực nhanh nhưng mặt lạnh lùng làm khách hơi e dè.",
  },
  "co-lan": {
    id: "co-lan",
    name: "Cô Lan",
    shiftCost: 380_000,
    detection: 95,
    speed: 80,
    intimidation: 65,
    customerCare: 90,
    reliability: 98,
    stamina: 95,
    comfortModifier: 0.02,
    description: "Nữ vệ sĩ chuyên nghiệp, mắt quan sát tinh tường, chu đáo và kỷ luật thép.",
  },
};

export function getGuardById(id: string): GuardProfile | undefined {
  if (id in GUARD_ROSTER) {
    return GUARD_ROSTER[id as GuardId];
  }
  return undefined;
}
