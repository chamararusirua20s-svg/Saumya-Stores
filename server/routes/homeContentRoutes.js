const express = require("express");
const {
  getHomeContent,
  updateHomeContent,
} = require("../controllers/homeContentController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getHomeContent).put(protect, admin, updateHomeContent);

module.exports = router;
