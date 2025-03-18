
const express = require('express');
const router = express.Router();
const admin_device_controller = require('./controller/admin-device_controller');

// router.post('/add_master_controller_device', admin_device_controller.add_master_controller_device);
router.post('/add_master_controller_hub_device' , admin_device_controller.add_master_controller_hub_device);
router.post('/add_pwm_controller_device' , admin_device_controller.add_pwm_controller_device);
router.post('/add_rgb_controller_device' , admin_device_controller.add_rgb_controller_device);
router.post('/add_mini_controller_device' , admin_device_controller.add_mini_controller_device);
router.post('/add_channel_controller_device' , admin_device_controller.add_channel_mini_controller_pwm_device);
router.get('/get_master_controller_device' , admin_device_controller.get_master_controller_device);

module.exports = router;
