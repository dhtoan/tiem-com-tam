import type { EventDefinition } from "../../../shared/types/events";
import { DIALOGUE_DAY_11_20 } from "../dialogue/day11-20";

export const STORY_EVENTS_DAY_11_20: EventDefinition[] = [
  {
    id: "story-day-11-neighborhood-visit",
    category: "story",
    title: "Đại Diện Khu Phố Ghé Thăm",
    description: DIALOGUE_DAY_11_20["story.day11.visit.intro"]!,
    urgency: "low",
    timeBehavior: "pause",
    choices: [
      {
        id: "day11-welcome-officer",
        label: "Niềm nở đón tiếp và lắng nghe hướng dẫn an ninh",
        description: "Gắn kết chặt chẽ với lực lượng trật tự khu phố.",
        consequences: [
          { type: "trust", delta: 10 },
          { type: "reputation", delta: 0.1 },
          { type: "flag", key: "story_day11_officer_welcomed", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-12-missing-item",
    category: "story",
    title: "Chiếc Ví Bị Thất Lạc",
    description: DIALOGUE_DAY_11_20["story.day12.missing.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day12-investigate",
        label: "Cùng JD kiểm tra kỹ gầm bàn và hỏi hàng xóm",
        description: "Tìm thấy chiếc ví bị rơi kẹt bên hông ghế!",
        consequences: [
          { type: "trust", delta: 12 },
          { type: "reputation", delta: 0.2 },
          { type: "flag", key: "story_day12_wallet_found", value: true },
        ],
      },
      {
        id: "day12-support-customer",
        label: "Động viên khách và hỗ trợ tiền xe về nhà",
        description: "Thể hiện tấm lòng hào sảng của tiệm cơm Sài Gòn.",
        consequences: [
          { type: "cash", amount: -50_000 },
          { type: "trust", delta: 15 },
          { type: "reputation", delta: 0.25 },
          { type: "flag", key: "story_day12_customer_supported", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-13-guard-vs-camera",
    category: "story",
    title: "Nâng Cấp An Ninh",
    description: DIALOGUE_DAY_11_20["story.day13.security.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day13-choose-guard",
        label: "Thuê Chú Tám bảo vệ (Chi phí mỗi ca trực)",
        description: "Có người thực tế túc dắt xe và trông coi an toàn.",
        consequences: [
          { type: "trust", delta: 8 },
          { type: "flag", key: "story_day13_guard_chosen", value: "guard" },
        ],
      },
      {
        id: "day13-choose-camera",
        label: "Lắp đặt hệ thống camera an ninh quan sát",
        description: "Đầu tư một lần, ghi hình liên tục suốt ngày đêm.",
        consequences: [
          { type: "cash", amount: -200_000 },
          { type: "trust", delta: 5 },
          { type: "unlockUpgrade", upgradeId: "camera_system" },
          { type: "flag", key: "story_day13_guard_chosen", value: "camera" },
        ],
      },
    ],
  },
  {
    id: "story-day-14-jd-exhaustion",
    category: "story",
    title: "Nghỉ Ngơi Hay Cố Gắng?",
    description: DIALOGUE_DAY_11_20["story.day14.exhaustion.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day14-rest-jd",
        label: "Bảo JD nghỉ ngơi dưỡng sức ngay hôm nay",
        description: "Đặt sức khỏe người thân lên trên doanh số.",
        consequences: [
          { type: "jdStamina", delta: 75 },
          { type: "jdMood", delta: 40 },
          { type: "familyTrust", delta: 10 },
          { type: "flag", key: "story_day14_jd_rested", value: true },
        ],
      },
      {
        id: "day14-push-through",
        label: "Pha cho JD ly sữa đá và bảo cố thêm một chút",
        description: "Tiếp tục duy trì năng suất tối đa.",
        consequences: [
          { type: "jdStamina", delta: -10 },
          { type: "jdMood", delta: -20 },
          { type: "flag", key: "story_day14_jd_pushed", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-15-midpoint-review",
    category: "story",
    title: "KPI 5 Ngày Của Chồng",
    description: DIALOGUE_DAY_11_20["story.day15.midpoint.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day15-accept-kpi",
        label: "Tự tin nhận thử thách tăng trưởng của chồng",
        description: "Khẳng định bản lĩnh bà chủ tiệm cơm tấm.",
        consequences: [
          { type: "husbandConfidence", delta: 10 },
          { type: "familyTrust", delta: 5 },
          { type: "flag", key: "story_day15_kpi_accepted", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-16-competitor-discount",
    category: "story",
    title: "Cuộc Chiến Giá",
    description: DIALOGUE_DAY_11_20["story.day16.competitor.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day16-focus-quality",
        label: "Giữ vững chất lượng: Thịt dày, ướp đậm đà, nước mắm kẹo",
        description: "Khách sành ăn sẽ luôn chọn món ngon thực chất.",
        consequences: [
          { type: "reputation", delta: 0.25 },
          { type: "trust", delta: 5 },
          { type: "flag", key: "story_day16_strategy", value: "quality" },
        ],
      },
      {
        id: "day16-match-discount",
        label: "Tung chương trình tặng canh chua miễn phí",
        description: "Hút khách bằng ưu đãi cạnh tranh sòng phẳng.",
        consequences: [
          { type: "cash", amount: -80_000 },
          { type: "reputation", delta: 0.1 },
          { type: "flag", key: "story_day16_strategy", value: "promo" },
        ],
      },
    ],
  },
  {
    id: "story-day-17-operational-challenge",
    category: "story",
    title: "Thử Thách Vận Hành",
    description: DIALOGUE_DAY_11_20["story.day17.challenge.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day17-reinforce-stall",
        label: "Cùng JD chằng bạt che và kiểm soát lò nướng",
        description: "Bảo đảm lò sườn không bị tắt giữa giông bão.",
        consequences: [
          { type: "reputation", delta: 0.15 },
          { type: "trust", delta: 5 },
          { type: "jdXp", delta: 25 },
          { type: "flag", key: "story_day17_storm_overcome", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-18-book-inspection",
    category: "story",
    title: "Kiểm Tra Minh Bạch",
    description: DIALOGUE_DAY_11_20["story.day18.books.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day18-present-books",
        label: "Trình sổ sách hóa đơn chứng từ đầu vào đầu ra",
        description: "Cán bộ Nam kiểm tra kỹ lưỡng sự minh bạch của tiệm.",
        consequences: [
          { type: "trust", delta: 8 },
          { type: "reputation", delta: 0.1 },
          { type: "flag", key: "story_day18_books_inspected", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-19-husband-finance-debate",
    category: "story",
    title: "Tích Lũy Hay Mở Rộng?",
    description: DIALOGUE_DAY_11_20["story.day19.debate.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day19-keep-reserves",
        label: "Đồng ý giữ tiền mặt trong két phòng thủ",
        description: "Ưu tiên tuyệt đối thanh toán kỳ hạn nợ ngày mai.",
        consequences: [
          { type: "husbandConfidence", delta: 15 },
          { type: "familyTrust", delta: 10 },
          { type: "flag", key: "story_day19_choice", value: "reserve" },
        ],
      },
      {
        id: "day19-invest-equipment",
        label: "Quyết định nâng cấp quầy tủ kính giữ nhiệt",
        description: "Thuyết phục chồng bằng tầm nhìn kinh doanh dài hạn.",
        consequences: [
          { type: "cash", amount: -250_000 },
          { type: "husbandConfidence", delta: -5 },
          { type: "reputation", delta: 0.2 },
          { type: "unlockUpgrade", upgradeId: "heated_display" },
          { type: "flag", key: "story_day19_choice", value: "invest" },
        ],
      },
    ],
  },
  {
    id: "story-day-20-milestone-2",
    category: "story",
    title: "Cột Mốc 30% Nợ",
    description: DIALOGUE_DAY_11_20["story.day20.milestone.intro"]!,
    urgency: "critical",
    timeBehavior: "pause",
    choices: [
      {
        id: "day20-pay-full",
        label: "Thanh toán dứt điểm 30% đợt 2 (1.500.000đ)",
        description: "Chồng vô cùng bất ngờ và bắt đầu nể phục nghị lực của Joy.",
        consequences: [
          { type: "cash", amount: -1_500_000 },
          { type: "debt", delta: -1_500_000 },
          { type: "husbandConfidence", delta: 25 },
          { type: "familyTrust", delta: 20 },
          { type: "flag", key: "story_day20_milestone_passed", value: true },
        ],
      },
      {
        id: "day20-pay-partial",
        label: "Thanh toán một phần (500.000đ) và xin dồn lại đợt cuối",
        description: "Chồng lắc đầu không vui nhưng cho Joy thêm cơ hội cuối.",
        consequences: [
          { type: "cash", amount: -500_000 },
          { type: "debt", delta: -500_000 },
          { type: "husbandConfidence", delta: -15 },
          { type: "missedInstallment", count: 1 },
          { type: "flag", key: "story_day20_milestone_partial", value: true },
        ],
      },
    ],
  },
];
