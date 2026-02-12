import axios from "axios";
import type { ApiError } from "@/types/api-error";
import { showErrorToast } from "@/lib/utils";

export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    return {
      code: data?.code ?? "UNKNOWN_ERROR",
      message: data?.message ?? "Đã có lỗi xảy ra",
      httpStatus: data?.http_status ?? error.response?.status ?? 500,
      details: data?.details,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Đã có lỗi xảy ra",
    httpStatus: 500,
  };
};

export const handleApiError = (apiError: ApiError) => {
  if (apiError.code === "UNAUTHORIZED") {
    showErrorToast("Bạn cần đăng nhập để thực hiện hành động này");
    return;
  }

  if (apiError.code === "FORBIDDEN") {
    showErrorToast("Bạn không có quyền thực hiện hành động này");
    return;
  }

  if (apiError.code === "NOT_FOUND") {
    showErrorToast("Không tìm thấy tài nguyên yêu cầu");
    return;
  }

  showErrorToast(apiError.message);
};

