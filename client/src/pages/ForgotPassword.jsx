import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, KeyRound, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/forgot-password", { email });
      setSent(true);
      toast.success(data.message || "Reset code sent!");
      // Navigate to OTP page after short delay
      setTimeout(() => {
        navigate(`/forgot-password/verify?email=${encodeURIComponent(data.email || email)}`);
      }, 1200);
    } catch (err) {
      const errData = err.response?.data;
      if (err.response?.status === 429 && errData?.secondsLeft) {
        toast.error(errData.message || "Please wait before requesting another code.");
      } else {
        toast.error(errData?.message || "Failed to send reset code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 bg-[#F8FAF5]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#16A34A] p-8 text-center text-white space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Forgot Password?</h2>
          <p className="text-xs text-emerald-100 font-medium">
            Enter your email to receive a reset code
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {!sent ? (
            <>
              <p className="text-gray-500 text-sm text-center leading-relaxed">
                Enter your registered email address and we'll send you a 6-digit code to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="input input-icon-left text-sm"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || sent}
                  className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-700 font-semibold text-sm">Reset code sent!</p>
              <p className="text-gray-400 text-xs">Redirecting to verification…</p>
            </div>
          )}

          <div className="text-center border-t border-gray-100 pt-4 space-y-2">
            <p className="text-gray-500 text-xs">
              Remember your password?{" "}
              <Link to="/login" className="text-[#16A34A] font-bold hover:underline">
                Sign In
              </Link>
            </p>
            <p className="text-gray-500 text-xs">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#16A34A] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
