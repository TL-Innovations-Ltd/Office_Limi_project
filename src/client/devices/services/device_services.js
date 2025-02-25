const Device_DB  = require('../models/device_model');
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
        console.log(device_id)
        const user = req.user;
       
        const findDevice = await Device_DB.findOne({ device_id: device_id});
        console.log( "fond hoya" , findDevice);
        // const findDevice = await Device_DB.find({device_id  : device_id});;
        // console.log(findDevice);
        if ( !findDevice) {
            throw  new Error("Warning ! This is not our Device");
        }

        // find is  the  device is link to other user
        if (user.devices.includes(device_id)) {
            throw new  Error("Device already linked to this user");
        }
        
         // 🔥 Add device to user with `addedAt`
         const newDevice = { device_id, addedAt: new Date() };
        user.devices.push(newDevice);
        await user.save();

        return user;
    }
   
}





// // Importing Required Modules
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const { nanoid } = require("nanoid");
// const cron = require("node-cron");


// // Add Device
// app.post("/add-device", async (req, res) => {
//   const { email, deviceId, role } = req.body;
//   const user = await User.findOne({ email, verified: true });
//   if (!user) return res.status(400).json({ error: "User not verified" });
//   const expiresAt = role === "Installer" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
//   const device = await Device.create({ userId: user._id, deviceId, role, expiresAt });
//   res.json({ message: "Device added", device });
// });

// // Remove Expired Devices (Cron Job)
// cron.schedule("0 * * * *", async () => {
//   await Device.deleteMany({ expiresAt: { $lt: new Date() } });
//   console.log("Expired devices removed");
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
