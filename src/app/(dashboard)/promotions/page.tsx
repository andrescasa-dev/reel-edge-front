// Initialize MSW on server before making API calls
import "@/core/mocks/init-server";

import { PromotionsPage } from "@/modules/promotions";

export default function PromotionsRoute() {
  return <PromotionsPage />;
}

