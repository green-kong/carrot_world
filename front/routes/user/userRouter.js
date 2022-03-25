const express = require('express');

const userControll = require('./user.controller.js');

const router = express.Router();

router.get('/profile', userControll.profile);

module.exports = router;
