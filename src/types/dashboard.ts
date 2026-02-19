export type DashboardPeriod = "today" | "week" | "month" | "year";

export interface DashboardFilterQuery {
  from?: string;
  to?: string;
  period?: DashboardPeriod;
}

export interface LoanMetrics {
  total: number;
  borrowing: number;
  returned: number;
  overdue: number;
}
