const express = require('express');
const router = express.Router();
const client_device_controller = require('./controllers/client_device_controllers');
const authClientmiddleware = require('../middleware/user_middleware');


// router.post('/pwm_light_control' , authClientmiddleware ,    client_device_controller.pwm_light_control); // tested
// router.post('/rgb_light_control' , authClientmiddleware ,    client_device_controller.rgb_light_control);    // tested
router.post('/process_device_data',
    authClientmiddleware,         // Existing authentication middleware
    client_device_controller.process_device_data
);

module.exports = router;
