const Sequence = require('../models/sequence.model');
const JWT = require('jsonwebtoken');
const Emergency = require('../models/emergency.model')
const {JWT_SECRET} = require('../configuration');

signToken = user => {
  return JWT.sign({
    iss: 'EMERGENCY',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET);
}

module.exports = {
  findAll: async (request, response, next) => {
    Emergency.find().sort({createdAt: -1})
      .then(receiving_calls => {
        response.send(receiving_calls);
      })
      .catch(error => {
        response.status(500).send({
          message: error.message || "Something went wrong while getting list of Receiving calls."
        });
      })
  },
  add: async (request, response, next) => {
    const {
      code,
      requested_by,
      phone_number,
      reason_call,
      address,
      reference,
      date_time
    } = request.body;

    const newEmergency = new Emergency({
      code,
      requested_by,
      phone_number,
      reason_call,
      address,
      reference,
      date_time
    });
    const sequence = await Sequence.findOne({"code": "emergency"});
    if (!sequence) {
      console.log('sequence NULL!!!!');
      return done(null, false);
    }

    // Check if the password is correct
    console.log(sequence);
    newEmergency.code = await sequence.nextCode();
    await newEmergency.save()
      .catch((error) => {
        response.status(400).json('Error: '+ error);
      });
    await sequence.save();
    response.status(200).json({'id': newEmergency._id});
  },
  findById: async (request, response, next) => {
    Emergency.findById(request.params.id)
      .then(emergency => response.json(emergency))
      .catch(error => response.status(400).json({error}));
  }
}
