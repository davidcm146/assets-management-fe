import { loginApi, meApi } from "@/api/auth.api";
import { setAccessToken } from "@/lib/cookies";
import { getApiError } from "@/api/error-handler";
import type { LoginFormValues } from "./login.schema";

export const loginService = async (data: LoginFormValues) => {
  try {
    const loginRes = await loginApi(data);
    console.log(data);
    setAccessToken(loginRes.data.token);
    return await meApi();
  } catch (error) {
    throw getApiError(error);
  }
};
