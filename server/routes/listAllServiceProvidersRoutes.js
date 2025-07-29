const router = require("express").Router();
const {
  listAllServiceProviders,
  getServiceProvider,
} = require("../controller/vendors/listAllServiceProviders");
const protect = require("../middleware/protect");

router
  .route("/")
  .get(protect, listAllServiceProviders)
  .post(protect, getServiceProvider);

module.exports = router;
