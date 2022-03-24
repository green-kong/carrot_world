const express = require('express');

const adminControll = require('./adminController.js');

const router = express.Router();

router.get('/login', adminControll.login);

router.get('/statistics', adminControll.statistics);

router.get('/board', adminControll.board);

router.get('/user', adminControll.user);

module.exports = router;
