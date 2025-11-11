"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardHeader,
  CardSchedule,
  CardInsight,
  CardBreakdown,
} from "@/modules/dashboard";
import { useResearchStatus } from "@/modules/dashboard";
import { dashboardService } from "@/modules/dashboard/services";
import { ResearchModal } from "@/modules/dashboard/components/ResearchModal/ResearchModal";
import { useToast } from "@/core/hooks/use-toast";
import type { DashboardStats } from "@/modules/dashboard/types";

const POLLING_INTERVAL = 5000; // 5 seconds

interface DashboardContentProps {
  initialStats: DashboardStats;
}

export function DashboardContent({ initialStats }: DashboardContentProps) {
  const router = useRouter();
  const researchMutation = useResearchStatus();
  const { toast } = useToast();
  const previousResearchStatusRef = useRef<boolean>(false);

  // Determine if research is active from initial stats
  const initialIsResearching =
    initialStats?.data?.some((state) => state.status === "researching") ||
    false;

  // Track if research was just started via mutation
  const [researchStarted, setResearchStarted] = useState(false);

  // Poll dashboard stats when research is active
  const { data: currentStats } = useQuery({
    queryKey: ["dashboard", "state-stats", "polling"],
    queryFn: async () => {
      const response = await dashboardService.getStateStats();
      return response;
    },
    enabled: initialIsResearching || researchStarted,
    refetchInterval: (query) => {
      const data = query.state.data as DashboardStats | undefined;
      const isResearching = data?.data?.some(
        (state) => state.status === "researching"
      );
      // Stop polling and reset flag when research completes
      if (!isResearching && researchStarted) {
        setResearchStarted(false);
      }
      return isResearching ? POLLING_INTERVAL : false;
    },
    initialData: initialStats,
  });

  // Use current stats if available, otherwise use initial stats
  const stats = currentStats || initialStats;

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

  const isResearching =
    stats?.data?.some((state) => state.status === "researching") || false;

  // Track research status changes to show toast when it completes
  useEffect(() => {
    const wasResearching = previousResearchStatusRef.current;
    const isCurrentlyResearching = isResearching;

    // If research just completed (was researching, now idle)
    if (wasResearching && !isCurrentlyResearching) {
      toast({
        title: "Research completed",
        description: "The research process has finished successfully.",
        variant: "success",
      });
      // Revalidate routes
      router.refresh();
    }

    previousResearchStatusRef.current = isCurrentlyResearching;
  }, [isResearching, toast, router]);

  const handleRunSearch = async () => {
    try {
      const action = isResearching ? "stop" : "start";
      const response = await researchMutation.mutateAsync(action);
      if (response) {
        // If starting research, enable polling
        if (action === "start") {
          setResearchStarted(true);
        } else {
          setResearchStarted(false);
        }
        // Refresh the page data without full reload
        router.refresh();
      }
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${
          isResearching ? "stop" : "start"
        } research. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleStopResearch = async () => {
    try {
      // Optimistically update the state to close the modal immediately
      // This will disable polling and close the modal
      setResearchStarted(false);

      // The mutation will optimistically update the cache via onSuccess callback
      await researchMutation.mutateAsync("stop");

      // Refresh to get server-side updated data
      router.refresh();
    } catch {
      // Revert optimistic update on error
      // Check if research is still active from stats
      const stillResearching = stats?.data?.some(
        (state) => state.status === "researching"
      );
      if (stillResearching) {
        setResearchStarted(true);
      }
      toast({
        title: "Error",
        description: "Failed to stop research. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <DashboardHeader
          title="Casino Research Dashboard"
          description="Monitor casino databases and promotions across NJ, MI, PA, and WV"
          onRunSearch={handleRunSearch}
          isResearching={isResearching}
          isPending={researchMutation.isPending || isResearching}
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

      <ResearchModal
        open={isResearching}
        onStop={handleStopResearch}
        isStopping={researchMutation.isPending}
      />
    </>
  );
}
