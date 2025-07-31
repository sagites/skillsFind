const router = require("express").Router();
const protect = require("../middleware/protect");
const ROLES = require("../utils/roles");
const { authorize } = require("../middleware/roleMiddleware");
const {
  createReview,
  getReviews,
} = require("../controller/users/reviewController");

router
  .route("/vendor/:vendorId")
  .post(protect, authorize(ROLES.USER), createReview)
  .get(protect, authorize(ROLES.VENDOR, ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN), getReviews);

module.exports = router;
