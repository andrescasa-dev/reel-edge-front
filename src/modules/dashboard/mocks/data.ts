import type { DashboardStats, StateStats } from "../types";

export const mockStateStats: StateStats[] = [
  {
    state: { Abbreviation: "NJ", Name: "New Jersey" },
    casinosTracked: 12,
    promotionsActive: 45,
    missingCasinos: 3,
    pendingComparisons: 8,
    status: "idle",
    lastUpdated: new Date().toISOString(),
  },
  {
    state: { Abbreviation: "MI", Name: "Michigan" },
    casinosTracked: 15,
    promotionsActive: 52,
    missingCasinos: 2,
    pendingComparisons: 12,
    status: "researching",
    lastUpdated: new Date().toISOString(),
  },
  {
    state: { Abbreviation: "PA", Name: "Pennsylvania" },
    casinosTracked: 18,
    promotionsActive: 67,
    missingCasinos: 5,
    pendingComparisons: 15,
    status: "idle",
    lastUpdated: new Date().toISOString(),
  },
  {
    state: { Abbreviation: "WV", Name: "West Virginia" },
    casinosTracked: 8,
    promotionsActive: 28,
    missingCasinos: 1,
    pendingComparisons: 4,
    status: "idle",
    lastUpdated: new Date().toISOString(),
  },
];

export const mockDashboardStats: DashboardStats = {
  data: mockStateStats,
  timestamp: new Date().toISOString(),
};

