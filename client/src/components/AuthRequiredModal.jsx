import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, UserPlus, X, Sparkles } from "lucide-react";
import { AuthModalContext } from "../context/AuthModalContext";
import BrandLogo from "./BrandLogo";

const AuthRequiredModal = () => {
  const { isAuthModalOpen, closeAuthModal, redirectPath } = useContext(AuthModalContext);
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  const handleLogin = () => {
    closeAuthModal();
    navigate("/login", { state: { from: redirectPath || "/" } });
  };

  const handleRegister = () => {
    closeAuthModal();
    navigate("/register", { state: { from: redirectPath || "/" } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden z-10 transform transition-all animate-scale-up">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors z-20"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#16A34A] p-6 text-center text-white relative">
          <div className="mb-3">
            <BrandLogo variant="card" size="md" href={null} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Account Required
          </h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 text-center">
          <div className="space-y-2">
            <p className="text-base font-bold text-gray-900 leading-snug">
              Please log in or create an account to continue shopping.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Join Saumya Stores to add fresh groceries to your cart, enjoy special supermarket discounts, and track your orders.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleLogin}
              className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20"
            >
              <span>Log In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRegister}
              className="w-full py-3 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4 text-[#16A34A]" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Guest browsing notice */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={closeAuthModal}
              className="text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors"
            >
              Continue browsing as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
