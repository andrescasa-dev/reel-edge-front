"use client";

import { useEffect, useState } from "react";
import { isMockMode } from "@/core/mocks/config";

/**
 * MSWProvider
 * Client component that initializes MSW in the browser
 * Must be a client component because MSW requires browser APIs (window, service workers)
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      // Check environment
      const isDevelopment = process.env.NODE_ENV === "development";
      const mocksEnabled = isMockMode();

      console.log("[MSW] Initialization check:", {
        isDevelopment,
        mocksEnabled,
        envVar: process.env.NEXT_PUBLIC_ENABLE_MOCKS,
      });

      // Only run in development and if mocks are enabled
      if (!isDevelopment) {
        console.log("[MSW] Skipping - not in development mode");
        setMswReady(true);
        return;
      }

      if (!mocksEnabled) {
        console.warn(
          "[MSW] ⚠️ Mocks are disabled. Set NEXT_PUBLIC_ENABLE_MOCKS=true in .env.local to enable MSW"
        );
        setMswReady(true);
        return;
      }

      try {
        console.log("[MSW] Starting initialization...");
        // Dynamic import to exclude MSW from production bundle
        const { enableMocking } = await import("@/core/mocks/browser");
        await enableMocking();
        setMswReady(true);
      } catch (error) {
        console.error("[MSW] ❌ Failed to initialize:", error);
        setMswReady(true); // Continue anyway to not block the app
      }
    }

    initMSW();
  }, []);

  return <>{children}</>;
}
