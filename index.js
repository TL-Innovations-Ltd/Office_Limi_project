
const { envPath } = require('./src/config/env');
require('dotenv').config({ path: envPath });

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/connection/DB_connection');
const { specs, swaggerUi } = require('./src/config/swagger');

const app = express();

const user_routes = require('./src/client/user/routes');
const test_ping = require('./src/test/routes');
const admin_device_routes = require('./src/admin/devices/routes');
const device_routes = require('./src/client/devices/routes');

const allowedWebOrigins = [
    // Production domains
    'https://www.limilighting.com',

    // Development/Staging
    'http://localhost:3000',
    'https://limi-tau.vercel.app',
    'https://limi-release.vercel.app',
    
    // PlayCanvas - both HTTP and HTTPS
    'https://playcanv.as',
    'http://playcanv.as',
];

const corsOptions = {
    origin: function (origin, callback) {
      // Allow all mobile apps (no origin) and requests from allowed web origins
      if (!origin) {
        return callback(null, true);
    }
    
    // For web origins, check against the allowed list
    if (allowedWebOrigins.includes(origin)) {
        return callback(null, true);
    }
    
    // Log and block other web origins
    console.warn(`CORS policy: Suzair ${origin} not allowed`);
    return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'X-File-Name',
        'Cache-Control',
        'X-API-Key'  // If you use API keys
    ],
    exposedHeaders: [
        'Content-Disposition',
        'X-File-Name',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining'
    ],
    credentials: true,  // Important if using cookies/sessions
    maxAge: 86400,     // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 200
};

// In your Express setup
app.use(cors(corsOptions));

// Add this before your routes
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ extended: true, limit: '2000mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
