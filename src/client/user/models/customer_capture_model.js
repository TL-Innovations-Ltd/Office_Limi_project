const mongoose = require('mongoose');
const { stringify } = require('uuid');

const CustomerSchema = new mongoose.Schema({
    staffName: String,
    clientName : String,
    clientCompanyInfo : String,
    itemCodes: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    nfcData : String,
    notes : String,
    images: {
      frontCardImage: {
        url: String,
        id: String,
      },
      backCardImage: {
        url: String,
        id: String,
      },
    },
    profileId: String,
    profileUrl: String,
}, {timestamps : true});

module.exports = mongoose.model('Customer', CustomerSchema);
