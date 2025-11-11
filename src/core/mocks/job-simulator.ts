/**
 * Job Simulator
 * Simulates the research job that updates state stats progressively
 */

import type { StateStats } from "@/modules/dashboard/types";

export interface JobState {
  isRunning: boolean;
  startTime: number | null;
  progress: {
    [state: string]: {
      missingCasinos: number;
      pendingComparisons: number;
      casinosTracked: number;
      promotionsActive: number;
    };
  };
}

// Global job state (shared across requests)
// Note: In a real scenario, this would be stored in a database or cache
let jobState: JobState = {
  isRunning: false,
  startTime: null,
  progress: {
    NJ: {
      missingCasinos: 3,
      pendingComparisons: 8,
      casinosTracked: 12,
      promotionsActive: 45,
    },
    MI: {
      missingCasinos: 2,
      pendingComparisons: 12,
      casinosTracked: 15,
      promotionsActive: 52,
    },
    PA: {
      missingCasinos: 5,
      pendingComparisons: 15,
      casinosTracked: 18,
      promotionsActive: 67,
    },
    WV: {
      missingCasinos: 1,
      pendingComparisons: 4,
      casinosTracked: 8,
      promotionsActive: 28,
    },
  },
};

// Job duration in milliseconds (30 seconds for demo)
const JOB_DURATION_MS = 30000;

// Track the interval to prevent multiple intervals
let jobInterval: NodeJS.Timeout | null = null;

/**
 * Start the research job
 */
export function startJob(): void {
  if (jobState.isRunning) {
    console.log("[Job Simulator] ⚠️ Job is already running");
    return;
  }

  // Clear any existing interval
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
  }

  jobState.isRunning = true;
  jobState.startTime = Date.now();

  console.log("[Job Simulator] 🚀 Research job started");

  // Simulate job progress
  jobInterval = setInterval(() => {
    if (!jobState.isRunning) {
      if (jobInterval) {
        clearInterval(jobInterval);
        jobInterval = null;
      }
      return;
    }

    const elapsed = Date.now() - (jobState.startTime || 0);
    const progress = Math.min(elapsed / JOB_DURATION_MS, 1);

    // Update progress for each state
    Object.keys(jobState.progress).forEach((state) => {
      const stateProgress = jobState.progress[state];
      
      // Simulate finding new missing casinos
      const baseMissing = stateProgress.missingCasinos;
      const newMissing = Math.floor(baseMissing * (1 + progress * 0.5));
      stateProgress.missingCasinos = newMissing;

      // Simulate finding new comparisons
      const baseComparisons = stateProgress.pendingComparisons;
      const newComparisons = Math.floor(baseComparisons * (1 + progress * 0.8));
      stateProgress.pendingComparisons = newComparisons;

      // Simulate slight increases in tracked casinos and promotions
      stateProgress.casinosTracked = Math.floor(
        stateProgress.casinosTracked * (1 + progress * 0.1)
      );
      stateProgress.promotionsActive = Math.floor(
        stateProgress.promotionsActive * (1 + progress * 0.15)
      );
    });

    // Complete the job after duration
    if (progress >= 1) {
      stopJob();
      if (jobInterval) {
        clearInterval(jobInterval);
        jobInterval = null;
      }
    }
  }, 2000); // Update every 2 seconds
}

/**
 * Stop the research job
 */
export function stopJob(): void {
  if (!jobState.isRunning) {
    console.log("[Job Simulator] ⚠️ Job is not running");
    return;
  }

  jobState.isRunning = false;
  jobState.startTime = null;

  // Clear the interval
  if (jobInterval) {
    clearInterval(jobInterval);
    jobInterval = null;
  }

  console.log("[Job Simulator] ✅ Research job stopped");
}

/**
 * Get current job state
 */
export function getJobState(): JobState {
  return { ...jobState };
}

/**
 * Get state stats with current job progress
 */
export function getStateStatsWithJobProgress(
  baseStats: StateStats[]
): StateStats[] {
  const currentJobState = getJobState();

  return baseStats.map((stat) => {
    const stateAbbr = stat.state.Abbreviation;
    const progress = currentJobState.progress[stateAbbr];

    if (!progress) {
      return stat;
    }

    return {
      ...stat,
      status: currentJobState.isRunning ? "researching" : "idle",
      missingCasinos: progress.missingCasinos,
      pendingComparisons: progress.pendingComparisons,
      casinosTracked: progress.casinosTracked,
      promotionsActive: progress.promotionsActive,
      lastUpdated: new Date().toISOString(),
    };
  });
}

/**
 * Reset job state (useful for testing)
 */
export function resetJobState(): void {
  jobState = {
    isRunning: false,
    startTime: null,
    progress: {
      NJ: {
        missingCasinos: 3,
        pendingComparisons: 8,
        casinosTracked: 12,
        promotionsActive: 45,
      },
      MI: {
        missingCasinos: 2,
        pendingComparisons: 12,
        casinosTracked: 15,
        promotionsActive: 52,
      },
      PA: {
        missingCasinos: 5,
        pendingComparisons: 15,
        casinosTracked: 18,
        promotionsActive: 67,
      },
      WV: {
        missingCasinos: 1,
        pendingComparisons: 4,
        casinosTracked: 8,
        promotionsActive: 28,
      },
    },
  };
}

