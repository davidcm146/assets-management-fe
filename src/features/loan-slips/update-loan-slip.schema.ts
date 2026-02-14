import { LOAN_STATUS } from "@/types/loan-slip";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const updateLoanSlipSchema = z
  .object({
    name: z
      .string()
      .min(3, "Tên tài sản phải có ít nhất 3 ký tự")
      .max(100, "Tên tài sản tối đa 100 ký tự")
      .optional(),

    borrower_name: z
      .string()
      .min(3, "Tên người mượn phải có ít nhất 3 ký tự")
      .max(50, "Tên người mượn tối đa 50 ký tự")
      .optional(),

    department: z.string().optional(),

    position: z.string().optional(),

    description: z
      .string()
      .max(500, "Mô tả tối đa 500 ký tự")
      .optional()
      .or(z.literal("")),

    serial_number: z.string().optional(),

    status: z
      .union([
        z.literal(LOAN_STATUS.BORROWING),
        z.literal(LOAN_STATUS.RETURNED),
        z.literal(LOAN_STATUS.OVERDUE),
      ])
      .optional(),

    borrowed_date: z.date({
      message: "Ngày mượn không hợp lệ",
    }),

    returned_date: z.date({
      message: "Ngày trả không hợp lệ",
    }),

    existing_images: z
      .array(z.string())
      .max(5, "Tối đa 5 hình ảnh")
      .optional(),

    new_images: z
      .array(
        z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_IMAGE_SIZE,
            "Kích thước hình ảnh tối đa là 5MB"
          )
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Chỉ chấp nhận hình ảnh định dạng JPG hoặc PNG"
          )
      )
      .max(5, "Tối đa 5 hình ảnh")
      .optional(),
  })
  .refine(
    (data) =>
      ((data.existing_images ?? []).length +
        (data.new_images ?? []).length) <= 5,
    {
      message: "Tổng số hình ảnh tối đa là 5",
      path: ["new_images"],
    }
  )
  .refine(
    (data) => data.returned_date >= data.borrowed_date,
    {
      message: "Ngày trả phải sau hoặc bằng ngày mượn",
      path: ["returned_date"],
    }
  );

export type UpdateLoanSlipFormValues = z.infer<typeof updateLoanSlipSchema>;
