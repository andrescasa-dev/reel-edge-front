export interface PromotionComparison {
  id: string;
  casino: {
    casinodb_id: number;
    Name: string;
    state: {
      Abbreviation: string;
      Name: string;
    };
  };
  currentPromotion: {
    Offer_Name: string;
    offer_type: string;
    Expected_Deposit: number;
    Expected_Bonus: number;
    terms_and_conditions?: string;
    wagering_requirements?: string;
    valid_from?: string;
    valid_until?: string;
  } | null;
  discoveredPromotion: {
    Offer_Name: string;
    offer_type: string;
    Expected_Deposit: number;
    Expected_Bonus: number;
    terms_and_conditions?: string;
    wagering_requirements?: string;
    valid_from?: string;
    valid_until?: string;
  };
  comparisonType: "better" | "alternative" | "new";
  status: "pending" | "updated" | "reviewed" | "ignored";
  createdAt: string;
  updatedAt: string;
}

export interface PromotionComparisonsFilters {
  page?: number;
  limit?: number;
  promotion_id?: string;
  status?: "pending" | "updated" | "reviewed" | "ignored";
  insight?: "better" | "alternative" | "new";
  offer_type?: string;
  state?: "NJ" | "MI" | "PA" | "WV";
  casino?: string;
}

export interface PromotionComparisonsResponse {
  data: PromotionComparison[];
  pagination: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface UpdateComparisonRequest {
  action: "update" | "add" | "ignore";
  notes?: string;
}

export interface UpdateComparisonResponse {
  success: boolean;
  message: string;
  comparison: PromotionComparison;
}

