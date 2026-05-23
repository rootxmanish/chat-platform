import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(username.trim(), password);
      toast.success("Account created! Welcome to NexChat.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const usernameValid =
    username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);

  return (
    <div className="min-h-screen bg-void-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-electric-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-iris-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-iris-400 to-electric-500 flex items-center justify-center shadow-glow-iris">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Nex<span className="text-gradient">Chat</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        {/* Card */}
        <div className="border-gradient rounded-2xl p-7 bg-surface">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="choose_username"
                  autoComplete="username"
                  className="w-full bg-void-800 border border-void-600 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-iris-500 focus:ring-1 focus:ring-iris-500/30 transition-all font-mono pr-9"
                />
                {username.length >= 3 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">
                    {usernameValid ? "✓" : "✗"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1.5">
                3–20 chars, letters, numbers & underscores only
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="min. 6 characters"
                autoComplete="new-password"
                className="w-full bg-void-800 border border-void-600 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-iris-500 focus:ring-1 focus:ring-iris-500/30 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="repeat password"
                autoComplete="new-password"
                className={`w-full bg-void-800 border rounded-xl px-4 py-3 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:ring-1 transition-all font-mono ${
                  confirmPassword && password !== confirmPassword
                    ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-void-600 focus:border-iris-500 focus:ring-iris-500/30"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white bg-gradient-to-r from-iris-500 to-iris-600 hover:from-iris-400 hover:to-iris-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-glow-sm hover:shadow-glow-iris mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-iris-400 hover:text-iris-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
