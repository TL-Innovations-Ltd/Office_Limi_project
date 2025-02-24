const mongoose = require('mongoose');


const connectDB = () => {
     
 mongoose.connect(process.env.MONGO_URL).then(() => console.log('💥 MongoDB Connected...')).catch((e) => console.log(e))
     
}

module.exports = connectDB;