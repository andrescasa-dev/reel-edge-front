"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../services";
import type { ResearchStatus } from "../types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "state-stats"],
    queryFn: async () => {
      const response = await dashboardService.getStateStats();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch dashboard stats");
      }
      // Response data is DashboardStats { data: StateStats[], timestamp: string }
      // Return the full DashboardStats object
      return response.data;
    },
  });
}

export function useResearchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "start" | "stop") =>
      dashboardService.updateResearchStatus(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

