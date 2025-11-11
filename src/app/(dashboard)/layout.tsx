import { Header } from "@/core/components/Header";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Missing Casinos", href: "/missing-casinos" },
  { label: "Promotions", href: "/promotions" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header menuItems={menuItems} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

