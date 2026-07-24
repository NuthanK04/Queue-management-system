import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post(isRegistering ? "/auth/register" : "/auth/login", isRegistering
        ? { name, email, password }
        : { email, password });

      login(response.data.token, response.data.user);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Queue Management
        </h1>

        <p className="mb-6 text-center text-gray-500">
          {isRegistering ? "Create your manager account" : "Manager Login"}
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : isRegistering ? "Create account" : "Login"}
          </button>
        </form>
        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="mt-5 w-full text-sm font-medium text-blue-600 hover:text-blue-700">
          {isRegistering ? "Already have an account? Log in" : "New here? Create a manager account"}
        </button>
      </div>
    </div>
  );
}
