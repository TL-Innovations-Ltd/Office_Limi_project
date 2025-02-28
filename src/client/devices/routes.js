const express = require('express');
const router = express.Router();
const device_controller = require('./controllers/device_controller');
const authClientmiddleware = require('../middleware/user_middleware');

// Routes
router.post('/add_device' , device_controller.add_devices);
router.post('/link_device' , authClientmiddleware  ,  device_controller.link_devices);
router.get('/get_link_devices' , authClientmiddleware , device_controller.get_link_devices);
router.patch('/light_control' , authClientmiddleware , device_controller.light_control);
router.get('/alldevices' ,  device_controller.alldevices);
router.get('/alldevices_user' , authClientmiddleware ,  device_controller.alldevices_user);

module.exports = router;