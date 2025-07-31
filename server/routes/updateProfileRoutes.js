const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const updateProfile = require("../controller/updateProfile");
const ROLES = require("../utils/roles");

router
  .route("/")
  .put(protect, authorize(ROLES.USER, ROLES.VENDOR, ROLES.ADMIN, ROLES.SUPERADMIN), updateProfile);

module.exports = router;
