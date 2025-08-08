const mqtt = require("mqtt");


// Replace with your actual values
const host = 'mqtts://mqtt.limilighting.com';
const port = '8883';
const username = 'suzair-1';
const password = 'suzair-1'; // asli password yahan likhein

const client = mqtt.connect(`${host}:${port}`, {
  username,
  password,
  clientId: 'suzair' + Math.random().toString(16).substr(2, 8),
  // rejectUnauthorized: false,
});

module.exports = client;