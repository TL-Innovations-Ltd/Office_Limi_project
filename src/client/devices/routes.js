
const express = require('express');
const router = express.Router();
const client_device_controller = require('./controllers/client_device_controllers');
const authClientmiddleware = require('../middleware/user_middleware');

router.post('/link_user_master_controller' , authClientmiddleware ,  client_device_controller.link_user_master_controller);  
router.get('/get_user_master_controller' , authClientmiddleware ,  client_device_controller.get_user_master_controller);  // tested
router.patch('/pwm_light_control' , authClientmiddleware ,  client_device_controller.pwm_light_control); // tested
router.patch('/rgb_light_control' ,  authClientmiddleware , client_device_controller.rgb_light_control);    // tested
router.patch('/mini_controller_light_control' ,  authClientmiddleware , client_device_controller.mini_controller_light_control);
router.get('/get_all_lights' ,  authClientmiddleware ,  client_device_controller.get_all_devices);  // tested
router.get('/get_user_channels' ,  authClientmiddleware ,  client_device_controller.get_user_channels);  // tested
router.get('/get_user_channels_mode_lights' ,  authClientmiddleware ,   client_device_controller.get_user_channels_mode_lights)  //tested

module.exports = router;
