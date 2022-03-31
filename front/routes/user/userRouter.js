const express = require('express');

const userControll = require('./user.controller.js');

const router = express.Router();

const unauth = require('../../middlewares/user/unauth.js');

function loginMiddleware(req, res) {
  res.render('user/login.html');
}

router.get('/login', unauth, loginMiddleware);

router.get('/join', (req, res) => {
  res.render('/join.html');
});

router.get('/profile', userControll.profile);

router.get('/profile/delete', (req, res) => {
  res.render('user/delete.html');
});

module.exports = router;
