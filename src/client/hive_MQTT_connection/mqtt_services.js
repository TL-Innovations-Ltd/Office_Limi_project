const mqttClient = require('./mqtt_conenection');
const Hub_DB = require('../../admin/devices/models/hub-controller_device');

// Topic constants
const TOPICS = {
    DEVICE_STATUS: 'status',    // For device status updates
    DEVICE_CONTROL: 'data',    // For sending commands to devices
    DEVICE_DATA: 'disconnect',         // For receiving data from devices
    DEVICE_CREDENTIALS : 'credentials'
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
                resolve({ topic });
            }
        });
    });
}

// Handle all device messages
mqttClient.on('message', async (topic, message) => {
    try {
        console.log('Raw message received:', {
            topic,
            message: message.toString(),
            timestamp: new Date().toISOString()
        });
        const parsed = JSON.parse(message.toString());

        switch (topic) {
            case 'status':
                console.log('📡 Device connected:', parsed);
                handleDeviceStatus(parsed.macAddress)
                break;

            case 'data':
                console.log('🌡️ Temperature reading:', parsed);
                break;

            case 'disconnect':
                console.log('🔌 Device disconnected:', parsed);
                break;

            default:
                console.warn('⚠️ Unknown topic:', topic);
        }
    } catch (error) {
        console.error('Error processing MQTT message:', error);
    }
});

// Handle device status updates
async function handleDeviceStatus(macAddress) {
    try {
        const hub = await Hub_DB.findOne({ macAddress });

        if (hub) {

            // Update device status in database
            await Hub_DB.updateOne(
                { macAddress },
                {
                    $set: {
                        status: "online"
                    }
                },
                { new: true }  // This returns the document after update
            );

            // Device is registered, send authorization
            await publishMessage(`${TOPICS.DEVICE_CREDENTIALS}`, hub);

            console.log(`Device ${macAddress} authorized and updated`);
        } else {
            // Device not registered
            console.log(`Unauthorized device attempt: ${macAddress}`);
        }
    } catch (error) {
        console.error(`Error handling device status for ${macAddress}:`, error);
    }
}


// Initialize MQTT connection
mqttClient.on("connect", async () => {
    try {
        console.log("✅ MQTT Broker Connected Successfully");

        await subscribeMessage('status');
        await subscribeMessage('data');
        await subscribeMessage('disconnect');

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