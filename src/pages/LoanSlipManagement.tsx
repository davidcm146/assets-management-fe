"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchLoanSlips,
  createLoanSlip,
  updateLoanSlip,
  deleteLoanSlip,
} from "@/features/loan-slips/loan-slip.service";
import type {
  CreateLoanSlipPayload,
  UpdateLoanSlipPayload,
  LoanSlip,
  LoanSlipQuery,
} from "@/types/loan-slip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createLoanSlipColumns } from "@/features/loan-slips/loan-slip.columns";
import { LoanSlipFilters } from "@/features/loan-slips/loan-slip-filters";
import { DataTable } from "@/components/ui/data-table";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
import { CreateLoanSlipDialog } from "@/components/CreateLoanSlipDialog";
import {
  UpdateLoanSlipDialog
} from "@/components/UpdateLoanSlipDialog";
import dayjs from "dayjs";
import type { CreateLoanSlipFormValues } from "@/features/loan-slips/loan-slip.schema";
import type { UpdateLoanSlipFormValues } from "@/features/loan-slips/update-loan-slip.schema";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth.context";

const DEFAULT_QUERY: LoanSlipQuery = {
  page: 1,
  limit: 10,
};

export default function LoanSlipManagement() {
  const [data, setData] = useState<LoanSlip[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState<LoanSlipQuery>({ ...DEFAULT_QUERY });
  const [deletingLoanSlip, setDeletingLoanSlip] = useState<LoanSlip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedLoanSlip, setSelectedLoanSlip] =
    useState<LoanSlip | null>(null);

  const navigate = useNavigate();

  const handleCreate = async (values: CreateLoanSlipFormValues) => {
    const payload: CreateLoanSlipPayload = {
      name: values.name,
      borrower_name: values.borrower_name,
      borrowed_date: dayjs(values.borrowed_date).format("DD-MM-YYYY"),
      returned_date: dayjs(values.returned_date).format("DD-MM-YYYY"),
      images: values.images,

      department: values.department ?? "",
      position: values.position ?? "",
      description: values.description ?? "",
      serial_number: values.serial_number ?? "",
    };

    const created = await createLoanSlip(payload);
    setCreateDialogOpen(false);
    toast.success("Tạo phiếu mượn thành công")

    try {
      const res = await fetchLoanSlips({ page: 1, limit: query.limit! });
      setData(res.items);
      setTotal(res.total);
    } catch (error) {
      if (query.page === 1) {
        setData((prev) => [created, ...prev]);
      }
      setTotal((prev) => prev + 1);
    }
  };

  const handleEdit = (loanSlip: LoanSlip) => {
    setSelectedLoanSlip(loanSlip);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (loanSlip: LoanSlip) => {
    setDeletingLoanSlip(loanSlip);
  };

  const confirmDelete = async () => {
    if (!deletingLoanSlip) return;

    try {
      setIsDeleting(true);
      await deleteLoanSlip(deletingLoanSlip.id);

      setData((prev) =>
        prev.filter((item) => item.id !== deletingLoanSlip.id)
      );

      setTotal((prev) => Math.max(0, prev - 1));

      toast.success("Xóa phiếu mượn thành công");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
      setDeletingLoanSlip(null);
    }
  };


  const handleUpdate = async (values: UpdateLoanSlipFormValues) => {
    if (!selectedLoanSlip) return;

    let payload: UpdateLoanSlipPayload = {
      existing_images: values.existing_images ?? [],
      new_images: values.new_images ?? [],
    };

    if (user?.role === "admin") {
      payload = {
        ...payload,
        status: values.status,
        borrowed_date: dayjs(values.borrowed_date).format("DD-MM-YYYY"),
        returned_date: dayjs(values.returned_date).format("DD-MM-YYYY"),
      };
    }

    if (user?.role === "IT") {
      payload = {
        ...payload,
        name: values.name,
        borrower_name: values.borrower_name,
        department: values.department,
        position: values.position,
        description: values.description,
        serial_number: values.serial_number,
        status: values.status,
        borrowed_date: dayjs(values.borrowed_date).format("DD-MM-YYYY"),
        returned_date: dayjs(values.returned_date).format("DD-MM-YYYY"),
      };
    }

    const updated = await updateLoanSlip(selectedLoanSlip.id, payload);

    setUpdateDialogOpen(false);
    setSelectedLoanSlip(null);
    toast.success("Cập nhật phiếu mượn thành công")

    setData((prev) =>
      prev.map((item) =>
        item.id === selectedLoanSlip.id ? updated : item
      )
    );
  };


  useEffect(() => {
    setLoading(true);
    fetchLoanSlips(query)
      .then((res) => {
        setData(res.items);
        setTotal(res.total);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  const handleFilterChange = useCallback((patch: Partial<LoanSlipQuery>) => {
    setQuery((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setQuery((prev) => ({
      page: 1,
      limit: prev.limit,
      search: prev.search,
      sort: prev.sort,
      order: prev.order,
    }));
  }, []);

  const columns = useMemo(
    () =>
      createLoanSlipColumns(
        (id) => navigate(`/loan-slips/${id}`),
        handleEdit,
        handleDelete
      ),
    []
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-blue-700" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Quản lý phiếu mượn
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Theo dõi và quản lý các phiếu mượn tài sản trong hệ thống
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-sm bg-blue-700 hover:bg-blue-500"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tạo phiếu mượn
        </Button>
      </div>

      {/* Stats - only total */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm max-w-xs">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tổng số phiếu mượn</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {total}
          </p>
        </div>
      </div>

      {/* Filters */}
      <LoanSlipFilters
        query={query}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Table */}
      <DataTable columns={columns} data={data} loading={loading} />

      {/* Pagination */}
      <CustomPagination
        page={query.page!}
        pageSize={query.limit!}
        total={total}
        onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
      />

      {/* Create Loan Slip Dialog */}
      <CreateLoanSlipDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />

      {/* Update Loan Slip Dialog */}
      <UpdateLoanSlipDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onSubmit={handleUpdate}
        loanSlip={selectedLoanSlip}
        role={user?.role}
      />
      <AlertDialog
        open={!!deletingLoanSlip}
        onOpenChange={(open) => {
          if (!open) setDeletingLoanSlip(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận xóa phiếu mượn
            </AlertDialogTitle>

            <AlertDialogDescription>
              Bạn có chắc muốn xóa phiếu mượn{" "}
              <span className="font-medium">
                {deletingLoanSlip?.name}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Hủy
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
