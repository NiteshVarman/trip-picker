const express = require("express");
const router = express.Router();
const {
  getAllListings,
  getIndiaPackages,
  getPackageDetails,
  getRecommendations,
  getPlacePackages,
  getInternationalListings,
  getEducationalListings,
  getDevotionalListings,
  getWeekendListings,
  getListingByTitle,
} = require("../controllers/listingController");

router.get("/", getAllListings);
router.get("/india", getIndiaPackages);
router.get("/packagedetails", getPackageDetails);
router.get("/api/recommendations", getRecommendations);
router.get("/place", getPlacePackages);
router.get("/international", getInternationalListings);
router.get("/educational", getEducationalListings);
router.get("/devotional", getDevotionalListings);
router.get("/weekend", getWeekendListings);
// Fetches a single listing by title — used by the payment page on direct
// URL access or page refresh when location.state is not available.
router.get("/title/:title", getListingByTitle);

module.exports = router;