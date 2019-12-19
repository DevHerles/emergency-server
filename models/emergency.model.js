const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emergencySchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  requested_by: {
    type: Object,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  reason_call: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  reference: {
    type: String
  },
  date_time: {
    type: String
  }
}, {
  timestamps: true
});

const Emergency = mongoose.model('emergency', emergencySchema)

module.exports = Emergency;
