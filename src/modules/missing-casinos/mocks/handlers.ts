import { http, HttpResponse, type HttpHandler } from "msw";
import { mockMissingCasinos } from "./data";
import { mockConfig } from "@/core/mocks/config";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const missingCasinosHandlers: HttpHandler[] = [
  http.get(`${API_BASE_URL}/missing-casinos`, async ({ request }) => {
    console.log("[MSW] ✅ Intercepted GET /missing-casinos");

    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    // Simulate network latency
    const delayTime =
      Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
      mockConfig.delayMin;
    await delay(delayTime);

    // Filter by state if provided
    let filtered = mockMissingCasinos;
    if (state) {
      filtered = filtered.filter(
        (casino) => casino.state.Abbreviation === state
      );
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (casino) =>
          casino.name.toLowerCase().includes(searchLower) ||
          casino.source.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return HttpResponse.json(
      {
        data: paginated,
        pagination: {
          total,
          limit,
          page: currentPage,
          totalPages,
          hasNext: offset + limit < total,
          hasPrevious: offset > 0,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }),

  // Handle OPTIONS for CORS preflight
  http.options(`${API_BASE_URL}/missing-casinos`, async () => {
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

