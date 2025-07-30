const router = require("express").Router();
const { authorize } = require("../middleware/roleMiddleware");
const {
  listAllServiceProviders,
  getServiceProvider,
} = require("../controller/vendors/listAllServiceProviders");
const protect = require("../middleware/protect");

router
  .route("/")
  .get(protect, authorize("user"), listAllServiceProviders)
  .post(protect, authorize("user"), getServiceProvider);

module.exports = router;
