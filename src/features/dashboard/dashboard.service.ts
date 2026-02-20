import { getLoanMetricsApi } from "@/api/dashboard.api";
import { getApiError } from "@/api/error-handler";
import type { DashboardFilterQuery, LoanMetrics } from "@/types/dashboard";

export const fetchLoanMetrics = async (query: DashboardFilterQuery = {}): Promise<LoanMetrics> => {
  try {
    const res = await getLoanMetricsApi({
      ...query,
    });

    return res.data;
  } catch (error) {
    throw getApiError(error);
  }
};
