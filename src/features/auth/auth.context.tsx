"use client";

/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { LoginFormValues } from "./login.schema";
import type { MeResponse, AuthContextValue } from "@/types/auth";

import { loginService } from "./login.service";
import { meApi } from "@/api/auth.api";
import { getAccessToken, removeAccessToken } from "@/lib/cookies";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (data: LoginFormValues) => {
    const meRes = await loginService(data);
    setUser(meRes.data);
  };

  const logout = () => {
    removeAccessToken();
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await meApi();
        setUser(res.data);
      } catch {
        removeAccessToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
