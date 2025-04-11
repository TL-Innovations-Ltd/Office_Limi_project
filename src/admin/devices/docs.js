module.exports = {
    addMasterControllerHubDevice: (req, res, next) => {
        /* 
        #swagger.tags = ['Admin Device Management']
        #swagger.summary = 'Add Master Controller Hub Device'
        #swagger.description = 'Endpoint to register a new hub device for a master controller'
        
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Hub device information',
            required: true,
            schema: {
                deviceInfo: 'text'
            }
        }
        
        #swagger.responses[200] = {
            description: 'Hub device successfully registered',
            schema: {
                success: true,
                data: {
                    userId: 'User ID who registered the device',
                    macAddress: 'Unique MAC address of the hub',
                    deviceName: 'Name of the hub device'
                }
            }
        }
        
        #swagger.responses[500] = {
            description: 'Failed to register hub device',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    }
};