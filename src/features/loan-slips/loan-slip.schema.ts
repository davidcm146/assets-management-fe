import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const createLoanSlipSchema = z
  .object({
    name: z
      .string()
      .min(3, "Tên tài sản phải có ít nhất 3 ký tự")
      .max(100, "Tên tài sản không được vượt quá 100 ký tự"),

    borrower_name: z
      .string()
      .min(3, "Tên người mượn phải có ít nhất 3 ký tự")
      .max(50, "Tên người mượn không được vượt quá 50 ký tự"),

    department: z.string().optional(),

    position: z.string().optional(),

    description: z
      .string()
      .min(10, "Mô tả phải có ít nhất 10 ký tự")
      .max(500, "Mô tả không được vượt quá 500 ký tự")
      .optional(),

    serial_number: z.string().optional(),

    borrowed_date: z.date({
      message: "Ngày mượn không hợp lệ",
    }),

    returned_date: z.date({
      message: "Ngày trả không hợp lệ",
    }),

    images: z
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
      .max(5, "Tối đa được tải lên 5 hình ảnh"),
  })
  .refine(
    (data) => data.returned_date >= data.borrowed_date,
    {
      message: "Ngày trả phải sau hoặc bằng ngày mượn",
      path: ["returned_date"],
    }
  );

export type CreateLoanSlipFormValues = z.infer<typeof createLoanSlipSchema>;
