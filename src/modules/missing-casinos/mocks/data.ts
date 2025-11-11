/**
 * Mock data for missing casinos
 */

export interface MissingCasino {
  id: string;
  name: string;
  state: {
    Abbreviation: string;
    Name: string;
  };
  source: string;
  promotionsFound: number;
  discoveredAt: string;
  website?: string;
  regulatoryId?: string;
}

export const mockMissingCasinos: MissingCasino[] = [
  {
    id: "casino-001",
    name: "Golden Nugget Atlantic City",
    state: { Abbreviation: "NJ", Name: "New Jersey" },
    source: "NJ Gaming Commission",
    promotionsFound: 3,
    discoveredAt: "2024-01-15T10:30:00Z",
    website: "https://goldennugget.com/atlantic-city",
    regulatoryId: "NJ-001",
  },
  {
    id: "casino-002",
    name: "Resorts Casino Hotel",
    state: { Abbreviation: "NJ", Name: "New Jersey" },
    source: "NJ Gaming Commission",
    promotionsFound: 2,
    discoveredAt: "2024-01-14T09:15:00Z",
    website: "https://resortscasino.com",
    regulatoryId: "NJ-002",
  },
  {
    id: "casino-003",
    name: "Tropicana Atlantic City",
    state: { Abbreviation: "NJ", Name: "New Jersey" },
    source: "NJ Gaming Commission",
    promotionsFound: 5,
    discoveredAt: "2024-01-13T14:20:00Z",
    website: "https://tropicana.net",
    regulatoryId: "NJ-003",
  },
  {
    id: "casino-004",
    name: "MotorCity Casino Hotel",
    state: { Abbreviation: "MI", Name: "Michigan" },
    source: "Michigan Gaming Control Board",
    promotionsFound: 4,
    discoveredAt: "2024-01-12T11:45:00Z",
    website: "https://motorcitycasino.com",
    regulatoryId: "MI-001",
  },
  {
    id: "casino-005",
    name: "FireKeepers Casino Hotel",
    state: { Abbreviation: "MI", Name: "Michigan" },
    source: "Michigan Gaming Control Board",
    promotionsFound: 2,
    discoveredAt: "2024-01-11T16:30:00Z",
    website: "https://firekeeperscasino.com",
    regulatoryId: "MI-002",
  },
  {
    id: "casino-006",
    name: "Rivers Casino Philadelphia",
    state: { Abbreviation: "PA", Name: "Pennsylvania" },
    source: "Pennsylvania Gaming Control Board",
    promotionsFound: 6,
    discoveredAt: "2024-01-10T08:00:00Z",
    website: "https://riverscasino.com/philadelphia",
    regulatoryId: "PA-001",
  },
  {
    id: "casino-007",
    name: "Parx Casino",
    state: { Abbreviation: "PA", Name: "Pennsylvania" },
    source: "Pennsylvania Gaming Control Board",
    promotionsFound: 3,
    discoveredAt: "2024-01-09T13:15:00Z",
    website: "https://parxcasino.com",
    regulatoryId: "PA-002",
  },
  {
    id: "casino-008",
    name: "Hollywood Casino at Penn National",
    state: { Abbreviation: "PA", Name: "Pennsylvania" },
    source: "Pennsylvania Gaming Control Board",
    promotionsFound: 4,
    discoveredAt: "2024-01-08T10:20:00Z",
    website: "https://hollywoodcasino.com/penn-national",
    regulatoryId: "PA-003",
  },
  {
    id: "casino-009",
    name: "Mountaineer Casino Racetrack & Resort",
    state: { Abbreviation: "WV", Name: "West Virginia" },
    source: "West Virginia Lottery",
    promotionsFound: 2,
    discoveredAt: "2024-01-07T15:45:00Z",
    website: "https://mountaineercasino.com",
    regulatoryId: "WV-001",
  },
  {
    id: "casino-010",
    name: "Mardi Gras Casino & Resort",
    state: { Abbreviation: "WV", Name: "West Virginia" },
    source: "West Virginia Lottery",
    promotionsFound: 1,
    discoveredAt: "2024-01-06T12:00:00Z",
    website: "https://mardigrascasino.com",
    regulatoryId: "WV-002",
  },
  {
    id: "casino-011",
    name: "Harrah's Atlantic City",
    state: { Abbreviation: "NJ", Name: "New Jersey" },
    source: "NJ Gaming Commission",
    promotionsFound: 4,
    discoveredAt: "2024-01-05T09:30:00Z",
    website: "https://harrahs.com/atlantic-city",
    regulatoryId: "NJ-004",
  },
  {
    id: "casino-012",
    name: "Borgata Hotel Casino & Spa",
    state: { Abbreviation: "NJ", Name: "New Jersey" },
    source: "NJ Gaming Commission",
    promotionsFound: 7,
    discoveredAt: "2024-01-04T14:10:00Z",
    website: "https://borgata.com",
    regulatoryId: "NJ-005",
  },
];

