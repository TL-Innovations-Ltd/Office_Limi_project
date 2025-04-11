// src/test/docs.js

module.exports = {
    testLatency: (req, res, next) => {
        /* 
        #swagger.tags = ['Server Testing']
        #swagger.summary = 'Test Server Latency'
        #swagger.description = 'Endpoint to measure server latency and record client IP information'
        
        #swagger.responses[200] = {
            description: 'Latency test completed successfully',
            schema: {
                _id: 'Unique MongoDB document ID',
                ip: 'Client IP address',
                region: 'Geographical region of the client',
                latency: 'Latency in milliseconds',
                createdAt: 'Timestamp of the test'
            }
        }
        
        #swagger.responses[400] = {
            description: 'Failed to determine client IP',
            schema: {
                error: 'Could not determine IP'
            }
        }
        
        #swagger.responses[500] = {
            description: 'Internal server error during latency test',
            schema: {
                error: 'Detailed error message'
            }
        }
        */
        next();
    }
};