const JWT = require('jsonwebtoken');
const ReceivingCall = require('../models/emergency.model')
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
    ReceivingCall.find()
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

    const newReceivingCall = new ReceivingCall({
      code,
      requested_by,
      phone_number,
      reason_call,
      address,
      reference,
      date_time
    });
    await newReceivingCall.save()
      .catch((error) => {
        response.status(400).json('Error: '+ error);
      });
    response.status(200).json({'result': 'OK!'});
  }
}
