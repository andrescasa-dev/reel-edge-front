import { httpClient } from "@/core/services";
import type { MissingCasinosResponse, MissingCasinosQueryParams } from "../types";

export const missingCasinosService = {
  getMissingCasinos: (params?: MissingCasinosQueryParams) =>
    httpClient.get<MissingCasinosResponse>("/missing-casinos", params),
};

