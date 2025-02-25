const Device_DB  = require('../models/device_model');
const  User_DB = require('../../user/models/user_models');
const mongoose  = require('mongoose');
module.exports = {
    
    add_device_service : async(req) => {
        const {device_id} = req.body;
        if(!device_id){
             throw new Error('Missing device_id');
        }
        const device_model = new Device_DB(req.body);
        await device_model.save();
        return device_model;
    },

    link_device_service : async(req) => {
        const {device_id} = req.body;

        const user = req.user;
       
        const findDevice = await Device_DB.findOne({ device_id: device_id});
       
        if ( !findDevice) {
            throw  new Error("Warning ! This is not our Device");
        }

         // ✅ Check if device is already linked to the current user
    if (user.devices.some(device => device.device_id === device_id)) {
        throw new Error("Device already linked to this user");
    }
        
         // 🔥 Add device to user with `addedAt`
         const newDevice = { device_id, addedAt: new Date() };
        user.devices.push(newDevice);
        await user.save();

        return user;
    },

    light_control_service : async(req) => {
        const  user  = req.user;
        const {device_id, status , color , brightness , blinking} = req.body;
     
        // ✅ Brightness validation (should be between 0 and 100)
    if (typeof brightness === "number" && (brightness < 0 || brightness > 100)) {
        throw new Error("Invalid brightness value, must be between 0 and 100");
    }
        
     // ✅ Blinking validation (must be strictly boolean)
     if (blinking !== undefined && typeof blinking !== "boolean") {
        throw new Error("Invalid blinking value, must be true or false");
    }

        
            // ✅ Check if user has this device linked
        if (!user.devices.some((device) => device.device_id === device_id)) {
            throw new  Error("This Device is not  link with you ");
        }
        // ✅ Update device status
        const updatedDevice = await Device_DB.findOneAndUpdate(
            { device_id },
            { 
                ...(status && { status }), // 🟢 Update status if provided
                ...(color && { color }),   // 🟢 Update color if provided
                ...(typeof brightness === "number" && brightness >= 0 && brightness <= 100 && { brightness }), // 🟢 Brightness check
                ...(typeof blinking === "boolean" && { blinking }) // 🟢 Blinking check
            },
            { new: true } // ✅ Return updated document
        );
       
        if (!updatedDevice) {
            throw  new  Error ("Device noot Found")
        }

        return updatedDevice;
    }

}



