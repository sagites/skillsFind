const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const { createReview } = require("../controller/users/reviewController");

router.route("/vendor/:vendorId").post(protect, authorize("user"), createReview);

module.exports = router;