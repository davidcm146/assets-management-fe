import { api } from "./axios";
import type { LoginResponse, LoginPayload, MeResponse } from "@/types/auth";

export const loginApi = (payload: LoginPayload) => {
  return api.post<LoginResponse>("/api/auth/login", payload);
};

export const meApi = () => {
  return api.get<MeResponse>("/api/me");
};
