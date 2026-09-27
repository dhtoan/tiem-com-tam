import type { Difficulty } from "../../shared/types/core";
import type { GameState, DebtMilestone } from "../../shared/types/game-state";

export function createInitialState(difficulty: Difficulty, runSeed: string): GameState {
  let startingDebt = 30_000_000;
  let workingCash = 1_200_000;
  let milestones: DebtMilestone[] = [
    { day: 10, targetAmount: 6_000_000, paidAmount: 0, isPaid: false },
    { day: 20, targetAmount: 9_000_000, paidAmount: 0, isPaid: false },
    { day: 30, targetAmount: 15_000_000, paidAmount: 0, isPaid: false },
  ];

  if (difficulty === "easy") {
    startingDebt = 15_000_000;
    workingCash = 1_500_000;
    milestones = [
      { day: 10, targetAmount: 3_000_000, paidAmount: 0, isPaid: false },
      { day: 20, targetAmount: 4_500_000, paidAmount: 0, isPaid: false },
      { day: 30, targetAmount: 7_500_000, paidAmount: 0, isPaid: false },
    ];
  } else if (difficulty === "hard") {
    startingDebt = 50_000_000;
    workingCash = 1_000_000;
    milestones = [
      { day: 10, targetAmount: 10_000_000, paidAmount: 0, isPaid: false },
      { day: 20, targetAmount: 15_000_000, paidAmount: 0, isPaid: false },
      { day: 30, targetAmount: 25_000_000, paidAmount: 0, isPaid: false },
    ];
  }

  const now = Date.now();

  return {
    meta: {
      version: 1,
      runSeed,
      createdAt: now,
      updatedAt: now,
      saveRevision: 1,
    },
    campaign: {
      day: 1,
      phase: "morning",
      difficulty,
      completedDays: [],
      flags: {},
      isEndless: false,
    },
    economy: {
      shopCash: workingCash,
      debtReserve: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      upgrades: [],
    },
    debt: {
      originalDebt: startingDebt,
      remainingDebt: startingDebt,
      milestones,
      husbandConfidence: 50,
      missedInstallments: 0,
    },
    market: {
      day: 1,
      items: {},
      supplierId: "wholesale-regular",
    },
    inventory: {
      items: {
        "com-tam": 30,
        "suon-heo": 20,
        "thit-heo": 15,
        "bi-heo": 15,
        "cha-trung": 15,
        "trung-ga": 15,
        "mo-hanh": 25,
        "do-chua": 25,
        "dua-leo": 25,
        "ca-chua": 25,
        "nuoc-mam": 30,
      },
      batches: [],
    },
    customers: {
      queue: [],
      servedCount: 0,
      rejectedCount: 0,
      abandonedCount: 0,
    },
    cooking: {
      grillItems: [],
      grillCapacity: 4,
      plate: {
        rice: false,
        proteins: [],
        toppings: [],
        sides: [],
      },
    },
    jd: {
      level: 1,
      xp: 0,
      stamina: 100,
      mood: 100,
      trustWithJoy: 80,
      assignedRole: "shop-helper",
      specializationProgress: {
        "shop-helper": 0,
        "service-runner": 0,
        cashier: 0,
        "camera-awareness": 0,
        "family-support": 0,
      },
    },
    security: {
      securityScore: 20,
      cameraLevel: 0,
      hasLock: false,
      hasLighting: false,
      theftCount: 0,
      incidentHistory: [],
    },
    books: {
      bookAccuracy: 100,
      unrecordedTransactions: 0,
      actualBalance: workingCash,
      recordedBalance: workingCash,
      inspectionsPassed: 0,
    },
    neighborhood: {
      neighborhoodTrust: 50,
      communityLevel: 1,
      policeVisits: 0,
      localReputation: 50,
    },
    family: {
      familyTrust: 70,
      husbandConfidence: 50,
      husbandHelpsInStall: false,
      betAccepted: true,
    },
    reputation: {
      rating: 4.0,
      reviewCount: 5,
      cleanStreak: 1,
    },
    director: {
      dailyEventsTriggered: [],
      campaignEventsTriggered: {},
      lastEventDay: {},
      stressScore: 0,
      scheduledFollowUps: [],
    },
    journal: {
      entries: [
        {
          day: 1,
          title: "Khai trương quán Cơm Tấm",
          description: "Mượn tiền chồng bắt đầu kèo 30 ngày chứng minh tiệm cơm tấm thành công.",
          category: "milestone",
          timestamp: now,
        },
      ],
      decisions: {},
    },
    settings: {
      language: "vi",
      masterVolume: 0.8,
      musicVolume: 0.7,
      sfxVolume: 0.8,
      ambienceVolume: 0.6,
      uiVolume: 0.8,
      slowTimeMode: "standard",
      reducedMotion: false,
      activeOverlayId: undefined,
    },
  };
}
