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
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // 1. If loading (checking auth), show a spinner.
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // 2. Not logged in? Show the login form.
  return <LoginForm />;
}
