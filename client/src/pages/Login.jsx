import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || "/";

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, user, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email.trim(), password, rememberMe);
    if (result.success) {
      toast.success("Welcome back to Saumya Stores!");
    } else if (result.requiresVerification) {
      toast.error("Please verify your email before logging in.");
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } else {
      toast.error(result.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 bg-[#F5F8F2]">
      <div className="max-w-[440px] w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(20,83,45,0.08)] border border-gray-100 overflow-hidden transition-all duration-300">
        {/* Card Header with Fresh Supermarket Branding */}
        <div className="bg-gradient-to-br from-[#14532D] via-[#15803D] to-[#16A34A] px-6 py-8 sm:px-8 text-center text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto shadow-md">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="inline-flex items-center space-x-1 text-[11px] font-black uppercase tracking-wider bg-white/20 text-emerald-100 px-3 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-300 mr-1" />
              <span>Saumya Stores</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xs mx-auto">
              Sign in to access your fresh grocery basket & account
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                Email Address <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-gray-400">
                  <Mail className="w-4.5 h-4.5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="input input-icon-left text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password with Functional Show/Hide */}
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-wide mb-1.5">
                Password <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-gray-400">
                  <Lock className="w-4.5 h-4.5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-icon-left input-icon-right text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5 text-gray-500" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Alignment */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A] border-gray-300 accent-[#16A34A]"
                />
                <span className="font-semibold text-xs sm:text-sm">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm font-bold text-[#16A34A] hover:text-[#14532D] hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full h-12 text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:shadow-emerald-700/30 active:scale-[0.99] transition-all duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Shop</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Bottom Free Account Link */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-gray-500 text-xs sm:text-sm font-medium">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-[#16A34A] font-extrabold hover:underline">
                Create Free Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
