import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AUTH_TOKEN_KEY } from "@/features/auth/model/constants";

export function AppLayout() {
  const location = useLocation();
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Outlet />
    </div>
  );
}
