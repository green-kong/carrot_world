const express = require('express');

const homeControll = require('./home.controller.js');

const router = express.Router();

router.post('/write', homeControll.write);

module.exports = router;
