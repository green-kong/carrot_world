const express = require('express');

const router = express.Router();

const homeControll = require('./home/home.controller.js');

router.use('/home', homeControll.auction);

module.exports = router;
