const router = require('express-promise-router')();
const passport = require('passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const Theme = require('../controllers/theme.controller');
const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/')
    .get(passportJWT, Theme.findAll);
router.route('/add')
    .post(validateBody(schemas.themeSchema), Theme.add);
router.route('/:id')
    .get(passportJWT, Theme.findByUserId);

module.exports = router;