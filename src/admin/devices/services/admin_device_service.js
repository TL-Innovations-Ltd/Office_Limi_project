// const MasterController_DB = require('../models/master-controller_device');
const Hub_DB = require('../models/hub-controller_device');
const axios = require("axios");

async function getAdminToken() {
    const response = await axios.post('https://thingsboard.limilighting.com/api/auth/login', {
        username: "tenant@thingsboard.org",
        password: "tenant"
    });
    
    return response.data; // contains token and refreshToken
}

async function registerDeviceInThingsBoard(name, token) {
    const res = await axios.post(
        'https://thingsboard.limilighting.com/api/device',
        {
            name,
            type: 'light' // You can change this if needed
        },
        {
            headers: {
                'X-Authorization': `Bearer ${token}`
            }
        }
    );

    return res.data; // contains device ID
}

async function getDeviceAccessToken(deviceId, token) {
    const res = await axios.get(
        `https://thingsboard.limilighting.com/api/device/${deviceId}/credentials`,
        {
            headers: {
                'X-Authorization': `Bearer ${token}`
            }
        }
    );

    return res.data.credentialsId;
}

module.exports = {

    // add_master_controller_device_service: async (req) => {
    //     const { name } = req.body;
    //     if (!name) {
    //         throw new Error('Missing Master Controller  Device Name');
    //     }
    //     const masterController = new MasterController_DB({ name });
    //     await masterController.save();
    //     return masterController;
    // },

    add_master_controller_hub_device_service: async (req) => {
        const userId = req.user._id;
        const { deviceInfo } = req.body;

        if (!deviceInfo) {
            throw new Error('Device information is required');
        }

        // Extracting details from deviceInfo string
        const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]/);
        if (!match) {
            throw new Error('Fomrat invalid')
        }

        const name = match[1];
        const id = match[2];
        const receivedBytes = match[3].split(',').map(Number); // Convert to array of numbers

        if (receivedBytes.includes(90)) {
            throw new Error("developer mode ignore")
        }

        let existingDevice = await Hub_DB.findOne({ macAddress: id });
        if (existingDevice) {
            return { message: "Hub already registered" };
        }

        // 👉 Step 1: Get token
        const { token } = await getAdminToken();
        if (!token) {
            throw new Error('Failed to get admin token');
        }
    
        // 👉 Step 2: Create device in ThingsBoard
        const tbDevice = await registerDeviceInThingsBoard(name, token);
        if (!tbDevice) {
            throw new Error('Failed to register device in ThingsBoard');
        }

        // 👉 Step 3: Get access token
        const accessToken = await getDeviceAccessToken(tbDevice.id.id, token);
        if (!accessToken) {
            throw new Error('Failed to get device access token');
        }

        // Create the hub
        const hub = new Hub_DB({
            // masterControllerId,
            userId: userId,
            macAddress: id,
            deviceName: name,
            thingsboard : {
                deviceId : tbDevice.id.id,
                accessToken : accessToken
            }
        });
        await hub.save();
 
        return hub;

    },

};