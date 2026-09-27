export interface CustomerProfile {
  id: string;
  name: string;
  archetype: "worker" | "office" | "student" | "neighbor" | "regular";
  preferredRecipes: string[];
  basePatienceMs: number;
  tipMultiplier: number;
}

export const day1CustomerPool: CustomerProfile[] = [
  {
    id: "cust-hung",
    name: "Anh Hùng Xe Ôm",
    archetype: "worker",
    preferredRecipes: ["com-suon", "com-thit-nuong", "com-suon-cha"],
    basePatienceMs: 35_000,
    tipMultiplier: 1.0,
  },
  {
    id: "cust-lan",
    name: "Chị Lan Văn Phòng",
    archetype: "office",
    preferredRecipes: ["com-suon-trung", "com-suon-bi-cha", "com-dac-biet"],
    basePatienceMs: 28_000,
    tipMultiplier: 1.2,
  },
  {
    id: "cust-ba",
    name: "Bác Ba Tổ Trưởng",
    archetype: "neighbor",
    preferredRecipes: ["com-suon", "com-suon-bi", "com-suon-bi-cha-trung"],
    basePatienceMs: 40_000,
    tipMultiplier: 1.1,
  },
  {
    id: "cust-nam",
    name: "Nam Sinh Viên",
    archetype: "student",
    preferredRecipes: ["com-suon", "com-thit-nuong"],
    basePatienceMs: 32_000,
    tipMultiplier: 0.9,
  },
  {
    id: "cust-nam-tho",
    name: "Chú Năm Thợ Hồ",
    archetype: "worker",
    preferredRecipes: ["com-suon-bi-cha", "com-suon-bi-cha-trung"],
    basePatienceMs: 36_000,
    tipMultiplier: 1.0,
  },
];
