import { http, HttpResponse, type HttpHandler } from "msw";
import { mockDashboardStats } from "./data";
import { mockConfig } from "@/core/mocks/config";
import {
  startJob,
  stopJob,
  getStateStatsWithJobProgress,
} from "@/core/mocks/job-simulator";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const dashboardHandlers: HttpHandler[] = [
  http.get(`${API_BASE_URL}/dashboard/state-stats`, async ({ request }) => {
    console.log("[MSW] ✅ Intercepted GET /dashboard/state-stats");

    const delayTime =
      Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
      mockConfig.delayMin;
    await delay(delayTime);

    // Get stats with current job progress
    const statsWithProgress = getStateStatsWithJobProgress(
      mockDashboardStats.data
    );

    return HttpResponse.json(
      {
        IsSuccess: true,
        Data: {
          data: statsWithProgress,
          timestamp: new Date().toISOString(),
        },
        Error: undefined,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }),

  http.post(
    `${API_BASE_URL}/dashboard/research-status`,
    async ({ request }) => {
      console.log("[MSW] ✅ Intercepted POST /dashboard/research-status");

      const body = (await request.json()) as { action: "start" | "stop" };
      const delayTime =
        Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
        mockConfig.delayMin;
      await delay(delayTime);

      // Start or stop the job simulator
      if (body.action === "start") {
        startJob();
      } else {
        stopJob();
      }

      return HttpResponse.json(
        {
          IsSuccess: true,
          Data: {
            success: true,
            message: `Research ${
              body.action === "start" ? "started" : "stopped"
            } successfully`,
            status: body.action === "start" ? "researching" : "idle",
          },
          Error: undefined,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  ),
];
