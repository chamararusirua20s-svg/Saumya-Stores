const crypto = require("crypto");

const OTP_SECRET = process.env.OTP_SECRET || process.env.JWT_SECRET || "saumya_otp_secret_2026";

/**
 * Generate a cryptographically secure 6-digit OTP.
 * @returns {string} 6-digit string (zero-padded)
 */
const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999);
  return String(otp);
};

/**
 * Hash an OTP using HMAC-SHA256 so it is not stored in plain text.
 * @param {string} otp
 * @returns {string} hex digest
 */
const hashOTP = (otp) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(String(otp))
    .digest("hex");
};

/**
 * Generate a cryptographically secure reset token (hex string).
 * @returns {{ rawToken: string, tokenHash: string }}
 */
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHmac("sha256", OTP_SECRET)
    .update(rawToken)
    .digest("hex");
  return { rawToken, tokenHash };
};

/**
 * Hash a reset token (same mechanism as OTP hash).
 * @param {string} rawToken
 * @returns {string} hex digest
 */
const hashResetToken = (rawToken) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(rawToken)
    .digest("hex");
};

module.exports = { generateOTP, hashOTP, generateResetToken, hashResetToken };
