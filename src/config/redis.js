// src/config/redis.js
const Redis = require('ioredis');
require('dotenv').config();

// Create Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST, // Default to localhost
    port: process.env.REDIS_PORT,         // Default Redis port
    retryStrategy: (times) => {
        // Reconnect after
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

// Event listeners
redisClient.on('connect', () => {
    console.log('✅ Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

// Export the client
module.exports = redisClient;