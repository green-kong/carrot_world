require('dotenv').config();

const express = require('express');

const router = express.Router();

const adminControll = require('./admin.controller.js');

router.post('/login', adminControll.login);

router.post('/auth', adminControll.auth);

router.post('/sell', adminControll.sell);

router.post('/auction', adminControll.auction);

router.post('/user', adminControll.user);

module.exports = router;
