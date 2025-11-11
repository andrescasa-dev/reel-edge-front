"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "../services";
import { userAdapter } from "../adapters";
import type { User } from "../types";

/**
 * useUsers Hook
 * React Query integration for fetching users
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userService.getUsers();

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch users");
      }

      // Transform backend users to frontend format
      return response.data.map(userAdapter) as User[];
    },
  });
}
