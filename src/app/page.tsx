import { UserTable, mockUsers } from "@/modules/users";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <UserTable users={mockUsers} />
    </main>
  );
}
