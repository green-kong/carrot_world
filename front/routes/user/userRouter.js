const express = require('express');

const userControll = require('./user.controller.js');

const router = express.Router();
const auth = require('../../middlewares/user/auth.js');
const unauth = require('../../middlewares/user/unauth.js');

function loginMiddleware(req, res) {
  res.render('user/login.html');
}

router.get('/login', unauth, loginMiddleware);

router.get('/join', userControll.join);

router.get('/logout', userControll.join);

router.get('/profile', userControll.profile);

router.get('/profile/edit', auth, userControll.profileEdit);

module.exports = router;
