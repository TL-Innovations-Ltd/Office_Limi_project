// src/client/user/docs.js

module.exports = {
    test: (req, res, next) => {
        /* 
        #swagger.tags = ['Utility']
        #swagger.summary = 'Test endpoint'
        #swagger.description = 'A simple test route to check server status'
        #swagger.responses[200] = {
            description: 'Server is running',
            schema: {
                message: 'Test',
                port: 'Server port number'
            }
        }
        */
        next();
    },

    sendOtp: (req, res, next) => {
        /* 
        #swagger.tags = ['Authentication']
        #swagger.summary = 'Send OTP to user'
        #swagger.description = 'Endpoint to send One-Time Password (OTP) to user\'s email for verification'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'User email for OTP',
            required: true,
            schema: {
                email: 'user@example.com'
            }
        }
        #swagger.responses[200] = {
            description: 'OTP sent successfully',
            schema: {
                success: true,
                otp: 'OTP sent successfully & expires in 15 minutes'
            }
        }
        #swagger.responses[500] = {
            description: 'Server error',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    verifyProduction: (req, res, next) => {
        /* 
        #swagger.tags = ['Authentication']
        #swagger.summary = 'Verify production user'
        #swagger.description = 'Endpoint to verify a production user\'s email'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Production user email',
            required: true,
            schema: {
                email: 'production@example.com'
            }
        }
        #swagger.responses[200] = {
            description: 'Production user verified successfully',
            schema: {
                success: true,
                message: 'production user verified'
            }
        }
        #swagger.responses[500] = {
            description: 'Verification failed',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    verifyOtp: (req, res, next) => {
        /* 
        #swagger.tags = ['Authentication']
        #swagger.summary = 'Verify OTP'
        #swagger.description = 'Endpoint to verify One-Time Password (OTP) sent to user\'s email'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'User email and OTP',
            required: true,
            schema: {
                email: 'user@example.com',
                otp: '123456'
            }
        }
        #swagger.responses[200] = {
            description: 'OTP verified successfully',
            schema: {
                success: true,
                message: 'User created',
                data: {
                    user_data: 'User details',
                    token: 'JWT authentication token'
                }
            }
        }
        #swagger.responses[500] = {
            description: 'OTP verification failed',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    installerUser: (req, res, next) => {
        /* 
        #swagger.tags = ['User Management']
        #swagger.summary = 'Create installer user'
        #swagger.description = 'Endpoint to create a temporary installer user account'
        #swagger.responses[200] = {
            description: 'Installer user created successfully',
            schema: {
                success: true,
                message: 'Installer User created',
                data: {
                    user_details: 'Temporary installer user information',
                    token: 'JWT authentication token'
                }
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to create installer user',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    updateName: (req, res, next) => {
        /* 
        #swagger.tags = ['User Management']
        #swagger.summary = 'Update user name'
        #swagger.description = 'Endpoint to update a user\'s username'
        #swagger.parameters['path'] = {
            in: 'path',
            name: 'id',
            description: 'User ID',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'New username',
            required: true,
            schema: {
                user_name: 'new_username'
            }
        }
        #swagger.responses[200] = {
            description: 'Username updated successfully',
            schema: {
                success: true,
                message: 'Username Updated',
                data: 'Updated user details'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to update username',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    addFamilyMember: (req, res, next) => {
        /* 
        #swagger.tags = ['Family Management']
        #swagger.summary = 'Add family member'
        #swagger.description = 'Endpoint to add a new family member (requires authentication)'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Family member email',
            required: true,
            schema: {
                email: 'familymember@example.com'
            }
        }
        #swagger.responses[200] = {
            description: 'Family member added successfully',
            schema: {
                success: true,
                message: 'Family member added',
                data: 'New family member details'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to add family member',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    addProductionUser: (req, res, next) => {
        /* 
        #swagger.tags = ['User Management']
        #swagger.summary = 'Add production user'
        #swagger.description = 'Endpoint to create a new production user account'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Production user details',
            required: true,
            schema: {
                username: 'production_user',
                email: 'production@example.com'
            }
        }
        #swagger.responses[200] = {
            description: 'Production user added successfully',
            schema: {
                success: true,
                data: 'New production user details'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to add production user',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    updateProductionUser: (req, res, next) => {
        /* 
        #swagger.tags = ['User Management']
        #swagger.summary = 'Update production user'
        #swagger.description = 'Endpoint to update production user details'
        #swagger.parameters['path'] = {
            in: 'path',
            name: 'id',
            description: 'Production user ID',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Updated user details',
            required: true,
            schema: {
                user_name: 'new_username',
                production_email_status: true
            }
        }
        #swagger.responses[200] = {
            description: 'Production user updated successfully',
            schema: {
                success: true,
                data: 'Updated production user details'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to update production user',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    customerCapture: (req, res, next) => {
        /* 
        #swagger.tags = ['Customer Management']
        #swagger.summary = 'Capture customer details'
        #swagger.description = 'Endpoint to capture and store customer information'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'Customer capture details',
            required: true,
            schema: {
                staffName: 'Staff Name',
                clientName: 'Client Name',
                clientCompanyInfo: 'Company Information',
                itemCodes: ['item1', 'item2'],
                nfcData: 'NFC Information',
                notes: 'Additional notes',
                frontCardImage: 'Base64 encoded front card image',
                backCardImage: 'Base64 encoded back card image'
            }
        }
        #swagger.responses[200] = {
            description: 'Customer details captured successfully',
            schema: {
                success: true,
                data: 'Profile URL for the captured customer'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to capture customer details',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    getCustomerDetails: (req, res, next) => {
        /* 
        #swagger.tags = ['Customer Management']
        #swagger.summary = 'Get customer details'
        #swagger.description = 'Endpoint to retrieve customer details by profile ID'
        #swagger.parameters['path'] = {
            in: 'path',
            name: 'profileId',
            description: 'Customer profile ID',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Customer details retrieved successfully',
            schema: {
                success: true,
                data: 'Detailed customer information'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to retrieve customer details',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    getAllCustomerDetails: (req, res, next) => {
        /* 
        #swagger.tags = ['Customer Management']
        #swagger.summary = 'Get all customer details'
        #swagger.description = 'Endpoint to retrieve details of all customers'
        #swagger.responses[200] = {
            description: 'All customer details retrieved successfully',
            schema: {
                success: true,
                data: 'List of all customer details'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to retrieve customer details',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    trackingCapture: (req, res, next) => {
        /* 
        #swagger.tags = ['Tracking']
        #swagger.summary = 'Capture user tracking data'
        #swagger.description = 'Endpoint to capture and store user tracking information'
        #swagger.parameters['body'] = {
            in: 'body',
            name: 'body',
            description: 'User tracking data',
            required: true,
            schema: {
                sessionId: 'Unique session identifier',
                customerId: 'Customer ID',
                trackingDetails: 'Tracking information'
            }
        }
        #swagger.responses[200] = {
            description: 'Tracking data captured successfully',
            schema: {
                success: true,
                data: 'Captured tracking information'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to capture tracking data',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    getTrackingCapture: (req, res, next) => {
        /* 
        #swagger.tags = ['Tracking']
        #swagger.summary = 'Get all tracking captures'
        #swagger.description = 'Endpoint to retrieve all user tracking data'
        #swagger.responses[200] = {
            description: 'Tracking data retrieved successfully',
            schema: {
                success: true,
                data: 'List of all tracking captures'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to retrieve tracking data',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    getUserTracking: (req, res, next) => {
        /* 
        #swagger.tags = ['Tracking']
        #swagger.summary = 'Get user tracking by customer ID'
        #swagger.description = 'Endpoint to retrieve tracking data for a specific customer'
        #swagger.parameters['path'] = {
            in: 'path',
            name: 'customerId',
            description: 'Customer ID',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'User tracking data retrieved successfully',
            schema: {
                success: true,
                data: 'Tracking information for the specified customer'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to retrieve user tracking data',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    },

    getUserCapture: (req, res, next) => {
        /* 
        #swagger.tags = ['User Management']
        #swagger.summary = 'Get all user captures'
        #swagger.description = 'Endpoint to retrieve details of all captured users'
        #swagger.responses[200] = {
            description: 'User capture data retrieved successfully',
            schema: {
                success: true,
                data: 'List of all user captures'
            }
        }
        #swagger.responses[500] = {
            description: 'Failed to retrieve user capture data',
            schema: {
                success: false,
                error_message: 'Detailed error description'
            }
        }
        */
        next();
    }
};