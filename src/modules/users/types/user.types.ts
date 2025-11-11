export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  name: string;
  age: number;
  registerDate: Date;
  status: UserStatus;
}

