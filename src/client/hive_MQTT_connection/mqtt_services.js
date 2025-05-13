const mqttClient = require('./mqtt_conenection');
const Hub_DB = require('../../admin/devices/models/hub-controller_device');

// Topic constants
const TOPICS = {
    DEVICE_STATUS: 'device/+/status',    // For device status updates
    DEVICE_CONTROL: 'device/control/',    // For sending commands to devices
    DEVICE_DATA: 'device/+/data'         // For receiving data from devices
};

// Function to publish a message with QoS 1
function publishMessage(topic, payload) {
    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
            if (err) {
                console.error(`Failed to publish to ${topic}:`, err);
                reject({ topic, error_message: err });
            } else {
                console.log(`Published to ${topic}:`, payload);
                resolve({ topic, payload });
            }
        });
    });
}

// Function to subscribe to topics with error handling
function subscribeMessage(topic) {
    return new Promise((resolve, reject) => {
        mqttClient.subscribe(topic, { qos: 1 }, (err) => {
            if (err) {
                console.error(`Failed to subscribe to ${topic}:`, err);
                reject({ topic, error_message: err });
            } else {
                console.log(`✅ Subscribed to ${topic}`);
                resolve({ topic });
            }
        });
    });
}

// Handle all device messages
mqttClient.on('message', async (topic, message) => {
    try {
        console.log(`Message Received on ${topic}:`, message.toString());
        const messageData = JSON.parse(message.toString());

        if (topic.startsWith('device/')) {
            const [, macAddress, messageType] = topic.split('/');

            // Handle different message types
            switch (messageType) {
                case 'status':
                    await handleDeviceStatus(macAddress, messageData);
                    break;
                case 'data':
                    await handleDeviceData(macAddress, messageData);
                    break;
                default:
                    console.warn(`Unknown message type: ${messageType}`);
            }
        }
    } catch (error) {
        console.error('Error processing MQTT message:', error);
    }
});

// Handle device status updates
async function handleDeviceStatus(macAddress, messageData) {
    try {
        const hub = await Hub_DB.findOne({ macAddress });
        
        if (hub) {
            // Device is registered, send authorization
            await publishMessage(`${TOPICS.DEVICE_CONTROL}${macAddress}`, {
                status: 'AUTHORIZED',
                deviceId: hub._id,
                deviceName: hub.deviceName,
                timestamp: new Date().toISOString()
            });

            // Update device status in database
            await Hub_DB.updateOne(
                { macAddress },
                { 
                    $set: { 
                        lastSeen: new Date(),
                        isOnline: true,
                        connectionType: 'WIFI'
                    }
                }
            );

            console.log(`Device ${macAddress} authorized and updated`);
        } else {
            // Device not registered
            await publishMessage(`${TOPICS.DEVICE_CONTROL}${macAddress}`, {
                status: 'UNAUTHORIZED',
                message: 'Device not registered',
                timestamp: new Date().toISOString()
            });
            console.warn(`Unauthorized device attempt: ${macAddress}`);
        }
    } catch (error) {
        console.error(`Error handling device status for ${macAddress}:`, error);
    }
}

// Handle device data messages
async function handleDeviceData(macAddress, messageData) {
    try {
        const hub = await Hub_DB.findOne({ macAddress });
        if (hub) {
            // Process device data here
            console.log(`Received data from ${macAddress}:`, messageData);
        }
    } catch (error) {
        console.error(`Error handling device data for ${macAddress}:`, error);
    }
}

// Initialize MQTT connection
mqttClient.on("connect", async () => {
    try {
        console.log("✅ MQTT Broker Connected Successfully");
        
        // Subscribe to all device topics
        await subscribeMessage(TOPICS.DEVICE_STATUS);

        console.log("✅ All topic subscriptions completed");
    } catch (error) {
        console.error('MQTT initialization error:', error);
    }
});

// Handle MQTT errors
mqttClient.on("error", (error) => {
    console.error("❌ MQTT Connection Error:", error);
});

// Handle MQTT disconnection
mqttClient.on("close", () => {
    console.warn("⚠️ MQTT Connection Closed");
});

// Export functions for use in other modules
module.exports = {
    publishMessage,
    subscribeMessage,
    TOPICS
};