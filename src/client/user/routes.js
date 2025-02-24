const express = require('express');
const router = express.Router();
const user_controller = require('./controllers/user_controllers');

router.post('/send_otp' , user_controller.send_otp);
router.post('/verify_otp' , user_controller.check_otp);

module.exports = router;
