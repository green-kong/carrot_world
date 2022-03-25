const express = require('express');

const homeControll = require('./home.controller.js');

const router = express.Router();

router.get('/', homeControll.home);

router.get('/write', homeControll.write);

module.exports = router;
