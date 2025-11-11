"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../services";
import type { DashboardStats } from "../types";

const POLLING_INTERVAL = 5000; // 5 seconds

export function useDashboardStats() {
  // Compute whether polling should be enabled based on research status
  const shouldPoll = (data: DashboardStats | undefined): boolean => {
    if (!data?.data) return false;
    return data.data.some((state) => state.status === "researching");
  };

  const query = useQuery({
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
    refetchInterval: (query) => {
      const data = query.state.data as DashboardStats | undefined;
      return shouldPoll(data) ? POLLING_INTERVAL : false;
    },
  });

  return query;
}

export function useResearchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: "start" | "stop") => {
      const response = await dashboardService.updateResearchStatus(action);
      if (!response.success) {
        throw new Error(response.error || "Failed to update research status");
      }
      return response.data;
    },
    onSuccess: (data, action) => {
      // Invalidate all dashboard queries to get fresh data immediately
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      // If stopping, optimistically update the cache to reflect "idle" status
      if (action === "stop") {
        queryClient.setQueriesData(
          { queryKey: ["dashboard", "state-stats"] },
          (oldData: DashboardStats | undefined) => {
            if (!oldData?.data) return oldData;

            return {
              ...oldData,
              data: oldData.data.map((state) => ({
                ...state,
                status: "idle" as const,
              })),
              timestamp: new Date().toISOString(),
            };
          }
        );

        // Also update the polling query
        queryClient.setQueriesData(
          { queryKey: ["dashboard", "state-stats", "polling"] },
          (oldData: DashboardStats | undefined) => {
            if (!oldData?.data) return oldData;

            return {
              ...oldData,
              data: oldData.data.map((state) => ({
                ...state,
                status: "idle" as const,
              })),
              timestamp: new Date().toISOString(),
            };
          }
        );
      }
    },
  });
}
