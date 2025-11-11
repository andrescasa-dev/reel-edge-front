import { httpClient } from "@/core/services";
import type {
  PromotionComparisonsFilters,
  PromotionComparisonsResponse,
  UpdateComparisonRequest,
  UpdateComparisonResponse,
} from "../types";

export const promotionsService = {
  getComparisons: (filters?: PromotionComparisonsFilters) =>
    httpClient.get<PromotionComparisonsResponse>(
      "/promotions/comparisons",
      filters
    ),

  updateComparison: (
    comparisonId: string,
    data: UpdateComparisonRequest
  ) =>
    httpClient.patch<UpdateComparisonResponse>(
      `/promotions/comparisons/${comparisonId}`,
      data
    ),
};

