const express = require("express");
const {
  loginUser,
  registerUser,
  getUserProfile,
  getUsers,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/users", protect, admin, getUsers);

module.exports = router;
