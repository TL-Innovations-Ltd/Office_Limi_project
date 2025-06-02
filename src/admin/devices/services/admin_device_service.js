// const MasterController_DB = require('../models/master-controller_device');
const { v4: uuidv4 } = require('uuid');
const Hub_DB = require('../models/hub-controller_device');
const axios = require("axios");
const redisClient = require('../../../config/redis');

const THINGSBOARD_ADMIN_TOKEN_KEY = 'thingsboard:admin:token';
const TOKEN_EXPIRY = 3600; // 1 hour in seconds

async function getAdminToken() {
    // Try to get token from cache first

    const cachedToken = await redisClient.get(THINGSBOARD_ADMIN_TOKEN_KEY);
    if (cachedToken && cachedToken.token) {
        return JSON.parse(cachedToken);
    }

    // If not in cache, fetch new token
    const response = await axios.post('https://thingsboard.limilighting.com/api/auth/login', {
        username: "tenant@thingsboard.org",
        password: "tenant"
    });
    
    // Cache the new token with 5 minutes less than expiry to ensure we refresh before it expires
    if (response.data && response.data.token) {
        await redisClient.set(
            THINGSBOARD_ADMIN_TOKEN_KEY, 
            JSON.stringify(response.data),
            'EX',
            TOKEN_EXPIRY - 300 // 55 minutes (5 minutes less than expiry)
        );
    }
    
    return response.data;
}

async function registerDeviceInThingsBoard(name, token) {
    // Generate a unique name by appending a UUID
    const uniqueName = `${name}-${uuidv4()}`;
    
    const res = await axios.post(
        'https://thingsboard.limilighting.com/api/device',
        {
            name: uniqueName,
            type: 'light' // You can change this if needed
        },
        {
            headers: {
                'X-Authorization': `Bearer ${token}`
            }
        }
    );

    return res.data;
}

async function getDeviceAccessToken(deviceId, token) {
    // No need to cache credentials as they are stored in MongoDB after first fetch
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

        // Check if device already exists
        const deviceCacheKey = `device:exists:${id}`;
        
        // Check cache first
        const cachedDevice = await redisClient.get(deviceCacheKey);
        if (cachedDevice === 'true') {
            return { message: "Hub already registered", cached: cachedDevice };
        }
        
        // If not in cache, check database
        const existingDevice = await Hub_DB.findOne({ macAddress: id });
        if (existingDevice) {
             // Cache the result for 1 hour
             await redisClient.set(deviceCacheKey, 'true', 'EX', 3600);
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