import type { LoginFormValues } from "@/features/auth/login.schema";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface MeResponse {
  id: number;
  username: string;
  role: string;
}

export type AuthRole =
  | "admin"
  | "IT";

export interface AuthContextValue {
  user: MeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormValues) => Promise<void>;
  logout: () => void;
}