import type { BackendUser } from "../types/backend.types";

export const mockUsers: BackendUser[] = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    registerDate: "2024-01-15T00:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    registerDate: "2024-02-20T00:00:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    age: 45,
    registerDate: "2024-03-10T00:00:00Z",
    status: "inactive",
  },
  {
    id: "4",
    name: "Alice Williams",
    age: 26,
    registerDate: "2024-04-05T00:00:00Z",
    status: "pending",
  },
  {
    id: "5",
    name: "Charlie Brown",
    age: 38,
    registerDate: "2024-05-12T00:00:00Z",
    status: "active",
  },
  {
    id: "6",
    name: "Diana Prince",
    age: 29,
    registerDate: "2024-06-18T00:00:00Z",
    status: "active",
  },
  {
    id: "7",
    name: "Edward Norton",
    age: 41,
    registerDate: "2024-07-22T00:00:00Z",
    status: "inactive",
  },
  {
    id: "8",
    name: "Fiona Apple",
    age: 35,
    registerDate: "2024-08-30T00:00:00Z",
    status: "pending",
  },
];
