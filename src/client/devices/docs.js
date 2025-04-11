// src/client/devices/docs.js

module.exports = {
    processDeviceData: (req, res, next) => {
        /* 
        #swagger.tags = ['Device Control']
        #swagger.summary = 'Process device control data'
        #swagger.description = 'Endpoint to handle device data for PWM, RGB, and Mini Controller modes'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Device control data',
            required: true,
           schema: {
                deviceInfo: 'text'
            }
        }
        #swagger.responses[200] = {
            description: 'Device data processed successfully',
            schema: {
                success: true,
                data: {
                    message: 'Device settings saved',
                    deviceSettings: {
                        userId: 'User ID',
                        macAddress: 'Device MAC address',
                        cool: 'Cool color temperature (-100 to 100)',
                        warm: 'Warm color temperature (-100 to 100)',
                        brightness: 'Brightness level (0-100)',
                        red: 'Red color value (0-255)',
                        green: 'Green color value (0-255)',
                        blue: 'Blue color value (0-255)'
                    }
                }
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to process device data',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    }
};