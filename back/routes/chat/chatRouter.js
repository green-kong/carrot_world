const express = require('express');

const router = express.Router();
const chatController = require('./chatController.js');

router.post('/', chatController.chat);
router.post('/renderChat', chatController.renderChat);

module.exports = router;
