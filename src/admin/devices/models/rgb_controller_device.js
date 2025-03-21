// const mongoose = require("mongoose");

// const RGBLightSchema = new mongoose.Schema({
//   channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
//   deviceName: { type: String, required: true },
//   color: { // RGB format (e.g., { r: 255, g: 0, b: 0 } for red)
//     r: { type: Number, min: 0, max: 255, default: 255 },
//     g: { type: Number, min: 0, max: 255, default: 255 },
//     b: { type: Number, min: 0, max: 255, default: 255 }
//   },
//   status: { type: String, enum: ["on", "off"], default: "off" },
//   length: { type: Number, min: 1, default: 1 }, // RGB strip ki length (meters ya LEDs count)
//   schedule: {
//     enabled: { type: Boolean, default: false },
//     turnOffTime: { type: Date, default: null },  // Time to turn off the light
//     turnOnTime: { type: Date, default: null }    // Time to turn on the light
//   }
// }, {timestamps: true});

// module.exports = mongoose.model("RGB", RGBLightSchema);
