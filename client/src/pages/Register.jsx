import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShoppingBag,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0–9)", test: (p) => /\d/.test(p) },
  { label: "Special character (!@#$…)", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

const Register = () => {
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [phone, setPhone]                   = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [showStrength, setShowStrength]     = useState(false);
  const [loading, setLoading]               = useState(false);
  const [errors, setErrors]                 = useState({});

  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const redirect  = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) navigate(redirect);
  }, [navigate, user, redirect]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Full name is required.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";

    const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
    if (!phone) newErrors.phone = "Phone number is required.";
    else if (!phoneRegex.test(phone)) newErrors.phone = "Invalid Sri Lankan mobile (e.g. 0771234567).";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
    if (!password) newErrors.password = "Password is required.";
    else if (!passwordRegex.test(password)) newErrors.password = "Password doesn't meet the requirements below.";

    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
        phone,
        deliveryAddress,
      });
      toast.success(data.message || "Verification code sent to your email!");
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
  const passedCount = passwordStrength.filter((r) => r.passed).length;

  const strengthColor =
    passedCount <= 2 ? "#EF4444" : passedCount <= 3 ? "#F59E0B" : passedCount === 4 ? "#3B82F6" : "#16A34A";
  const strengthLabel =
    passedCount <= 2 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount === 4 ? "Good" : "Strong";

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-10 px-4 bg-[#F8FAF5]">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#16A34A] p-8 text-center text-white space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Create Account</h2>
          <p className="text-xs text-emerald-100 font-medium">
            Join Saumya Stores · Fresh Groceries · Fast Delivery
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="p-6 sm:p-8 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <UserIcon className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="input input-icon-left text-sm"
                placeholder="e.g. Kasun Perera"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                required
              />
            </div>
            {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name}</p>}
          </div>

          {/* Email */}
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
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Sri Lankan Mobile Number</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="tel"
                className="input input-icon-left text-sm"
                placeholder="0771234567"
                value={phone}
                maxLength={12}
                onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                required
              />
            </div>
            {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone}</p>}
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Delivery Address <span className="text-gray-400 font-normal">(optional – you can add this later)</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 pointer-events-none">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <textarea
                className="input input-icon-left text-sm resize-none"
                style={{ height: "84px", paddingTop: "12px", paddingBottom: "12px" }}
                placeholder="No. 54/2, Haputhale Road, Wellawaya, Sri Lanka"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-icon-left pr-11 text-sm"
                placeholder="Min 8 chars · Upper · Lower · Number · Symbol"
                value={password}
                onFocus={() => setShowStrength(true)}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.password}</p>}

            {/* Password Strength */}
            {showStrength && password.length > 0 && (
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
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                className="input input-icon-left pr-11 text-sm"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
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
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold">Passwords do not match.</p>
            )}
            {confirmPassword && password === confirmPassword && password.length > 0 && (
              <p className="text-green-500 text-[11px] mt-1 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Passwords match
              </p>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account & Verify Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-gray-500 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-[#16A34A] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
