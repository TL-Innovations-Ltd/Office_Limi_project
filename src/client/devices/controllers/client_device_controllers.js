
const device_control_service = require('../services/client_devices_service');



module.exports = {

    link_user_master_controller : async(req, res) => {
        try{
           const linkedMasterController = await device_control_service.link_user_master_controller_service(req);
           res.status(200).json({success  : true , message : 'Master controller linked' , data : linkedMasterController});
        }
        catch(e){
           console.log(e);
           res.status(500).json({success  : false , error_message : e.message});
        }
   },

   get_user_master_controller : async(req, res) => {
      
    try{
        const result = await device_control_service.get_user_master_controllers_service(req);
        res.status(200).json({success : true  , data : result});
    } catch (error) {
          console.log(error);
        res.status(500).json({success  : false , error_message : error.message});
    }
   },

    pwm_light_control : async(req , res) => {
         try {
            const result = await device_control_service.pwm_light_control_service(req);
            res.status(200).json({success : true  , data : result});
         } catch (error) {
            console.log(error);
             res.status(500).json({success  : false , error_message : error.message});
         }
    },

    rgb_light_control : async(req , res) => {
         try {
            const result = await device_control_service.rgb_light_control_service(req);
            res.status(200).json({success : true  , data : result});
         } catch (error) {
            console.log(error);
             res.status(500).json({success  : false , error_message : error.message});
         }
    },

    mini_controller_light_control : async(req , res) => {   
          try {
            const result = await device_control_service.mini_controller_output_control_service(req);
            res.status(200).json({success : true  , data : result});
         } catch (error) {
            console.log(error);
             res.status(500).json({success  : false , error_message : error.message});
         }
    },

    get_all_devices : async(req, res) => {
        try{
            const result = await device_control_service.get_all_devices_service(req);
            res.status(200).json({success : true  , data : result});
        } catch (error) {
            console.log(error);
            res.status(500).json({success  : false , error_message : error.message});
        }
    },

    get_user_channels : async(req , res ) => { 
        try {
            const result = await device_control_service.get_user_channels_service(req);
            res.status(200).json({success : true  , data : result});
        } catch (error) {
            console.log(error);
            res.status(500).json({success  : false , error_message : error.message});
        }
    },
    
    get_user_channels_mode_lights : async(req , res) => {
         try {
            const result = await device_control_service.get_user_channels_mode_lights_service(req);
            res.status(200).json({success : true  , data : result});
         } catch (error) {
            console.log(error);
            res.status(500).json({success  : false , error_message : error.message});
         }
    }

}
