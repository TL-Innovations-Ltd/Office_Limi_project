const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 5, // Limit connection pool size
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Socket timeout
        });
        console.log('💥 MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;