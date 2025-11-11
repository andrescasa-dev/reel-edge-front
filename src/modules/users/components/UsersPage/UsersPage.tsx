"use client";

import { UserTable } from "../UserTable";
import { useUsers } from "../../hooks";

export function UsersPage() {
  const { data: users, isLoading, error } = useUsers();

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <div className="text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load users"}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <UserTable users={users || []} />
    </div>
  );
}
