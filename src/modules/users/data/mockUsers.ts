import { type User } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    registerDate: new Date("2024-01-15"),
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    registerDate: new Date("2024-02-20"),
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    age: 45,
    registerDate: new Date("2024-03-10"),
    status: "inactive",
  },
  {
    id: "4",
    name: "Alice Williams",
    age: 26,
    registerDate: new Date("2024-04-05"),
    status: "pending",
  },
  {
    id: "5",
    name: "Charlie Brown",
    age: 38,
    registerDate: new Date("2024-05-12"),
    status: "active",
  },
  {
    id: "6",
    name: "Diana Prince",
    age: 29,
    registerDate: new Date("2024-06-18"),
    status: "active",
  },
  {
    id: "7",
    name: "Edward Norton",
    age: 41,
    registerDate: new Date("2024-07-22"),
    status: "inactive",
  },
  {
    id: "8",
    name: "Fiona Apple",
    age: 35,
    registerDate: new Date("2024-08-30"),
    status: "pending",
  },
];

