const router = require('express').Router();
const {forgotPassword, resetPassword} = require("../controller/forgotPasswordController");

router.post('/', forgotPassword);
router.post('/reset', resetPassword);

module.exports = router;
