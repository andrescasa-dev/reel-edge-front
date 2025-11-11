import type { BackendResponse, ApiResponse } from "../types";

/**
 * HTTP Client
 * Low-level HTTP communication wrapper with automatic response transformation
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Builds query string from parameters
 * Supports Date objects by converting them to ISO strings
 */
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (value instanceof Date) {
      searchParams.append(key, value.toISOString());
    } else if (typeof value === "object") {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Transforms backend response format to frontend format
 */
function transformResponse<T>(
  backendResponse: BackendResponse<T>
): ApiResponse<T> {
  return {
    success: backendResponse.IsSuccess,
    data: backendResponse.Data,
    error: backendResponse.Error,
  };
}

/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
function createTimeout(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Makes an HTTP request with timeout and error handling
 */
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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
      createTimeout(DEFAULT_TIMEOUT),
    ]);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const backendResponse: BackendResponse<T> = await response.json();
    return transformResponse(backendResponse);
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
 * HTTP Client with type-safe methods
 */
export const httpClient = {
  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${endpoint}${queryString}`;
    return request<T>(url, { method: "GET" });
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    return request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    return request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    return request<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    return request<T>(url, { method: "DELETE" });
  },
};
