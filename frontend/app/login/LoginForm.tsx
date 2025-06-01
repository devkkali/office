"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginForm() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto my-24 p-8 rounded-2xl bg-white shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="mb-4 w-full px-4 py-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="mb-4 w-full px-4 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full py-2 rounded bg-blue-700 text-white font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  );
}
