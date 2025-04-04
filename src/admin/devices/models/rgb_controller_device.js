const mongoose = require("mongoose");

const RGBLightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link user
  macAddress: { type: String, required: true}, // Device ID to link with the device
  outputNumber: { type: Number}, // 6 or 7 for RGB outputs
  red: { type: Number, required: true, min: 0, max: 255 },  // Red value (0-255)
  green: { type: Number, required: true, min: 0, max: 255 }, // Green value (0-255)
  blue: { type: Number, required: true, min: 0, max: 255 }   // Blue value (0-255)
}, {timestamps: true});

module.exports = mongoose.model("RGB", RGBLightSchema);
