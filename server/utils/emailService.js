const nodemailer = require("nodemailer");

// ── Shared transporter factory ─────────────────────────────────────────────────
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
};

// ── Shared email style constants ───────────────────────────────────────────────
const BRAND_GREEN = "#16A34A";
const BRAND_DARK = "#14532D";
const BRAND_ORANGE = "#F59E0B";
const BG_COLOR = "#F8FAF5";

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Saumya Stores</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_DARK} 0%,${BRAND_GREEN} 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">🛒 Saumya Stores</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Fresh Groceries · Fast Delivery · Wellawaya, Sri Lanka</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F1F5F0;padding:20px 40px;text-align:center;border-top:1px solid #E5EDE5;">
              <p style="margin:0;color:#6B7280;font-size:11px;line-height:1.6;">
                No 54/2 Saumya Stores, Haputhale Road, Wellawaya, Sri Lanka<br/>
                Phone: +94 77 2434 641 · Email: admin@grocery.com
              </p>
              <p style="margin:8px 0 0;color:#9CA3AF;font-size:10px;">© ${new Date().getFullYear()} Saumya Stores. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── OTP Box Component ──────────────────────────────────────────────────────────
const otpBox = (otp) => {
  const digits = String(otp).split("").map(d => `
    <td style="padding:0 4px;">
      <div style="width:44px;height:52px;background:#F0FDF4;border:2px solid ${BRAND_GREEN};border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:${BRAND_DARK};text-align:center;line-height:52px;">${d}</div>
    </td>
  `).join("");

  return `
    <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;">
      <tr>${digits}</tr>
    </table>
  `;
};

// ── 1. Order Confirmation Email ────────────────────────────────────────────────
const sendOrderConfirmationEmail = async (toEmail, customerName, orderId, totalAmount) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured. Order confirmation email skipped.");
    return;
  }

  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;color:${BRAND_DARK};font-size:22px;font-weight:800;">Order Confirmed! 🎉</h2>
    <p style="color:#374151;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hello <strong>${customerName}</strong>, thank you for shopping with us!<br/>
      Your order has been successfully placed and payment received.
    </p>
    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="color:#6B7280;font-size:13px;padding-bottom:6px;">Order ID</td><td style="text-align:right;color:${BRAND_DARK};font-weight:700;font-size:13px;">#${orderId}</td></tr>
        <tr><td style="color:#6B7280;font-size:13px;padding-bottom:6px;">Payment</td><td style="text-align:right;color:#16A34A;font-weight:700;font-size:13px;">✓ Paid</td></tr>
        <tr><td style="color:#6B7280;font-size:13px;">Total</td><td style="text-align:right;color:${BRAND_DARK};font-weight:800;font-size:16px;">Rs. ${Number(totalAmount).toFixed(2)}</td></tr>
      </table>
    </div>
    <p style="color:#6B7280;font-size:13px;text-align:center;margin:0;">We'll notify you when your order is on its way. 🚚</p>
  `);

  try {
    await transporter.sendMail({
      from: `"Saumya Stores" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "✅ Order Confirmed – Saumya Stores",
      html,
    });
    console.log(`Order confirmation email sent to ${toEmail}`);
  } catch (err) {
    console.error("Error sending order confirmation email:", err.message);
  }
};

// ── 2. Registration OTP Email ──────────────────────────────────────────────────
const sendRegistrationOTP = async (toEmail, customerName, otp) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured. Registration OTP email skipped. OTP:", otp);
    return;
  }

  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;color:${BRAND_DARK};font-size:22px;font-weight:800;">Verify Your Email 📧</h2>
    <p style="color:#374151;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hello <strong>${customerName}</strong>! Welcome to Saumya Stores.<br/>
      Use the code below to verify your email address and activate your account.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      ${otpBox(otp)}
      <p style="color:#6B7280;font-size:12px;margin:12px 0 0;">This code expires in <strong>5 minutes</strong></p>
    </div>
    <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0;color:#92400E;font-size:12px;line-height:1.6;">
        ⚠️ <strong>Never share this code</strong> with anyone. Saumya Stores will never ask for your OTP via phone or email.
      </p>
    </div>
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">If you did not create an account, please ignore this email.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"Saumya Stores" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "🔐 Your Verification Code – Saumya Stores",
      html,
    });
    console.log(`Registration OTP email sent to ${toEmail}`);
  } catch (err) {
    console.error("Error sending registration OTP email:", err.message);
  }
};

