"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Calendar, X, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { DashboardPeriod, DashboardFilterQuery } from "@/types/dashboard";

type Props = {
  onChange: (filters: DashboardFilterQuery) => void;
};

export function DashboardFilter({ onChange }: Props) {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [isUsingDateRange, setIsUsingDateRange] = useState(false);

  const handlePeriodChange = (value: string) => {
    const p = value as DashboardPeriod;
    setPeriod(p);
    // Only send period if not using date range
    if (!isUsingDateRange) {
      onChange({ period: p });
    }
  };

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (date && toDate) {
      const from = dayjs(date).format("DD-MM-YYYY");
      const to = dayjs(toDate).format("DD-MM-YYYY");
      setIsUsingDateRange(true);
      onChange({ from, to });
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    if (fromDate && date) {
      const from = dayjs(fromDate).format("DD-MM-YYYY");
      const to = dayjs(date).format("DD-MM-YYYY");
      setIsUsingDateRange(true);
      onChange({ from, to });
    }
  };

  const handleClearDateRange = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setIsUsingDateRange(false);
    onChange({ period });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Select 
          value={period} 
          onValueChange={handlePeriodChange}
          disabled={isUsingDateRange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hôm nay</SelectItem>
            <SelectItem value="week">Tuần này</SelectItem>
            <SelectItem value="month">Tháng này</SelectItem>
            <SelectItem value="year">Năm nay</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {fromDate
                  ? dayjs(fromDate).format("DD/MM/YYYY")
                  : "Từ ngày"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={fromDate}
                onSelect={handleFromDateChange}
                disabled={(date) =>
                  toDate ? date > toDate : false
                }
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">→</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {toDate
                  ? dayjs(toDate).format("DD/MM/YYYY")
                  : "Đến ngày"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={toDate}
                onSelect={handleToDateChange}
                disabled={(date) =>
                  fromDate ? date < fromDate : false
                }
              />
            </PopoverContent>
          </Popover>

          {isUsingDateRange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDateRange}
              className="gap-1"
              title="Xóa bộ lọc khoảng thời gian"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
