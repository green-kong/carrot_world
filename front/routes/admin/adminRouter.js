const express = require('express');
const auth = require('../../middlewares/admin/auth.js');
const unauth = require('../../middlewares/admin/unauth.js');
const adminControll = require('./adminController.js');

const router = express.Router();

router.get('/login', unauth, adminControll.login);

router.get('/statistics', auth, adminControll.statistics);

router.get('/board', auth, adminControll.board);

router.get('/user', auth, adminControll.user);

module.exports = router;
