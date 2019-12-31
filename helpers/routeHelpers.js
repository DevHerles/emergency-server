const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (request, response, next) => {
      const result = Joi.validate(request.body, schema);
      if(result.error) {
        return response.status(400).json(result.error);
      }
      if(!request.value) {request.value = {};}
      request.value['body'] = request.value;
      next();
    }
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    emergencySchema: Joi.object().keys ({
      requested_by: Joi.object().required(),
      phone_number: Joi.string().required(),
      reason_call: Joi.string().required(),
      address: Joi.string().required(),
      reference: Joi.string(),
      date_time: Joi.string()
    }),
    themeSchema: Joi.object().keys({
      user_id: Joi.string().required(),
      theme: Joi.string().required()
    })
  }
}
