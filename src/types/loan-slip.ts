export interface LoanSlip {
  id: number;
  name: string;
  borrower_name: string;
  department: string;
  position: string;
  description: string;
  status: LoanSlipStatus;
  serial_number: string;
  images: string[];
  borrowed_date: string | null;
  returned_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type LoanSlipStatus =
  | "Đang mượn"
  | "Đã trả";

export interface LoanSlipQuery {
  search?: string;

  department?: string;
  status?: string;

  borrowed_from?: string;
  borrowed_to?: string;

  returned_from?: string;
  returned_to?: string;

  page?: number;
  limit?: number;

  sort?: string;
  order?: "asc" | "desc";
}

export interface LoanSlipListResponse {
  items: LoanSlip[];
  total: number;
}

export interface CreateLoanSlipPayload {
  name: string;
  borrower_name: string;
  department?: string;
  position?: string;
  description?: string;
  serial_number?: string;
  borrowed_date: string;
  returned_date: string;
  images?: File[];
}

export const LOAN_STATUS = {
  BORROWING: 1,
  RETURNED: 2,
} as const;

export type LoanStatus = typeof LOAN_STATUS[keyof typeof LOAN_STATUS];

export interface UpdateLoanSlipPayload {
  name?: string;
  borrower_name?: string;
  borrowed_date?: string;
  returned_date?: string;
  status?: 1 | 2;
  department?: string;
  position?: string;
  description?: string;
  serial_number?: string;

  existing_images?: string[];
  new_images?: File[];
}

