import { LOAN_STATUS } from "@/types/loan-slip";
import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";
import type { NotificationType } from "@/types/notification";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapStatusToNumber(status: string | number): 1 | 2 | 3 {
  if (status === 1 || status === "borrowing" || status === "Đang mượn") {
    return LOAN_STATUS.BORROWING;
  }

  if (status === 2 || status === "returned" || status === "Đã trả") {
    return LOAN_STATUS.RETURNED;
  }

  if (status === 3 || status === "overdue" || status === "Quá hạn") {
    return LOAN_STATUS.OVERDUE;
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

export const formatNotificationDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN");
};

export const getNotificationTypeLabel = (type: NotificationType): string => {
  const map: Record<NotificationType, string> = {
    loan_slip_overdue: "Phiếu mượn quá hạn",
  };

  return map[type] || "Thông báo";
};

export const getNotificationTypeColor = (type: NotificationType): "default" | "secondary" | "destructive" | "outline" => {
  const map: Record<NotificationType, "default" | "secondary" | "destructive" | "outline"> = {
    loan_slip_overdue: "destructive",
  };

  return map[type] || "default";
};
