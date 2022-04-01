const express = require('express');

const userControll = require('./user.controller.js');

const router = express.Router();

const auth = require('../../middlewares/user/auth.js');
const unauth = require('../../middlewares/user/unauth.js');

function loginMiddleware(req, res) {
  res.render('user/login.html');
}

router.get('/login', unauth, loginMiddleware);

router.get('/join', (req, res) => {
  res.render('/join.html');
});

router.get('/profile', userControll.profile);

router.get('/profile/edit', auth, (req, res) => {
  const { userEmail, userAlias, userMobile } = req.user.userResult;
  res.render('user/edit.html', { userEmail, userAlias, userMobile });
});

module.exports = router;
