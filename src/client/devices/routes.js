const express = require('express');
const router = express.Router();
const device_controller = require('./controllers/device_controller');
const authClientmiddleware = require('../middleware/user_middleware');

// Routes
router.post('/add_device' , device_controller.add_devices);
router.post('/link_device' , authClientmiddleware  ,  device_controller.link_devices);
router.patch('/light_control' , authClientmiddleware , device_controller.light_control)

module.exports = router;