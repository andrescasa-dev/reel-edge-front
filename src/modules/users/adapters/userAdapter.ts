import type { User } from "../types";
import type { BackendUser } from "../types/backend.types";

/**
 * User Adapter
 * Transforms backend user format to frontend format
 * Pure function with no side effects
 *
 * Since backend uses camelCase for top-level fields (same as frontend),
 * we only need to transform the date string to a Date object
 */
export function userAdapter(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    age: backendUser.age,
    registerDate: new Date(backendUser.registerDate),
    status: backendUser.status,
  };
}
