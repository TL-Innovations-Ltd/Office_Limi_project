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
            // console.log(error);
            res.status(500).json({ success : false , error_message : error.message});
        } 
    },

};