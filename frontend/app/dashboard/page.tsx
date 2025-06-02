"use client";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import TenantDashboard from "./TenantDashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { isMainDomain } = useTenant();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10 text-center">Loading...</div>;

  // Show Admin dashboard if on main domain, else show tenant dashboard
  return isMainDomain
    ? <AdminDashboard user={user} />
    : <TenantDashboard user={user} />;
}
