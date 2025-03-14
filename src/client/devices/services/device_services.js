const Device_DB = require('../models/device_model');
const Bluetooth_DB = require('../models/bluetooth_devices');
const User_DB = require('../../user/models/user_models');
const mongoose = require('mongoose');
const mqttClient = require('../../hive_MQTT_connection/mqtt_conenection');
const MQTT_TOPIC = "iot/light_control"; // Aapka MQTT topic

module.exports = {

    add_device_service: async (req) => {
        const { device_name } = req.body;
        if (!device_name) {
            throw new Error('Missing device_id');
        }
        const device_model = new Device_DB(req.body);
        await device_model.save();
        return device_model;
    },

    link_device_service: async (req) => {
        const { device_id } = req.body;

        const user = req.user;
          console.log(user);
        const findDevice = await Device_DB.findOne({ device_id: device_id });

        if (!findDevice) {
            throw new Error("Warning ! This is not our Device");
        }

        // ✅ Check if device is already linked to the current user
        if (user?.devices?.some(device => device?.device_id === device_id)) {
            throw new Error("Device already linked to this user");
        }

        // 🔥 Add device to user with `addedAt`
        const newDevice = { device_id, addedAt: new Date() };
        user.devices.push(newDevice);
        await user.save();

        return user;
    },

    light_control_service: async (req) => {
        const user = req.user;
        const { device_id, status, color, brightness, blinking } = req.body;

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
            throw new Error("This Device is not  link with you ");
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
            throw new Error("Device not Found")
        }

        // // ✅ MQTT Message Send to IoT Device
        // const mqttMessage = JSON.stringify({
        //     device_id,
        //     status,
        //     color,
        //     brightness,
        //     blinking
        // });

        // mqttClient.publish(MQTT_TOPIC, mqttMessage, { qos: 1, retain: false }, (error) => {
        //     if (error) {
        //         console.error("❌ MQTT Publish Error:", error);
        //     } else {
        //         console.log("📡 MQTT Message Sent:", mqttMessage);
        //     }
        // });
     
        // // ✅ Listen for MQTT Response (Success/Failure from IoT Device)
        // mqttClient.on("message", (topic, message) => {
        //     if (topic === MQTT_TOPIC) {
        //         console.log("📩 IoT Device Response:", message.toString());
        //     }
        // });

        return updatedDevice;
    },

    all_devices_service : async(req) => {
        return  await Device_DB.find({});
    },

    get_linked_devices_service : async(req) => {
        const user = await User_DB.findById(req.user._id)
        .populate({
            path: 'device_details',
            select: 'device_name status -_id' // ✅ Select only necessary fields
        });

        // ✅ Filter sirf zaroori cheezein
        const filteredResponse = {
            username: user.username,
            devices: user.device_details?.map(device => ({
            device_name: device.device_name,
            device_id : device.device_id,
            device_status : device.status
        })) || []
           };

        return filteredResponse;
    },

    all_devices_user_service : async(req) => {
        // 🟢 Token se user ID le lo (Assume req.user.id me aa raha hai)
        const userId = req.user.id; 
        
        // 🟢 User ka record fetch karo (Devices wali field include karo)
        const user = await User_DB?.findById(userId)?.select("devices");

        // 🟢 Sare available devices fetch karo
        const allDevices = await Device_DB?.find({});
        
        // 🟢 User ke devices ki list bana lo (Sirf device_id extract karo)
        const userDeviceIds = user?.devices?.map(device => device?.device_id?.toString());

        // 🔥 Filter out only those devices jo user ke pass nahi hain
        const filteredDevices = allDevices?.filter(device => !userDeviceIds?.includes(device?.device_id?.toString()));

        return filteredDevices; 
    },

    add_bluetooth_device_service : async(req) => {
    const { device_id, device_name} = req.body;
    const user = req.user; // 🔥 Token middleware se user mil gaya

    // 🔹 Step 1: Check if Bluetooth Device already exists
    let device = await Bluetooth_DB.findOne({ device_id: device_id });

    if (!device) {
      // 🔹 Step 2: If device does not exist, create a new Bluetooth device entry
      device = new Bluetooth_DB({
        deviceName: device_name,
        device_id: device_id,
      });

      await device.save(); // 🔥 Save new device in database
    }

    // 🔹 Step 3: Check if the device is already linked with the user
    const isAlreadyLinked = user.devices.some((d) => d.device_id === device_id);
    if (isAlreadyLinked) {
      throw new Error("Device already linked to user");
    }

    // 🔹 Step 4: Add device to user's Bluetooth devices array
    user.devices.push({ device_id });
    await user.save(); // 🔥 Save updated user

    return {success : true,data  : user};
    },

    get_bluetooth_device_service : async(req) => {
        const user = await User_DB.findById(req.user.id)
        .populate("device_details") // 🔥 Virtual populate ka use kar raha hai
        .select("-otp -otp_expire_at"); // 🔥 Extra fields hide kar raha hai

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
    }

}



