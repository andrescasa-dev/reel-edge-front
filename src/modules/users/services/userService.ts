import { httpClient } from "@/core/services";
import type { BackendUser } from "../types/backend.types";

/**
 * User Service
 * Domain-specific API calls for users
 */
export const userService = {
  /**
   * Get all users
   */
  getUsers: () => httpClient.get<BackendUser[]>("/users"),
};
