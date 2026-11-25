const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    badge: { type: String, default: "", trim: true },
    offer: { type: String, default: "", trim: true },
    bg: { type: String, required: true },
    link: { type: String, default: "/shop" },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

const promoBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
    bgGradient: { type: String, default: "from-amber-500 to-orange-600" },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

const featuredSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: "homepage",
      unique: true,
    },
    heroSlides: {
      type: [heroSlideSchema],
      default: [],
    },
    promotionalBanners: {
      type: [promoBannerSchema],
      default: [],
    },
    homepageCategories: {
      type: [String],
      default: [],
    },
    featuredSections: {
      type: [featuredSectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
