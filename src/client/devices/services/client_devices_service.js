const PWM_DB = require('../../../admin/devices/models/pwm_controller_device');
const RGB_DB = require('../../../admin/devices/models/rgb_controller_device');
// const Master_Controller_DB = require('../../../admin/devices/models/master-controller_device');
const Hub_DB = require('../../../admin/devices/models/hub-controller_device');
const User_DB = require('../../user/models/user_models');

module.exports = {

    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU4ODcwNmZjNzE3NjY3YjExZjdhMyIsImlhdCI6MTc0MzY4NTk2MywiZXhwIjoxNzQ0MjkwNzYzfQ.SxB20DlDOQ_tDuV_UcG9ne8naO6mGoteWo1f5ifSLoI

    // pwm_light_control_service: async (req) => {
    //     const userId = req.user._id;
    //     const { deviceInfo } = req.body;

    //     // Extract device details
    //     const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]\).*?Hex Data: \[(.*?)\]/);
    //     if (!match) {
    //         throw new Error({ error: "Invalid device data format" });
    //     }

    //     const name = match[1];
    //     const id = match[2];
    //     const receivedBytes = match[3].split(',').map(Number);
    //     const hexData = match[4].split(',').map(byte => parseInt(byte, 16)); // Convert Hex to Decimal

    //     if (receivedBytes.includes(90)) {
    //         throw new Error("developer mode ignore")
    //     }

    //     // Find or create device
    //     let device = await Hub_DB.findOne({ macAddress: id });
    //     if (!device) {
    //         throw new Error('device  is  not connected')
    //     }

    //     // Determine mode from hexData[0]
    //     const mode = hexData[0];

    //     if (mode === 0x01) {
    //         // Normal PWM Mode
    //         const cool = (hexData[1] / 255) * 100;
    //         const warm = (hexData[2] / 255) * 100;
    //         const brightness = (hexData[3] / 255) * 100;

    //         let pwmSettings = new PWM_DB({
    //             userId: userId,
    //             macAddress: id,
    //             cool: cool,
    //             warm: warm,
    //             brightness: brightness
    //         });
    //         await pwmSettings.save();

    //         return pwmSettings;
    //     }

    //     if (mode === 0x03) {
    //         // Mini Controller PWM Mode
    //         const outputNumber = hexData[1]; // Which output is being controlled

    //         if (outputNumber >= 0x01 && outputNumber <= 0x05) {
    //             const cool = (hexData[2] / 255) * 100;
    //             const warm = (hexData[3] / 255) * 100;
    //             const brightness = (hexData[4] / 255) * 100;

    //             let pwmSettings = new PWM_DB({
    //                 macAddress: id,
    //                 outputNumber: outputNumber,
    //                 cool: cool,
    //                 warm: warm,
    //                 brightness: brightness
    //             });

    //             await pwmSettings.save();

    //             return pwmSettings;
    //         }

    //     }
    //     throw new Error("Invalid Mini Controller PWM Mode");
    // },

    // rgb_light_control_service: async (req) => {

    //     const userId = req.user._id;
    //     const { deviceInfo } = req.body;
    //      console.log("rgb");
    //      console.log(req.body);
    //     // Extract devreq.bice details
    //     const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]\).*?Hex Data: \[(.*?)\]/);
    //     if (!match) {
    //         throw new Error({ error: "Invalid device data format" });
    //     }

    //     const name = match[1];
    //     const id = match[2];
    //     const receivedBytes = match[3].split(',').map(Number);
    //     const hexData = match[4].split(',').map(byte => parseInt(byte, 16)); // Convert Hex to Decimal

    //     if (receivedBytes.includes(90)) {
    //         throw new Error("developer mode ignore")
    //     }

    //     // Determine mode from hexData[0]
    //     const mode = hexData[0];

    //     if (mode === 0x02) {
    //         // Normal RGB Mode
    //         const red = hexData[1];
    //         const green = hexData[2];
    //         const blue = hexData[3];

    //         let rgbSettings = new RGB_DB({
    //             userId: userId,
    //             macAddress: id,
    //             red: red,
    //             green: green,
    //             blue: blue
    //         });
    //         await rgbSettings.save();

    //         return rgbSettings;
    //     }

    //     if (mode === 0x03) {
    //         // Mini Controller RGB Mode
    //         const outputNumber = hexData[1];

    //         if (outputNumber === 0x06 || outputNumber === 0x07) {
    //             const red = hexData[2];
    //             const green = hexData[3];
    //             const blue = hexData[4];

    //             let rgbSettings = new RGB_DB({
    //                 userId: userId,
    //                 macAddress: id,
    //                 outputNumber: outputNumber,
    //                 red: red,
    //                 green: green,
    //                 blue: blue
    //             });
    //             await rgbSettings.save();

    //             return rgbSettings;
    //         }
    //     }

    //     throw new Error("Invalid  RGB Mode");

    // },

    processDeviceDataService: async (req) => {
        const userId = req.user._id; // Get user ID from the request
        const { deviceInfo } = req.body; // Extract device information from the request body

        // Extracting details from deviceInfo string
        const match = deviceInfo.match(/name: "(.*?)", id: "(.*?)", receivedBytes: \[(.*?)\]\).*?Hex Data: \[(.*?)\]/);
        if (!match) {
            throw new Error("Invalid device data format");
        }

        const id = match[2];
        const receivedBytes = match[3].split(',').map(Number);
        const hexData = match[4].split(',').map(byte => parseInt(byte, 16)); // Convert Hex to Decimal

        // Determine mode from hexData[0]
        const mode = hexData[0];

        if (mode === 0x01) {
            // console.log("Pwm lights");
            // PWM Mode
            // const cool = hexData[1];
            // const warm = hexData[2];
            // const brightness = hexData[3];

            const cool = ((128 - hexData[1]) / 128) * 100; // Converts Hex (0-255) to -100 to 100 scale
            const warm = ((hexData[2] - 128) / 128) * 100;  // Converts Hex (0-255) to -100 to 100 scale
            const brightness = (hexData[3] / 255) * 100;    // Converts Hex (0-255) to 0-100%


            let pwmSettings = new PWM_DB({
                userId: userId,
                macAddress: id,
                cool: cool,
                warm: warm,
                brightness: brightness
            });
            await pwmSettings.save();
            return { message: "PWM settings saved successfully", pwmSettings };

        } else if (mode === 0x02) {
            // console.log("RGB lights");
            // RGB Mode
            const red = hexData[1];
            const green = hexData[2];
            const blue = hexData[3];

            let rgbSettings = new RGB_DB({
                userId: userId,
                macAddress: id,
                red: red,
                green: green,
                blue: blue
            });
            await rgbSettings.save();
            return { message: "RGB settings saved successfully", rgbSettings };

        } else if (mode === 0x03) {
            // console.log("Mini Controller Mode");
            // Mini Controller Mode
            const outputNumber = hexData[1];

            if (outputNumber >= 1 && outputNumber <= 5) {
                // console.log("Mini Controller PWM Mode");
                // PWM output
                // const cool = hexData[2];
                // const warm = hexData[3];
                // const brightness = hexData[4];

                const cool = ((128 - hexData[1]) / 128) * 100; // Converts Hex (0-255) to -100 to 100 scale
                const warm = ((hexData[2] - 128) / 128) * 100;  // Converts Hex (0-255) to -100 to 100 scale
                const brightness = (hexData[3] / 255) * 100;    // Converts Hex (0-255) to 0-100%   

                let miniPwmSettings = new PWM_DB({
                    userId: userId,
                    macAddress: id,
                    outputNumber: outputNumber,
                    cool: cool,
                    warm: warm,
                    brightness: brightness
                });
                await miniPwmSettings.save();
                return { message: "Mini Controller PWM settings saved successfully", miniPwmSettings };

            } else if (outputNumber >= 6 && outputNumber <= 7) {
                // console.log("Mini Controller RGB Mode");
                // RGB output
                const red = hexData[2];
                const green = hexData[3];
                const blue = hexData[4];

                let miniRgbSettings = new RGB_DB({
                    userId: userId,
                    macAddress: id,
                    outputNumber: outputNumber,
                    red: red,
                    green: green,
                    blue: blue
                });
                await miniRgbSettings.save();
                return { message: "Mini Controller RGB settings saved successfully", miniRgbSettings };
            } else {
                throw new Error("Invalid output number for Mini Controller");
            }
        }
        throw new Error("Invalid mode");

    },

}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTg3NGIyMThhNDE2MjE2NWRlMzQ2MCIsImlhdCI6MTc0MzY3ODk1NCwiZXhwIjoxNzQzNjgyNTU0fQ.FcKn3PsCyYbAKK0hcXbt1BdQx_QOPMTTJAXBOEoUH3Q