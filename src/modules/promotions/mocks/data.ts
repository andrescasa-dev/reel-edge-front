/**
 * Mock data for promotion comparisons
 */

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

export const mockPromotionComparisons: PromotionComparison[] = [
  {
    id: "comp-001",
    casino: {
      casinodb_id: 1,
      Name: "Borgata Hotel Casino & Spa",
      state: { Abbreviation: "NJ", Name: "New Jersey" },
    },
    currentPromotion: {
      Offer_Name: "Welcome Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 100,
      Expected_Bonus: 50,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "20x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "Welcome Bonus Plus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 100,
      Expected_Bonus: 75,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "25x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "better",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "comp-002",
    casino: {
      casinodb_id: 2,
      Name: "Golden Nugget Atlantic City",
      state: { Abbreviation: "NJ", Name: "New Jersey" },
    },
    currentPromotion: {
      Offer_Name: "No Deposit Bonus",
      offer_type: "No Deposit Bonus",
      Expected_Deposit: 0,
      Expected_Bonus: 20,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "30x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "Free Spins Package",
      offer_type: "Free Spins",
      Expected_Deposit: 0,
      Expected_Bonus: 25,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "35x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "alternative",
    status: "pending",
    createdAt: "2024-01-15T10:25:00Z",
    updatedAt: "2024-01-15T10:25:00Z",
  },
  {
    id: "comp-003",
    casino: {
      casinodb_id: 3,
      Name: "MotorCity Casino Hotel",
      state: { Abbreviation: "MI", Name: "Michigan" },
    },
    currentPromotion: null,
    discoveredPromotion: {
      Offer_Name: "New Player Welcome Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 200,
      Expected_Bonus: 100,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "25x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "new",
    status: "pending",
    createdAt: "2024-01-15T10:20:00Z",
    updatedAt: "2024-01-15T10:20:00Z",
  },
  {
    id: "comp-004",
    casino: {
      casinodb_id: 4,
      Name: "Rivers Casino Philadelphia",
      state: { Abbreviation: "PA", Name: "Pennsylvania" },
    },
    currentPromotion: {
      Offer_Name: "Match Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 150,
      Expected_Bonus: 75,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "20x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "Match Bonus Enhanced",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 150,
      Expected_Bonus: 100,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "20x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "better",
    status: "pending",
    createdAt: "2024-01-15T10:15:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
  },
  {
    id: "comp-005",
    casino: {
      casinodb_id: 5,
      Name: "Mountaineer Casino Racetrack & Resort",
      state: { Abbreviation: "WV", Name: "West Virginia" },
    },
    currentPromotion: {
      Offer_Name: "Weekend Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 50,
      Expected_Bonus: 25,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "15x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "Weekend Special",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 75,
      Expected_Bonus: 30,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "18x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "alternative",
    status: "pending",
    createdAt: "2024-01-15T10:10:00Z",
    updatedAt: "2024-01-15T10:10:00Z",
  },
  {
    id: "comp-006",
    casino: {
      casinodb_id: 6,
      Name: "FireKeepers Casino Hotel",
      state: { Abbreviation: "MI", Name: "Michigan" },
    },
    currentPromotion: null,
    discoveredPromotion: {
      Offer_Name: "First Deposit Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 100,
      Expected_Bonus: 50,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "20x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "new",
    status: "pending",
    createdAt: "2024-01-15T10:05:00Z",
    updatedAt: "2024-01-15T10:05:00Z",
  },
  {
    id: "comp-007",
    casino: {
      casinodb_id: 7,
      Name: "Parx Casino",
      state: { Abbreviation: "PA", Name: "Pennsylvania" },
    },
    currentPromotion: {
      Offer_Name: "VIP Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 500,
      Expected_Bonus: 200,
      terms_and_conditions: "VIP terms apply",
      wagering_requirements: "30x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "VIP Bonus Premium",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 500,
      Expected_Bonus: 250,
      terms_and_conditions: "VIP terms apply",
      wagering_requirements: "30x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "better",
    status: "pending",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "comp-008",
    casino: {
      casinodb_id: 8,
      Name: "Harrah's Atlantic City",
      state: { Abbreviation: "NJ", Name: "New Jersey" },
    },
    currentPromotion: {
      Offer_Name: "Reload Bonus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 50,
      Expected_Bonus: 20,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "15x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "Reload Bonus Plus",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 50,
      Expected_Bonus: 25,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "15x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "better",
    status: "pending",
    createdAt: "2024-01-15T09:55:00Z",
    updatedAt: "2024-01-15T09:55:00Z",
  },
  {
    id: "comp-009",
    casino: {
      casinodb_id: 9,
      Name: "Tropicana Atlantic City",
      state: { Abbreviation: "NJ", Name: "New Jersey" },
    },
    currentPromotion: null,
    discoveredPromotion: {
      Offer_Name: "Summer Special",
      offer_type: "Deposit Bonus",
      Expected_Deposit: 75,
      Expected_Bonus: 40,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "20x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "new",
    status: "pending",
    createdAt: "2024-01-15T09:50:00Z",
    updatedAt: "2024-01-15T09:50:00Z",
  },
  {
    id: "comp-010",
    casino: {
      casinodb_id: 10,
      Name: "Hollywood Casino at Penn National",
      state: { Abbreviation: "PA", Name: "Pennsylvania" },
    },
    currentPromotion: {
      Offer_Name: "Cashback Bonus",
      offer_type: "Cashback",
      Expected_Deposit: 100,
      Expected_Bonus: 10,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "10x",
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    discoveredPromotion: {
      Offer_Name: "Cashback Bonus Enhanced",
      offer_type: "Cashback",
      Expected_Deposit: 100,
      Expected_Bonus: 15,
      terms_and_conditions: "Standard terms apply",
      wagering_requirements: "10x",
      valid_from: "2024-01-15T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
    },
    comparisonType: "better",
    status: "pending",
    createdAt: "2024-01-15T09:45:00Z",
    updatedAt: "2024-01-15T09:45:00Z",
  },
];

