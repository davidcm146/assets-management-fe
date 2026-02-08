"use client";

import React, { useEffect, useState } from "react";
import { fetchLoanSlipById } from "@/features/loan-slips/loan-slip.service";
import type { LoanSlip } from "@/types/loan-slip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Box,
  User,
  Building2,
  Briefcase,
  CalendarDays,
  CalendarCheck2,
  Clock,
  CheckCircle2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  borrowing: {
    label: "Dang muon",
    icon: <Clock className="h-4 w-4" />,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  returned: {
    label: "Da tra",
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-6 py-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}

interface LoanSlipDetailProps {
  id: string
}

export default function LoanSlipDetail({ id }: LoanSlipDetailProps) {
  const [slip, setSlip] = useState<LoanSlip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSlip(null);
    fetchLoanSlipById(id)
      .then((res) => {
        if (!res) {
          setNotFound(true);
        } else {
          setSlip(res);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (notFound || !slip) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Box className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Khong tim thay phieu muon
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Phieu muon voi ma &quot;{id}&quot; khong ton tai hoac da bi xoa.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

      </div>
    );
  }

  const status = statusConfig[slip.status];
  const borrowedDays = slip.returned_date
    ? dayjs(slip.returned_date).diff(dayjs(slip.borrowed_date), "day")
    : dayjs().diff(dayjs(slip.borrowed_date), "day");

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Quay lai</span>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground text-balance">
              Chi tiet phieu muon
            </h1>
            <p className="text-sm text-muted-foreground">
              Ma phieu: #{slip.id}
            </p>
          </div>
        </div>

        {status && (
          <Badge
            variant="outline"
            className={`${status.className} gap-1.5 px-3 py-1 text-sm`}
          >
            {status.icon}
            {status.label}
          </Badge>
        )}
      </div>

      {/* Main card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Asset header */}
        <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Box className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tai san muon
            </p>
            <p className="text-lg font-semibold text-foreground">
              {slip.name}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoField
              icon={<User className="h-4 w-4" />}
              label="Nguoi muon"
              value={slip.borrower_name}
            />
            <InfoField
              icon={<Building2 className="h-4 w-4" />}
              label="Phong ban"
              value={slip.department}
            />
            <InfoField
              icon={<Briefcase className="h-4 w-4" />}
              label="Chuc vu"
              value={slip.position}
            />
            <InfoField
              icon={<CalendarDays className="h-4 w-4" />}
              label="Ngay muon"
              value={
                <span className="tabular-nums">
                  {dayjs(slip.borrowed_date).format("DD/MM/YYYY")}
                </span>
              }
            />
            <InfoField
              icon={<CalendarCheck2 className="h-4 w-4" />}
              label="Ngay tra"
              value={
                slip.returned_date ? (
                  <span className="tabular-nums">
                    {dayjs(slip.returned_date).format("DD/MM/YYYY")}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Chua tra</span>
                )
              }
            />
            <InfoField
              icon={<Clock className="h-4 w-4" />}
              label="So ngay muon"
              value={
                <span className="tabular-nums">
                  {borrowedDays} ngay
                  {!slip.returned_date && (
                    <span className="ml-1.5 text-xs text-amber-600">
                      (dang muon)
                    </span>
                  )}
                </span>
              }
            />
          </div>
        </div>

        <Separator />

        {/* Images */}
        {slip.images && slip.images.length > 0 && (
          <div className="px-6 py-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Hinh anh
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {slip.images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                  className="group relative aspect-3/2 overflow-hidden rounded-lg border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`${slip.name} - Anh ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 transition-colors duration-200 group-hover:bg-foreground/10" />
                </button>
              ))}
            </div>
          </div>
        )}

        {slip.images && slip.images.length === 0 && (
          <div className="px-6 py-5">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Hinh anh
            </p>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-10">
              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Khong co hinh anh
              </p>
            </div>
          </div>
        )}
      </div>

      {slip.images && slip.images.length > 0 && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl border-none bg-background/95 p-0 backdrop-blur-sm">
            <DialogTitle className="sr-only">
              {slip.name} - Anh {lightboxIndex + 1} / {slip.images.length}
            </DialogTitle>

            <div className="relative flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 z-10 h-6 w-6 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20"
                onClick={() => setLightboxOpen(false)}
              >
                {/* <X className="h-4 w-4" /> */}
              </Button>

              {slip.images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-3 z-10 h-9 w-9 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === 0 ? slip.images.length - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Anh truoc</span>
                </Button>
              )}

              <div className="flex min-h-75 items-center justify-center p-4 sm:min-h-100 sm:p-6">
                <img
                  src={slip.images[lightboxIndex] || "/placeholder.svg"}
                  alt={`${slip.name} - Anh ${lightboxIndex + 1}`}
                  className="max-h-[70vh] w-auto rounded-lg object-contain"
                />
              </div>

              {/* Next button */}
              {slip.images.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 z-10 h-9 w-9 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === slip.images.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Anh tiep</span>
                </Button>
              )}
            </div>

            {/* Dot indicators */}
            {slip.images.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pb-4">
                {slip.images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${i === lightboxIndex
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                  >
                    <span className="sr-only">Anh {i + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
