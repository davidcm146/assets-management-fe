import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/LoginPage";
import Home from "@/pages/Home";
import LoanSlipManagement from "@/pages/LoanSlipManagement";
import Log from "@/pages/Log";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import LoanSlipDetailPage from "@/pages/LoanSlipDetailPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <Home /> },
          { path: "loan-slips", element: <LoanSlipManagement /> },
          { path: "loan-slips/:id", element: <LoanSlipDetailPage /> },
          { path: "audit-logs", element: <Log /> }
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
