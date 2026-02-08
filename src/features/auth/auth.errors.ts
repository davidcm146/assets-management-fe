import { ERROR_CODES } from "@/constants/error-codes";

export const authErrorMessages: Record<string, string> = {
  [ERROR_CODES.UNAUTHORIZED]: "Tên đăng nhập hoặc mật khẩu không đúng",
};
