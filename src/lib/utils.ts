import { LOAN_STATUS } from "@/types/loan-slip";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

  // fallback an toàn
  return LOAN_STATUS.BORROWING;
}
