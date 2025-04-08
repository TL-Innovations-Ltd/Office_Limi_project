const mongoose = require('mongoose');

const userTrackingSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  customerId: { type: String, default: null },
  ipAddress: { type: String},
  country: { type: String },
  city: { type: String },
  region: { type: String },
  org: { type: String },
  postal: { type: String },
  timezone: { type: String },
  referrer: { type: String },
  userAgent: { type: String },
  sessionDuration: { type: Number },
  pagesVisited: { type: [String] },
  consent: { type: Boolean, default: false },
  isUpdate: { type: Boolean, default: false },
  browser: { type: String },
  device: { type: String },
  _method: { type: String }
}, { timestamps: true });

const UserTracking = mongoose.model('UserTracking', userTrackingSchema);

module.exports = UserTracking;