export type GuardId = "chu-tam" | "anh-hung" | "co-lan";

export type GuardShift = "morning" | "lunch" | "evening" | "full_day";

export interface GuardProfile {
  id: GuardId;
  name: string;
  shiftCost: number;
  detection: number; // 0-100
  speed: number; // 0-100
  intimidation: number; // 0-100
  customerCare: number; // 0-100
  reliability: number; // 0-100
  stamina: number; // 0-100
  comfortModifier: number; // impact on customer satisfaction/comfort (-1.0 to 1.0)
  description: string;
}

export interface GuardAttendanceInput {
  guardId: GuardId;
  day: number;
  shift: GuardShift;
  seed: number;
}

export interface GuardAttendanceResult {
  attended: boolean;
  late: boolean;
  effectiveDetection: number;
  comfortModifier: number;
  note: string;
}
