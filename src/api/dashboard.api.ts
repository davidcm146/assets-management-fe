import type { DashboardFilterQuery, LoanMetrics } from "@/types/dashboard";
import { api } from "./axios";

export const getLoanMetricsApi = (query: DashboardFilterQuery) => {
  return api.get<LoanMetrics>("/api/dashboard/loan-metrics", {
    params: query,
  });
};
