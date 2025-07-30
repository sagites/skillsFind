const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const updateProfile = require("../controller/updateProfile");

router.route("/").put(protect, authorize("vendor"), updateProfile);

module.exports = router;
