// d:\Office_Limi_project\src\config\swagger.config.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Light Control System Backend ( Suzair )',
        description: 'API documentation for Light Control System',
        version: '1.0.0',
    },
    host: `localhost:${process.env.PORT || 3000}`,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
};

const outputFile = './swagger-output.json';
const routes = [
    './src/client/user/routes.js', 
    './src/client/devices/routes.js', 
    './src/admin/devices/routes.js',
    './src/test/routes.js'
];

// Validate and generate Swagger documentation
swaggerAutogen(outputFile, routes , doc)
    .then(() => {
        console.log('Swagger documentation generated successfully');
    })
    .catch((err) => {
        console.log('Error generating Swagger documentation:');
        console.log(err);
    });