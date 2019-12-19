const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sequenceSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  prefix: {
    type: String,
    required: true
  },
  number_increment: {
    type: Number,
    required: true
  },
  number_next_actual: {
    type: Number,
    required: true
  },
  padding: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

sequenceSchema.pre('save', async function (next) {
  try {
    this.number_next_actual = this.number_next_actual + this.number_increment;
    next();
  } catch (error) {
    next(error);
  }
});

sequenceSchema.methods.nextCode = function () {
  try {
    const zeroPad = (number, places) => String(number).padStart(places, '0')

    number = this.number_next_actual + this.number_increment;
    return this.prefix + '-' + zeroPad(number, this.padding);
  } catch (error) {
    throw new Error(error);
  }
}

const Sequence = mongoose.model('sequence', sequenceSchema)

module.exports = Sequence;
