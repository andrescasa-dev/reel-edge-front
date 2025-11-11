"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { missingCasinosService } from "../services";
import type { MissingCasinosQueryParams, MissingCasino } from "../types";

const DEFAULT_LIMIT = 20;

export interface UseMissingCasinosParams {
  state?: "NJ" | "MI" | "PA" | "WV";
  search?: string;
}

export function useMissingCasinos(params?: UseMissingCasinosParams) {
  return useInfiniteQuery({
    queryKey: ["missing-casinos", params],
    queryFn: async ({ pageParam = 0 }) => {
      const queryParams: MissingCasinosQueryParams = {
        limit: DEFAULT_LIMIT,
        offset: pageParam,
        ...params,
      };

      const response = await missingCasinosService.getMissingCasinos(queryParams);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination.hasNext) {
        return undefined;
      }
      // Calculate next offset: current offset + limit
      const currentOffset = allPages.length * DEFAULT_LIMIT;
      return currentOffset;
    },
    initialPageParam: 0,
  });
}

export function useMissingCasinosFlat(params?: UseMissingCasinosParams) {
  const query = useMissingCasinos(params);
  
  const data = query.data?.pages.flatMap((page) => page.data) ?? [];
  const total = query.data?.pages[0]?.pagination.total ?? 0;
  const hasNextPage = query.hasNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;

  return {
    ...query,
    data,
    total,
    hasNextPage,
    isFetchingNextPage,
  };
}

