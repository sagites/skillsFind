const router = require("express").Router();
const {
  listAllServiceProviders,
} = require("../controller/users/listAllServiceProviders");
const protect = require("../middleware/protect");

router.route("/").get(protect, listAllServiceProviders);

module.exports = router;