"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10 text-center">Loading...</div>;

  if (user.role === "admin") {
    return (
      <div className="max-w-3xl mx-auto my-16 p-8 rounded-2xl bg-white shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Admin Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        {/* admin content here */}
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto my-16 p-8 rounded-2xl bg-white shadow-xl">
      <h1 className="text-3xl font-bold mb-4 text-green-700">User Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      {/* user content here */}
    </div>
  );
}
