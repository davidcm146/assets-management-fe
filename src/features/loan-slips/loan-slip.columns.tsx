"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { LoanSlip } from "@/types/loan-slip";
import dayjs from "dayjs";

const statusConfig: Record<string, { label: string; className: string }> = {
  borrowing: {
    label: "Đang mượn",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  },
  returned: {
    label: "Đã trả",
    className:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
  },
  overdue: {
    label: "Quá hạn",
    className:
      "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
};

export function createLoanSlipColumns(
  onViewDetail: (id: string) => void,
  onEdit: (loanSlip: LoanSlip) => void,
  onDelete: (loanSlip: LoanSlip) => void
): ColumnDef<LoanSlip>[] {
  return [
    {
      accessorKey: "name",
      header: "Tài sản",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <svg
              className="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <span className="font-medium text-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "borrower_name",
      header: "Nhà thầu",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            {row.original.borrower_name
              ?.split(" ")
              .map((n) => n[0])
              .slice(-2)
              .join("")}
          </div>
          <span>{row.original.borrower_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Phòng ban",
    },
    {
      accessorKey: "position",
      header: "Chức vụ",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        const config = statusConfig[status] ?? {
          label: status,
          className: "",
        };

        return (
          <Badge variant="outline" className={config.className}>
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "borrowed_date",
      header: "Ngày mượn",
      cell: ({ row }) =>
        row.original.borrowed_date
          ? dayjs(row.original.borrowed_date).format("DD/MM/YYYY")
          : "-"
    },
    {
      accessorKey: "returned_date",
      header: "Ngày trả",
      cell: ({ row }) =>
        row.original.returned_date
          ? dayjs(row.original.returned_date).format("DD/MM/YYYY")
          : "-"
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const status = row.original.status;

        const canEdit =
          status !== "returned" && status !== "overdue";

        const canDelete =
          status === "borrowing";

        return (
          <div className="flex items-center justify-end gap-1">

            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(row.original)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Cập nhật
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-red-600 hover:text-red-700"
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => onViewDetail(row.original.id.toString())}
            >
              <Eye className="h-3.5 w-3.5" />
              Chi tiết
            </Button>
          </div>
        );
      },
    },
  ];
}
