const router = require("express").Router();
const {Signup, Login} = require('../controller/authController')

router.post('/signup', Signup)
router.post('/login', Login)

module.exports = router;