import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { getSession } from "@/lib/auth"

export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
