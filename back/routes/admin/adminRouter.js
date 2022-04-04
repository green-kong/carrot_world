require('dotenv').config();

const express = require('express');

const router = express.Router();

const adminControll = require('./admin.controller.js');

router.post('/login', adminControll.login);

router.post('/auth', adminControll.auth);

router.post('/sell', adminControll.sell);

module.exports = router;
