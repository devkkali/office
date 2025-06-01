// app/dashboard/DashboardContent.tsx
"use client";
import { useAuth } from "@/context/AuthContext";

export default function DashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "admin") {
    // ...
  }
  // ...
}
