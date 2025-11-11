import { http, HttpResponse, type HttpHandler } from "msw";
import { mockUsers } from "./data";
import { mockConfig } from "@/core/mocks/config";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Must match the API base URL used in http-client.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const userHandlers: HttpHandler[] = [
  http.get(`${API_BASE_URL}/users`, async ({ request }) => {
    console.log(
      "[MSW] ✅ Intercepted GET request:",
      request.method,
      request.url
    );
    console.log("[MSW] Expected pattern:", `${API_BASE_URL}/users`);

    // Simulate network latency
    const delayTime =
      Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
      mockConfig.delayMin;
    await delay(delayTime);

    console.log(
      "[MSW] 📦 Returning mock data for users:",
      mockUsers.length,
      "users"
    );

    return HttpResponse.json(mockUsers, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),

  // Also handle OPTIONS for CORS preflight
  http.options(`${API_BASE_URL}/users`, async () => {
    return HttpResponse.json(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
];
