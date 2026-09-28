export type CustomerArchetype =
  | 'worker'
  | 'office'
  | 'student'
  | 'neighbor'
  | 'regular'
  | 'courier'
  | 'elder'
  | 'gourmet'
  | 'tourist'
  | 'family';

export type CustomerMood = 'happy' | 'neutral' | 'waiting' | 'impatient' | 'angry' | 'delighted';

export const CUSTOMER_ARCHETYPES: CustomerArchetype[] = [
  'worker',
  'office',
  'student',
  'neighbor',
  'regular',
  'courier',
  'elder',
  'gourmet',
  'tourist',
  'family',
];

export const CUSTOMER_MOODS: CustomerMood[] = [
  'happy',
  'neutral',
  'waiting',
  'impatient',
  'angry',
  'delighted',
];

export interface CustomerVariant {
  id: string;
  archetype: CustomerArchetype;
  name: string;
  avatarKey: string;
  preferredRecipes: string[];
  basePatienceMs: number;
  tipMultiplier: number;
  moodSprites: Record<CustomerMood, string>;
}

export interface CommunityNPC {
  id: string;
  name: string;
  roleDescription: string;
  fictionalDisclaimer: boolean;
  avatarKey: string;
}

export const CUSTOMER_VARIANTS: CustomerVariant[] = [
  // 1. Worker (3 variants)
  {
    id: 'cust_worker_01',
    archetype: 'worker',
    name: 'Anh Hùng Xe Ôm',
    avatarKey: 'char_customer_worker_01',
    preferredRecipes: ['com-suon', 'com-thit-nuong', 'com-suon-cha'],
    basePatienceMs: 35_000,
    tipMultiplier: 1.0,
    moodSprites: {
      neutral: '/assets/customers/worker_01_neutral.png',
      happy: '/assets/customers/worker_01_happy.png',
      waiting: '/assets/customers/worker_01_neutral.png',
      impatient: '/assets/customers/worker_01_impatient.png',
      angry: '/assets/customers/worker_01_angry.png',
      delighted: '/assets/customers/worker_01_delighted.png',
    },
  },
  {
    id: 'cust_worker_02',
    archetype: 'worker',
    name: 'Chú Năm Thợ Hồ',
    avatarKey: 'char_customer_worker_02',
    preferredRecipes: ['com-suon-bi-cha', 'com-suon-bi-cha-trung'],
    basePatienceMs: 38_000,
    tipMultiplier: 1.0,
    moodSprites: {
      neutral: '/assets/customers/worker_02_neutral.png',
      happy: '/assets/customers/worker_02_happy.png',
      waiting: '/assets/customers/worker_02_neutral.png',
      impatient: '/assets/customers/worker_02_impatient.png',
      angry: '/assets/customers/worker_02_angry.png',
      delighted: '/assets/customers/worker_02_delighted.png',
    },
  },
  {
    id: 'cust_worker_03',
    archetype: 'worker',
    name: 'Anh Ba Bốc Xếp',
    avatarKey: 'char_customer_worker_03',
    preferredRecipes: ['com-suon-cha', 'com-tam-dai-gia'],
    basePatienceMs: 36_000,
    tipMultiplier: 1.05,
    moodSprites: {
      neutral: '/assets/customers/worker_03_neutral.png',
      happy: '/assets/customers/worker_03_happy.png',
      waiting: '/assets/customers/worker_03_neutral.png',
      impatient: '/assets/customers/worker_03_impatient.png',
      angry: '/assets/customers/worker_03_angry.png',
      delighted: '/assets/customers/worker_03_delighted.png',
    },
  },

  // 2. Office (3 variants)
  {
    id: 'cust_office_01',
    archetype: 'office',
    name: 'Chị Lan Kế Toán',
    avatarKey: 'char_customer_office_01',
    preferredRecipes: ['com-suon-trung', 'com-suon-bi-cha', 'com-dac-biet'],
    basePatienceMs: 28_000,
    tipMultiplier: 1.25,
    moodSprites: {
      neutral: '/assets/customers/office_01_neutral.png',
      happy: '/assets/customers/office_01_happy.png',
      waiting: '/assets/customers/office_01_neutral.png',
      impatient: '/assets/customers/office_01_impatient.png',
      angry: '/assets/customers/office_01_angry.png',
      delighted: '/assets/customers/office_01_delighted.png',
    },
  },
  {
    id: 'cust_office_02',
    archetype: 'office',
    name: 'Anh Minh Marketing',
    avatarKey: 'char_customer_office_02',
    preferredRecipes: ['com-suon-non', 'com-tam-suon-muoi-ot', 'com-tam-tau-hu-ky'],
    basePatienceMs: 26_000,
    tipMultiplier: 1.3,
    moodSprites: {
      neutral: '/assets/customers/office_02_neutral.png',
      happy: '/assets/customers/office_02_happy.png',
      waiting: '/assets/customers/office_02_neutral.png',
      impatient: '/assets/customers/office_02_impatient.png',
      angry: '/assets/customers/office_02_angry.png',
      delighted: '/assets/customers/office_02_delighted.png',
    },
  },
  {
    id: 'cust_office_03',
    archetype: 'office',
    name: 'Em Thảo Lập Trình Viên',
    avatarKey: 'char_customer_office_03',
    preferredRecipes: ['com-suon-bi-cha-trung', 'com-tam-ga-nuong'],
    basePatienceMs: 30_000,
    tipMultiplier: 1.2,
    moodSprites: {
      neutral: '/assets/customers/office_03_neutral.png',
      happy: '/assets/customers/office_03_happy.png',
      waiting: '/assets/customers/office_03_neutral.png',
      impatient: '/assets/customers/office_03_impatient.png',
      angry: '/assets/customers/office_03_angry.png',
      delighted: '/assets/customers/office_03_delighted.png',
    },
  },

  // 3. Student (3 variants)
  {
    id: 'cust_student_01',
    archetype: 'student',
    name: 'Nam Sinh Viên Bách Khoa',
    avatarKey: 'char_customer_student_01',
    preferredRecipes: ['com-suon', 'com-thit-nuong'],
    basePatienceMs: 32_000,
    tipMultiplier: 0.9,
    moodSprites: {
      neutral: '/assets/customers/student_01_neutral.png',
      happy: '/assets/customers/student_01_happy.png',
      waiting: '/assets/customers/student_01_neutral.png',
      impatient: '/assets/customers/student_01_impatient.png',
      angry: '/assets/customers/student_01_angry.png',
      delighted: '/assets/customers/student_01_delighted.png',
    },
  },
  {
    id: 'cust_student_02',
    archetype: 'student',
    name: 'Hoa Nữ Sinh Kinh Tế',
    avatarKey: 'char_customer_student_02',
    preferredRecipes: ['com-thit-nuong', 'com-suon-trung'],
    basePatienceMs: 34_000,
    tipMultiplier: 0.95,
    moodSprites: {
      neutral: '/assets/customers/student_02_neutral.png',
      happy: '/assets/customers/student_02_happy.png',
      waiting: '/assets/customers/student_02_neutral.png',
      impatient: '/assets/customers/student_02_impatient.png',
      angry: '/assets/customers/student_02_angry.png',
      delighted: '/assets/customers/student_02_delighted.png',
    },
  },
  {
    id: 'cust_student_03',
    archetype: 'student',
    name: 'Tuấn Học Sinh Cấp 3',
    avatarKey: 'char_customer_student_03',
    preferredRecipes: ['com-suon', 'com-suon-cha'],
    basePatienceMs: 35_000,
    tipMultiplier: 0.85,
    moodSprites: {
      neutral: '/assets/customers/student_03_neutral.png',
      happy: '/assets/customers/student_03_happy.png',
      waiting: '/assets/customers/student_03_neutral.png',
      impatient: '/assets/customers/student_03_impatient.png',
      angry: '/assets/customers/student_03_angry.png',
      delighted: '/assets/customers/student_03_delighted.png',
    },
  },

  // 4. Neighbor (3 variants)
  {
    id: 'cust_neighbor_01',
    archetype: 'neighbor',
    name: 'Bác Ba Tổ Trưởng',
    avatarKey: 'char_customer_neighbor_01',
    preferredRecipes: ['com-suon', 'com-suon-bi', 'com-suon-bi-cha-trung'],
    basePatienceMs: 42_000,
    tipMultiplier: 1.1,
    moodSprites: {
      neutral: '/assets/customers/neighbor_01_neutral.png',
      happy: '/assets/customers/neighbor_01_happy.png',
      waiting: '/assets/customers/neighbor_01_neutral.png',
      impatient: '/assets/customers/neighbor_01_impatient.png',
      angry: '/assets/customers/neighbor_01_angry.png',
      delighted: '/assets/customers/neighbor_01_delighted.png',
    },
  },
  {
    id: 'cust_neighbor_02',
    archetype: 'neighbor',
    name: 'Cô Sáu Tạp Hóa',
    avatarKey: 'char_customer_neighbor_02',
    preferredRecipes: ['com-suon-cha', 'com-tam-cha-cua'],
    basePatienceMs: 40_000,
    tipMultiplier: 1.15,
    moodSprites: {
      neutral: '/assets/customers/neighbor_02_neutral.png',
      happy: '/assets/customers/neighbor_02_happy.png',
      waiting: '/assets/customers/neighbor_02_neutral.png',
      impatient: '/assets/customers/neighbor_02_impatient.png',
      angry: '/assets/customers/neighbor_02_angry.png',
      delighted: '/assets/customers/neighbor_02_delighted.png',
    },
  },
  {
    id: 'cust_neighbor_03',
    archetype: 'neighbor',
    name: 'Dì Út Bán Trái Cây',
    avatarKey: 'char_customer_neighbor_03',
    preferredRecipes: ['com-suon-bi', 'com-suon-trung'],
    basePatienceMs: 45_000,
    tipMultiplier: 1.1,
    moodSprites: {
      neutral: '/assets/customers/neighbor_03_neutral.png',
      happy: '/assets/customers/neighbor_03_happy.png',
      waiting: '/assets/customers/neighbor_03_neutral.png',
      impatient: '/assets/customers/neighbor_03_impatient.png',
      angry: '/assets/customers/neighbor_03_angry.png',
      delighted: '/assets/customers/neighbor_03_delighted.png',
    },
  },

  // 5. Regular (3 variants)
  {
    id: 'cust_regular_01',
    archetype: 'regular',
    name: 'Anh Tấn Thợ Tiện',
    avatarKey: 'char_customer_regular_01',
    preferredRecipes: ['com-suon-bi-cha-trung', 'com-suon-dac-biet'],
    basePatienceMs: 38_000,
    tipMultiplier: 1.2,
    moodSprites: {
      neutral: '/assets/customers/regular_01_neutral.png',
      happy: '/assets/customers/regular_01_happy.png',
      waiting: '/assets/customers/regular_01_neutral.png',
      impatient: '/assets/customers/regular_01_impatient.png',
      angry: '/assets/customers/regular_01_angry.png',
      delighted: '/assets/customers/regular_01_delighted.png',
    },
  },
  {
    id: 'cust_regular_02',
    archetype: 'regular',
    name: 'Chị Mai Tiệm May',
    avatarKey: 'char_customer_regular_02',
    preferredRecipes: ['com-suon-bi-cha', 'com-tam-tau-hu-ky'],
    basePatienceMs: 36_000,
    tipMultiplier: 1.15,
    moodSprites: {
      neutral: '/assets/customers/regular_02_neutral.png',
      happy: '/assets/customers/regular_02_happy.png',
      waiting: '/assets/customers/regular_02_neutral.png',
      impatient: '/assets/customers/regular_02_impatient.png',
      angry: '/assets/customers/regular_02_angry.png',
      delighted: '/assets/customers/regular_02_delighted.png',
    },
  },
  {
    id: 'cust_regular_03',
    archetype: 'regular',
    name: 'Thầy Hưng Dạy Vẽ',
    avatarKey: 'char_customer_regular_03',
    preferredRecipes: ['com-suon-trung', 'com-tam-suon-cay-mac-khen'],
    basePatienceMs: 39_000,
    tipMultiplier: 1.2,
    moodSprites: {
      neutral: '/assets/customers/regular_03_neutral.png',
      happy: '/assets/customers/regular_03_happy.png',
      waiting: '/assets/customers/regular_03_neutral.png',
      impatient: '/assets/customers/regular_03_impatient.png',
      angry: '/assets/customers/regular_03_angry.png',
      delighted: '/assets/customers/regular_03_delighted.png',
    },
  },

  // 6. Courier (3 variants)
  {
    id: 'cust_courier_01',
    archetype: 'courier',
    name: 'Bảo Shipper Xanh',
    avatarKey: 'char_customer_courier_01',
    preferredRecipes: ['com-suon-hop', 'com-suon-bi-cha-hop'],
    basePatienceMs: 22_000,
    tipMultiplier: 1.35,
    moodSprites: {
      neutral: '/assets/customers/courier_01_neutral.png',
      happy: '/assets/customers/courier_01_happy.png',
      waiting: '/assets/customers/courier_01_neutral.png',
      impatient: '/assets/customers/courier_01_impatient.png',
      angry: '/assets/customers/courier_01_angry.png',
      delighted: '/assets/customers/courier_01_delighted.png',
    },
  },
  {
    id: 'cust_courier_02',
    archetype: 'courier',
    name: 'Đạt Shipper Cam',
    avatarKey: 'char_customer_courier_02',
    preferredRecipes: ['com-suon-bi-hop', 'com-suon-trung-hop'],
    basePatienceMs: 24_000,
    tipMultiplier: 1.3,
    moodSprites: {
      neutral: '/assets/customers/courier_02_neutral.png',
      happy: '/assets/customers/courier_02_happy.png',
      waiting: '/assets/customers/courier_02_neutral.png',
      impatient: '/assets/customers/courier_02_impatient.png',
      angry: '/assets/customers/courier_02_angry.png',
      delighted: '/assets/customers/courier_02_delighted.png',
    },
  },
  {
    id: 'cust_courier_03',
    archetype: 'courier',
    name: 'Hải Shipper Đỏ',
    avatarKey: 'char_customer_courier_03',
    preferredRecipes: ['com-suon-hop', 'com-dac-biet-hop'],
    basePatienceMs: 23_000,
    tipMultiplier: 1.3,
    moodSprites: {
      neutral: '/assets/customers/courier_03_neutral.png',
      happy: '/assets/customers/courier_03_happy.png',
      waiting: '/assets/customers/courier_03_neutral.png',
      impatient: '/assets/customers/courier_03_impatient.png',
      angry: '/assets/customers/courier_03_angry.png',
      delighted: '/assets/customers/courier_03_delighted.png',
    },
  },

  // 7. Elder (3 variants)
  {
    id: 'cust_elder_01',
    archetype: 'elder',
    name: 'Cụ Tư Đi Bộ Sáng',
    avatarKey: 'char_customer_elder_01',
    preferredRecipes: ['com-suon-cha', 'com-tam-tau-hu-ky'],
    basePatienceMs: 48_000,
    tipMultiplier: 1.05,
    moodSprites: {
      neutral: '/assets/customers/elder_01_neutral.png',
      happy: '/assets/customers/elder_01_happy.png',
      waiting: '/assets/customers/elder_01_neutral.png',
      impatient: '/assets/customers/elder_01_impatient.png',
      angry: '/assets/customers/elder_01_angry.png',
      delighted: '/assets/customers/elder_01_delighted.png',
    },
  },
  {
    id: 'cust_elder_02',
    archetype: 'elder',
    name: 'Bà Bảy Hưu Trí',
    avatarKey: 'char_customer_elder_02',
    preferredRecipes: ['com-suon-bi', 'com-tam-cha-cua'],
    basePatienceMs: 46_000,
    tipMultiplier: 1.1,
    moodSprites: {
      neutral: '/assets/customers/elder_02_neutral.png',
      happy: '/assets/customers/elder_02_happy.png',
      waiting: '/assets/customers/elder_02_neutral.png',
      impatient: '/assets/customers/elder_02_impatient.png',
      angry: '/assets/customers/elder_02_angry.png',
      delighted: '/assets/customers/elder_02_delighted.png',
    },
  },
  {
    id: 'cust_elder_03',
    archetype: 'elder',
    name: 'Ông Chín Cờ Tướng',
    avatarKey: 'char_customer_elder_03',
    preferredRecipes: ['com-suon-trung', 'com-suon-bi-cha-trung'],
    basePatienceMs: 50_000,
    tipMultiplier: 1.05,
    moodSprites: {
      neutral: '/assets/customers/elder_03_neutral.png',
      happy: '/assets/customers/elder_03_happy.png',
      waiting: '/assets/customers/elder_03_neutral.png',
      impatient: '/assets/customers/elder_03_impatient.png',
      angry: '/assets/customers/elder_03_angry.png',
      delighted: '/assets/customers/elder_03_delighted.png',
    },
  },

  // 8. Gourmet (3 variants)
  {
    id: 'cust_gourmet_01',
    archetype: 'gourmet',
    name: 'Hoàng Food Reviewer',
    avatarKey: 'char_customer_gourmet_01',
    preferredRecipes: ['com-tam-dai-gia', 'com-dac-biet', 'com-tam-suon-muoi-ot'],
    basePatienceMs: 25_000,
    tipMultiplier: 1.6,
    moodSprites: {
      neutral: '/assets/customers/gourmet_01_neutral.png',
      happy: '/assets/customers/gourmet_01_happy.png',
      waiting: '/assets/customers/gourmet_01_neutral.png',
      impatient: '/assets/customers/gourmet_01_impatient.png',
      angry: '/assets/customers/gourmet_01_angry.png',
      delighted: '/assets/customers/gourmet_01_delighted.png',
    },
  },
  {
    id: 'cust_gourmet_02',
    archetype: 'gourmet',
    name: 'Bếp Trưởng Khải',
    avatarKey: 'char_customer_gourmet_02',
    preferredRecipes: ['com-tam-suon-cay-mac-khen', 'com-tam-cha-cua'],
    basePatienceMs: 26_000,
    tipMultiplier: 1.5,
    moodSprites: {
      neutral: '/assets/customers/gourmet_02_neutral.png',
      happy: '/assets/customers/gourmet_02_happy.png',
      waiting: '/assets/customers/gourmet_02_neutral.png',
      impatient: '/assets/customers/gourmet_02_impatient.png',
      angry: '/assets/customers/gourmet_02_angry.png',
      delighted: '/assets/customers/gourmet_02_delighted.png',
    },
  },
  {
    id: 'cust_gourmet_03',
    archetype: 'gourmet',
    name: 'Nghệ Sĩ Hương Giang',
    avatarKey: 'char_customer_gourmet_03',
    preferredRecipes: ['com-tam-dai-gia', 'com-suon-non'],
    basePatienceMs: 27_000,
    tipMultiplier: 1.55,
    moodSprites: {
      neutral: '/assets/customers/gourmet_03_neutral.png',
      happy: '/assets/customers/gourmet_03_happy.png',
      waiting: '/assets/customers/gourmet_03_neutral.png',
      impatient: '/assets/customers/gourmet_03_impatient.png',
      angry: '/assets/customers/gourmet_03_angry.png',
      delighted: '/assets/customers/gourmet_03_delighted.png',
    },
  },

  // 9. Tourist (3 variants)
  {
    id: 'cust_tourist_01',
    archetype: 'tourist',
    name: 'Mark Khách Tây Balo',
    avatarKey: 'char_customer_tourist_01',
    preferredRecipes: ['com-dac-biet', 'com-suon-bi-cha-trung'],
    basePatienceMs: 35_000,
    tipMultiplier: 1.4,
    moodSprites: {
      neutral: '/assets/customers/tourist_01_neutral.png',
      happy: '/assets/customers/tourist_01_happy.png',
      waiting: '/assets/customers/tourist_01_neutral.png',
      impatient: '/assets/customers/tourist_01_impatient.png',
      angry: '/assets/customers/tourist_01_angry.png',
      delighted: '/assets/customers/tourist_01_delighted.png',
    },
  },
  {
    id: 'cust_tourist_02',
    archetype: 'tourist',
    name: 'Yuki Du Khách Tokyo',
    avatarKey: 'char_customer_tourist_02',
    preferredRecipes: ['com-suon-trung', 'com-tam-ga-nuong'],
    basePatienceMs: 36_000,
    tipMultiplier: 1.35,
    moodSprites: {
      neutral: '/assets/customers/tourist_02_neutral.png',
      happy: '/assets/customers/tourist_02_happy.png',
      waiting: '/assets/customers/tourist_02_neutral.png',
      impatient: '/assets/customers/tourist_02_impatient.png',
      angry: '/assets/customers/tourist_02_angry.png',
      delighted: '/assets/customers/tourist_02_delighted.png',
    },
  },
  {
    id: 'cust_tourist_03',
    archetype: 'tourist',
    name: 'Gia Đình Bác Bình Hà Nội',
    avatarKey: 'char_customer_tourist_03',
    preferredRecipes: ['com-dac-biet', 'com-suon-bi-cha'],
    basePatienceMs: 38_000,
    tipMultiplier: 1.3,
    moodSprites: {
      neutral: '/assets/customers/tourist_03_neutral.png',
      happy: '/assets/customers/tourist_03_happy.png',
      waiting: '/assets/customers/tourist_03_neutral.png',
      impatient: '/assets/customers/tourist_03_impatient.png',
      angry: '/assets/customers/tourist_03_angry.png',
      delighted: '/assets/customers/tourist_03_delighted.png',
    },
  },

  // 10. Family (3 variants) -> Total 28 variants
  {
    id: 'cust_family_01',
    archetype: 'family',
    name: 'Gia Đình Anh Tuấn',
    avatarKey: 'char_customer_family_01',
    preferredRecipes: ['com-dac-biet', 'com-suon-bi-cha-trung', 'com-tam-tau-hu-ky'],
    basePatienceMs: 33_000,
    tipMultiplier: 1.25,
    moodSprites: {
      neutral: '/assets/customers/family_01_neutral.png',
      happy: '/assets/customers/family_01_happy.png',
      waiting: '/assets/customers/family_01_neutral.png',
      impatient: '/assets/customers/family_01_impatient.png',
      angry: '/assets/customers/family_01_angry.png',
      delighted: '/assets/customers/family_01_delighted.png',
    },
  },
  {
    id: 'cust_family_02',
    archetype: 'family',
    name: 'Mẹ Con Chị Hạnh',
    avatarKey: 'char_customer_family_02',
    preferredRecipes: ['com-suon-trung', 'com-thit-nuong'],
    basePatienceMs: 31_000,
    tipMultiplier: 1.2,
    moodSprites: {
      neutral: '/assets/customers/family_02_neutral.png',
      happy: '/assets/customers/family_02_happy.png',
      waiting: '/assets/customers/family_02_neutral.png',
      impatient: '/assets/customers/family_02_impatient.png',
      angry: '/assets/customers/family_02_angry.png',
      delighted: '/assets/customers/family_02_delighted.png',
    },
  },
  {
    id: 'cust_family_03',
    archetype: 'family',
    name: 'Nhóm Bạn Trẻ Cuối Tuần',
    avatarKey: 'char_customer_family_03',
    preferredRecipes: ['com-tam-dai-gia', 'com-suon-non', 'com-dac-biet'],
    basePatienceMs: 32_000,
    tipMultiplier: 1.3,
    moodSprites: {
      neutral: '/assets/customers/family_03_neutral.png',
      happy: '/assets/customers/family_03_happy.png',
      waiting: '/assets/customers/family_03_neutral.png',
      impatient: '/assets/customers/family_03_impatient.png',
      angry: '/assets/customers/family_03_angry.png',
      delighted: '/assets/customers/family_03_delighted.png',
    },
  },
];

