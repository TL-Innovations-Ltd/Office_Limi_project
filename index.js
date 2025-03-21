const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const connectDB = require('./src/connection/DB_connection');
const mqttClient = require('./src/client/hive_MQTT_connection/mqtt_conenection');
const user_routes = require('./src/client/user/routes');
const admin_device_routes = require('./src/admin/devices/routes');
const device_routes = require('./src/client/devices/routes');

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());

connectDB();

// ✅ Server Start hote hi MQTT connection initialize ho jayega
// mqttClient.on("connect", () => {
//     console.log("✅ MQTT Broker Connected Successfully");
// });

// mqttClient.on("error", (error) => {
//     console.error("❌ MQTT Connection Error:", error);
// });

// 🔥 Auto Unlink Script Require Karo
// require('./src/client/node_cron_timer/node_cron_timer');

app.use('/client' , user_routes);
app.use('/client/devices' , device_routes);
app.use('/admin' , admin_device_routes );


app.listen( process.env.PORT ,() => console.log('🌐 Server is running on port 3000'));
// module.exports = app;