import { userHandlers } from "@/modules/users/mocks/handlers";
import { dashboardHandlers } from "@/modules/dashboard/mocks/handlers";
import { missingCasinosHandlers } from "@/modules/missing-casinos/mocks/handlers";
import { promotionsHandlers } from "@/modules/promotions/mocks/handlers";

export const handlers = [
  ...userHandlers,
  ...dashboardHandlers,
  ...missingCasinosHandlers,
  ...promotionsHandlers,
];
