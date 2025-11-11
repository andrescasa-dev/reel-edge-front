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
 * Makes a server-side HTTP request
 * Returns data directly (not wrapped)
 */
async function serverRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
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

    const data: T = await response.json();
    return data;
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
    return serverRequest<DashboardStats>(url, {
      method: "GET",
    });
  },
};
