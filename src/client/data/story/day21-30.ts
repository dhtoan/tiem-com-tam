import type { EventDefinition } from "../../../shared/types/events";
import { DIALOGUE_DAY_21_30 } from "../dialogue/day21-30";

export const STORY_EVENTS_DAY_21_30: EventDefinition[] = [
  {
    id: "story-day-21-viral-surge",
    category: "story",
    title: "Tiếng Lành Đồn Xa",
    description: DIALOGUE_DAY_21_30["story.day21.viral.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day21-embrace-fame",
        label: "Mở rộng bếp than, chuẩn bị đón tiếp làn sóng thực khách",
        description: "Khách nườm nượp kéo tới trải nghiệm cơm tấm trứ danh.",
        consequences: [
          { type: "reputation", delta: 0.3 },
          { type: "trust", delta: 10 },
          { type: "flag", key: "story_day21_viral_success", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-22-jd-specialization",
    category: "story",
    title: "JD Đột Phá Kỹ Năng",
    description: DIALOGUE_DAY_21_30["story.day22.specialization.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day22-specialize-jd",
        label: "Công nhận JD là Quản lý Vận hành cốt cán",
        description: "Mở khóa tiềm năng tối đa và sự gắn kết bền chặt.",
        consequences: [
          { type: "jdXp", delta: 80 },
          { type: "jdMood", delta: 25 },
          { type: "familyTrust", delta: 10 },
          { type: "flag", key: "story_day22_jd_mastered", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-23-security-climax",
    category: "story",
    title: "Kẻ Gian Chuyên Nghiệp",
    description: DIALOGUE_DAY_21_30["story.day23.climax.intro"]!,
    urgency: "critical",
    timeBehavior: "pause",
    choices: [
      {
        id: "day23-deploy-defense",
        label: "Kích hoạt mạng lưới cảnh báo: Bảo vệ + Camera + Hàng xóm",
        description: "Phối hợp nhịp nhàng tóm gọn kẻ gian không tốn một giọt mồ hôi.",
        consequences: [
          { type: "trust", delta: 15 },
          { type: "reputation", delta: 0.2 },
          { type: "flag", key: "story_day23_thief_foiled", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-24-catering-opportunity",
    category: "story",
    title: "Đơn Tiệc Công Ty",
    description: DIALOGUE_DAY_21_30["story.day24.catering.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day24-accept-catering",
        label: "Nhận đơn 60 suất cơm giao đúng 11h30",
        description: "Tổng động viên toàn bộ năng suất, thu về lợi nhuận khủng.",
        consequences: [
          { type: "cash", amount: 600_000 },
          { type: "reputation", delta: 0.25 },
          { type: "flag", key: "story_day24_catering_completed", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-25-husband-helps",
    category: "story",
    title: "Đồng Lòng Gia Đình",
    description: DIALOGUE_DAY_21_30["story.day25.husband.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day25-accept-help",
        label: "Cười hạnh phúc trao muôi xới cơm cho chồng",
        description: "Gia đình hòa thuận, vợ chồng cùng chung tay xây dựng tổ ấm.",
        consequences: [
          { type: "husbandHelps", helps: true },
          { type: "familyTrust", delta: 25 },
          { type: "husbandConfidence", delta: 20 },
          { type: "flag", key: "story_day25_husband_joined", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-26-late-market-shock",
    category: "story",
    title: "Bão Giá Cuối Mùa",
    description: DIALOGUE_DAY_21_30["story.day26.marketshock.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day26-weather-shock",
        label: "Sử dụng nguồn dự trữ thông minh vượt qua bão giá",
        description: "Kinh nghiệm quản lý hàng tồn kho giúp tiệm đứng vững.",
        consequences: [
          { type: "reputation", delta: 0.15 },
          { type: "flag", key: "story_day26_shock_weathered", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-27-final-books-check",
    category: "story",
    title: "Sẵn Sàng Hạch Toán",
    description: DIALOGUE_DAY_21_30["story.day27.finalbooks.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day27-audit-books",
        label: "Tổng kết sổ thu chi chuẩn chỉnh, không một sai sót",
        description: "Cán bộ quản lý thị trường khen ngợi tiệm làm ăn mẫu mực.",
        consequences: [
          { type: "trust", delta: 10 },
          { type: "reputation", delta: 0.2 },
          { type: "flag", key: "story_day27_audit_passed", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-28-neighborhood-climax",
    category: "story",
    title: "Đoàn Kết Khu Phố",
    description: DIALOGUE_DAY_21_30["story.day28.neighborhood.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day28-rally-community",
        label: "Cảm ơn bà con khu phố đã luôn đồng hành và ủng hộ",
        description: "Tiệm cơm tấm trở thành linh hồn ấm áp của cả xóm nhỏ.",
        consequences: [
          { type: "trust", delta: 20 },
          { type: "reputation", delta: 0.25 },
          { type: "flag", key: "story_day28_neighborhood_love", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-29-final-strategy",
    category: "story",
    title: "Trước Giờ G",
    description: DIALOGUE_DAY_21_30["story.day29.strategy.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day29-final-planning",
        label: "Kiểm tra toàn bộ nguyên liệu, tinh thần sẵn sàng cho ngày 30",
        description: "Tất cả mọi người đều hào hứng chờ đón ngày kết thúc kèo.",
        consequences: [
          { type: "jdMood", delta: 20 },
          { type: "husbandConfidence", delta: 10 },
          { type: "flag", key: "story_day29_ready", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-30-finale",
    category: "story",
    title: "Đại Tiệc Cơm Tấm Sài Gòn",
    description: DIALOGUE_DAY_21_30["story.day30.finale.intro"]!,
    urgency: "critical",
    timeBehavior: "pause",
    choices: [
      {
        id: "day30-settle-final",
        label: "Thanh toán dứt điểm toàn bộ khoản nợ còn lại!",
        description: "Joy chính thức làm chủ tiệm cơm tấm Sài Gòn rạng rỡ!",
        consequences: [
          { type: "debt", delta: -100_000_000 },
          { type: "familyTrust", delta: 30 },
          { type: "husbandConfidence", delta: 30 },
          { type: "flag", key: "story_day30_resolved", value: true },
        ],
      },
      {
        id: "day30-incomplete-final",
        label: "Chỉ gom góp thanh toán được một phần nợ...",
        description: "Khoản nợ vẫn chưa thể dứt điểm trong 30 ngày.",
        consequences: [
          { type: "debt", delta: -1_000_000 },
          { type: "missedInstallment", count: 1 },
          { type: "husbandConfidence", delta: -20 },
          { type: "familyTrust", delta: -10 },
          { type: "flag", key: "story_day30_resolved", value: false },
        ],
      },
    ],
  },
];
