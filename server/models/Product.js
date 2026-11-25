const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Variant selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },
    buyingPrice: {
      type: Number,
      required: [true, "Variant buying price is required"],
      min: [0, "Buying price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Variant stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    barcode: {
      type: String,
      required: [true, "Barcode is required"],
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    buyingPrice: {
      type: Number,
      required: [true, "Buying price is required"],
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      default: 0,
    },
    variants: {
      type: [productVariantSchema],
      validate: {
        validator: (variants) => Array.isArray(variants) && variants.length > 0,
        message: "At least one product variant is required",
      },
      default: undefined,
    },
    stockLevel: {
      type: Number,
      required: [true, "Minimum stock level is required"],
      default: 10,
    },
    expiryDate: {
      type: Date,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300?text=Product+Image",
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (!this.variants || this.variants.length === 0) {
    this.variants = [
      {
        name: "Default",
        sellingPrice: this.sellingPrice || 0,
        buyingPrice: this.buyingPrice || 0,
        stock: this.quantity || 0,
        sku: this.barcode || "",
      },
    ];
  }

  const firstVariant = this.variants[0];
  this.sellingPrice = firstVariant.sellingPrice;
  this.buyingPrice = firstVariant.buyingPrice;
  this.quantity = this.variants.reduce(
    (total, variant) => total + (Number(variant.stock) || 0),
    0
  );

  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
