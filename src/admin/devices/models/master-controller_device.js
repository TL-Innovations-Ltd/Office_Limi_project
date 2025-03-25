
const mongoose = require("mongoose");

const MasterControllerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hub" }]
}, {timestamps : true});

module.exports = mongoose.model("MasterController", MasterControllerSchema);
