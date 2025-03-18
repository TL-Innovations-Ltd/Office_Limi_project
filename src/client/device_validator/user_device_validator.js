
const User_DB = require('../../../admin/users/models/user_models');
const PWM_DB = require('../../../admin/devices/models/pwm_controller_device');
const RGB_DB = require('../../../admin/devices/models/rgb_controller_device');
const Channel_DB = require('../../../admin/devices/models/channel_controller_device');
const Hub_DB = require('../../../admin/devices/models/hub-controller_device');

module.exports = {
    checkUserDeviceAccess : async(userId , deviceId , deviceType) => {
        // Get user's linked master controllers
    const user = await User_DB.findById(userId);
    if (!user || !user.masterControllers || user.masterControllers.length === 0) {
        throw new Error("User has no linked master controllers");
    }

    let device;
    let channelId;

    // Find the device and get its channel ID
    if (deviceType === 'PWM') {
        device = await PWM_DB.findById(deviceId);
        if (!device) throw new Error("PWM Light not found");
        channelId = device.channelId;
    } else if (deviceType === 'RGB') {
        device = await RGB_DB.findById(deviceId);
        if (!device) throw new Error("RGB Light not found");
        channelId = device.channelId;
    } else {
        throw new Error("Invalid device type");
    }

    // Get the channel to find the hub
    const channel = await Channel_DB.findById(channelId);
    if (!channel) throw new Error("Channel not found");

    // Get the hub to find the master controller
    const hub = await Hub_DB.findById(channel.hubId);
    if (!hub) throw new Error("Hub not found");

    // Check if the master controller is linked to the user
    if (!user.masterControllers.includes(hub.masterControllerId.toString())) {
        throw new Error("User does not have access to this device");
    }

    return true; 
    }
}