import type { EventDefinition } from "../../../shared/types/events";
import { DIALOGUE_DAY_01_10 } from "../dialogue/day01-10";

export const STORY_EVENTS_DAY_01_10: EventDefinition[] = [
  {
    id: "story-day-01-bet",
    category: "story",
    title: "Khai Trương & Kèo 30 Ngày",
    description: DIALOGUE_DAY_01_10["story.day01.bet.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day1-accept-bet",
        label: "Quyết tâm nhận kèo 30 ngày!",
        description: "Bắt đầu hành trình gầy dựng tiệm cơm tấm với sự giúp đỡ của JD.",
        consequences: [
          { type: "familyTrust", delta: 5 },
          { type: "husbandConfidence", delta: 5 },
          { type: "flag", key: "story_day1_bet_accepted", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-02-jd-first-day",
    category: "story",
    title: "Ngày Làm Việc Đầu Tiên Của JD",
    description: DIALOGUE_DAY_01_10["story.day02.jd.intro"]!,
    urgency: "low",
    timeBehavior: "pause",
    choices: [
      {
        id: "day2-guide-jd",
        label: "Chỉ bảo JD tận tình cách phục vụ",
        description: "Giúp JD học hỏi và tăng tốc làm quen với công việc.",
        consequences: [
          { type: "jdXp", delta: 25 },
          { type: "jdMood", delta: 10 },
          { type: "flag", key: "story_day2_guided_jd", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-03-first-regular",
    category: "story",
    title: "Vị Khách Quen Đầu Tiên",
    description: DIALOGUE_DAY_01_10["story.day03.regular.intro"]!,
    urgency: "low",
    timeBehavior: "pause",
    choices: [
      {
        id: "day3-welcome-bac-ba",
        label: "Tặng thêm miếng chả trứng thơm lừng",
        description: "Gây ấn tượng đẹp với vị tổ trưởng dân phố.",
        consequences: [
          { type: "trust", delta: 8 },
          { type: "reputation", delta: 0.15 },
          { type: "stock", ingredientId: "egg_meatloaf", quantity: -1 },
          { type: "flag", key: "story_day3_welcomed_regular", value: true },
        ],
      },
      {
        id: "day3-serve-standard",
        label: "Phục vụ đúng chuẩn theo giá niêm yết",
        description: "Giữ đúng định lượng bán hàng của tiệm.",
        consequences: [
          { type: "trust", delta: 3 },
          { type: "flag", key: "story_day3_standard_regular", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-04-pork-price-rise",
    category: "story",
    title: "Biến Động Giá Thị Trường",
    description: DIALOGUE_DAY_01_10["story.day04.pork.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day4-absorb-cost",
        label: "Chấp nhận chịu lãi ít, giữ nguyên giá bán",
        description: "Giữ chân khách hàng và nâng cao uy tín trong khu phố.",
        consequences: [
          { type: "trust", delta: 6 },
          { type: "reputation", delta: 0.1 },
          { type: "flag", key: "story_day4_strategy", value: "absorb" },
        ],
      },
      {
        id: "day4-raise-price",
        label: "Tạm tăng giá dĩa cơm thêm 3.000đ",
        description: "Bảo toàn biên lợi nhuận để chuẩn bị trả nợ.",
        consequences: [
          { type: "trust", delta: -4 },
          { type: "flag", key: "story_day4_strategy", value: "raise" },
        ],
      },
    ],
  },
  {
    id: "story-day-05-husband-profit-check",
    category: "story",
    title: "Lợi Nhuận Ở Đâu?",
    description: DIALOGUE_DAY_01_10["story.day05.husband.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day5-explain-cashflow",
        label: "Giải thích dòng tiền tái đầu tư vào nguyên liệu",
        description: "Chứng minh định hướng kinh doanh bền vững của Joy.",
        consequences: [
          { type: "husbandConfidence", delta: 8 },
          { type: "familyTrust", delta: 5 },
          { type: "flag", key: "story_day5_explained", value: true },
        ],
      },
      {
        id: "day5-promise-milestone",
        label: "Hứa sẽ chuẩn bị đủ tiền kỳ hạn Day 10",
        description: "Tạo niềm tin bằng cam kết hoàn thành mục tiêu nợ.",
        consequences: [
          { type: "husbandConfidence", delta: 5 },
          { type: "flag", key: "story_day5_promised", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-06-suspicious-person",
    category: "story",
    title: "Ánh Mắt Nghi Vấn",
    description: DIALOGUE_DAY_01_10["story.day06.suspicious.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day6-shout-warning",
        label: "Hô lớn mời khách vào bàn để gây chú ý",
        description: "Nhắc nhở nhẹ nhàng khiến kẻ gian biết mình đã bị lộ.",
        consequences: [
          { type: "trust", delta: 3 },
          { type: "flag", key: "story_day6_detected_early", value: true },
        ],
      },
      {
        id: "day6-jd-observe",
        label: "Nhờ JD đứng ở góc quầy quan sát an toàn",
        description: "JD theo dõi từ xa, không va chạm thể chất nguy hiểm.",
        consequences: [
          { type: "jdXp", delta: 20 },
          { type: "flag", key: "story_day6_jd_observed", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-07-weekend-rush",
    category: "story",
    title: "Giờ Cao Điểm Cuối Tuần",
    description: DIALOGUE_DAY_01_10["story.day07.rush.intro"]!,
    urgency: "medium",
    timeBehavior: "pause",
    choices: [
      {
        id: "day7-motivate-team",
        label: "Cùng JD tập trung cao độ ra món nhanh",
        description: "Giữ vững chất lượng dĩa cơm dù khách đông.",
        consequences: [
          { type: "reputation", delta: 0.2 },
          { type: "jdStamina", delta: -15 },
          { type: "flag", key: "story_day7_rush_conquered", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-08-jd-role-assignment",
    category: "story",
    title: "Trợ Thủ Đảm Đương",
    description: DIALOGUE_DAY_01_10["story.day08.role.intro"]!,
    urgency: "low",
    timeBehavior: "pause",
    choices: [
      {
        id: "day8-trust-jd",
        label: "Tin tưởng giao quyền cho JD thử sức",
        description: "Tăng sự gắn kết và lòng tin giữa Joy và JD.",
        consequences: [
          { type: "jdMood", delta: 15 },
          { type: "jdXp", delta: 35 },
          { type: "flag", key: "story_day8_trusted_jd", value: true },
        ],
      },
    ],
  },
  {
    id: "story-day-09-market-warning",
    category: "story",
    title: "Trữ Hàng Hay Giữ Tiền?",
    description: DIALOGUE_DAY_01_10["story.day09.warning.intro"]!,
    urgency: "high",
    timeBehavior: "pause",
    choices: [
      {
        id: "day9-stockpile",
        label: "Nhập thêm thịt trữ trước biến động",
        description: "Đảm bảo nguồn cung nhưng giảm tiền mặt sẵn có cho Day 10.",
        consequences: [
          { type: "stock", ingredientId: "pork_chop", quantity: 15 },
          { type: "cash", amount: -150_000 },
          { type: "flag", key: "story_day9_choice", value: "stockpile" },
        ],
      },
      {
        id: "day9-reserve-cash",
        label: "Giữ tiền mặt để sẵn sàng cho kỳ hạn trả nợ",
        description: "Ưu tiên hoàn thành cột mốc 20% nợ của chồng.",
        consequences: [
          { type: "husbandConfidence", delta: 5 },
          { type: "flag", key: "story_day9_choice", value: "reserve" },
        ],
      },
    ],
  },
  {
    id: "story-day-10-milestone-1",
    category: "story",
    title: "Cột Mốc 20% Nợ",
    description: DIALOGUE_DAY_01_10["story.day10.milestone.title"]!,
    urgency: "critical",
    timeBehavior: "pause",
    choices: [
      {
        id: "day10-pay-full",
        label: "Thanh toán đầy đủ 20% đợt 1 (1.000.000đ)",
        description: "Chồng gật đầu hài lòng, mối quan hệ gia đình cởi mở hơn.",
        consequences: [
          { type: "cash", amount: -1_000_000 },
          { type: "husbandConfidence", delta: 20 },
          { type: "familyTrust", delta: 15 },
          { type: "flag", key: "story_day10_milestone_passed", value: true },
        ],
      },
      {
        id: "day10-ask-extension",
        label: "Xin khất nợ sang kỳ tới vì cần vốn xoay vòng",
        description: "Chồng thở dài khó chịu nhưng tiệm vẫn tiếp tục hoạt động.",
        consequences: [
          { type: "husbandConfidence", delta: -25 },
          { type: "familyTrust", delta: -10 },
          { type: "missedInstallment", count: 1 },
          { type: "flag", key: "story_day10_milestone_delayed", value: true },
        ],
      },
    ],
  },
];
