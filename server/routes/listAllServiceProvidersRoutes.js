const router = require("express").Router();
const {
  listAllServiceProviders,
  getServiceProvider,
} = require("../controller/users/listAllServiceProviders");
const protect = require("../middleware/protect");

router
  .route("/")
  .get(protect, listAllServiceProviders)
  .post(protect, getServiceProvider);

module.exports = router;
