const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const {
  createReview,
  getReviews,
} = require("../controller/users/reviewController");

router
  .route("/vendor/:vendorId")
  .post(protect, authorize("user"), createReview)
  .get(protect, authorize("user", "vendor", "admin", "superadmin"), getReviews);

module.exports = router;
