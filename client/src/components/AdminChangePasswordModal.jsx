import React, { useState, useContext } from "react";
import axios from "axios";
import { ShieldAlert, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const AdminChangePasswordModal = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Only show if user is admin and mustChangePassword is true
  if (!user || user.role !== "admin" || !user.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword === "Admin@123") {
      setError("You cannot use the temporary initial password. Please choose a new secure password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/auth/change-password",
        { newPassword },
        config
      );

      // Update state and storage so modal dismisses
      updateUserData({ mustChangePassword: false });
      toast.success("Admin password changed successfully! Your account is now secure.");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Uncloseable backdrop */}
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Security Update Required</h2>
          <p className="text-xs text-amber-100 mt-1 font-medium">
            You must change the initial administrator password before accessing the admin dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              New Secure Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="input pl-10 text-xs w-full"
                placeholder="Enter new password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                className="input pl-10 text-xs w-full"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-emerald-700/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Password & Continue</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePasswordModal;
