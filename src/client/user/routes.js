const express = require('express');
const router = express.Router();
const user_controller = require('./controllers/user_controllers');

router.post('/send_otp' , user_controller.send_otp);
router.post('/verify_otp' , user_controller.check_otp);
router.post('/installer_user' , user_controller.installer_user);
router.patch('/update_name/:id' , user_controller.update_name);

module.exports = router;
