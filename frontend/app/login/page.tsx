"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If logged in, redirect home
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  // Always show form, even if loading (login form handles its own spinner)
  return <LoginForm />;
}
