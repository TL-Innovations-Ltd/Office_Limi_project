const mongoose = require('mongoose');

const userTrackingSchema = new mongoose.Schema({
  customerId: { type: String, default: null }, // nullable
  ipAddress: { type: String},
  country: { type: String },
  referrer: { type: String},
  userAgent: { type: String},
  sessionDuration: { type: Number },
  pagesVisited: { type: [String] },
  consent: { type: Boolean},
},{timestamps : true});

const UserTracking = mongoose.model('UserTracking', userTrackingSchema);

module.exports = UserTracking;