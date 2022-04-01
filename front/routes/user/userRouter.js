const express = require('express');

const userControll = require('./user.controller.js');

const router = express.Router();

const auth = require('../../middlewares/user/auth.js');
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
  res.clearCookie('Access_token');
  res.send(alertmove('http://localhost:3000', '로그아웃 되었습니다.'));
});

router.get('/profile', userControll.profile);

router.get('/profile/edit', auth, (req, res) => {
  const { userEmail, userAlias, userMobile } = req.user.userResult;
  res.render('user/edit.html', { userEmail, userAlias, userMobile });
});

module.exports = router;
