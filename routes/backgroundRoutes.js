const express = require("express");
const router = express.Router();

const {
  getBackgrounds,
  addBackground,
  deleteBackground,
} = require("../controllers/backgroundController");

const upload = require("../middleware/uploadBackground");

// Get all backgrounds
router.get("/", getBackgrounds);

// Add background (Upload Image)
router.post("/", upload.single("image"), addBackground);

// Delete background
router.delete("/:id", deleteBackground);

module.exports = router;