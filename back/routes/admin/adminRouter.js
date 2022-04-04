const express = require('express');

const adminControll = require('./admin.controller.js');

const router = express.Router();

router.post('/sell', adminControll.sell);

router.post('/auction', adminControll.auction);

module.exports = router;
