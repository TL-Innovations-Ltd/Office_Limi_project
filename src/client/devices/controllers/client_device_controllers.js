
const device_control_service = require('../services/client_devices_service');

module.exports = {

   //  pwm_light_control : async(req , res) => {
   //       try {
   //          const result = await device_control_service.pwm_light_control_service(req);
   //          res.status(200).json({success : true  , data : result});
   //       } catch (error) {
   //          console.log(error);
   //           res.status(500).json({success  : false , error_message : error.message});
   //       }
   //  },

   //  rgb_light_control : async(req , res) => {
   //       try {
   //          const result = await device_control_service.rgb_light_control_service(req);
   //          res.status(200).json({success : true  , data : result});
   //       } catch (error) {
   //          console.log(error);
   //           res.status(500).json({success  : false , error_message : error.message});
   //       }
   //  },

    process_device_data : async(req , res) => {
        try {
            const result = await device_control_service.processDeviceDataService(req);
            res.status(200).json({success : true  , data : result});
        } catch (error) {
            // console.log(error);
            res.status(500).json({success  : false , error_message : error.message});
        }
    }

}
