import { describe, it, expect } from "vitest";
import {
  recordJournalEntry,
  recordDecision,
  getEndingMontageEntries,
} from "../../src/client/campaign/journal";
import { createInitialState } from "../../src/client/state/createInitialState";
import type { JournalEntry, DecisionRecord } from "../../src/shared/types/journal";

describe("Campaign Journal, Decision Memory and Montage Data", () => {
  it("records journal entries in chronological order and prevents duplicates", () => {
    let state = createInitialState("normal", "journal-test");

    const entry1: JournalEntry = {
      id: "j-day1-open",
      day: 1,
      title: "Khai trương quán cơm",
      description: "Nhận kèo 30 ngày từ chồng.",
      category: "milestone",
      isMontageCandidate: true,
      timestamp: 1000,
    };

    const entry2: JournalEntry = {
      id: "j-day5-meeting",
      day: 5,
      title: "Họp gia đình đầu tiên",
      description: "Thuyết phục chồng về định hướng kinh doanh.",
      category: "family",
      isMontageCandidate: false,
      timestamp: 2000,
    };

    state = recordJournalEntry(state, entry1);
    state = recordJournalEntry(state, entry2);
    // Duplicate attempt
    state = recordJournalEntry(state, entry1);

    expect(state.campaign.journal?.length).toBe(2);
    expect(state.campaign.journal?.[0]?.id).toBe("j-day1-open");
    expect(state.campaign.journal?.[1]?.id).toBe("j-day5-meeting");
  });

  it("records player decisions and stores flags", () => {
    let state = createInitialState("normal", "decision-test");

    const decision: DecisionRecord = {
      eventId: "story-day-04-pork-price-rise",
      day: 4,
      choiceId: "day4-absorb-cost",
      choiceLabel: "Chấp nhận chịu lãi ít, giữ nguyên giá bán",
      timestamp: 1500,
    };

    state = recordDecision(state, decision);

    expect(state.campaign.decisions?.length).toBe(1);
    expect(state.campaign.decisions?.[0]?.choiceId).toBe("day4-absorb-cost");
    expect(state.campaign.flags["decision_story-day-04-pork-price-rise"]).toBe("day4-absorb-cost");
  });

  it("filters and selects top montage candidates for Day 30 ending montage", () => {
    let state = createInitialState("normal", "montage-test");

    const entries: JournalEntry[] = [
      {
        id: "m-1",
        day: 1,
        title: "Khai trương quán",
        description: "Bắt đầu kèo 30 ngày",
        category: "milestone",
        isMontageCandidate: true,
        timestamp: 100,
      },
      {
        id: "m-2",
        day: 10,
        title: "Cột mốc 20% nợ",
        description: "Thanh toán đợt đầu tiên thành công",
        category: "milestone",
        isMontageCandidate: true,
        timestamp: 200,
      },
      {
        id: "m-3",
        day: 14,
        title: "JD kiệt sức",
        description: "Cho JD nghỉ ngơi dưỡng sức",
        category: "jd",
        isMontageCandidate: true,
        timestamp: 300,
      },
      {
        id: "m-minor",
        day: 17,
        title: "Mua gia vị",
        description: "Mua thêm nước tương",
        category: "community",
        isMontageCandidate: false,
        timestamp: 400,
      },
      {
        id: "m-4",
        day: 25,
        title: "Chồng vào bếp phụ",
        description: "Gia đình đồng lòng",
        category: "family",
        isMontageCandidate: true,
        timestamp: 500,
      },
    ];

    entries.forEach((e) => {
      state = recordJournalEntry(state, e);
    });

    const montage = getEndingMontageEntries(state);
    expect(montage.length).toBe(4);
    expect(montage.some((e) => e.id === "m-minor")).toBe(false);
    expect(montage[0]?.id).toBe("m-1");
    expect(montage[3]?.id).toBe("m-4");
  });
});
