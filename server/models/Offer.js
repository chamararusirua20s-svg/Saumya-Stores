const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Offer description is required"],
      trim: true,
    },
    offerType: {
      type: String,
      enum: ["today", "weekend", "hot", "special", "bogo", "limited"],
      default: "today",
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    image: {
      type: String,
      default: "",
    },
    desktopBanner: {
      type: String,
      default: "",
    },
    mobileBanner: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "Shop Now",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "hidden", "inactive"],
      default: "active",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: [true, "Offer start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Offer end date is required"],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

offerSchema.virtual("active").get(function () {
  return this.enabled && this.status === "active";
});

offerSchema.set("toJSON", { virtuals: true });
offerSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Offer", offerSchema);
