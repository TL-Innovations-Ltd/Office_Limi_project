const mqtt = require("mqtt");


// 🛠 Replace these with your HiveMQ Cloud credentials
const host = "cfbefad9730d4c2a9244171b0174d88b.s1.eu.hivemq.cloud";
const port = 8883; // Secure MQTT (TLS)
const username = "hivemq.webclient.1741761375853"; // HiveMQ Cloud Username
const password = "7E9x>4KJhRO!bk1&qaA?"; // HiveMQ Cloud Password

// ✅ Connect with TLS
const client = mqtt.connect(`mqtts://${host}:${port}`, {
    // clientId: "client_" + Math.random().toString(16).substr(2, 8), // Unique Client ID
    clean: true,
    username: username,
    password: password,
    reconnectPeriod: 1000, // Reconnect after 1 second
});

module.exports = client;