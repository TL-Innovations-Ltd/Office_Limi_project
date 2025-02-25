const express = require('express');
require('dotenv').config();
const app = express();
const connectDB = require('./src/connection/DB_connection');

const user_routes = require('./src/client/user/routes');
const device_routes = require('./src/client/devices/routes');

app.use(express.json());

connectDB();

// 🔥 Auto Unlink Script Require Karo
require('./src/client/node_cron_timer/node_cron_timer');

app.use('/client' , user_routes);
app.use('/client/devices' , device_routes );

app.listen( process.env.PORT ,() => console.log('🌐 Server is running on port 3000'));