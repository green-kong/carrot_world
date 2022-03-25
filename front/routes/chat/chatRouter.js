const express = require('express');

const chatControll = require('./chat.controller.js');

const router = express.Router();

router.get('/', chatControll.chat);

module.exports = router;
