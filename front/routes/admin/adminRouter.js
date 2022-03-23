const express = require('express');

const adminControll = require('./adminController.js');

const router = express.Router();

router.get('/login', adminControll.login);

module.exports = router;
