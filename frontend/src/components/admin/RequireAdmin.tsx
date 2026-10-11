import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { AdminLayout } from "./AdminLayout";

export function RequireAdmin({ children }: PropsWithChildren) {
  const { user, loading } = useAdminAuth();

  if (loading) return <p className="p-6">Laster…</p>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <AdminLayout>{children}</AdminLayout>;
}
