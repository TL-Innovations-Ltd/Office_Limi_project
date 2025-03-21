
const mongoose = require("mongoose");

const MiniControllerSchema = new mongoose.Schema({
  // channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  deviceName: { type: String, required: true },
  // pwmOutputs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PWMLight" }], // 5 PWM lights
  // rgbOutputs: [{ type: mongoose.Schema.Types.ObjectId, ref: "RGBLight" }], // 2 RGB lights
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, {timestamps: true});

module.exports = mongoose.model("MiniController", MiniControllerSchema);
