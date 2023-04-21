const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');

router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.registerUser))

router.route('/login')
.get(users.renderLoginPage)
.post(passport.authenticate('local',
{ failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }),
users.authenticateUser)

router.get('/logout', users.logout)

module.exports = router;

