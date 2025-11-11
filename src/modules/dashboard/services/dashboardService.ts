import { httpClient } from "@/core/services";
import type { DashboardStats, ResearchStatus } from "../types";

export const dashboardService = {
  getStateStats: () =>
    httpClient.get<DashboardStats>("/dashboard/state-stats"),

  updateResearchStatus: (action: "start" | "stop") =>
    httpClient.post<ResearchStatus>("/dashboard/research-status", { action }),
};

