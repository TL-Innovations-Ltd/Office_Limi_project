const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true },
  channelNumber: { type: Number, required: true }, // Channel index (1-16)
  mode: { type: String, enum: ["PWM", "RGB", "MiniController", null], default : null},
  pwmLight: { type: mongoose.Schema.Types.ObjectId, ref: "PWMLight" }, // If mode is PWM
  rgbLight: { type: mongoose.Schema.Types.ObjectId, ref: "RGBLight" }, // If mode is RGB
  miniController: { type: mongoose.Schema.Types.ObjectId, ref: "MiniController" }, // If mode is MiniController
}, {timestamps: true});

module.exports = mongoose.model("Channel", ChannelSchema);
