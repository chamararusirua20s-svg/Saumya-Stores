import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, KeyRound, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import BrandLogo from "../components/BrandLogo";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0–9)", test: (p) => /\d/.test(p) },
  { label: "Special character (!@#$…)", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email      = searchParams.get("email") || "";
  const resetToken = searchParams.get("token") || "";
  const navigate   = useNavigate();

  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [showStrength, setShowStrength]       = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [success, setSuccess]                 = useState(false);

  useEffect(() => {
    if (!email || !resetToken) navigate("/forgot-password");
  }, [email, resetToken, navigate]);

  const passwordStrength = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(newPassword),
  }));
  const passedCount = passwordStrength.filter((r) => r.passed).length;
  const strengthColor =
    passedCount <= 2 ? "#EF4444" : passedCount <= 3 ? "#F59E0B" : passedCount === 4 ? "#3B82F6" : "#16A34A";
  const strengthLabel =
    passedCount <= 2 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount === 4 ? "Good" : "Strong";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password doesn't meet the security requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        email,
        resetToken,
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      toast.success(data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed. Please start over.";
      toast.error(msg);
      if (
        msg.toLowerCase().includes("expired") ||
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("start over")
      ) {
        setTimeout(() => navigate("/forgot-password"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F8FAF5]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#14532D] mb-2">Password Reset!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your password has been updated. Redirecting to login…
          </p>
          <Link
            to="/login"
            className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            Go to Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 bg-[#F8FAF5]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#16A34A] p-8 text-center text-white space-y-3">
          <BrandLogo variant="card" size="lg" />
          <h2 className="text-2xl font-black tracking-tight">Reset Password</h2>
          <p className="text-xs text-emerald-100 font-medium">
            Create a strong new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <p className="text-gray-500 text-xs text-center">
            Setting new password for <span className="font-semibold text-gray-700">{email}</span>
          </p>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showNew ? "text" : "password"}
                className="input input-icon-left pr-11 text-sm"
                placeholder="Min 8 chars · Upper · Lower · Number · Symbol"
                value={newPassword}
                onFocus={() => setShowStrength(true)}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength indicator */}
            {showStrength && newPassword.length > 0 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-500">Strength</span>
                  <span className="text-[11px] font-bold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${(passedCount / 5) * 100}%`, backgroundColor: strengthColor }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {passwordStrength.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      {rule.passed ? (
                        <CheckCircle className="w-3 h-3 flex-shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 flex-shrink-0 text-gray-300" />
                      )}
                      <span className={`text-[10px] font-medium ${rule.passed ? "text-green-600" : "text-gray-400"}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                className="input input-icon-left pr-11 text-sm"
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold">Passwords do not match.</p>
            )}
            {confirmPassword && newPassword === confirmPassword && newPassword.length > 0 && (
              <p className="text-green-500 text-[11px] mt-1 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || passedCount < 5 || newPassword !== confirmPassword}
            className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-xs">
              <Link to="/login" className="text-[#16A34A] font-bold hover:underline">
                ← Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
