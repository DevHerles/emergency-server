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
  findAll: async (request, response) => {
    Emergency.find().sort({createdAt: -1})
      .then(emergencies => {
        if(!request.query.pageSize) {
          request.query.pageSize = 10;
        }
        const totalPage = emergencies.length / request.query.pageSize;
        console.log(request.query);
        response.send({data: emergencies, totalPage, totalItem: emergencies.length});
      })
      .catch(error => {
        response.status(500).send({
          message: error.message || "Something went wrong while getting list of Receiving calls."
        });
      })
  },
  add: async (request, response) => {
    if(!request.body) {
      return response.status(400).send({
        message: "Plesase fill all required fields."
      })
    }

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
      return res.status(400).send({
        message: "Emergency sequence does not exists."
      });
    }

    newEmergency.code = await sequence.nextCode();
    await newEmergency.save()
      .catch((error) => {
        response.status(500).json({
          message: error.message || "Something went wrong while creating new emergency."
        });
      });
    
      await sequence.save()
      .catch((error) => {
        response.status(500).json({
          message: error.message || "Something went wrong while saving emergency sequence."
        });
      });
    response.send({'id': newEmergency._id});
  },
  findById: async (request, response) => {
    Emergency.findById(request.params.id)
      .then(emergency => {
        if(!emergency) {
          return response.status(400).send({
            message: "Emergency not found with id " + request.params.id
          })
        }
        response.send(emergency);
      })
      .catch(error => {
        if(error.kind === 'ObjectId') {
          return response.status(400).send({
            message: "Emergency not found with id " + request.params.id
          })
        }
        return response.status(500).send({
          message: error.message || "Error getting emergency with id " + request.params.id
        });
      });
  },
  update: async (request, response) => {
    if(!request.body) {
      return response.status(400).send({
        message: "Plesase fill all required fields."
      })
    }

    const {
      requested_by,
      phone_number,
      reason_call,
      address,
      reference,
      date_time
    } = request.body;

    Emergency.findByIdAndUpdate(request.params.id, {
      requested_by,
      phone_number,
      reason_call,
      address,
      reference,
      date_time
    }, {new: true})
      .then(emergency => {
        if(!emergency) {
          return response.status(404).send({
            message: "Emergency not found with id " + request.params.id
          });
        }
        response.send(emergency);
      })
      .catch(error => {
        if(error.kind === 'ObjectId') {
          return response.status(404).send({
            message: error.message || "Emergency not found with id " + request.params.id
          });
        }
        return response.status(500).send({
          message: error.message || "Error updating emergency with id " + request.params.id
        });
      })
  },
  delete: async (request, response) => {
    Emergency.findByIdAndRemove(request.params.id)
      .then(emergency => {
        if(!emergency) {
          return response.status(404).send({
            message: "Emergency not found with id " + request.params.id
          });
        }
        response.send({
          message: "Emergency deteled successfully!"
        });
      })
      .catch(error => {
        if(error.kind === 'ObjectId' || error.name === 'NotFound') {
          return response.status(404).send({
            message: "Emergency not found with id " + request.params.id
          });
        }
        return response.status(500).send({
          message: error.message || "Could not delete emergency with id " + request.params.id
        });
      });
  }
};