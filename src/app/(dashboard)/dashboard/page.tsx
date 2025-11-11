"use client";

import { useMemo } from "react";
import {
  DashboardHeader,
  CardSchedule,
  CardInsight,
  CardBreakdown,
} from "@/modules/dashboard";
import { useDashboardStats, useResearchStatus } from "@/modules/dashboard";
// Simple toast implementation
const showToast = (message: string) => {
  console.log("Toast:", message);
  // In a real app, you'd use a toast library like sonner or react-hot-toast
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const researchMutation = useResearchStatus();

  const totalStats = useMemo(() => {
    if (!stats?.data) return null;
    return stats.data.reduce(
      (acc, state) => ({
        casinosTracked: acc.casinosTracked + state.casinosTracked,
        promotionsActive: acc.promotionsActive + state.promotionsActive,
        missingCasinos: acc.missingCasinos + (state.missingCasinos || 0),
        pendingComparisons:
          acc.pendingComparisons + (state.pendingComparisons || 0),
      }),
      {
        casinosTracked: 0,
        promotionsActive: 0,
        missingCasinos: 0,
        pendingComparisons: 0,
      }
    );
  }, [stats]);

  const handleRunSearch = async () => {
    try {
      const response = await researchMutation.mutateAsync("start");
      if (response.success && response.data) {
        showToast("Research started successfully");
      }
    } catch {
      showToast("Failed to start research. Please try again.");
    }
  };

  const handleScheduleToggle = (enabled: boolean) => {
    // This would typically update the schedule setting
    console.log("Schedule toggled:", enabled);
  };

  const isResearching =
    stats?.data?.some((state) => state.status === "researching") || false;

  const lastRun = useMemo(() => {
    if (stats?.timestamp) {
      return new Date(stats.timestamp);
    }
    // Fallback: use a fixed reference date
    return new Date("2024-01-01T00:00:00Z");
  }, [stats]);

  const nextRun = useMemo(() => {
    // Calculate next run: 24 hours after last run
    const baseTime = lastRun.getTime();
    return new Date(baseTime + 24 * 60 * 60 * 1000);
  }, [lastRun]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-muted rounded-lg" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <DashboardHeader
        title="Casino Research Dashboard"
        description="Monitor casino databases and promotions across NJ, MI, PA, and WV"
        onRunSearch={handleRunSearch}
        onScheduleToggle={handleScheduleToggle}
        scheduleEnabled={false}
        isResearching={isResearching || researchMutation.isPending}
      />

      <CardSchedule lastRun={lastRun} nextRun={nextRun} isScheduled={false} />

      {totalStats && (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <CardInsight
            title="Total Casinos"
            description="Across all states"
            value={totalStats.casinosTracked}
            valueDescription="Casinos tracked"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />
          <CardInsight
            title="Active Promotions"
            description="Currently tracked"
            value={totalStats.promotionsActive}
            valueDescription="Promotions active"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <CardInsight
            title="Missing Casinos"
            description="Casinos not in database"
            value={totalStats.missingCasinos}
            valueDescription="Found across all states"
            icon={
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            }
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">State Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stats?.data?.map((stateStat) => (
            <CardBreakdown
              key={stateStat.state.Abbreviation}
              state={stateStat.state}
              casinosTracked={stateStat.casinosTracked}
              promotionsActive={stateStat.promotionsActive}
              missingCasinos={stateStat.missingCasinos}
              pendingComparisons={stateStat.pendingComparisons}
              status={stateStat.status}
              lastUpdated={new Date(stateStat.lastUpdated)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
