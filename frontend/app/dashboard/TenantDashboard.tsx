"use client";
import type { User } from "@/context/AuthContext";

export default function TenantDashboard({ user }: { user: User }) {
  return (
    <div className="max-w-3xl mx-auto my-16 p-8 rounded-2xl bg-white shadow-xl">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Tenant Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      {/* tenant-specific content */}
    </div>
  );
}
