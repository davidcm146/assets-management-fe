import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/auth.context";
import { Loader2 } from "lucide-react";

export default function PublicRoutes() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
