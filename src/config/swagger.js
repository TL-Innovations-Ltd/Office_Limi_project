const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Light Control System API Backend (Suzair)',
      version: '1.0.0',
      description: 'API documentation for the Light Control System',
      contact: {
        name: 'API Support',
        email: 'support@limilighting.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: [
    './src/client/user/docs/swagger.js',  // User module documentation
    './src/client/devices/docs/swagger.js',
    './src/admin/devices/docs/swagger.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
