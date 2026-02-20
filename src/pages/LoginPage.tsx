"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/login.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { useAuth } from "@/features/auth/auth.context";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      navigate(from, { replace: true });

      toast.success("Đăng nhập thành công");
    } catch (error: unknown) {
      let message = "Đăng nhập thất bại";

      if (error instanceof Error) {
        message = error.message;
      }

      setError("username", { message });
      setError("password", { message });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-700 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-700 text-white">
            <FileText className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Đăng nhập
          </CardTitle>
          <CardDescription>
            Hệ thống Quản lý Phiếu mượn
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Tên đăng nhập</Label>
              <Input
                placeholder="Tên đăng nhập"
                {...register("username")}
              />
            </div>

            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {(errors.password || errors.username) && (
                <p className="text-sm text-red-500">
                  {errors.username?.message || errors.password?.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
