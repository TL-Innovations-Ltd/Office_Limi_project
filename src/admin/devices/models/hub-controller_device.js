const mongoose = require("mongoose");

// Hub Schema
const HubSchema = new mongoose.Schema({
  // masterControllerId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterController", required: true },
  hubType: { type: Number, enum: [1, 4, 8, 16], required: true },
  macAddress: { type: String, unique: true, required: true },
  firmwareVersion: { type: String, default: "1.0" },
  hardwareVersion : { type: String, default: "V1" },
  deviceName: { type: String, required: true },
  connectionStatus: { type: String, enum: ["connected", "disconnected"], default: "connected" },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Hub", HubSchema);
