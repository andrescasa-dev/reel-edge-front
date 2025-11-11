export interface State {
  Abbreviation: "NJ" | "MI" | "PA" | "WV";
  Name: string;
}

export interface MissingCasino {
  id: string;
  name: string;
  state: State;
  source: string;
  promotionsFound: number;
  discoveredAt: string;
  website?: string;
  regulatoryId?: string;
}

export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MissingCasinosResponse {
  data: MissingCasino[];
  pagination: Pagination;
}

export interface MissingCasinosQueryParams {
  state?: "NJ" | "MI" | "PA" | "WV";
  search?: string;
  limit?: number;
  offset?: number;
}

