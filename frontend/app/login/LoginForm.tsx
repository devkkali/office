"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoginForm() {
  const { login, authMode, setAuthMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto my-24 bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 tracking-tight">🔐 Sign In</h2>

      {/* === Auth Mode Switch === */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="authMode"
            value="cookie"
            checked={authMode === "cookie"}
            onChange={() => setAuthMode("cookie")}
            className="accent-blue-600"
          />
          <span className="text-gray-700">Cookie</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="authMode"
            value="token"
            checked={authMode === "token"}
            onChange={() => setAuthMode("token")}
            className="accent-blue-600"
          />
          <span className="text-gray-700">Token</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-semibold">Email</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            type="email"
            autoComplete="username"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 font-semibold">Password</label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg transition disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Logging in...
            </>
          ) : (
            <>Login</>
          )}
        </button>
        {error && (
          <div className="mt-3 text-center text-red-600 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
