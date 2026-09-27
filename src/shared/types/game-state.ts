import type { Difficulty, DayPhase, Language } from "./core";

export interface MetaState {
  version: number;
  runSeed: string;
  createdAt: number;
  updatedAt: number;
  saveRevision: number;
}

export interface CampaignState {
  day: number;
  phase: DayPhase;
  difficulty: Difficulty;
  completedDays: number[];
  currentObjectiveId?: string;
  flags: Record<string, boolean | number | string>;
  isEndless: boolean;
  endlessDay?: number;
}

export interface EconomyState {
  shopCash: number;
  debtReserve: number;
  totalRevenue: number;
  totalExpenses: number;
  upgrades: string[];
}

export interface DebtMilestone {
  day: 10 | 20 | 30;
  targetAmount: number;
  paidAmount: number;
  isPaid: boolean;
}

export interface DebtState {
  originalDebt: number;
  remainingDebt: number;
  milestones: DebtMilestone[];
  husbandConfidence: number; // 0-100
  missedInstallments: number;
}

export interface MarketItem {
  id: string;
  currentPrice: number;
  basePrice: number;
  trend: "up" | "down" | "stable";
}

export interface MarketState {
  day: number;
  items: Record<string, MarketItem>;
  supplierId: string;
}

export interface InventoryBatch {
  id: string;
  ingredientId: string;
  quantity: number;
  dayPurchased: number;
  freshness: "fresh" | "okay" | "use-soon" | "spoiled";
}

export interface InventoryState {
  items: Record<string, number>;
  batches: InventoryBatch[];
}

export interface CustomerOrder {
  orderId: string;
  recipeId: string;
  components: string[];
  maxWaitTimeMs: number;
  timeRemainingMs: number;
}

export interface CustomerState {
  activeCustomerId?: string;
  queue: string[];
  servedCount: number;
  rejectedCount: number;
  abandonedCount: number;
}

export interface CookItem {
  id: string;
  proteinId: string;
  stage: "raw" | "cooking-a" | "ready-to-flip" | "cooking-b" | "perfect" | "overcooked" | "burnt";
  heat: number;
  elapsedMs: number;
  flipCount: number;
  quality: number;
}

export interface CookingState {
  grillItems: CookItem[];
  grillCapacity: number;
  plate: {
    rice: boolean;
    proteins: string[];
    toppings: string[];
    sides: string[];
  };
}

export type JDRole = "shop-helper" | "service-runner" | "cashier" | "camera-awareness" | "family-support";

export interface JDState {
  level: number;
  xp: number;
  stamina: number; // 0-100
  mood: number; // 0-100
  trustWithJoy: number; // 0-100
  assignedRole: JDRole;
  specializationProgress: Record<JDRole, number>;
}

export interface SecurityState {
  securityScore: number; // 0-100
  cameraLevel: number; // 0-3
  hasLock: boolean;
  hasLighting: boolean;
  activeGuardId?: string;
  theftCount: number;
  incidentHistory: string[];
}

export interface BooksState {
  bookAccuracy: number; // 0-100
  unrecordedTransactions: number;
  actualBalance: number;
  recordedBalance: number;
  inspectionsPassed: number;
}

export interface NeighborhoodState {
  neighborhoodTrust: number; // 0-100
  communityLevel: number;
  policeVisits: number;
  localReputation: number;
}

export interface FamilyState {
  familyTrust: number; // 0-100
  husbandConfidence: number; // 0-100
  husbandHelpsInStall: boolean;
  betAccepted: boolean;
}

export interface ReputationState {
  rating: number; // 0.0 - 5.0
  reviewCount: number;
  cleanStreak: number;
}

export interface DirectorState {
  dailyEventsTriggered: string[];
  campaignEventsTriggered: Record<string, number>;
  lastEventDay: Record<string, number>;
  stressScore: number;
  activeIncidentId?: string;
  scheduledFollowUps: Array<{
    id: string;
    targetDay: number;
    eventId: string;
  }>;
}

export interface JournalRecord {
  day: number;
  title: string;
  description: string;
  category: "milestone" | "incident" | "story" | "family";
  timestamp: number;
}

export interface JournalState {
  entries: JournalRecord[];
  decisions: Record<string, { choiceId: string; day: number }>;
}

export interface SettingsState {
  language: Language;
  masterVolume: number; // 0-1
  musicVolume: number;
  sfxVolume: number;
  ambienceVolume: number;
  uiVolume: number;
  slowTimeMode: "standard" | "extra-slow" | "auto-pause" | "no-timed";
  reducedMotion: boolean;
  activeOverlayId?: string;
}

export interface GameState {
  meta: MetaState;
  campaign: CampaignState;
  economy: EconomyState;
  debt: DebtState;
  market: MarketState;
  inventory: InventoryState;
  customers: CustomerState;
  cooking: CookingState;
  jd: JDState;
  security: SecurityState;
  books: BooksState;
  neighborhood: NeighborhoodState;
  family: FamilyState;
  reputation: ReputationState;
  director: DirectorState;
  journal: JournalState;
  settings: SettingsState;
}
