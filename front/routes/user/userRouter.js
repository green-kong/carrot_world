const express = require('express');

const userControll = require('./user.controller.js');

const auth = require('../../middlewares/user/auth.js');

const router = express.Router();

const unauth = require('../../middlewares/user/unauth.js');

router.get('/logout', userControll.logout);

router.get('/profile', auth, userControll.profile);

router.get('/profile/edit', auth, userControll.profileEdit);

module.exports = router;
