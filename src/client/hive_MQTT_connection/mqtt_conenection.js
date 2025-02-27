const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_BROKER_CONNECTION);

module.exports = client;