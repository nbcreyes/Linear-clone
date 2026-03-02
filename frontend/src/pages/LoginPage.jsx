import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      login(data);

      // Check if there is a pending invite code from a shared link
      const pendingInviteCode = localStorage.getItem("pendingInviteCode");
      if (pendingInviteCode) {
        localStorage.removeItem("pendingInviteCode");
        navigate(`/join/${pendingInviteCode}`);
      } else {
        navigate("/issues");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Linear Clone
          </h1>
          <p className="text-[#8a8a8a] text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8a8a8a] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8a8a8a] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-sm font-medium py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-[#8a8a8a]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#5e5ce6] hover:text-[#4f4dd4] transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
