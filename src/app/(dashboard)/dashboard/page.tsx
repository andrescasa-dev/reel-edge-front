// Initialize MSW on server before making API calls
import "@/core/mocks/init-server";

import { dashboardServiceServer } from "@/modules/dashboard/services/dashboardService.server";
import { DashboardContent } from "@/modules/dashboard/components/DashboardContent/DashboardContent";

// Revalidate every 24 hours (86400 seconds)
export const revalidate = 86400;

export default async function DashboardPage() {
  // Fetch data server-side
  const stats = await dashboardServiceServer.getStateStats();

  return <DashboardContent initialStats={stats} />;
}
