/**
 * Backend User types
 * These types match the backend API response format
 * Top-level fields use camelCase (consistent with API spec)
 */

export interface BackendUser {
  id: string;
  name: string;
  age: number;
  registerDate: string; // ISO string from backend
  status: "active" | "inactive" | "pending";
}
