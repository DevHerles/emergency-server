const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
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
  signUp: async (request, response, next) => {
    const { email, password } = request.body;

    const foundUser = await User.findOne({email});
    if(foundUser) {
      response.status(403).json({error: 'Email is already in use.'});
    }
    const newUser = new User({email, password});
    await newUser.save()
      .catch((error) => {
        console.log(error.errmsg);
        response.status(400).json('Error: '+ error);
      });
    const token = signToken(newUser);
    response.status(200).json({token});
  },
  signIn: async (request, response, next) => {
    console.log('UserController.signin() called!');
    const token = signToken(request.user);
    response.status(200).json({token});
  },
  secret: async (request, response, next) => {
    console.log('UserController.secret() called!');
    response.status(200).json({secret: 'resource'});
  },
}
