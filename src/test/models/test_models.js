const mongoose = require("mongoose");

const serverTestSchema = new mongoose.Schema({
    ip: String,
    region: String,
    latency: Number,
},{timestamps : true});

module.exports = mongoose.model("ServerTest", serverTestSchema);
