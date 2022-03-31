const express = require('express');

const userControll = require('./user.controller.js');

const router = express.Router();

const unauth = require('../../middlewares/user/unauth.js');
const alertmove = require('../../utils/user/alertmove.js');

function loginMiddleware(req, res) {
  res.render('user/login.html');
}

router.get('/login', unauth, loginMiddleware);

router.get('/join', (req, res) => {
  res.render('user/join.html');
});

router.get('/logout', (req, res) => {
  res.send(alertmove('http://localhost:3000', '로그아웃 되었습니다.'));
});

router.get('/profile', userControll.profile);

module.exports = router;
