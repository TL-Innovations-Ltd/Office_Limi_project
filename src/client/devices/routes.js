const express = require('express');
const router = express.Router();
const client_device_controller = require('./controllers/client_device_controllers');
const authClientmiddleware = require('../middleware/user_middleware');
const { publishMessage , TOPICS } = require('../hive_MQTT_connection/mqtt_services');


// router.post('/pwm_light_control' , authClientmiddleware ,    client_device_controller.pwm_light_control); // tested
// router.post('/rgb_light_control' , authClientmiddleware ,    client_device_controller.rgb_light_control);    // tested
router.post('/process_device_data',
    authClientmiddleware,         // Existing authentication middleware
    client_device_controller.process_device_data
);

router.post('/postmessage'  , async( req , res ) => {
     try{
         await publishMessage(TOPICS.DEVICE_CONTROL ,  {brightness : 60 , color : "red"});

         res.status(200).json({message : "Message sent successfully"});
     }
     catch(e){
       res.status(400).json({error_message :  JSON.stringify(e) });
     }
})

module.exports = router;
