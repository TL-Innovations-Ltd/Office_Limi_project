const admin_device_service = require('../services/admin_device_service');

module.exports = {

    // add_master_controller_device : async(req, res) => {
    //     try {
    //         const result = await admin_device_service.add_master_controller_device_service(req);
    //         res.status(200).json({success : true , data : result});
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ success : false , error_message : error.message});
    //     } 
    // },

    add_master_controller_hub_device : async(req, res) => {
        try {
            const result = await admin_device_service.add_master_controller_hub_device_service(req);
            res.status(200).json({success : true , data : result});
        } catch (error) {
            console.log(error);
            res.status(500).json({ success : false , error_message : error.message});
        } 
    },

    add_pwm_controller_device : async (req, res) => {
        try {
            const result = await admin_device_service.add_pwm_controller_device_service(req);
            res.status(200).json({success : true , data : result});
        } catch (error) {
            console.log(error);
            res.status(500).json({ success : false , error_message : error.message});
        }
    },

    add_rgb_controller_device : async(req, res) => {
         try{
            const result = await admin_device_service.add_rgb_controller_device_service(req);
            res.status(200).json({success : true , data : result});
         }
         catch(error){
            console.log(error);
            res.status(500).json({ success : false , error_message : error.message});
         }
    },

    add_mini_controller_device : async(req, res) => {
         try{
            const result = await admin_device_service.add_mini_controller_device_service(req);
            res.status(200).json({success : true , data : result});
         }
         catch(error){
            console.log(error);
            res.status(500).json({ success : false , error_message : error.message});
         }
    },

    add_channel_mini_controller_pwm_device : async(req, res) => {
         try{
            const result = await admin_device_service.add_channel_mini_controller_pwm_device_service(req);
            res.status(200).json({success : true , data : result});
         }
         catch(error){
              console.log(error);
              res.status(500).json({ success : false , error_message : error.message});
         }
    },

    get_master_controller_device : async(req, res) => {
         try{
            const result = await admin_device_service.get_master_controller_device_service(req);
            res.status(200).json({success : true , data : result});
         }
         catch(error){
            console.log(error);
            res.status(500).json({ success : false , error_message : error.message});
         }
    }
    
};