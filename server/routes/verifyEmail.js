const router = require('express').Router();
const { verifyEmailMail, resendEmail} = require("../controller/verifyEmailController");

router.post('/', verifyEmailMail);
router.post('/resend-email', resendEmail);

module.exports = router;

