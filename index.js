
const { envPath } = require('./src/config/env');
require('dotenv').config({ path: envPath });

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/connection/DB_connection');
const { specs, swaggerUi } = require('./src/config/swagger');

const app = express();

const user_routes = require('./src/client/user/routes');
const test_ping = require('./src/test/routes');
const admin_device_routes = require('./src/admin/devices/routes');
const device_routes = require('./src/client/devices/routes');

const corsOptions = {
    origin: function (origin, callback) {
        // Allow specific domains
        if (!origin || 
            origin === "https://playcanv.as" || 
            origin === "https://dev.api.limitless-lighting.co.uk" || 
            origin === "http://localhost:3000" || 
            origin === "http://localhost:5173") {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    credentials: true,
    maxAge: 3600,
    optionsSuccessStatus: 204
};

// Add CORS middleware first
app.use(cors(corsOptions));

// Add additional headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin');
    next();
});

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Add timeout for large file uploads
app.use((req, res, next) => {
    res.setTimeout(300000); // 5 minutes
    next();
});

// Add this before your routes
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true, limit: '2000mb' }));

connectDB();

// For Redis connection
require('./src/config/redis');

// for MQTT connection
require('./src/client/hive_MQTT_connection/mqtt_services');

// 🔥 Auto Delete Installer User After 24 Hours 
require('./src/client/node_cron_timer/node_cron_timer');

app.use('/client', user_routes);
app.use('/server', test_ping);
app.use('/client/devices', device_routes);
app.use('/admin', admin_device_routes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(process.env.PORT, () => {
    console.log(`🌐 Server started on port ${process.env.PORT}`);
});
