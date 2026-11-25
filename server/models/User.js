const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    address: {
      street: String,
      city: String,
      zipCode: String,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ── Email Verification ─────────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpHash: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    otpLastSent: {
      type: Date,
    },

    // ── Password Reset ─────────────────────────────────────────────────────────
    resetOtpHash: {
      type: String,
      select: false,
    },
    resetOtpExpiry: {
      type: Date,
    },
    resetOtpAttempts: {
      type: Number,
      default: 0,
    },
    resetTokenHash: {
      type: String,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
