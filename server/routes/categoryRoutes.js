const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Allow public GET for listing categories; creation and deletion remain protected
router.route("/").get(getCategories).post(protect, admin, createCategory);
router.route("/:id").delete(protect, admin, deleteCategory);

module.exports = router;
