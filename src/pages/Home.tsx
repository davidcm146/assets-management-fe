"use client";

import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLoanMetrics } from "@/features/dashboard/dashboard.service";
import type { DashboardFilterQuery, LoanMetrics } from "@/types/dashboard";
import { handleApiError } from "@/api/error-handler";
import { DashboardFilter } from "@/components/DashboardFilter";
import axios from "axios";

export default function Home() {
  const [metrics, setMetrics] = useState<LoanMetrics | null>(null);
  const [filters, setFilters] = useState<DashboardFilterQuery>({ period: "month" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchLoanMetrics(filters);
        if (isMounted) setMetrics(data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          handleApiError(error.response?.data);
        } else {
          console.error(error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMetrics();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const stats = [
    {
      title: "Tổng phiếu mượn",
      value: metrics?.total ?? 0,
      icon: FileText,
      description: "Tất cả phiếu mượn trong hệ thống",
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      title: "Đang mượn",
      value: metrics?.borrowing ?? 0,
      icon: Clock,
      description: "Phiếu mượn chưa trả",
      iconClass: "text-amber-600",
      bgClass: "bg-amber-50",
    },
    {
      title: "Đã trả",
      value: metrics?.returned ?? 0,
      icon: CheckCircle,
      description: "Phiếu mượn đã hoàn thành",
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      title: "Quá hạn",
      value: metrics?.overdue ?? 0,
      icon: AlertTriangle,
      description: "Phiếu mượn quá hạn trả",
      iconClass: "text-destructive",
      bgClass: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 rounded-full bg-blue-700" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Trang chủ
            </h1>
            <p className="text-sm text-muted-foreground">
              Tổng quan hệ thống quản lý phiếu mượn
            </p>
          </div>
        </div>

        <DashboardFilter onChange={setFilters} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-card text-card-foreground border-border hover:border-blue-300 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgClass}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.iconClass}`} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "—" : stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-700 text-white border-0">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Chào mừng đến Hệ thống Quản lý Phiếu mượn
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Theo dõi, quản lý và xử lý phiếu mượn nhanh chóng, hiệu quả.
            </p>
          </div>
          <FileText className="h-12 w-12 text-blue-200/50 hidden md:block" />
        </CardContent>
      </Card>
    </div>
  );
}
