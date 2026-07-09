const express = require("express");
const {
  getPublicOffers,
  getAdminOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
} = require("../controllers/offerController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getPublicOffers);
router.route("/admin").get(protect, admin, getAdminOffers).post(protect, admin, createOffer);
router
  .route("/admin/:id")
  .get(protect, admin, getOfferById)
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);
router.route("/admin/:id/toggle").put(protect, admin, toggleOffer);

module.exports = router;
