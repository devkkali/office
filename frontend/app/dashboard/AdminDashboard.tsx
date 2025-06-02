"use client";
import { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import type { User } from "@/context/AuthContext";

export default function AdminDashboard({ user }: { user: User }) {
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await axiosClient.post("/tenant", { name: tenantName });
      setSuccess("Tenant created: " + res.data?.name);
      setTenantName("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create tenant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-16 p-8 rounded-2xl bg-white shadow-xl">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">Admin Dashboard</h1>
      <p className="mb-8">Welcome, {user.name}!</p>
      <form onSubmit={handleCreateTenant} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border px-4 py-2 rounded-lg flex-1"
          placeholder="Tenant name"
          value={tenantName}
          onChange={e => setTenantName(e.target.value)}
          required
          disabled={loading}
        />
        <button
          className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg disabled:bg-blue-400 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Tenant"}
        </button>
      </form>
      {success && <div className="text-green-700">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
      {/* Other admin content here */}
    </div>
  );
}
