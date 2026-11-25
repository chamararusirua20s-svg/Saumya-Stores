const express = require("express");
const {
  getProducts,
  getProductById,
  getProductByBarcode,
  deleteProduct,
  createProduct,
  updateProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public GET routes for product listing and details
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/barcode/:barcode", getProductByBarcode);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
