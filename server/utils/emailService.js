const nodemailer = require("nodemailer");

/**
 * Sends a professional order confirmation email to the user.
 * 
 * @param {string} toEmail - Customer's registered email address.
 * @param {string} customerName - Customer's name.
 * @param {string} orderId - The generated order ID.
 * @param {number} totalAmount - Total amount paid.
 */
const sendOrderConfirmationEmail = async (toEmail, customerName, orderId, totalAmount) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP email configurations (SMTP_HOST, SMTP_USER, SMTP_PASS) are missing in environment variables. Email confirmation skipped.");
    return;
  }

  // Create transporter configuration
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Saumya Stores" <${user}>`,
    to: toEmail,
    subject: "Saumya Stores - Order Confirmation",
    text: `Hello ${customerName},

Your payment was successful and your order has been placed successfully.

Order ID: ${orderId}
Payment Method: Credit/Debit Card
Payment Status: Paid
Order Total: Rs. ${totalAmount.toFixed(2)}

Thank you for shopping with Saumya Stores.

Saumya Stores Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email successfully sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