// ── 3. Password Reset OTP Email ────────────────────────────────────────────────
const sendPasswordResetOTP = async (toEmail, customerName, otp) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured. Password reset OTP email skipped. OTP:", otp);
    return;
  }

  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;color:${BRAND_DARK};font-size:22px;font-weight:800;">Password Reset 🔑</h2>
    <p style="color:#374151;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hello <strong>${customerName}</strong>!<br/>
      We received a request to reset your password. Enter the code below to continue.
    </p>
    <div style="text-align:center;margin:0 0 24px;">
      ${otpBox(otp)}
      <p style="color:#6B7280;font-size:12px;margin:12px 0 0;">This code expires in <strong>5 minutes</strong></p>
    </div>
    <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0;color:#92400E;font-size:12px;line-height:1.6;">
        ⚠️ <strong>Never share this code</strong> with anyone. If you did not request a password reset, please change your password immediately.
      </p>
    </div>
    <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">If you didn't request a password reset, please ignore this email.</p>
  `);

  try {
    await transporter.sendMail({
      from: `"Saumya Stores" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "🔑 Password Reset Code – Saumya Stores",
      html,
    });
    console.log(`Password reset OTP email sent to ${toEmail}`);
  } catch (err) {
    console.error("Error sending password reset OTP email:", err.message);
  }
};

// ── 4. Verification Success Email ─────────────────────────────────────────────
const sendVerificationSuccessEmail = async (toEmail, customerName) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const html = emailWrapper(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background:#F0FDF4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
        <span style="font-size:32px;">✅</span>
      </div>
      <h2 style="margin:0 0 8px;color:${BRAND_DARK};font-size:22px;font-weight:800;">Account Verified!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">
        Hello <strong>${customerName}</strong>! Your email has been verified successfully.<br/>
        You can now log in and start shopping at Saumya Stores.
      </p>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login" style="display:inline-block;background:${BRAND_GREEN};color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Start Shopping →</a>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: `"Saumya Stores" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "✅ Email Verified – Welcome to Saumya Stores!",
      html,
    });
  } catch (err) {
    console.error("Error sending verification success email:", err.message);
  }
};

// ── 5. Password Reset Success Email ───────────────────────────────────────────
const sendPasswordResetSuccessEmail = async (toEmail, customerName) => {
  const transporter = createTransporter();
  if (!transporter) return;

  const html = emailWrapper(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background:#F0FDF4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
        <span style="font-size:32px;">🔒</span>
      </div>
      <h2 style="margin:0 0 8px;color:${BRAND_DARK};font-size:22px;font-weight:800;">Password Changed!</h2>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Hello <strong>${customerName}</strong>! Your password has been reset successfully.<br/>
        You can now log in with your new password.
      </p>
    </div>
    <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:14px 18px;margin-bottom:20px;">
      <p style="margin:0;color:#92400E;font-size:12px;line-height:1.6;">
        ⚠️ If you did not make this change, please contact us immediately at <strong>admin@grocery.com</strong> or call <strong>+94 77 2434 641</strong>.
      </p>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login" style="display:inline-block;background:${BRAND_GREEN};color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Sign In →</a>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: `"Saumya Stores" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "🔒 Password Reset Successful – Saumya Stores",
      html,
    });
  } catch (err) {
    console.error("Error sending password reset success email:", err.message);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendRegistrationOTP,
  sendPasswordResetOTP,
  sendVerificationSuccessEmail,
  sendPasswordResetSuccessEmail,
};
