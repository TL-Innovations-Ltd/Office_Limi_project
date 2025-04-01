const mongoose = require("mongoose");

const PWMLightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link user
  macAddress: { type: String, required: true },
  outputNumber: { type: Number }, // 6 or 7 for RGB outputs
  cool: { type: Number, default: 0 },
  warm: { type: Number, default: 0 },
  brightness: { type: Number, default: 0 },
}, {timestamps: true});

module.exports = mongoose.model("PWM", PWMLightSchema);