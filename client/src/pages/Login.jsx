import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShoppingBag, ShieldCheck, UserCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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
    const result = await login(email, password, rememberMe);
    if (result.success) {
      toast.success("Welcome back to Saumya Stores!");
    } else {
      toast.error(result.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#F8FAF5]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#16A34A] p-8 text-center text-white space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className="text-xs text-emerald-100 font-medium">
            Sign in to access your Saumya Stores account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input pl-10 text-xs"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="input pl-10 text-xs"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#16A34A] focus:ring-[#16A34A] w-4 h-4"
                />
                <span>Remember me</span>
              </label>
              <Link to="/register" className="text-[#16A34A] hover:underline font-bold">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20"
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

          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-[#16A34A] font-bold hover:underline">
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
