
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

app.use(
    cors({
        origin: "*"
    })
);

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
