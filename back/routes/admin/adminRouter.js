const express = require('express');

const adminControll = require('./admin.controller.js');

const router = express.Router();

router.post('/sell', adminControll.sell);

module.exports = router;
