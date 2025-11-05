import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authApi } from "../api/authClient";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking"); // 'checking' | 'ok' | 'fail'

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await authApi("/auth/me", { withAuth: true });
      if (!cancelled) setStatus(res.ok ? "ok" : "fail");
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === "checking") {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Проверка доступа…</div>;
  }
  return status === "ok" ? <Outlet /> : <Navigate to="/login" replace />;
}
