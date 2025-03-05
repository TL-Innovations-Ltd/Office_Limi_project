const mongoose = require("mongoose");

const BluetoothDeviceSchema = new mongoose.Schema({
    deviceName: { type: String, required: true, default : "Unknown  Devices" },
    device_id: { type: String, required: true, unique: true },
    lastConnectedAt: { type: Date, default: Date.now },
    deviceType: { type: String , default: "other" },
});

const BluetoothDevice = mongoose.model("BluetoothDevice", BluetoothDeviceSchema);
module.exports = BluetoothDevice;

    // services: { type: [String], default: [] },
    // characteristics: { type: [String], default: [] } 
        // macAddress: { type: String, default: "N/A" },
    // rssi: { type: Number },
    // connectionStatus: { type: String, enum: ["connected", "disconnected", "discovered"], default: "discovered" },
       // batteryLevel: { type: Number, default: null },