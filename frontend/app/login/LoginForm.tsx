"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto mt-20 p-8 rounded-2xl shadow-xl bg-white space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Sign In</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
      <input
        className="w-full border p-3 rounded-lg focus:outline-none"
        placeholder="Email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border p-3 rounded-lg focus:outline-none"
        placeholder="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
