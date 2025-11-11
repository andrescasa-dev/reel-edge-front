import type { BackendResponse } from "@/core/types";
import type { DashboardStats } from "../types";

/**
 * Server-side dashboard service
 * Used for server components and ISR
 */

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3000";

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Checks if response has BackendResponse format (with IsSuccess, Data, Error)
 */
function isBackendResponse<T>(
  response: unknown
): response is BackendResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "IsSuccess" in response &&
    "Data" in response
  );
}

/**
 * Transforms backend response format to frontend format
 * Handles both wrapped (BackendResponse) and direct response formats
 */
function transformResponse<T>(response: BackendResponse<T> | T): {
  success: boolean;
  data: T;
  error?: string;
} {
  // If response has BackendResponse format (wrapped)
  if (isBackendResponse<T>(response)) {
    return {
      success: response.IsSuccess,
      data: response.Data,
      error: response.Error,
    };
  }

  // If response is direct (no wrapper), treat as successful
  return {
    success: true,
    data: response as T,
  };
}

/**
 * Makes a server-side HTTP request
 */
async function serverRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; error?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await Promise.race([
      fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), DEFAULT_TIMEOUT);
      }),
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return transformResponse<T>(jsonResponse);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

/**
 * Server-side dashboard service
 */
export const dashboardServiceServer = {
  /**
   * Get state stats (server-side)
   */
  async getStateStats(): Promise<DashboardStats> {
    const url = `${API_BASE_URL}/dashboard/state-stats`;
    const response = await serverRequest<DashboardStats>(url, {
      method: "GET",
    });

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch dashboard stats");
    }

    return response.data;
  },
};
