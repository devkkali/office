"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  // Show spinner if checking auth
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // Show form if not authenticated
  return <LoginForm />;
}
