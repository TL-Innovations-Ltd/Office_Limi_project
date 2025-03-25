const mongoose = require("mongoose");

const PWMLightSchema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  deviceName: { type: String, required: true },
  color: { // RGB format (e.g., { r: 255, g: 0, b: 0 } for red)
    r: { type: Number, min: 0, max: 255, default: 255 },
    g: { type: Number, min: 0, max: 255, default: 255 },
    b: { type: Number, min: 0, max: 255, default: 255 }
  },
  brightness: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ["on", "off"], default: "off" },
  schedule: {
    enabled: { type: Boolean, default: false },
    turnOffTime: { type: Date, default: null },  // Time to turn off the light
    turnOnTime: { type: Date, default: null }    // Time to turn on the light
  }
}, {timestamps: true});

module.exports = mongoose.model("PWM", PWMLightSchema);