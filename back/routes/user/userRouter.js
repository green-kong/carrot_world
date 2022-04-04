require('dotenv').config();

const express = require('express');

const router = express.Router();

const userControll = require('./user.controller.js');

router.post('/login', userControll.login);

router.post('/auth', userControll.auth);

router.post('/quit', userControll.quit);

router.post('/join', userControll.join);

router.post('/profile/edit', userControll.profileEdit);

module.exports = router;
