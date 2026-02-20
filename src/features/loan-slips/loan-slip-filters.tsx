"use client";

import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LoanSlipQuery } from "@/types/loan-slip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarIcon,
  Filter,
  RotateCcw,
  Search,
  X,
} from "lucide-react";

interface LoanSlipFiltersProps {
  query: LoanSlipQuery;
  onChange: (patch: Partial<LoanSlipQuery>) => void;
  onReset: () => void;
}

const SORT_OPTIONS = [
  { value: "name", label: "Tên tài sản" },
  { value: "borrower_name", label: "Nhà thầu" },
  { value: "department", label: "Phòng ban" },
  { value: "borrowed_date", label: "Ngày mượn" },
  { value: "returned_date", label: "Ngày trả" },
];

export function LoanSlipFilters({
  query,
  onChange,
  onReset,
}: LoanSlipFiltersProps) {
  const [searchInput, setSearchInput] = useState(
    () => query.search ?? ""
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    !!query.status ||
    !!query.borrowed_from ||
    !!query.borrowed_to ||
    !!query.returned_from ||
    !!query.returned_to;

  const activeFilterCount = [
    query.status,
    query.borrowed_from || query.borrowed_to,
    query.returned_from || query.returned_to,
  ].filter(Boolean).length;

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange({ search: value || undefined, page: 1 });
      }, 400);
    },
    [onChange],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tên tài sản, nhà thầu, phòng ban..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-10 pl-9 pr-9 bg-card"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Xóa tìm kiếm</span>
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <Button
          variant={showFilters ? "default" : "outline"}
          size="default"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 shrink-0"
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-primary text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Select
              value={query.sort || ""}
              onValueChange={(val) =>
                onChange({
                  sort: val || undefined,
                  order: val ? query.order || "asc" : undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger className={cn("h-10 w-40 bg-card", query.sort && "pr-8")}>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {query.sort && (
              <button
                type="button"
                onClick={() =>
                  onChange({ sort: undefined, order: undefined, page: 1 })
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Xóa sắp xếp</span>
              </button>
            )}
          </div>

          {query.sort && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 bg-transparent"
              onClick={() =>
                onChange({
                  order: query.order === "asc" ? "desc" : "asc",
                  page: 1,
                })
              }
            >
              {query.order === "desc" ? (
                <ArrowDownAZ className="h-4 w-4" />
              ) : (
                <ArrowUpAZ className="h-4 w-4" />
              )}
              <span className="sr-only">Đổi thứ tự</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Status */}
            <FilterField label="Trạng thái">
              <Select
                value={query.status || ""}
                onValueChange={(val) =>
                  onChange({
                    status: val === "__all__" ? undefined : val || undefined,
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="h-9 bg-background w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả</SelectItem>
                  <SelectItem value="borrowing">Đang mượn</SelectItem>
                  <SelectItem value="returned">Đã trả</SelectItem>
                </SelectContent>
              </Select>
            </FilterField>

            {/* Borrowed Date Range */}
            <FilterField label="Ngày mượn">
              <DateRangeFilter
                from={query.borrowed_from}
                to={query.borrowed_to}
                onFromChange={(val) =>
                  onChange({ borrowed_from: val, page: 1 })
                }
                onToChange={(val) => onChange({ borrowed_to: val, page: 1 })}
              />
            </FilterField>

            {/* Returned Date Range */}
            <FilterField label="Ngày trả">
              <DateRangeFilter
                from={query.returned_from}
                to={query.returned_to}
                onFromChange={(val) =>
                  onChange({ returned_from: val, page: 1 })
                }
                onToChange={(val) => onChange({ returned_to: val, page: 1 })}
              />
            </FilterField>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end border-t border-border pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from?: string;
  to?: string;
  onFromChange: (val: string | undefined) => void;
  onToChange: (val: string | undefined) => void;
}) {
  const fromParsed = from ? dayjs(from, "DD-MM-YYYY", true) : undefined;
  const fromDate = fromParsed?.isValid() ? fromParsed.toDate() : undefined;

  const toParsed = to ? dayjs(to, "DD-MM-YYYY", true) : undefined;
  const toDate = toParsed?.isValid() ? toParsed.toDate() : undefined;

  const formatDisplay = (date: Date | undefined) => {
    if (!date) return null;
    return dayjs(date).format("DD/MM/YYYY");
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 w-full justify-start gap-1.5 text-left font-normal bg-background",
                !from && "text-muted-foreground",
                from && "pr-7",
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">
                {formatDisplay(fromDate) ?? "Từ ngày"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) =>
                onFromChange(
                  date
                    ? dayjs(date as Date).format("DD-MM-YYYY")
                    : undefined
                )
              }
              disabled={(date) =>
                toDate ? date > toDate : false
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {from && (
          <button
            type="button"
            onClick={() => onFromChange(undefined)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Xóa ngày bắt đầu</span>
          </button>
        )}
      </div>

      <span className="text-xs text-muted-foreground shrink-0">-</span>

      <div className="relative flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 w-full justify-start gap-1.5 text-left font-normal bg-background",
                !to && "text-muted-foreground",
                to && "pr-7",
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">
                {formatDisplay(toDate) ?? "Đến ngày"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) =>
                onToChange(
                  date
                    ? dayjs(date as Date).format("DD-MM-YYYY")
                    : undefined
                )
              }
              disabled={(date) =>
                fromDate ? date < fromDate : false
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {to && (
          <button
            type="button"
            onClick={() => onToChange(undefined)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Xóa ngày kết thúc</span>
          </button>
        )}
      </div>
    </div>
  );
}
