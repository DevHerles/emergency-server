const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const Emergency = require('../controllers/emergency.controller');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/')
  .get(passportJWT, Emergency.findAll);
router.route('/add')
  .post(validateBody(schemas.emergencySchema),  Emergency.add);
router.route('/:id')
  .get(passportJWT, Emergency.findById);

module.exports = router;
