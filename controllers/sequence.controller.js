const Sequence = require('../models/sequence.model');
const JWT = require('jsonwebtoken');
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
  findById: async (request, response, next) => {
    return sequence = Sequence.find({'code': request.code})
      .then(sequence => response.json(sequence))
      .catch(error => response.status(400).json({error}));
  }
}
