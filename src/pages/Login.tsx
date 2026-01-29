import { zodResolver } from "@hookform/resolvers/zod"
import { Shield } from "lucide-react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"
import { setSession } from "@/lib/auth"

const loginSchema = z.object({
  username: z.string().trim().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().trim().min(1, "Vui lòng nhập mật khẩu"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  })

  function onSubmit(values: LoginValues) {
    setSession({ username: values.username.trim() })
    const state = location.state as { from?: { pathname?: string } } | null
    navigate(state?.from?.pathname ?? "/", { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold">Đăng nhập</div>
              <div className="text-sm text-muted-foreground">Dành cho user nhập</div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tên đăng nhập</label>
              <input
                {...form.register("username")}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="VD: guard01"
              />
              {form.formState.errors.username ? (
                <div className="text-xs text-destructive">{form.formState.errors.username.message}</div>
              ) : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Mật khẩu</label>
              <input
                {...form.register("password")}
                type="password"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
              {form.formState.errors.password ? (
                <div className="text-xs text-destructive">{form.formState.errors.password.message}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
