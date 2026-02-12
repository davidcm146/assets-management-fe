import { LOAN_STATUS } from "@/types/loan-slip";
import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapStatusToNumber(status: string | number): 1 | 2 {
  if (status === 1 || status === "borrowing" || status === "Đang mượn") {
    return LOAN_STATUS.BORROWING;
  }

  if (status === 2 || status === "returned" || status === "Đã trả") {
    return LOAN_STATUS.RETURNED;
  }

  return LOAN_STATUS.BORROWING;
}

export const formatDisplay = (date: Date | undefined) => {
  if (!date) return null;
  return dayjs(date).format("DD/MM/YYYY");
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 2500,
  });
};
