import { LogOut, Shield } from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { clearSession, getSession } from "@/lib/auth"
import { cn } from "@/lib/utils"

export default function DashboardLayout() {
  const navigate = useNavigate()
  const session = getSession()

  function logout() {
    clearSession()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="flex w-64 flex-col border-r bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold leading-tight">Assets Management</div>
              <div className="text-xs text-muted-foreground leading-tight">Bảo vệ</div>
            </div>
          </div>

          <nav className="p-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted",
                  isActive ? "bg-muted font-medium" : "text-foreground",
                )
              }
            >
              Phiếu mượn
            </NavLink>
          </nav>

          <div className="mt-auto border-t p-4">
            <div className="text-left text-sm font-medium">{session?.username ?? ""}</div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
