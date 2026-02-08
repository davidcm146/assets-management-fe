import axios from "axios";
import type { ApiError } from "@/types/api-error";

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
