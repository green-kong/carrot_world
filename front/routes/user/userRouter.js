const express = require('express');

const userControll = require('./user.controller.js');

const auth = require('../../middlewares/user/auth.js');

const router = express.Router();

const unauth = require('../../middlewares/user/unauth.js');

function loginMiddleware(req, res) {
  res.render('user/login.html');
}

router.get('/login', unauth, loginMiddleware);

router.get('/join', (req, res) => {
  res.render('/join.html');
});

router.get('/profile', auth, userControll.profile);

module.exports = router;
