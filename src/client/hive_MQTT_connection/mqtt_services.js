const mqttClient = require('./mqtt_conenection');

// Function to publish a message
function publishMessage(topic, payload) {
    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
            if (err) {
                reject({topic : topic , error_message : err});
            } else {
                resolve({ topic, payload }); // Resolve with the topic and payload
            }
        });
    });
}

// Function to subscribe to a topic and handle incoming messages
function subscribeMessage(topic) {
    return new Promise((resolve, reject) => {
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                reject({topic : topic , error_message : err});
            } else {
                // console.log(`Listening  to ${topic} topic`);
            }
        });
    });
}

mqttClient.on('message', (receivedTopic, message) => {
    // Resolve the promise with the received message
    console.log("Message Received")
    console.log({ topic: receivedTopic, message: message.toString() });
});

// ✅ Server Start hote hi MQTT connection initialize ho jayega
mqttClient.on("connect", async() => {
    console.log("✅ MQTT Broker Connected Successfully");

    try {
        const publishResponse = await publishMessage('suzair', { name: 'test', message: 'Hello World' });
        console.log(publishResponse);

        const listenmsg = await subscribeMessage('suzair'); // Replace 'test' with your actual topic
        console.log(listenmsg);
    } catch (error) {
        console.log(` erro : ${error.topic} : ${error.error_message}`);
    }

});

mqttClient.on("error", (error) => {
    console.log("❌ MQTT Connection Error:", error);
});

module.exports = {
    publishMessage,
    subscribeMessage
};
