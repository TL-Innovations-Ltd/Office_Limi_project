
const PWM_DB = require('../../../admin/devices/models/pwm_controller_device');
const RGB_DB = require('../../../admin/devices/models/rgb_controller_device');
const Hub_DB = require('../../../admin/devices/models/hub-controller_device');
const redis = require('../../../config/redis');
const { publishMessage, TOPICS } = require('../../hive_MQTT_connection/mqtt_services');
const axios = require("axios");

// Constants
const CACHE_TTL = 3600; // 1 hour

// Non-blocking MongoDB save function
async function saveDeviceLog(logData, isRgb = false) {
    try {
        const Model = isRgb ? RGB_DB : PWM_DB;
        const log = new Model(logData);
        await log.save().catch(console.error); // Non-blocking save
    } catch (error) {
        console.error('Error saving device log:', error.message);
    }
}

const sendToThingBoard = async (deviceAccessToken, telemetryData) => {
    try {
        // Make non-blocking by not awaiting
        axios.post(
            `https://thingsboard.limilighting.com/api/v1/${deviceAccessToken}/telemetry`,
            telemetryData
        ).catch(error => {
            console.error('Error in sendToThingBoard:', error.message);
        });
        return true;
    } catch (error) {
        console.error('Error in sendToThingBoard:', error.message);
        return false;
    }
};

// Get or cache device token with optimized error handling
async function getDeviceToken(deviceId) {
    const cacheKey = `thingboard:device:token:${deviceId}`;

    try {
        // Try cache first
        const cachedToken = await redis.get(cacheKey);
        if (cachedToken) return cachedToken;

        // Cache miss - get from DB with projection for only needed fields
        const device = await Hub_DB.findOne(
            { macAddress: deviceId },
            'thingsboard.accessToken'
        ).lean().exec();

        if (!device?.thingsboard?.accessToken) {
            throw new Error('Device not found or missing access token');
        }

        // Cache the token with pipeline for better performance
        const pipeline = redis.pipeline();
        pipeline.set(cacheKey, device.thingsboard.accessToken, 'EX', CACHE_TTL);
        await pipeline.exec();

        return device.thingsboard.accessToken;
    } catch (error) {
        console.error('Error getting device token:', error.message);
        throw error;
    }
}

// Optimized conversion functions
const convertCool = hex => ((128 - hex) * 100) / 128;
const convertWarm = hex => ((hex - 128) * 100) / 128;
const convertBrightness = hex => (hex * 100) / 255;

module.exports = {
    processDeviceDataService: async (req) => {
        const userId = req.user?._id;
        const { deviceInfo } = req.body;

        // Fast parsing with simpler regex
        const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]\).*?Hex Data: \[(.*?)\]/);

        if (!match) {
            throw new Error("Invalid device data format");
        }

        const deviceId = match[2];
        const receivedBytes = match[3].split(',').map(Number);
        const hexData = match[4].split(',').map(Number);
        const mode = hexData[0];
        const timestamp = Date.now();

        try {
             
            publishMessage(TOPICS.DEVICE_CONTROL , {
                receivedBytes : receivedBytes,
                hexData : hexData,
                timestamp : timestamp
            });

            // Get device token (cached)
            const deviceToken = await getDeviceToken(deviceId);
            if (!deviceToken) {
                throw new Error(`Device ${deviceId} not found or missing access token`);
            }

            // Process telemetry data
            let telemetryData;
            let logData = {
                userId: userId,
                macAddress: deviceId,
                timestamp: new Date()
            };

            switch (mode) {
                case 0x01: // PWM Mode
                    const cool = convertCool(hexData[1]);
                    const warm = convertWarm(hexData[2]);
                    const brightness = convertBrightness(hexData[3]);

                    telemetryData = {
                        ts: timestamp,
                        values: {
                            mode: "pwm",
                            source: "Hub",
                            cool,
                            warm,
                            brightness
                        }
                    };

                    // Save to MongoDB (non-blocking)
                    saveDeviceLog({
                        ...logData,
                        cool,
                        warm,
                        brightness
                    });
                    break;

                case 0x02: // RGB Mode
                    const red = hexData[1];
                    const green = hexData[2];
                    const blue = hexData[3];

                    telemetryData = {
                        ts: timestamp,
                        values: {
                            mode: "rgb",
                            source: "Hub",
                            red,
                            green,
                            blue
                        }
                    };

                    // Save to MongoDB (non-blocking)
                    saveDeviceLog({
                        ...logData,
                        red,
                        green,
                        blue
                    }, true);
                    break;

                case 0x03: // Mini Controller
                    const outputNumber = hexData[1];
                    const isRgb = outputNumber >= 6;

                    if (isRgb) {
                        const [red, green, blue] = [hexData[2], hexData[3], hexData[4]];
                        telemetryData = {
                            ts: timestamp,
                            values: {
                                mode: "rgb",
                                source: "Mini Controller",
                                red,
                                green,
                                blue
                            }
                        };
                        // Save RGB log
                        saveDeviceLog({
                            ...logData,
                            outputNumber,
                            red,
                            green,
                            blue
                        }, true);
                    } else {
                        const cool = convertCool(hexData[1]);
                        const warm = convertWarm(hexData[2]);
                        const brightness = convertBrightness(hexData[3]);

                        telemetryData = {
                            ts: timestamp,
                            values: {
                                mode: "pwm",
                                source: "Mini Controller",
                                cool,
                                warm,
                                brightness
                            }
                        };
                        // Save PWM log
                        saveDeviceLog({
                            ...logData,
                            outputNumber,
                            cool,
                            warm,
                            brightness
                        });
                    }
                    break;

                default:
                    throw new Error("Invalid mode");
            }

            // Send to ThingsBoard in background (non-blocking)
            sendToThingBoard(deviceToken, telemetryData);

            return {
                status: "success",
                message: "Command processed",
                mode: mode === 0x01 ? "pwm" : mode === 0x02 ? "rgb" : "mini_controller",
                timestamp
            };

        } catch (error) {
            console.error('Error processing device data:', error.message);
            throw error;
        }
    }
};
