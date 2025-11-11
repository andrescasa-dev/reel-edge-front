"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Info, TrendingUp } from "lucide-react";
import {
  DashboardHeader,
  CardSchedule,
  CardInsight,
  CardBreakdown,
} from "@/modules/dashboard";
import { useResearchStatus } from "@/modules/dashboard";
import type { DashboardStats } from "@/modules/dashboard/types";

// Simple toast implementation
const showToast = (message: string) => {
  console.log("Toast:", message);
  // In a real app, you'd use a toast library like sonner or react-hot-toast
};

interface DashboardContentProps {
  initialStats: DashboardStats;
}

export function DashboardContent({ initialStats }: DashboardContentProps) {
  const router = useRouter();
  const researchMutation = useResearchStatus();

  const totalStats = useMemo(() => {
    if (!initialStats?.data) return null;
    return initialStats.data.reduce(
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
  }, [initialStats]);

  const handleRunSearch = async () => {
    try {
      const action = isResearching ? "stop" : "start";
      const response = await researchMutation.mutateAsync(action);
      if (response) {
        showToast(
          action === "start"
            ? "Research started successfully"
            : "Research stopped successfully"
        );
        // Refresh the page data without full reload
        router.refresh();
      }
    } catch {
      showToast(
        `Failed to ${
          isResearching ? "stop" : "start"
        } research. Please try again.`
      );
    }
  };

  const handleScheduleToggle = (enabled: boolean) => {
    // This would typically update the schedule setting
    console.log("Schedule toggled:", enabled);
  };

  const isResearching =
    initialStats?.data?.some((state) => state.status === "researching") ||
    false;

  const lastRun = useMemo(() => {
    if (initialStats?.timestamp) {
      return new Date(initialStats.timestamp);
    }
    // Fallback: use a fixed reference date
    return new Date("2024-01-01T00:00:00Z");
  }, [initialStats]);

  const nextRun = useMemo(() => {
    // Calculate next run: 24 hours after last run
    const baseTime = lastRun.getTime();
    return new Date(baseTime + 24 * 60 * 60 * 1000);
  }, [lastRun]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <DashboardHeader
        title="Casino Research Dashboard"
        description="Monitor casino databases and promotions across NJ, MI, PA, and WV"
        onRunSearch={handleRunSearch}
        onScheduleToggle={handleScheduleToggle}
        scheduleEnabled={false}
        isResearching={isResearching}
        isPending={researchMutation.isPending}
      />

      <CardSchedule lastRun={lastRun} nextRun={nextRun} isScheduled={false} />

      {totalStats && (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <CardInsight
            title="Total Casinos"
            description="Across all states"
            value={totalStats.casinosTracked}
            valueDescription="Casinos tracked"
            icon={<Info className="h-5 w-5" stroke="#FF6900" />}
          />
          <CardInsight
            title="Active Promotions"
            description="Currently tracked"
            value={totalStats.promotionsActive}
            valueDescription="Promotions active"
            icon={<TrendingUp className="h-5 w-5" stroke="#00C950" />}
          />
          <CardInsight
            title="Missing Casinos"
            description="Casinos not in database"
            value={totalStats.missingCasinos}
            valueDescription="Found across all states"
            icon={<TrendingUp className="h-5 w-5" stroke="#2B7FFF" />}
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">State Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {initialStats?.data?.map((stateStat) => (
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
