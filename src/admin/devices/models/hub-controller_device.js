const mongoose = require("mongoose");

// Hub Schema
const HubSchema = new mongoose.Schema({
  // masterControllerId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterController", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link user
  deviceName: { type: String, required: true },
  macAddress: { type: String, unique: true, required: true },
  hubType: { type: Number,  default : 1},
  pwm : { type: mongoose.Schema.Types.ObjectId, ref: "PWM" }
}, { timestamps: true });

module.exports = mongoose.model("Hub", HubSchema);
