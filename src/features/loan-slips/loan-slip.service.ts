import { createLoanSlipApi, getLoanSlipByIdApi, getLoanSlipsApi, updateLoanSlipApi } from "@/api/loan-slip.api";
import { getApiError } from "@/api/error-handler";
import type {
  LoanSlipListResponse,
  LoanSlipQuery,
  LoanSlip,
  CreateLoanSlipPayload,
  UpdateLoanSlipPayload
} from "@/types/loan-slip";

const DEFAULT_QUERY: LoanSlipQuery = {
  page: 1,
  limit: 10,
};

export const fetchLoanSlips = async (
  query: LoanSlipQuery = {}
): Promise<LoanSlipListResponse> => {
  try {
    const res = await getLoanSlipsApi({
      ...DEFAULT_QUERY,
      ...query,
    });
    return res.data;
  } catch (error) {
    throw getApiError(error);
  }
};

export const fetchLoanSlipById = async (
  id: string | number
): Promise<LoanSlip | null> => {
  try {
    const res = await getLoanSlipByIdApi(id);
    return res.data;
  } catch (error: any) {
    const apiError = getApiError(error);

    if (apiError.code === "NOT_FOUND") {
      return null;
    }

    throw apiError;
  }
};

export const createLoanSlip = async (
  payload: CreateLoanSlipPayload,
): Promise<LoanSlip> => {
  try {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append(key, String(value));
      }
    });

    const res = await createLoanSlipApi(formData);
    return res.data;
  } catch (error: any) {
    throw getApiError(error);
  }
};

export async function updateLoanSlip(
  id: number,
  payload: UpdateLoanSlipPayload
): Promise<LoanSlip> {
  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.borrower_name !== undefined) {
    formData.append("borrower_name", payload.borrower_name);
  }

  if (payload.department !== undefined) {
    formData.append("department", payload.department);
  }

  if (payload.position !== undefined) {
    formData.append("position", payload.position);
  }

  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }

  if (payload.serial_number !== undefined) {
    formData.append("serial_number", payload.serial_number);
  }

  if (payload.status !== undefined) {
    formData.append("status", String(payload.status));
  }

  if (payload.borrowed_date !== undefined) {
    formData.append("borrowed_date", payload.borrowed_date);
  }

  if (payload.returned_date !== undefined) {
    formData.append("returned_date", payload.returned_date);
  }

  (payload.existing_images ?? []).forEach((url) => {
    formData.append("existing_images[]", url);
  });

  (payload.new_images ?? []).forEach((file) => {
    formData.append("new_images", file);
  });

  const { data } = await updateLoanSlipApi(id, formData);
  return data;
}
