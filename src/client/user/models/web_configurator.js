const mongoose = require('mongoose');

const model3DSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebConfigurator', model3DSchema);
