import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, Mail, RefreshCw, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import BrandLogo from "../components/BrandLogo";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

const OtpVerification = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef([]);

  // ── Auto-start cooldown on mount ──────────────────────────────────────────
  useEffect(() => {
    setResendTimer(RESEND_COOLDOWN);
  }, []);

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // ── Focus first input on mount ────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  }, []);

  const handleChange = (index, value) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (digit && index === OTP_LENGTH - 1) {
      const filled = [...newOtp.slice(0, -1), digit];
      if (filled.every((d) => d !== "")) {
        handleVerify(filled.join(""));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[nextFocus]?.focus();
    if (pasted.length === OTP_LENGTH) handleVerify(pasted);
  };

  const handleVerify = async (otpCode) => {
    const code = otpCode || otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-otp", { email, otp: code });
      setVerified(true);
      toast.success(data.message || "Email verified successfully!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed. Please try again.";
      toast.error(msg);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendLoading(true);
    try {
      const { data } = await axios.post("/api/auth/resend-otp", { email });
      toast.success(data.message || "New code sent to your email.");
      setResendTimer(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.secondsLeft) {
        setResendTimer(errData.secondsLeft);
      }
      toast.error(errData?.message || "Failed to resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F8FAF5]">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#14532D] mb-2">Email Verified!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your account has been activated. Redirecting to login…
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
          <h2 className="text-2xl font-black tracking-tight">Verify Your Email</h2>
          <p className="text-xs text-emerald-100 font-medium">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Email hint */}
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 font-medium truncate">{email}</p>
          </div>

          <p className="text-gray-500 text-sm text-center leading-relaxed">
            We've sent a 6-digit verification code to your email address.
            The code expires in <span className="font-bold text-gray-700">5 minutes</span>.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border-2 outline-none
                  transition-all duration-200 bg-gray-50
                  ${digit ? "border-[#16A34A] bg-green-50 text-[#14532D]" : "border-gray-200 text-gray-700"}
                  focus:border-[#16A34A] focus:bg-green-50 focus:ring-4 focus:ring-green-100
                `}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.some((d) => d === "")}
            className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-xs">Didn't receive the code?</p>
            {resendTimer > 0 ? (
              <p className="text-gray-400 text-xs font-medium">
                Resend available in{" "}
                <span className="text-[#16A34A] font-bold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-[#16A34A] font-bold text-sm hover:underline flex items-center gap-1.5 mx-auto transition-colors"
              >
                {resendLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Resend Code
              </button>
            )}
          </div>

          <div className="text-center border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-xs">
              Wrong email?{" "}
              <Link to="/register" className="text-[#16A34A] font-bold hover:underline">
                Go back to Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
