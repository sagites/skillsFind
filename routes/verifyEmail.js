const router = require('express').Router();
const { verifyEmailMail, resendEmail} = require("../controller/verifyEmailController");

router.post('/verifyEmail', verifyEmailMail);
router.post('/resend-email', resendEmail);

module.exports = router;

