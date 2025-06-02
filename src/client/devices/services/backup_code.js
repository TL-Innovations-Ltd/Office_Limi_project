// const PWM_DB = require('../../../admin/devices/models/pwm_controller_device');
// const RGB_DB = require('../../../admin/devices/models/rgb_controller_device');
// // const Master_Controller_DB = require('../../../admin/devices/models/master-controller_device');
// const Hub_DB = require('../../../admin/devices/models/hub-controller_device');
// const User_DB = require('../../user/models/user_models');
// const redis = require('../../../config/redis');
// const { publishMessage, TOPICS } = require('../../hive_MQTT_connection/mqtt_services');

// const axios = require("axios");

// const CACHE_TTL = 3600; // 1 hour

// const sendToThingBoard = async (deviceAccessToken, telemetryData) => {

//     try {
//         const res = await axios.post(
//             `https://thingsboard.limilighting.com/api/v1/${deviceAccessToken}/telemetry`,
//             telemetryData
//         );

//         return true;
//     } catch (error) {
//         console.log('Error sending telemetry to ThingBoard:', error);
//         return false;
//     }
// };

// // Get or cache device token
// async function getDeviceToken(deviceId) {
//     const cacheKey = `thingboard:device:token:${deviceId}`;

//     try {
//         // Try cache first
//         const cachedToken = await redis.get(cacheKey);
//         if (cachedToken) return cachedToken;

//         // Cache miss - get from DB
//         const device = await Hub_DB.findOne(
//             { macAddress: deviceId },
//             'thingsboard.accessToken'
//         ).lean();

//         if (!device?.thingsboard?.accessToken) {
//             throw new Error('Device not found or missing access token');
//         }

//         // Cache the token
//         await redis.set(cacheKey, device.thingsboard.accessToken, 'EX', CACHE_TTL);
//         return device.thingsboard.accessToken;
//     } catch (error) {
//         console.error('Error getting device token:', error.message);
//         throw error;
//     }
// }

// const convertCool = hex => ((128 - hex) / 128) * 100;
// const convertWarm = hex => ((hex - 128) / 128) * 100;
// const convertBrightness = hex => (hex / 255) * 100;

// module.exports = {

//     processDeviceDataService: async (req) => {
//         const userId = req.user._id;
//         const { deviceInfo } = req.body;

//         const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]\).*?Hex Data: \[(.*?)\]/);
//         if (!match) {
//             throw new Error("Invalid device data format");
//         }

//         const id = match[2];
//         const receivedBytes = match[3].split(',').map(Number);
//         const hexData = match[4].split(',').map(byte => parseInt(byte, 16));

//         const deviceAccessToken = await getDeviceToken(id);

//         if (!deviceAccessToken) {
//             throw new Error(`Device ${id} not found or missing access token`);
//         }

//         // const timestamp = Date.now();
//         const generateUniqueTimestamp = () => Date.now() + Math.floor(Math.random() * 1000);
//         const mode = hexData[0];

//         // await publishMessage(`${TOPICS.DEVICE_CONTROL}`, {
//         //     receivedBytes: receivedBytes,
//         //     hexData: hexData,
//         //     timestamp: new Date().toISOString()
//         // });

//         let telemetryData;

//         if (mode === 0x01) {
//             const cool = convertCool(hexData[1]);
//             const warm = convertWarm(hexData[2]);
//             const brightness = convertBrightness(hexData[3]);

//             telemetryData = {
//                 ts: generateUniqueTimestamp(),
//                 values: {
//                     mode: "pwm",
//                     source: "Hub",
//                     cool: cool,
//                     warm: warm,
//                     brightness: brightness
//                 }
//             };
//             await sendToThingBoard(deviceAccessToken, telemetryData);

//             const pwmSettings = new PWM_DB({
//                 userId: userId,
//                 macAddress: id,
//                 cool: cool,
//                 warm: warm,
//                 brightness: brightness
//             });
//             await pwmSettings.save();
//             return { message: "PWM settings saved successfully"};

//         } else if (mode === 0x02) {
//             const red = hexData[1];
//             const green = hexData[2];
//             const blue = hexData[3];

//             telemetryData = {
//                 ts: generateUniqueTimestamp(),
//                 values: {
//                     mode: "rgb",
//                     source: "Hub",
//                     red: red,
//                     green: green,
//                     blue: blue
//                 }
//             };
//             await sendToThingBoard(deviceAccessToken, telemetryData);

//             const rgbSettings = new RGB_DB({
//                 userId: userId,
//                 macAddress: id,
//                 red: red,
//                 green: green,
//                 blue: blue
//             });
//             await rgbSettings.save();
//             return { message: "RGB settings saved successfully"};

//         } else if (mode === 0x03) {
//             const outputNumber = hexData[1];

//             if (outputNumber >= 1 && outputNumber <= 5) {
//                 const cool = convertCool(hexData[1]);
//                 const warm = convertWarm(hexData[2]);
//                 const brightness = convertBrightness(hexData[3]);

//                 telemetryData = {
//                     ts: generateUniqueTimestamp(),
//                     values: {
//                         mode: "pwm",
//                         source: "Mini Controller",
//                         // outputNumber: outputNumber,
//                         cool: cool,
//                         warm: warm,
//                         brightness: brightness
//                     }
//                 };
//                 await sendToThingBoard(deviceAccessToken, telemetryData);

//                 const miniPwmSettings = new PWM_DB({
//                     userId: userId,
//                     macAddress: id,
//                     // outputNumber: outputNumber,
//                     cool: cool,
//                     warm: warm,
//                     brightness: brightness
//                 });
//                 await miniPwmSettings.save();
//                 return { message: "Mini Controller PWM settings saved successfully"};

//             } else if (outputNumber >= 6 && outputNumber <= 7) {
//                 const red = hexData[2];
//                 const green = hexData[3];
//                 const blue = hexData[4];

//                 telemetryData = [{
//                     ts: generateUniqueTimestamp(),
//                     values: {
//                         mode: "rgb",
//                         source: "Mini Controller",
//                         // outputNumber: outputNumber,
//                         red: red,
//                         green: green,
//                         blue: blue
//                     }
//                 }];
//                 await sendToThingBoard(deviceAccessToken, telemetryData);

//                 const miniRgbSettings = new RGB_DB({
//                     userId: userId,
//                     macAddress: id,
//                     // outputNumber: outputNumber,
//                     red: red,
//                     green: green,
//                     blue: blue
//                 });
//                 await miniRgbSettings.save();
//                 return { message: "Mini Controller RGB settings saved successfully" };
//             } else {
//                 throw new Error("Invalid output number for Mini Controller");
//             }
//         }

//         throw new Error("Invalid mode");
//     }

// }
 




//suzair  
