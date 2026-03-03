import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { AUTH_TOKEN_KEY } from "../services/api";

export function AppLayout() {
  const location = useLocation();
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
