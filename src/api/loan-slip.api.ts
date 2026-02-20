import { api } from "./axios";
import type {
  LoanSlipListResponse,
  LoanSlipQuery,
  LoanSlip
} from "@/types/loan-slip";

export const getLoanSlipsApi = (params: LoanSlipQuery) => {
  return api.get<LoanSlipListResponse>("/api/loan-slips", {
    params,
  });
};

export const getLoanSlipByIdApi = (id: string | number) => {
  return api.get<LoanSlip>(`/api/loan-slips/${id}`);
};

export const createLoanSlipApi = (formData: FormData) => {
  return api.post<LoanSlip>("/api/loan-slips", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateLoanSlipApi = (
  id: string | number,
  formData: FormData
) => {
  return api.put<LoanSlip>(`/api/loan-slips/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteLoanSlipApi = (id: number) => {
  return api.delete(`/api/loan-slips/${id}`);
};
