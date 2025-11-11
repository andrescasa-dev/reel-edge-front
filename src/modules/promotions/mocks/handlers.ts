import { http, HttpResponse, type HttpHandler } from "msw";
import { mockPromotionComparisons } from "./data";
import { mockConfig } from "@/core/mocks/config";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const promotionsHandlers: HttpHandler[] = [
  http.get(`${API_BASE_URL}/promotions/comparisons`, async ({ request }) => {
    console.log("[MSW] ✅ Intercepted GET /promotions/comparisons");

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const insight = url.searchParams.get("insight");
    const state = url.searchParams.get("state");
    const casino = url.searchParams.get("casino");
    const offer_type = url.searchParams.get("offer_type");
    const promotion_id = url.searchParams.get("promotion_id");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Simulate network latency
    const delayTime =
      Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
      mockConfig.delayMin;
    await delay(delayTime);

    // Apply filters
    let filtered = [...mockPromotionComparisons];

    if (status) {
      filtered = filtered.filter((comp) => comp.status === status);
    }

    if (insight) {
      filtered = filtered.filter((comp) => comp.comparisonType === insight);
    }

    if (state) {
      filtered = filtered.filter(
        (comp) => comp.casino.state.Abbreviation === state
      );
    }

    if (casino) {
      const casinoLower = casino.toLowerCase();
      filtered = filtered.filter((comp) =>
        comp.casino.Name.toLowerCase().includes(casinoLower)
      );
    }

    if (offer_type) {
      filtered = filtered.filter(
        (comp) => comp.discoveredPromotion.offer_type === offer_type
      );
    }

    if (promotion_id) {
      filtered = filtered.filter((comp) => comp.id === promotion_id);
    }

    // Apply pagination
    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return HttpResponse.json(
      {
        data: paginated,
        pagination: {
          total,
          limit,
          page,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }),

  http.patch(
    `${API_BASE_URL}/promotions/comparisons/:comparisonId`,
    async ({ request, params }) => {
      console.log(
        "[MSW] ✅ Intercepted PATCH /promotions/comparisons/:comparisonId"
      );

      const { comparisonId } = params;
      const body = (await request.json()) as {
        action: "update" | "add" | "ignore";
        notes?: string;
      };

      // Simulate network latency
      const delayTime =
        Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
        mockConfig.delayMin;
      await delay(delayTime);

      // Find the comparison
      const comparison = mockPromotionComparisons.find(
        (comp) => comp.id === comparisonId
      );

      if (!comparison) {
        return HttpResponse.json(
          {
            message: "Comparison not found",
            code: "NOT_FOUND",
          },
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      // Update the comparison based on action
      let newStatus: "updated" | "reviewed" | "ignored" = "reviewed";
      if (body.action === "update") {
        newStatus = "updated";
      } else if (body.action === "ignore") {
        newStatus = "ignored";
      }

      const updatedComparison = {
        ...comparison,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      // Update in mock data (in a real scenario, this would be persisted)
      const index = mockPromotionComparisons.findIndex(
        (comp) => comp.id === comparisonId
      );
      if (index !== -1) {
        mockPromotionComparisons[index] = updatedComparison;
      }

      return HttpResponse.json(
        {
          success: true,
          message: `Comparison ${body.action}ed successfully`,
          comparison: updatedComparison,
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }
  ),

  // Handle OPTIONS for CORS preflight
  http.options(`${API_BASE_URL}/promotions/comparisons`, async () => {
    return HttpResponse.json(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),

  http.options(
    `${API_BASE_URL}/promotions/comparisons/:comparisonId`,
    async () => {
      return HttpResponse.json(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
  ),
];
