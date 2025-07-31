const router = require("express").Router();
const ROLES = require("../utils/roles");
const { authorize } = require("../middleware/roleMiddleware");
const {
  listAllServiceProviders,
  getServiceProvider,
} = require("../controller/vendors/listAllServiceProviders");
const protect = require("../middleware/protect");

router
  .route("/")
  .get(protect, authorize(ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN), listAllServiceProviders)
  .post(protect, authorize(ROLES.USER), getServiceProvider);

module.exports = router;
