import { userHandlers } from "@/modules/users/mocks/handlers";
import { dashboardHandlers } from "@/modules/dashboard/mocks/handlers";

export const handlers = [...userHandlers, ...dashboardHandlers];