export const COMMUNITY_NPCS: CommunityNPC[] = [
  {
    id: 'npc_tax_officer',
    name: 'Cán Bộ Kiểm Tra Sổ Sách (Hư Cấu)',
    roleDescription: 'Thanh tra kiểm tra sổ sách kế toán định kỳ của phường.',
    fictionalDisclaimer: true,
    avatarKey: 'char_npc_tax_officer',
  },
  {
    id: 'npc_community_warden',
    name: 'Bảo Vệ Dân Phố Khu Phố (Hư Cấu)',
    roleDescription: 'Tuần tra trật tự an ninh đô thị và nhắc nhở lấn chiếm lòng lề đường.',
    fictionalDisclaimer: true,
    avatarKey: 'char_npc_community_warden',
  },
  {
    id: 'npc_hygiene_inspector',
    name: 'Đoàn Kiểm Tra ATVSTP (Hư Cấu)',
    roleDescription: 'Kiểm tra độ tươi sạch nguyên liệu và vệ sinh khu vực bếp nướng.',
    fictionalDisclaimer: true,
    avatarKey: 'char_npc_hygiene_inspector',
  },
];

const VARIANT_MAP = new Map<string, CustomerVariant>(
  CUSTOMER_VARIANTS.map(v => [v.id, v])
);

export function getCustomerVariant(id: string): CustomerVariant | undefined {
  return VARIANT_MAP.get(id);
}
