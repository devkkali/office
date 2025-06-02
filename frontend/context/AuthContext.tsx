"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useRouter, usePathname } from "next/navigation";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authMode?: "cookie" | "token";
  setAuthMode: (mode: "cookie" | "token") => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // New state for auth mode
  const [authMode, setAuthMode] = useState<"cookie" | "token">(
    () => (typeof window !== "undefined" && localStorage.getItem("authMode") as "cookie" | "token")
      || (process.env.NEXT_PUBLIC_AUTH_MODE as "cookie" | "token")
      || "cookie"
  );
  const router = useRouter();
  const pathname = usePathname();

  // Persist switch to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("authMode", authMode);
  }, [authMode]);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/login") {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        if (authMode === "token") {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token");
        }
        const res = await axiosClient.get("/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [pathname, authMode]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      let res;
      if (authMode === "token") {
        res = await axiosClient.post("/login", { email, password });
        if (res.data.token) localStorage.setItem("token", res.data.token);
      } else {
        await axiosClient.get("/sanctum/csrf-cookie");
        res = await axiosClient.post("/login", { email, password });
      }
      const userRes = await axiosClient.get("/me");
      setUser(userRes.data);
      router.replace("/");
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, authMode, setAuthMode, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
