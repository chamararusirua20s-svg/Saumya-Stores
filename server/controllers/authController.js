const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP, hashOTP, generateResetToken, hashResetToken } = require("../utils/otpService");
const {
  sendRegistrationOTP,
  sendPasswordResetOTP,
  sendVerificationSuccessEmail,
  sendPasswordResetSuccessEmail,
} = require("../utils/emailService");

// ── Constants ──────────────────────────────────────────────────────────────────
const OTP_EXPIRY_MS        = 5 * 60 * 1000;       // 5 minutes
const OTP_RESEND_COOLDOWN  = 60 * 1000;            // 60 seconds
const OTP_MAX_ATTEMPTS     = 5;
const RESET_TOKEN_EXPIRY_MS= 10 * 60 * 1000;      // 10 minutes
const PASSWORD_REGEX       = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;

// ── Token generator ────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user (sends OTP – does NOT return a JWT yet)
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, deliveryAddress } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ── Password strength ─────────────────────────────────────────────────────
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // ── Sri Lankan phone validation ───────────────────────────────────────────
    const phoneRegex = /^(?:\+94|0)?7\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid Sri Lankan mobile number." });
    }

    // ── Check duplicate email ─────────────────────────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "An account with this email already exists." });
      }
      // User exists but is unverified – resend OTP flow
      const otp = generateOTP();
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.deliveryAddress = deliveryAddress || "";
      existingUser.otpHash = hashOTP(otp);
      existingUser.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
      existingUser.otpAttempts = 0;
      existingUser.otpLastSent = new Date();
      await existingUser.save({ validateBeforeSave: false });
      await sendRegistrationOTP(existingUser.email, existingUser.name, otp);
      return res.status(200).json({
        message: "A new verification code has been sent to your email.",
        email: existingUser.email,
      });
    }

    // ── Create unverified user ────────────────────────────────────────────────
    const otp = generateOTP();
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      deliveryAddress: deliveryAddress || "",
      role: "customer",
      mustChangePassword: false,
      isVerified: false,
      otpHash: hashOTP(otp),
      otpExpiry: new Date(Date.now() + OTP_EXPIRY_MS),
      otpAttempts: 0,
      otpLastSent: new Date(),
    });

    await sendRegistrationOTP(user.email, user.name, otp);

    return res.status(201).json({
      message: "Account created. Please check your email for the verification code.",
      email: user.email,
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify OTP after registration
// @route   POST /api/auth/verify-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+otpHash +otpExpiry +otpAttempts"
    );

    if (!user) return res.status(404).json({ message: "Account not found." });
    if (user.isVerified) return res.status(400).json({ message: "Email is already verified." });

    // Attempts limit
    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new verification code.",
      });
    }

    // Expiry check
    if (!user.otpExpiry || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    // OTP match
    if (!user.otpHash || user.otpHash !== hashOTP(otp)) {
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      const remaining = OTP_MAX_ATTEMPTS - user.otpAttempts;
      return res.status(400).json({
        message: `Incorrect code. ${remaining > 0 ? `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` : "Account locked – request a new code."}`,
      });
    }

    // ── Activate account ──────────────────────────────────────────────────────
    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    // Send success email (non-blocking)
    sendVerificationSuccessEmail(user.email, user.name).catch(() => {});

    return res.json({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (err) {
    console.error("verifyRegistrationOTP error:", err);
    res.status(500).json({ message: "Verification failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Resend registration OTP
// @route   POST /api/auth/resend-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const resendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+otpLastSent +otpAttempts"
    );

    if (!user) return res.status(404).json({ message: "Account not found." });
    if (user.isVerified) return res.status(400).json({ message: "Email is already verified." });

    // Cooldown check
    if (user.otpLastSent && Date.now() - new Date(user.otpLastSent).getTime() < OTP_RESEND_COOLDOWN) {
      const secondsLeft = Math.ceil(
        (OTP_RESEND_COOLDOWN - (Date.now() - new Date(user.otpLastSent).getTime())) / 1000
      );
      return res.status(429).json({
        message: `Please wait ${secondsLeft} second${secondsLeft !== 1 ? "s" : ""} before requesting a new code.`,
        secondsLeft,
      });
    }

    const otp = generateOTP();
    user.otpHash = hashOTP(otp);
    user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
    user.otpAttempts = 0;
    user.otpLastSent = new Date();
    await user.save({ validateBeforeSave: false });

    await sendRegistrationOTP(user.email, user.name, otp);

    return res.json({ message: "A new verification code has been sent to your email." });
  } catch (err) {
    console.error("resendRegistrationOTP error:", err);
    res.status(500).json({ message: "Failed to resend code. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Block unverified customers (admin accounts bypass this check)
    if (user.role === "customer" && !user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      deliveryAddress: user.deliveryAddress,
      mustChangePassword: Boolean(user.mustChangePassword),
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      deliveryAddress: user.deliveryAddress,
      mustChangePassword: Boolean(user.mustChangePassword),
    });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ message: "Failed to retrieve profile." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Change password (admin first-login or account settings)
// @route   PUT /api/auth/change-password
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || !PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters with uppercase, lowercase, number, and special character.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found." });

    if (currentPassword && !(await user.comparePassword(currentPassword, user.password))) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: false,
      token: generateToken(user._id),
      message: "Password changed successfully.",
    });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Password change failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Forgot password – send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetOtpLastSent"
    );

    // Always return success to prevent email enumeration
    if (!user || !user.isVerified) {
      return res.json({
        message: "If this email is registered, a password reset code has been sent.",
      });
    }

    // Cooldown (reuse otpLastSent logic via resetOtpLastSent)
    if (user.otpLastSent && Date.now() - new Date(user.otpLastSent).getTime() < OTP_RESEND_COOLDOWN) {
      const secondsLeft = Math.ceil(
        (OTP_RESEND_COOLDOWN - (Date.now() - new Date(user.otpLastSent).getTime())) / 1000
      );
      return res.status(429).json({
        message: `Please wait ${secondsLeft} seconds before requesting another reset code.`,
        secondsLeft,
      });
    }

    const otp = generateOTP();
    user.resetOtpHash = hashOTP(otp);
    user.resetOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
    user.resetOtpAttempts = 0;
    user.otpLastSent = new Date(); // reuse this field for cooldown
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetOTP(user.email, user.name, otp);

    return res.json({
      message: "If this email is registered, a password reset code has been sent.",
      email: user.email, // returned so frontend can pass it to next step
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Failed to send reset code. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify password reset OTP – returns a short-lived reset token
// @route   POST /api/auth/verify-reset-otp
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetOtpHash +resetOtpExpiry +resetOtpAttempts"
    );

    if (!user) return res.status(404).json({ message: "Account not found." });

    if (user.resetOtpAttempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Too many failed attempts. Please request a new reset code." });
    }

    if (!user.resetOtpExpiry || new Date() > new Date(user.resetOtpExpiry)) {
      return res.status(400).json({ message: "Reset code has expired. Please request a new one." });
    }

    if (!user.resetOtpHash || user.resetOtpHash !== hashOTP(otp)) {
      user.resetOtpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      const remaining = OTP_MAX_ATTEMPTS - user.resetOtpAttempts;
      return res.status(400).json({
        message: `Incorrect code. ${remaining > 0 ? `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` : "Account locked – request a new code."}`,
      });
    }

    // OTP valid – generate a short-lived reset token
    const { rawToken, tokenHash } = generateResetToken();
    user.resetTokenHash = tokenHash;
    user.resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
    user.resetOtpHash = undefined;
    user.resetOtpExpiry = undefined;
    user.resetOtpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    return res.json({
      message: "OTP verified. Proceed to reset your password.",
      resetToken: rawToken,
      email: user.email,
    });
  } catch (err) {
    console.error("verifyResetOTP error:", err);
    res.status(500).json({ message: "OTP verification failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+resetTokenHash +resetTokenExpiry +password"
    );

    if (!user) return res.status(404).json({ message: "Account not found." });

    if (!user.resetTokenHash || !user.resetTokenExpiry) {
      return res.status(400).json({ message: "Invalid or expired reset session. Please start over." });
    }

    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).json({ message: "Reset session has expired. Please start over." });
    }

    if (user.resetTokenHash !== hashResetToken(resetToken)) {
      return res.status(400).json({ message: "Invalid reset token. Please start over." });
    }

    // ── Update password ───────────────────────────────────────────────────────
    user.password = newPassword;
    user.resetTokenHash = undefined;
    user.resetTokenExpiry = undefined;
    user.mustChangePassword = false;
    await user.save();

    // Send success email (non-blocking)
    sendPasswordResetSuccessEmail(user.email, user.name).catch(() => {});

    return res.json({ message: "Password reset successfully. You can now log in with your new password." });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Password reset failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
// ─────────────────────────────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");
    res.json(users);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Failed to retrieve users." });
  }
};

module.exports = {
  loginUser,
  registerUser,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  getUserProfile,
  changePassword,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getUsers,
};
