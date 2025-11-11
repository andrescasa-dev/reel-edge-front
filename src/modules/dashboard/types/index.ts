export interface State {
  Abbreviation: "NJ" | "MI" | "PA" | "WV";
  Name: string;
}

export interface StateStats {
  state: State;
  casinosTracked: number;
  promotionsActive: number;
  lastUpdated: string;
  status: "researching" | "idle";
  missingCasinos?: number;
  pendingComparisons?: number;
}

export interface DashboardStats {
  data: StateStats[];
  timestamp: string;
}

export interface ResearchStatus {
  success: boolean;
  message: string;
  status: "researching" | "idle";
}

